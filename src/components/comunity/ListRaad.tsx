import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RemoveBook } from '../../api/actions';
import { colorDarkCard, colorLetter, colorLogo } from '../../interfaces/colors';
import { CourtType } from '../../interfaces/Courts';
import DialogRaad from '../DialogRaad';

export default function ListRaad(props: {
    mainText: string,
    secondText: string,
    courtType: CourtType,
    courtName: string,
    id: number,
    toDelete: boolean
}) {
    const [showPopUp, setShowPopUp] = useState(false);
    const navigate = useNavigate();
    return (
        <List sx={{ width: '100%', bgcolor: colorDarkCard, marginTop: "8px", borderRadius: 5 }}>
            <ListItem sx={{ height: "60px" }}>
                <ListItemAvatar>
                    {props.courtType == CourtType.PADEL ? <Avatar src={"./images/raqueta2.png"} variant="square" style={{ width: "50px", height: "50px" }} /> : <></>}
                    {props.courtType == CourtType.TENIS ? <Avatar src={"./images/imagesNuno/tenis.png"} variant="square" style={{ width: "40px", height: "40px" }} /> : <></>}
                    {props.courtType == CourtType.SALAS ? <Avatar src={"./images/imagesNuno/others.png"} variant="square" style={{ width: "40px", height: "45px" }} /> : <></>}
                    {props.courtType == CourtType.OTHER ? <Avatar src={"./images/imagesNuno/merendero.png"} variant="square" style={{ width: "45px", height: "60px" }} /> : <></>}
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={<div style={{ color: "white" }}>{props.mainText + " | " + props.courtName}</div>}
                    secondary={<div style={{ color: colorLetter }}>{props.secondText}</div>}
                />
                {props.toDelete ? <ListItemAvatar onClick={() => setShowPopUp(true)}>
                    <Avatar sx={{ bgcolor: 'inherit' }}>
                        <DeleteForeverIcon style={{ color: "#fff", cursor: "pointer" }} />
                    </Avatar>
                </ListItemAvatar> : <></>}
            </ListItem>
            <DialogRaad
                titleMsg={'Borrar reserva'}
                longMsg={'Está seguro de que quiere eliminar su reserva?'}
                activate={showPopUp}
                deactivate={function (): void {
                    setShowPopUp(false);
                }} confirmHandler={function (): void {
                    RemoveBook(props.id, function (resp: any) {
                        navigate("/");
                    })
                    setShowPopUp(false);
                }} />

        </List>
    );
}