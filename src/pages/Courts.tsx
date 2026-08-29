import {
    Alert,
    Box,
    Button,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    Snackbar,
    Stack,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MakeBook } from '../api/actions';
import { GetCourts } from '../api/request';
import DateSelectorRaad from '../components/courts/DateSelectorRaad';
import SchedulRaad, { HourInfo, HourState } from '../components/courts/SchedulRaad';
import DialogRaad from '../components/DialogRaad';
import { BasicTabsRaadUncontrolled } from '../components/TabsRaad';
import { Booker } from '../interfaces/Booker';
import { Court, Timetable } from '../interfaces/Courts';
import {
    areThereMultipleCourtTypes,
    getCourtType,
    getCourtTypesTabsList,
    getDateSelectorDtoListFromCourts,
    getBookingTimeOptions,
    formatBookingTime,
} from '../util/util';
import { GenericResponse } from '../interfaces/GenericResponse';
import { translate } from 'react-i18nify';
import NoConnection from './NoConnection';

interface SelectedItem {
    courtId: number;
    date: number;
    hour: number;
    time: number;
}

// Section label used throughout this page
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            variant="caption"
            sx={{
                display: 'block',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                mt: 1.5,
                mb: 0.5,
                px: 2,
            }}
        >
            {children}
        </Typography>
    );
}

const Courts = () => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [selectedItem, setSelectedItem] = useState<SelectedItem>({ courtId: 0, hour: 0, date: 0, time: 0 });
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const [courtTypeSelected, setCourtTypeSelected] = useState<number>(0);
    const navigate = useNavigate();
    const [hours, setHours] = useState<HourInfo[]>([]);
    const [open, setOpen] = useState(false);
    const [isUrbaReadyForUse, _] = useState(true);
    const [isUrbaReadyModal, setIsUrbaReadyModal] = useState(false);
    const [openZeroTimeModal, setOpenZeroTimeModal] = useState(false);
    const modalMsg = useRef('');

    const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
        setOpenZeroTimeModal(false);
    };

    useEffect(() => {
        GetCourts((n: Court[]) => {
            if (n.length > 0)
                setSelectedItem({ date: n[0].timetables[0].day, courtId: n[0].id, hour: -1, time: 0 });
            setCourts(n);
        });
    }, []);

    useEffect(() => {
        for (const c of courts) {
            if (c.id !== selectedItem.courtId) continue;
            const currentDay = c.timetables.filter(t => t.day === selectedItem.date)[0];
            if (!currentDay) continue;
            // timetables[0] is always today, so the selected day is "today" when it matches.
            const isToday = c.timetables.length > 0 && currentDay.day === c.timetables[0].day;
            const nowHour = new Date().getHours();
            const listOfTimes: HourInfo[] = currentDay.availability.map(v => {
                const hour = +v.time.split(':')[0];
                let state: HourState;
                if (isToday && nowHour >= hour) state = 'past';   // already passed -> grey
                else if (v.valid) state = 'free';                 // available -> green
                else state = 'booked';                            // taken -> red
                return { title: v.time, state };
            });
            setHours(listOfTimes);
        }
    }, [courts, selectedItem]);

    // Keep the booking duration pre-selected (never left at 0) so the user does
    // not have to pick it manually: default to the longest available option
    // (e.g. 1h30 when a court offers 30min / 1h / 1h30).
    useEffect(() => {
        if (selectedItem.courtId === 0) return;
        const filtered = courts.filter(c => c.id === selectedItem.courtId);
        if (filtered.length === 0) return;
        const opts = getBookingTimeOptions(filtered, selectedItem);
        const def = opts.length ? opts[opts.length - 1] : 0;
        if (selectedItem.time === 0 && def !== 0) {
            setSelectedItem(prev => ({ ...prev, time: def }));
        }
    }, [courts, selectedItem]);

    const confirmBookAction = () => {
        const court: Court = courts.filter(c => c.id === selectedItem.courtId)[0];
        const timetable: Timetable = court.timetables.filter(t => t.day === selectedItem.date)[0];
        const b: Booker = {
            courtId: selectedItem.courtId,
            duration: selectedItem.time.toString(),
            day: timetable.fullDay,
            time: hours[selectedItem.hour].title,
            id: 0,
        };
        MakeBook(b, (resp: GenericResponse) => {
            if (resp.error === true) {
                modalMsg.current = translate('courts.bookingError');
                setOpen(true);
            } else {
                modalMsg.current = translate('courts.bookingSuccess');
                setOpen(true);
                setTimeout(() => navigate('/comunity'), 3000);
            }
        });
        setShowPopUp(false);
    };

    if (courts.length === 0) return <NoConnection />;

    return (
        <Box sx={{ paddingTop: 'var(--header-height)', pb: '80px' }}>

            {/* Court type tabs (if multiple types exist) */}
            {areThereMultipleCourtTypes(courts) ? (
                <Box sx={{ px: 2, pt: 1 }}>
                    <BasicTabsRaadUncontrolled
                        value={courtTypeSelected}
                        listComponents={[]}
                        setValue={(type: number) => {
                            const courtWithTypeX = courts.filter(c => c.type === type);
                            setSelectedItem({
                                date: selectedItem.date,
                                courtId: courtWithTypeX.length > 0 ? courtWithTypeX[0].id : courts[0].id,
                                hour: selectedItem.hour,
                                time: 0,
                            });
                            setCourtTypeSelected(type);
                        }}
                        listLabels={getCourtTypesTabsList(courts)}
                    />
                </Box>
            ) : null}

            {/* Court selector */}
            <SectionLabel>{translate('courts.chooseCourt')}</SectionLabel>
            <Box sx={{ px: 2 }}>
                <RadioGroup
                    value={selectedItem.courtId}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const courtIdToBook = +(event.target as HTMLInputElement).value;
                        setSelectedItem({ date: selectedItem.date, courtId: courtIdToBook, hour: -1, time: 0 });
                    }}
                >
                    {courts
                        .filter(c => c.type === courtTypeSelected)
                        .map((item, idx) => (
                            <FormControlLabel
                                key={idx}
                                value={item.id}
                                control={<Radio size="small" />}
                                label={
                                    <Typography variant="body2" fontWeight={500}>
                                        {item.name}
                                    </Typography>
                                }
                                sx={{ py: 0.5 }}
                            />
                        ))}
                </RadioGroup>
            </Box>

            {/* Date selector */}
            <SectionLabel>{translate('courts.availableDays')}</SectionLabel>
            <Box sx={{ px: 1 }}>
                <DateSelectorRaad
                    iconType={getCourtType(courts, selectedItem.courtId)}
                    dateSelectorDto={getDateSelectorDtoListFromCourts(courts, selectedItem.courtId)}
                    selected={selectedItem.date}
                    setSelected={(n: number) =>
                        setSelectedItem({ date: n, courtId: selectedItem.courtId, hour: -1, time: 0 })
                    }
                />
            </Box>

            {/* Hour schedule */}
            <SectionLabel>{translate('courts.schedule')}</SectionLabel>
            <SchedulRaad
                hours={hours}
                selected={selectedItem.hour}
                daySelected={selectedItem.date}
                changeSelectedHour={(index: number) =>
                    setSelectedItem({ date: selectedItem.date, courtId: selectedItem.courtId, hour: index, time: 0 })
                }
            />

            {/* Duration selector */}
            <SectionLabel>{translate('courts.bookingTime')}</SectionLabel>
            <Stack direction="row" sx={{ px: 2, pb: 1, flexWrap: 'wrap', gap: 1 }}>
                {getBookingTimeOptions(courts.filter(c => c.id === selectedItem.courtId), selectedItem).map(opt => (
                    <Button
                        key={opt}
                        variant={selectedItem.time === opt ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() =>
                            setSelectedItem({
                                date: selectedItem.date,
                                courtId: selectedItem.courtId,
                                hour: selectedItem.hour,
                                time: opt,
                            })
                        }
                        sx={{ minWidth: 78, py: 0.8 }}
                    >
                        {formatBookingTime(opt)}
                    </Button>
                ))}
            </Stack>

            {/* Confirm button */}
            <Box sx={{ px: 2, pt: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ py: 1.5 }}
                    onClick={() => {
                        if (!isUrbaReadyForUse) { setIsUrbaReadyModal(true); return; }
                        if (selectedItem.time === 0 || selectedItem.time === -1) { setOpenZeroTimeModal(true); return; }
                        if (selectedItem.hour === -1) return;
                        setShowPopUp(true);
                    }}
                >
                    {translate('courts.confirm')}
                </Button>
            </Box>

            {/* Snackbars */}
            <Snackbar
                open={isUrbaReadyModal}
                autoHideDuration={6000}
                onClose={() => setIsUrbaReadyModal(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="warning" sx={{ width: '100%', mt: '80px' }}>
                    {translate('courts.invalidBookMsgError1')} <br />
                    {translate('courts.invalidBookMsgError2')} <br />
                    {translate('courts.invalidBookMsgError3')}
                </Alert>
            </Snackbar>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handleClose}
                message={modalMsg.current}
                action={
                    <IconButton size="small" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />

            <Snackbar
                open={openZeroTimeModal}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={4000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {translate('courts.forgetBookTime')}
                </Alert>
            </Snackbar>

            <DialogRaad
                titleMsg={translate('courts.confirmBookTitle')}
                longMsg={translate('courts.confirmBookQuestion')}
                activate={showPopUp}
                deactivate={() => setShowPopUp(false)}
                confirmHandler={confirmBookAction}
            />
        </Box>
    );
};

export default Courts;
