import { useEffect, useRef, useState } from "react";
import { Button } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import { useLocation, useNavigate } from 'react-router-dom';
import ResponsiveHandler from "../components/ResponsiveHandler";
import { makePayment } from "../api/actions";
import HeaderRaad from "../components/HeaderRaad";
import { CreateWS, SendDeviceFeedback } from "../api/wsConnector";
import { WSDeviceDto, WSInteractionDto, WS_MSG_TYPE } from "../interfaces/WebsocketDtos";
import { WS_REQUEST } from "../api/request";

const Payment = () => {
    const [msgResponse, setMsgResponse] = useState<string>('Click for pay');
    const navigator = useNavigate();
    const myParam = useLocation().search
    const websocket = useRef<WebSocket>();

    const makePaymentUser = () => {
        // makePayment((response) => {
        // window.location.href = response.url;
        // });

        if (websocket.current) {
            const payload: WSDeviceDto = { value: 'test' };
            const ok = SendDeviceFeedback(websocket.current, payload);
            console.log('send info', ok)
        }
    }

    const onOpen = () => console.log("Connected to " + WS_REQUEST)

    const onMsg = (msg: WSInteractionDto) => {
        switch (msg.type) {
            case WS_MSG_TYPE.DEVICE_CTR: {
                const deviceDto: WSDeviceDto = msg.payload;
                console.log("on msg", deviceDto)
                return;
            }
            default:
                console.log('UNKNOWN', msg.payload);
                return;
        }
    }
    const onClose = () =>
        websocket.current = CreateWS(onOpen, onMsg, onClose)


    useEffect(() => {
        // const success = new URLSearchParams(myParam).get("success");
        // if (success == null) return;
        // success == 'true' ? setMsgResponse("Ha hecho bien el puto pago") : setMsgResponse("te has puto equivocado")
        websocket.current = CreateWS(onOpen, onMsg, onClose)
    }, [])

    const productId = "price_1NnOnhEc6fgTzslSIEKc3hyF";

    return (

        <>
            <HeaderRaad />
            <div style={{ marginTop: 80, marginBottom: 100 }}>
                <ResponsiveHandler
                    component={() =>
                        <>
                            <h1>Payment Shit</h1>
                            <Button variant="contained" endIcon={<SendIcon />} color="primary"
                                onClick={() => makePaymentUser()}>
                                PAGAR DE UNA VEZ
                            </Button>
                            <h1>{msgResponse}</h1>
                        </>
                    }
                />
            </div>
        </>
    )
}

export default Payment;
