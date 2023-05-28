export interface Court {
    id: number,
    name: string,
    timetables: Timetable[]
    type: CourtType,
    validTimes: string,
}

export interface Timetable {
    day: number,
    fullDay: string,
    availability: Availability[]
}
export interface Availability {
    time: string,
    valid: boolean
}

export interface Urbas {
    name: string,
    info: string,
    advanceBook: number
}

export interface CurrentCourtSelected {
    index: number,
    // timetables: number[]
}

export enum CourtType {
    PADEL = 0,
    TENIS,
    SALAS,
    OTHER 
}