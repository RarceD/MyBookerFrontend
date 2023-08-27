export interface StatsDto {
    id: number,
    token: string
}

export interface StatsInfo {
    success: boolean,
    date: string,
    count?: number,
    countNOK? : number
}