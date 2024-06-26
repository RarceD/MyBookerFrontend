import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RemoveBook } from '../../api/actions';
import { colorDarkCard, colorLetter } from '../../interfaces/colors';
import { CourtType } from '../../interfaces/Courts';
import DialogRaad from '../DialogRaad';
import { daysOfTheWeek } from '../../util/util';
import { translate } from 'react-i18nify';

export default function ListRaad(props: {
    mainText: string,
    secondText: string,
    courtType: CourtType,
    courtName: string,
    id: number,
    toDelete: boolean
}) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [showPassBookDelete, setShowPassBookDelete] = useState(false);
    const navigate = useNavigate();
    const isPassedBook = (mainText: string): boolean => {
        const weekday: string = mainText.split(" ")[0];
        const hour: number = +mainText.split(" ")[1].split(":")[0];
        return hour <= new Date().getHours() && daysOfTheWeek[weekday] == new Date().getDay();
    }
    return (
        <List sx={{ width: '100%', bgcolor: colorDarkCard, marginTop: "8px", borderRadius: 5 }}>
            <ListItem sx={{ height: "60px" }}>
                <ListItemAvatar>
                    {props.courtType == CourtType.PADEL ? <Avatar alt="Padel" src={"./images/raqueta2.png"} variant="square" style={{ width: "50px", height: "50px" }} /> : <></>}
                    {props.courtType == CourtType.TENIS ? <Avatar alt="Tenis" src={"./images/imagesNuno/tenis.png"} variant="square" style={{ width: "40px", height: "40px" }} /> : <></>}
                    {props.courtType == CourtType.SALAS ? <Avatar alt="Salas" src={"./images/imagesNuno/others.png"} variant="square" style={{ width: "40px", height: "45px" }} /> : <></>}
                    {props.courtType == CourtType.OTHER ? <Avatar alt="Other" src={"./images/imagesNuno/merendero.png"} variant="square" style={{ width: "45px", height: "60px" }} /> : <></>}
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={<div style={{ color: "white" }}>{props.mainText + " | " + props.courtName}</div>}
                    secondary={<div style={{ color: colorLetter }}>{props.secondText}</div>}
                />
                {props.toDelete ?
                    <ListItemAvatar onClick={() => {
                        isPassedBook(props.mainText) ? setShowPassBookDelete(true) : setShowPopUp(true);
                    }}>
                        <Avatar sx={{ bgcolor: 'inherit' }}>
                            <DeleteForeverIcon style={{ color: isPassedBook(props.mainText) ? "black" : "white", cursor: "pointer" }} />
                        </Avatar>
                    </ListItemAvatar> : <></>}
            </ListItem>
            <DialogRaad
                titleMsg={translate('community.deleteBook')}
                longMsg={translate('community.deleteAskConfirmation')}
                activate={showPopUp}
                deactivate={function (): void {
                    setShowPopUp(false);
                }} confirmHandler={function (): void {
                    const time = props.mainText.split(" ")[1];
                    RemoveBook(props.id, time, function (_resp: any) {
                        navigate("/");
                    })
                    setShowPopUp(false);
                }} />
            <DialogRaad
                titleMsg={translate('community.deleteBook')}
                longMsg={translate('community.deleteErrorBooking')}
                activate={showPassBookDelete}
                deactivate={function (): void {
                    setShowPassBookDelete(false);
                }}
                confirmHandler={function (): void {
                    setShowPassBookDelete(false);
                }} />
        </List>
    );
}