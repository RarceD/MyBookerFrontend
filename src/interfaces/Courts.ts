export interface Court {
    id: number,
    name: string,
    timetables: Timetable[]
    type: CourtType,
    validTimes: string,
    // urba: Urbas
    // last_played_res?: string,
    // info_text?: string,
    // last_oponent?: string,
    // img?: string
}

export interface Timetable {
    day: string,
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