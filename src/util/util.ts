import { DateSelectorDto } from "../components/courts/DateSelectorRaad";
import { Court, CourtType } from "../interfaces/Courts";

export const daysOfTheWeek: {
    [key: string]: number;
} = {
    "Lunes": 1,
    "Martes": 2,
    "Miércoles": 3,
    "Jueves": 4,
    "Viernes": 5,
    "Sábado": 6,
    "Domingo": 0
};

// TODO: almost all file should be a useCallback/useMemo approach
export const getDateSelectorDtoListFromCourts = (courts: Court[], courtSelected: number): DateSelectorDto[] => {
    let s: DateSelectorDto[] = [];
    let weekDays = ['Dom.', 'Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.'];
    let months = ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
    for (let court of courts) {
        if (court.id != courtSelected) continue;
        let currentDay = new Date();
        for (let t of court.timetables.map(i => i.day)) {
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
    if (times.length > 2) {
        return 0.5;
    }
    else {
        if (times[0] == "1,5")
            return 1.5;
        if (times[0] == "1")
            return 1;
    }
}

// Booking durations available for a court, as selectable options (e.g. 0.5, 1, 1.5).
export function getBookingTimeOptions(courts: Court[], selectedItem: any): number[] {
    if (courts.length === 0) return [];
    const step = getSlider(courts) ?? 1;
    const max = getMaxSliderValues(courts, selectedItem) ?? 1;
    if (!step || !max) return max ? [max] : [];
    const opts: number[] = [];
    for (let v = step; v <= max + 1e-9; v += step) {
        opts.push(Math.round(v * 100) / 100);
    }
    // Make sure the maximum is always offered even if it is not a multiple of step
    if (opts.length === 0 || Math.abs(opts[opts.length - 1] - max) > 1e-9) {
        if (max > 0) opts.push(Math.round(max * 100) / 100);
    }
    return Array.from(new Set(opts)).sort((a, b) => a - b);
}

// Human label for a booking duration: 0.5 -> "30 min", 1 -> "1 h", 1.5 -> "1 h 30 min".
export function formatBookingTime(v: number): string {
    const hours = Math.floor(v);
    const mins = Math.round((v - hours) * 60);
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} h`;
    return `${hours} h ${mins} min`;
}

export function getMaxSliderValues(courts: Court[], selectedItem: any) {
    if (courts.length == 0) return 1;

    // EXCEPTION PIECE OF SHIT
    console.log("courts", courts, selectedItem);
    if (courts[0].id == 21) {
      if (selectedItem.hour == 8)
        return 1;
      return 1.5
    }

    const times = courts[0].validTimes.split(";");
    if (times.length > 1) {
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
    color: 'text.primary',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90vw', sm: 400 },
    maxWidth: 400,
    bgcolor: '#272a35',
    border: '1px solid',
    borderColor: '#2c2f3e',
    borderRadius: 3,
    boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
    p: 3,
};