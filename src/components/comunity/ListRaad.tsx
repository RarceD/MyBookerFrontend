import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
    Avatar,
    Box,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RemoveBook } from '../../api/actions';
import { CourtType } from '../../interfaces/Courts';
import DialogRaad from '../DialogRaad';
import { daysOfTheWeek } from '../../util/util';
import { translate } from 'react-i18nify';

export default function ListRaad(props: {
    mainText: string;
    secondText: string;
    courtType: CourtType;
    courtName: string;
    id: number;
    toDelete: boolean;
}) {
    const [showPopUp, setShowPopUp] = useState(false);
    const [showPassBookDelete, setShowPassBookDelete] = useState(false);
    const navigate = useNavigate();

    const isPassedBook = (mainText: string): boolean => {
        const weekday = mainText.split(' ')[0];
        const hour = +mainText.split(' ')[1].split(':')[0];
        return hour <= new Date().getHours() && daysOfTheWeek[weekday] === new Date().getDay();
    };

    const isPast = isPassedBook(props.mainText);

    const courtIconSrc: Partial<Record<CourtType, string>> = {
        [CourtType.PADEL]: './images/raqueta2.png',
        [CourtType.TENIS]: './images/imagesNuno/tenis.png',
        [CourtType.SALAS]: './images/imagesNuno/others.png',
        [CourtType.OTHER]: './images/imagesNuno/merendero.png',
    };

    return (
        <>
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    mb: 1.5,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                    opacity: isPast && props.toDelete ? 0.55 : 1,
                    '&:hover': {
                        borderColor: 'primary.main',
                    },
                }}
            >
                <ListItem
                    sx={{ py: 1.5, px: 2 }}
                    secondaryAction={
                        props.toDelete ? (
                            <IconButton
                                edge="end"
                                size="small"
                                onClick={() =>
                                    isPast ? setShowPassBookDelete(true) : setShowPopUp(true)
                                }
                                sx={{
                                    color: isPast ? 'text.disabled' : 'error.main',
                                    opacity: isPast ? 0.4 : 1,
                                    '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                                }}
                            >
                                <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                        ) : null
                    }
                >
                    <ListItemAvatar sx={{ minWidth: 52 }}>
                        {courtIconSrc[props.courtType] ? (
                            <Avatar
                                alt={String(props.courtType)}
                                src={courtIconSrc[props.courtType]}
                                variant="rounded"
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    bgcolor: 'background.default',
                                    '& img': { objectFit: 'contain' },
                                }}
                            />
                        ) : null}
                    </ListItemAvatar>
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
                                {props.mainText}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mx: 0.5 }}
                                >
                                    ·
                                </Typography>
                                {props.courtName}
                            </Typography>
                        }
                        secondary={
                            <Typography variant="caption" color="text.secondary">
                                {props.secondText}
                            </Typography>
                        }
                    />
                </ListItem>
            </Box>

            <DialogRaad
                titleMsg={translate('community.deleteBook')}
                longMsg={translate('community.deleteAskConfirmation')}
                activate={showPopUp}
                deactivate={() => setShowPopUp(false)}
                confirmHandler={() => {
                    const time = props.mainText.split(' ')[1];
                    RemoveBook(props.id, time, (_resp: any) => navigate('/'));
                    setShowPopUp(false);
                }}
            />
            <DialogRaad
                titleMsg={translate('community.deleteBook')}
                longMsg={translate('community.deleteErrorBooking')}
                activate={showPassBookDelete}
                deactivate={() => setShowPassBookDelete(false)}
                confirmHandler={() => setShowPassBookDelete(false)}
            />
        </>
    );
}
