export interface Booker {
    id: string,
    token: string,
    court_id: number,
    time: string,
    duration: string,
    weekday?: number,
    day?: number
}