import { colorLogo } from '../../interfaces/colors';

export interface HourInfo {
    title: string;
    color: string;
}

export default function SchedulRaad(props: {
    hours: HourInfo[];
    selected: number;
    daySelected: number;
    changeSelectedHour: (index: number) => void;
}) {
    const getBackgroundColor = (c: HourInfo, index: number): string => {
        const time = +c.title.split(':')[0];
        const currentTime = new Date().getHours();
        // Past hour on today
        if (currentTime >= time && props.daySelected === 0) return '#1a1a1a';
        // Selected by user
        if (index === props.selected) return colorLogo;
        return c.color;
    };

    const isPast = (c: HourInfo): boolean => {
        const time = +c.title.split(':')[0];
        return new Date().getHours() >= time && props.daySelected === 0;
    };

    const isBlocked = (c: HourInfo): boolean => c.color === '#000';

    return (
        <div className="hours-courts">
            {props.hours.map((item, idx) => {
                const past = isPast(item);
                const blocked = isBlocked(item);
                const selected = idx === props.selected;

                return (
                    <div
                        key={idx}
                        onClick={() => {
                            if (!blocked && !past) props.changeSelectedHour(idx);
                        }}
                        style={{
                            backgroundColor: getBackgroundColor(item, idx),
                            color: selected ? '#fff' : blocked || past ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                            cursor: blocked || past ? 'not-allowed' : 'pointer',
                            opacity: past ? 0.4 : 1,
                            border: selected ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                            boxShadow: selected ? '0 0 0 3px rgba(255,132,0,0.2)' : 'none',
                            fontWeight: selected ? 700 : 500,
                        }}
                    >
                        {item.title}
                    </div>
                );
            })}
        </div>
    );
}
