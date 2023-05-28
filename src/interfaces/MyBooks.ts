import { CourtType } from "./Courts";

export interface MyBooks {
    id: number,
    name: string,
    schedule: string,
    image: string,
    duration: string,
    my: boolean,
    client_id: number,
    type: CourtType,
    courtName: string,
    weekday: number,
    timeRaw: number
}

export interface ClientBooks {
    id: number,
    clientId: number,
    weekday: string,
    hour: string,
    courtName: string,
    duration: string,
    clientName: string,
    type: number 
}
