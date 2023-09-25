export enum WS_MSG_TYPE {
    DEVICE_CTR = 1,
    UNKNOWN
}

export interface WSInteractionDto {
    clientId: number,
    type: WS_MSG_TYPE,
    payload: object
}

export interface WSDeviceDto {
    value?: string
}