import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { Alert, Button, FormControlLabel, IconButton, Radio, RadioGroup, Slider, Snackbar, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef, useState } from 'react';
import { MakeBook } from '../api/actions';
import { GetCourts } from '../api/request';
import DateSelectorRaad from '../components/courts/DateSelectorRaad';
import SchedulRaad, { HourInfo } from '../components/courts/SchedulRaad';
import DialogRaad from '../components/DialogRaad';
import { BasicTabsRaadUncontrolled } from '../components/TabsRaad';
import { Booker } from '../interfaces/Booker';
import { colorDarkCard, colorLetter, colorLogo } from '../interfaces/colors';
import { Court, Timetable } from '../interfaces/Courts';
import { areThereMultipleCourtTypes, getCourtType, getCourtTypesTabsList, getDateSelectorDtoListFromCourts, getMaxSliderValues, getSlider, getTypeNameCourt, styleModalRaad } from '../util/util';
import { GenericResponse } from '../interfaces/GenericResponse';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SelectedItem {
    courtId: number,
    date: number,
    hour: number,
    time: number
}
const Courts = () => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [selectedItem, setSelectedItem] = useState<SelectedItem>({ courtId: 0, hour: 0, date: 0, time: 0 });
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const [courtTypeSelected, setCourtTypeSelected] = useState<number>(0);
    const navigate = useNavigate();
    const [hours, setHours] = useState<HourInfo[]>([]);
    const [open, setOpen] = useState(false);
    const [openZeroTimeModal, setOpenZeroTimeModal] = useState(false);
    const modalMsg = useRef("");

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setOpenZeroTimeModal(false);
    };

    useEffect(() => {
        GetCourts((n: Court[]) => {
            if (n.length > 0) setSelectedItem({ date: n[0].timetables[0].day, courtId: n[0].id, hour: -1, time: 0 })
            setCourts(n);
        });
    }, []);

    useEffect(() => {
        for (let c of courts) {
            if (c.id != selectedItem.courtId) continue;
            let listOfTimes: HourInfo[] = [];
            // Get current day: 
            let currentDay = c.timetables.filter(t => t.day == selectedItem.date)[0]
            for (let v of currentDay.availability) {
                let item: HourInfo = { color: colorDarkCard, title: v.time }
                if (!v.valid) {
                    item.color = "#000";
                }
                listOfTimes.push(item)
            }
            setHours(listOfTimes);
        }
    }, [courts, selectedItem]);

    const confirmBookAction = () => {
        // Get full day:
        const court: Court = courts.filter(c => c.id == selectedItem.courtId)[0];
        const timetable: Timetable = court.timetables.filter(t => t.day == selectedItem.date)[0];
        const b: Booker = {
            courtId: selectedItem.courtId,
            duration: selectedItem.time.toString(),
            day: timetable.fullDay,
            time: hours[selectedItem.hour].title,
            id: 0
        }
        MakeBook(b, (resp: GenericResponse) => {
            if (resp.error == true) {
                modalMsg.current = "No es posible llevar a cabo su reserva, por favor compruebe las fechas y que no haya reservado previamente ese día.";
                setOpen(true);
            }
            else {
                modalMsg.current = "Su reserva se ha guardado correctamente. Disfrute de su partida.";
                setOpen(true);
                setTimeout(() => navigate('/comunity'), 3000);
            }
        })
        setShowPopUp(false);
    }

    return (
        <div style={{ marginTop: 100, marginBottom: 120 }}>
            {!areThereMultipleCourtTypes(courts) ?
                <div style={{ textAlign: "right" }}>
                    {getTypeNameCourt(courtTypeSelected)}
                </div> : <></>}
            <div className="comunity-text-center">
                Selección de pista:
                {areThereMultipleCourtTypes(courts) ?
                    <BasicTabsRaadUncontrolled
                        value={courtTypeSelected} listComponents={[]}
                        setValue={(type: number) => {
                            let courtWithTypeX: Court[] = courts.filter(c => c.type == type);
                            setSelectedItem({
                                date: selectedItem.date,
                                courtId: courtWithTypeX.length > 0 ? courtWithTypeX[0].id : courts[0].id,
                                hour: selectedItem.hour, time: 0
                            })
                            setCourtTypeSelected(type);
                        }}
                        listLabels={getCourtTypesTabsList(courts)} />
                    : <></>
                }

                <RadioGroup value={selectedItem.courtId} style={{ color: colorLetter }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        let courtIdToBook: number = +(event.target as HTMLInputElement).value;
                        setSelectedItem({ date: selectedItem.date, courtId: courtIdToBook, hour: -1, time: 0 })
                    }}>
                    {courts.filter(c => c.type == courtTypeSelected).map((item, idx) => <FormControlLabel value={item.id} key={idx}
                        control={<Radio style={{ color: colorLogo }} />} label={item.name} />)}
                </RadioGroup>
            </div>

            <div className="comunity-text">
                Fechas disponibles:
            </div>
            <DateSelectorRaad iconType={getCourtType(courts, selectedItem.courtId)}
                dateSelectorDto={getDateSelectorDtoListFromCourts(courts, selectedItem.courtId)}
                selected={selectedItem.date} setSelected={function (n: number): void {
                    setSelectedItem({ date: n, courtId: selectedItem.courtId, hour: -1, time: 0 })
                }} />

            <div className="comunity-text">
                Horario:
            </div>
            <SchedulRaad hours={hours} selected={selectedItem.hour} daySelected={selectedItem.date}
                changeSelectedHour={
                    (index: number) => {
                        setSelectedItem({ date: selectedItem.date, courtId: selectedItem.courtId, hour: index, time: 0 })
                    }} />

            <div className="comunity-text">
                Tiempo de reserva:
            </div>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <AccessTimeIcon style={{ color: colorLogo }} />
                <Slider value={selectedItem.time}
                    step={getSlider(courts.filter(c => c.id == selectedItem.courtId))}
                    marks
                    min={0}
                    max={getMaxSliderValues(courts.filter(c => c.id == selectedItem.courtId))}
                    valueLabelDisplay={"auto"}
                    onChange={function (event: Event, newValue: number | number[]): void {
                        let time: number = newValue as number;
                        setSelectedItem({
                            date: selectedItem.date,
                            courtId: selectedItem.courtId, hour: selectedItem.hour,
                            time: time
                        })
                    }}
                    style={{ color: colorLetter }} />
                <AccessTimeFilledIcon style={{ color: colorLogo }} />
            </Stack>

            <div style={{ textAlign: "center" }}>
                <Button variant="outlined"
                    onClick={() => {
                        if (selectedItem.time == 0 || selectedItem.time == -1) {
                            setOpenZeroTimeModal(true)
                            return;
                        }
                        if (selectedItem.hour == -1) return;
                        setShowPopUp(true)
                    }}
                    style={{ background: colorLogo, color: "white" }}>
                    Confirmar reserva
                </Button>
            </div>

            <DialogRaad
                titleMsg={'Confirmar reserva'}
                longMsg={'¿Está seguro de que quiere reservar?'}
                activate={showPopUp}
                deactivate={() => setShowPopUp(false)}
                confirmHandler={() => confirmBookAction()} />
            <Snackbar
                open={open}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handleClose}
                message={modalMsg.current}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
            <Snackbar open={openZeroTimeModal}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={4000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    No olvide seleccionar el tiempo de reserva.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Courts;
