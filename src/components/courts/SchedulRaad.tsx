import { colorLogo } from '../../interfaces/colors';
import { responsiveCtr } from '../../util/responsiveService';

export interface HourInfo {
    title: string,
    color: string
}
export default function SchedulRaad(props: {
    hours: HourInfo[],
    selected: number,
    daySelected: number,
    changeSelectedHour: (index: number) => void
}) {
    const getBackgroundColor = (c: HourInfo, index: number) => {
        // Verify date:
        let time = +c.title.split(":")[0]
        let currentTime = new Date().getHours();
        if (currentTime >= time && props.daySelected == 0)
            return "#000";
        // Selected by user:
        if (index == props.selected)
            return colorLogo;
        return c.color;
    }
    if (responsiveCtr.IsMobileDevice())
        return (
            <div className="hours-courts">
                {props.hours.map((item, idx) => <div key={idx}
                    onClick={() => {
                        if (item.color != "#000") props.changeSelectedHour(idx)
                    }}
                    style={{
                        color: idx == props.selected ? "white" : "",
                        backgroundColor: getBackgroundColor(item, idx),
                    }}>
                    {item.title}
                </div>)}
            </div>);
    else
        return (
            <div className="hours-courts-desktop">
                {props.hours.map((item, idx) => <div key={idx}
                    onClick={() => {
                        if (item.color != "#000") props.changeSelectedHour(idx)
                    }}
                    style={{
                        color: idx == props.selected ? "white" : "",
                        backgroundColor: getBackgroundColor(item, idx),
                    }}>
                    {item.title}
                </div>)}
            </div>);
}
