import { CourtType } from '../../interfaces/Courts';
import './../components.css';

export interface DateSelectorDto {
    week: string;
    day: string;
    letter: string;
}

const courtIcons: Partial<Record<CourtType, { src: string; alt: string }>> = {
    [CourtType.PADEL]: { src: './images/raqueta2.png',          alt: 'Padel' },
    [CourtType.TENIS]: { src: './images/imagesNuno/tenis.png',  alt: 'Tenis' },
    [CourtType.SALAS]: { src: './images/imagesNuno/gym.png',    alt: 'Salas' },
    [CourtType.OTHER]: { src: './images/imagesNuno/merendero.png', alt: 'Other' },
};

export default function DateSelectorRaad(props: {
    iconType: CourtType;
    dateSelectorDto: DateSelectorDto[];
    selected: number;
    setSelected: (n: number) => void;
}) {
    const icon = courtIcons[props.iconType];

    return (
        <div className="date-selector">
            {/* Sport icon */}
            {icon && (
                <div className="date-selector-icon">
                    <div>
                        <img alt={icon.alt} src={icon.src} width={36} height={36}
                            style={{ objectFit: 'contain' }} />
                    </div>
                </div>
            )}

            {/* Scrollable date items */}
            <div className="date-selector-items">
                {props.dateSelectorDto.map((item, idx) => (
                    <DateSelectorItemRaad
                        key={idx}
                        week={item.week}
                        day={item.day}
                        letter={item.letter}
                        selected={props.selected === +item.day}
                        changeSelectedItem={() => props.setSelected(+item.day)}
                    />
                ))}
            </div>
        </div>
    );
}

function DateSelectorItemRaad(props: {
    week: string;
    day: string;
    letter: string;
    selected?: boolean;
    changeSelectedItem: () => void;
}) {
    return (
        <div
            className="date-selector-item"
            onClick={() => props.changeSelectedItem()}
            style={{
                backgroundColor: props.selected
                    ? 'rgba(255, 132, 0, 0.15)'
                    : 'transparent',
                outline: props.selected ? '1.5px solid #FF8400' : '1.5px solid transparent',
            }}
        >
            <span className="date-selector-item-week">{props.week}</span>
            <span
                className="date-selector-item-day"
                style={{
                    color: props.selected ? '#FF8400' : 'var(--color-text-primary)',
                    fontWeight: props.selected ? 800 : 700,
                }}
            >
                {props.day}
            </span>
            <span className="date-selector-item-letter">{props.letter}</span>
        </div>
    );
}
