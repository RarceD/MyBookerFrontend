import { DateSelectorDto } from "../components/courts/DateSelectorRaad";
import { colorBackground } from "../interfaces/colors";
import { Court, CourtType, Timetable } from "../interfaces/Courts";


// TODO: almost all file should be a useCallback/useMemo approach
export const getDateSelectorDtoListFromCourts = (courts: Court[], courtSelected: number): DateSelectorDto[] => {
    let s: DateSelectorDto[] = [];
    let weekDays = ['Dom.', 'Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.'];
    let months = ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
    for (let court of courts) {
        if (court.id != courtSelected) continue;
        let currentDay = new Date();
        for (let t of court.timetables.map(i=>i.day)) {
            s.push({
                week: weekDays[currentDay.getDay()],
                day: t.toString(),
                letter: months[currentDay.getMonth()]
            })
            currentDay = addDays(currentDay, 1);
        }
    }
    return s;
}
export const getCourtType = (courts: Court[], courtSelected: number): CourtType => {
    if (courts.length == 0) return CourtType.PADEL;
    for (let c of courts) {
        if (c.id == courtSelected)
            return c.type;
    }
    return CourtType.PADEL;
}

export const areThereMultipleCourtTypes = (courts: Court[]): boolean => {
    if (courts.length == 0) return false;
    let numberPadel = courts.filter(c => c.type == CourtType.PADEL).length;
    let numberTenis = courts.filter(c => c.type == CourtType.TENIS).length;
    let numberPool = courts.filter(c => c.type == CourtType.SALAS).length;
    if (numberPadel > 0 && numberTenis == 0 && numberPool == 0) return false;
    return true;
}

export const getCourtTypesTabsList = (courts: Court[]): string[] => {
    if (courts.length == 0) return [];
    let courtsTypesNames = [];
    let numberPadel = courts.filter(c => c.type == CourtType.PADEL).length;
    let numberTenis = courts.filter(c => c.type == CourtType.TENIS).length;
    let numberPool = courts.filter(c => c.type == CourtType.SALAS).length;
    let numberOther = courts.filter(c => c.type == CourtType.OTHER).length;
    if (numberPadel != 0)
        courtsTypesNames.push("padel")
    if (numberTenis != 0)
        courtsTypesNames.push("tenis")
    if (numberPool != 0)
        courtsTypesNames.push("Salas")
    if (numberOther != 0)
        courtsTypesNames.push("Merendero")
    return courtsTypesNames;
}

export const getTypeNameCourt = (courtType: number): string => {
    if (courtType == CourtType.PADEL)
        return "PÁDEL";
    else if (courtType == CourtType.TENIS)
        return "TENIS";
    else if (courtType == CourtType.SALAS)
        return "PISCINA";
    return "OTROS";
}

export function addDays(date: any, days: any) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function getSlider(courts: Court[]) {
    if (courts.length == 0) return 1;
    const times = courts[0].validTimes.split(";");
    if (times.length > 2){
        return 0.5;
    }
    else {
        if (times[0] == "1,5")
            return 1.5;
        if (times[0] == "1")
            return 1;
    }
}

export function getMaxSliderValues(courts: Court[]) {
    if (courts.length == 0) return 1;
    const times = courts[0].validTimes.split(";");
    if (times.length > 1){
        return 1.5;
    }
    else {
        if (times[0] == "1,5")
            return 1.5;
        if (times[0] == "1")
            return 1;
    }
}

export const styleModalRaad = {
    position: 'absolute' as 'absolute',
    color: "white",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: colorBackground,
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};