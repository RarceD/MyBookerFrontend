import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { LocalNotificationSchema } from '@capacitor/local-notifications';
import { translate } from 'react-i18nify';
import { GetTokenId } from '../api/auth';
import { GetBooks } from '../api/request';
import { ClientBooks } from '../interfaces/MyBooks';
import { daysOfTheWeek } from './util';

// Minutes before the booking starts at which the reminder is shown.
export const REMINDER_MINUTES_BEFORE = 30;

const REMINDER_KIND = 'booking-reminder';
const REMINDER_CHANNEL_ID = 'booking-reminders';
const REMINDER_ID_START = 900000;
const BOOKS_CACHE_KEY = 'books';
const PREFERENCE_KEY = 'notifications.bookingReminders';

const normalizeDayName = (value: string): string =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const weekdayByNormalizedName: Record<string, number> = (() => {
    const map: Record<string, number> = {};
    const aliases: Record<string, number> = {
        lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6, domingo: 0,
        lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6, dom: 0,
        monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0,
        mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0,
    };

    for (const [name, day] of Object.entries(daysOfTheWeek)) {
        map[normalizeDayName(name)] = day;
    }
    for (const [name, day] of Object.entries(aliases)) {
        map[normalizeDayName(name)] = day;
    }
    return map;
})();

let started = false;
let removeAppStateListener: (() => void) | null = null;
// Re-scheduling cancels the previous reminders, so overlapping runs are chained
// to make sure two syncs never step on each other.
let syncQueue: Promise<void> = Promise.resolve();

const isReminder = (notification: { id?: number; extra?: unknown }): boolean => {
    if ((notification.extra as { kind?: string } | undefined)?.kind === REMINDER_KIND) return true;
    // Fallback for platforms that do not echo `extra` back on getPending():
    // every reminder id lives in this reserved range.
    const id = notification.id;
    return typeof id === 'number' && id >= REMINDER_ID_START && id < REMINDER_ID_START + 1000;
};

const isNative = (): boolean => Capacitor.isNativePlatform();

// Remembered user choice. `null` means the user never decided.
export const getBookingRemindersPreference = (): boolean | null => {
    const value = localStorage.getItem(PREFERENCE_KEY);
    if (value === null) return null;
    return value === '1';
};

const setBookingRemindersPreference = (enabled: boolean): void => {
    localStorage.setItem(PREFERENCE_KEY, enabled ? '1' : '0');
};

const readCachedBooks = (): ClientBooks[] | null => {
    try {
        const raw = localStorage.getItem(BOOKS_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as ClientBooks[]) : null;
    } catch {
        return null;
    }
};

const parseTime = (time: string): { hours: number; minutes: number } | null => {
    const match = /^(\d{1,2})[:.](\d{2})/.exec((time ?? '').trim());
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;
    return { hours, minutes };
};

// The backend sends the real date of the booking ("day", e.g. "2026-11-23").
// When it is present the reminder is scheduled for that exact date, so a
// booking for next week's Monday is never mistaken for today's Monday.
const dateFromBookingDay = (day: string | undefined, time: string): Date | null => {
    if (!day) return null;
    const parsed = /^(\d{4})-(\d{2})-(\d{2})/.exec(day.trim());
    if (!parsed) return null;
    const timeParts = parseTime(time);
    if (!timeParts) return null;

    const date = new Date(
        Number(parsed[1]),
        Number(parsed[2]) - 1,
        Number(parsed[3]),
        timeParts.hours,
        timeParts.minutes,
        0,
        0,
    );
    return Number.isNaN(date.getTime()) ? null : date;
};

// Fallback for backends that do not send the date yet: bookings only carry the
// weekday name (e.g. "Lunes") and the start time ("18:00"), so the reminder
// date is the next occurrence of that weekday. A booking whose weekday is today
// but whose time has already passed is considered finished (same rule the
// booking list uses) instead of rolling over to next week, which would trigger
// a bogus reminder.
const nextWeekdayDate = (weekdayName: string, time: string): Date | null => {
    const targetDay = weekdayByNormalizedName[normalizeDayName(weekdayName)];
    if (targetDay === undefined) return null;

    const timeParts = parseTime(time);
    if (!timeParts) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeParts.hours, timeParts.minutes, 0, 0);
    if (today.getDay() === targetDay) {
        return today.getTime() > now.getTime() ? today : null;
    }

    for (let offset = 1; offset <= 7; offset++) {
        const candidate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + offset,
            timeParts.hours,
            timeParts.minutes,
            0,
            0,
        );
        if (candidate.getDay() === targetDay) return candidate;
    }
    return null;
};

const bookingStartDate = (book: ClientBooks): Date | null =>
    dateFromBookingDay(book.day, book.hour) ?? nextWeekdayDate(book.weekday, book.hour);

const requestDisplayPermission = async (): Promise<boolean> => {
    if (isNative()) {
        try {
            let status = await LocalNotifications.checkPermissions();
            if (status.display !== 'granted') {
                status = await LocalNotifications.requestPermissions();
            }
            if (status.display !== 'granted') return false;

            if (Capacitor.getPlatform() === 'android') {
                try {
                    await LocalNotifications.createChannel({
                        id: REMINDER_CHANNEL_ID,
                        name: translate('notifications.channelName'),
                        description: translate('notifications.channelDescription'),
                        importance: 4,
                        visibility: 1,
                        vibration: true,
                    });
                } catch {
                    // Channel already exists or is unsupported: keep going.
                }
            }
            return true;
        } catch {
            return false;
        }
    }

    // Web: the plugin can only show the notification while the page is open,
    // but it is still useful and uses the standard browser permission.
    if (typeof Notification === 'undefined') return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    try {
        return (await Notification.requestPermission()) === 'granted';
    } catch {
        return false;
    }
};

const canUseExactAlarms = async (): Promise<boolean> => {
    if (!isNative() || Capacitor.getPlatform() !== 'android') return true;
    try {
        const status = await LocalNotifications.checkExactNotificationSetting();
        return status.exact_alarm === 'granted';
    } catch {
        return true;
    }
};

export const cancelBookingNotifications = async (): Promise<void> => {
    try {
        const pending = await LocalNotifications.getPending();
        const ours = pending.notifications.filter(isReminder);
        if (ours.length === 0) return;
        await LocalNotifications.cancel({ notifications: ours.map((n) => ({ id: n.id })) });
    } catch {
        // Nothing scheduled or plugin unavailable: nothing to cancel.
    }
};

const buildReminders = (list: ClientBooks[], myId: number, exactNotification: boolean): LocalNotificationSchema[] => {
    const now = Date.now();
    const notifications: LocalNotificationSchema[] = [];

    for (const book of list) {
        if (book.clientId !== myId) continue;

        const startsAt = bookingStartDate(book);
        if (!startsAt) continue;

        const remindAt = startsAt.getTime() - REMINDER_MINUTES_BEFORE * 60 * 1000;
        if (remindAt <= now) continue;

        notifications.push({
            id: REMINDER_ID_START + notifications.length,
            title: translate('notifications.bookingReminderTitle'),
            body: translate('notifications.bookingReminderBody', {
                court: book.courtName,
                time: book.hour,
            }),
            channelId: REMINDER_CHANNEL_ID,
            foreground: true,
            isExactNotification: exactNotification,
            extra: { kind: REMINDER_KIND, bookId: book.id },
            schedule: {
                at: new Date(remindAt),
                allowWhileIdle: true,
            },
        });
    }

    return notifications;
};

const scheduleFrom = async (list: ClientBooks[] | null, askPermission: boolean): Promise<void> => {
    const [token, myId] = GetTokenId();
    if (!token || !myId) {
        await cancelBookingNotifications();
        return;
    }

    const exactNotification = await canUseExactAlarms();
    const reminders = list ? buildReminders(list, Number(myId), exactNotification) : [];

    // Without upcoming bookings there is nothing to ask permission for.
    if (reminders.length === 0) {
        await cancelBookingNotifications();
        return;
    }

    const preference = getBookingRemindersPreference();
    if (preference !== true && !askPermission) {
        await cancelBookingNotifications();
        return;
    }

    const allowed = await requestDisplayPermission();
    if (!allowed) {
        // The user explicitly said no: remember it so we do not keep asking,
        // and leave the Profile switch showing off.
        if (askPermission && preference === null) setBookingRemindersPreference(false);
        await cancelBookingNotifications();
        return;
    }

    // First implicit opt-in (mobile only): remember the granted choice so the
    // user is not asked again, and the toggle in Profile shows it as on.
    if (preference === null) setBookingRemindersPreference(true);

    await cancelBookingNotifications();
    await LocalNotifications.schedule({ notifications: reminders });
};

// Recomputes and reschedules every reminder from the bookings of this user.
export const syncBookingNotifications = (books?: ClientBooks[]): Promise<void> => {
    const run = async (): Promise<void> => {
        try {
            const list = books ?? readCachedBooks();
            const preference = getBookingRemindersPreference();

            // Native apps ask once, in context, as soon as the user has a
            // booking. On the web it is opt-in from the Profile screen.
            const askPermission = preference === null && isNative();

            await scheduleFrom(list, askPermission);
        } catch (error) {
            console.warn('Could not schedule booking notifications', error);
        }
    };

    syncQueue = syncQueue.then(run, run);
    return syncQueue;
};

// Re-reads the bookings from the API and reschedules every reminder.
export const refreshBookingNotifications = (): void => {
    GetBooks((books: ClientBooks[]) => {
        if (!Array.isArray(books)) return;
        void syncBookingNotifications(books);
    });
};

export const areBookingRemindersEnabled = async (): Promise<boolean> => {
    if (getBookingRemindersPreference() !== true) return false;
    try {
        if (isNative()) {
            const status = await LocalNotifications.checkPermissions();
            return status.display === 'granted';
        }
        return typeof Notification !== 'undefined' && Notification.permission === 'granted';
    } catch {
        return false;
    }
};

// Explicit opt-in (Profile switch): requests permission and reschedules.
export const enableBookingReminders = async (): Promise<boolean> => {
    const allowed = await requestDisplayPermission();
    if (!allowed) return false;
    setBookingRemindersPreference(true);
    // Use the cached list right away, then refresh it from the API.
    await syncBookingNotifications();
    refreshBookingNotifications();
    return true;
};

export const disableBookingReminders = async (): Promise<void> => {
    setBookingRemindersPreference(false);
    await cancelBookingNotifications();
};

export const startBookingNotifications = (): void => {
    if (started) {
        // The component may remount (route change) while the listener is still
        // alive: refresh anyway so the reminders follow the latest bookings.
        refreshBookingNotifications();
        return;
    }
    started = true;

    refreshBookingNotifications();

    void App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) refreshBookingNotifications();
    }).then((handle) => {
        removeAppStateListener = () => {
            void handle.remove();
        };
    });
};

// Just detaches the listeners; reminders stay scheduled until the user turns
// them off or logs out.
export const stopBookingNotifications = (): void => {
    started = false;
    removeAppStateListener?.();
    removeAppStateListener = null;
};

// Logout: forget the choice and drop every pending reminder.
export const clearBookingNotifications = async (): Promise<void> => {
    stopBookingNotifications();
    localStorage.removeItem(PREFERENCE_KEY);
    await cancelBookingNotifications();
};
