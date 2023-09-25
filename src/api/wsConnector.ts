import { WSDeviceDto, WSInteractionDto, WS_MSG_TYPE } from "../interfaces/WebsocketDtos";
import { WS_REQUEST } from "./request"

export const CreateWS = (
    onOpen: () => void,
    onMsg: (msg: WSInteractionDto) => void,
    onClose: () => void
): WebSocket => {
    const ws = new WebSocket(WS_REQUEST)
    ws.onopen = () => onOpen();
    ws.onclose = () => onClose();
    ws.onmessage = (msg) => {
        try {
            const wsMsg: WSInteractionDto = JSON.parse(msg.data);
            onMsg(wsMsg)
        }
        catch (e) {
            onMsg({
                payload: msg.data,
                clientId: -1,
                type: WS_MSG_TYPE.UNKNOWN
            })
        }
    }
    return ws;
}

export const SendDeviceFeedback = (ws: WebSocket, objToSend: WSDeviceDto): boolean => {
    const toSend: WSInteractionDto = {
        clientId: 2,
        type: WS_MSG_TYPE.DEVICE_CTR,
        payload: objToSend
    }
    if (ws.OPEN) {
        ws.send(JSON.stringify(toSend))
        return true;
    }
    return false;
}

