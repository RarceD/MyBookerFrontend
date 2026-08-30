import { colorLogo } from '../../interfaces/colors';

export type HourState = 'free' | 'booked' | 'past';

export interface HourInfo {
    title: string;
    state: HourState;
}

// Palette per slot state (dark theme friendly)
const styleByState: Record<HourState, { bg: string; fg: string; edge: string }> = {
    free: { bg: 'rgba(34,197,94,0.12)', fg: '#22c55e', edge: 'rgba(34,197,94,0.55)' },
    booked: { bg: 'rgba(239,68,68,0.07)', fg: 'rgba(239,68,68,0.6)', edge: 'rgba(239,68,68,0.3)' },
    past: { bg: '#141414', fg: 'var(--color-text-muted)', edge: 'var(--color-border)' },
};

export default function SchedulRaad(props: {
    hours: HourInfo[];
    selected: number;
    daySelected: number;
    changeSelectedHour: (index: number) => void;
}) {
    return (
        <div className="hours-courts">
            {props.hours.map((item, idx) => {
                const selected = idx === props.selected;
                const disabled = item.state !== 'free';
                const palette = styleByState[item.state];

                const bg = selected ? colorLogo : palette.bg;
                const fg = selected ? '#fff' : palette.fg;
                const edge = selected ? 'var(--color-accent)' : palette.edge;

                return (
                    <div
                        key={idx}
                        onClick={() => {
                            if (!disabled) props.changeSelectedHour(idx);
                        }}
                        style={{
                            backgroundColor: bg,
                            color: fg,
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            opacity: item.state === 'past' ? 0.4 : 1,
                            border: `${selected ? 1.5 : 1}px solid ${edge}`,
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
