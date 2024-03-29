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

export interface StatsBooker {
    courtId: number,
    isDelete: boolean,
    registerTime: string,
    bookTime :string 
}