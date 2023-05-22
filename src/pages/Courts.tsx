import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup, Slider, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MakeBook } from '../api/actions';
import { GetCourts } from '../api/request';
import DateSelectorRaad from '../components/courts/DateSelectorRaad';
import SchedulRaad, { HourInfo } from '../components/courts/SchedulRaad';
import DialogRaad from '../components/DialogRaad';
import { BasicTabsRaadUncontrolled } from '../components/TabsRaad';
import { Booker } from '../interfaces/Booker';
import { colorDarkCard, colorLetter, colorLogo } from '../interfaces/colors';
import { Court } from '../interfaces/Courts';
import { areThereMultipleCourtTypes, getCourtType, getCourtTypesTabsList, getDateSelectorDtoListFromCourts, getTypeNameCourt, styleModalRaad } from '../util/util';

interface SelectedItem {
    courtId: number,
    hour: number,
    date: number,
    time: number
}
const Courts = () => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [selectedItem, setSelectedItem] = useState<SelectedItem>({ courtId: 0, hour: 0, date: 0, time: 1 });
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const [courtTypeSelected, setCourtTypeSelected] = useState<number>(0);

    const [hours, setHours] = useState<HourInfo[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const modalMsg = useRef("");

    const navigate = useNavigate();
    useEffect(() => {
        GetCourts((n: Court[]) => {
            if (n.length > 0) setSelectedItem({ date: 0, courtId: n[0].id, hour: 0, time: 1 })
            setCourts(n);
            console.log(n);
        });
    }, []);
    useEffect(() => {
        for (let c of courts) {
            if (c.id != selectedItem.courtId) continue;
            let listOfTimes: HourInfo[] = [];
            for (let v of c.timetables.filter(i => i.day === '22')) {
                let item: HourInfo = { color: colorDarkCard, title: v.time }
                if (!v.valid) {
                    item.color = "#000";
                }
                listOfTimes.push(item)
            }
            setHours(listOfTimes);
        }
    }, [courts, selectedItem]);

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
                                hour: selectedItem.hour, time: 1
                            })
                            setCourtTypeSelected(type);
                        }}
                        listLabels={getCourtTypesTabsList(courts)} />
                    : <></>
                }

                <RadioGroup value={selectedItem.courtId} style={{ color: colorLetter }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        let courtIdToBook: number = +(event.target as HTMLInputElement).value;
                        setSelectedItem({ date: selectedItem.date, courtId: courtIdToBook, hour: selectedItem.hour, time: 1 })
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
                    setSelectedItem({ date: n, courtId: selectedItem.courtId, hour: selectedItem.hour, time: 1 })
                }} />

            <div className="comunity-text">
                Horario:
            </div>
            <SchedulRaad hours={hours} selected={selectedItem.hour} daySelected={selectedItem.date}
                changeSelectedHour={
                    (index: number) => {
                        setSelectedItem({ date: selectedItem.date, courtId: selectedItem.courtId, hour: index, time: 1 })
                    }} />

            <div className="comunity-text">
                Tiempo de reserva:
            </div>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <AccessTimeIcon style={{ color: colorLogo }} />
                <Slider value={selectedItem.time}
                    step={1} valueLabelDisplay={"auto"} marks min={0} max={1}
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
                        if (selectedItem.time == 0) return;
                        setShowPopUp(true)
                    }}
                    style={{ background: colorLogo, color: "white" }}>
                    Confirmar reserva
                </Button>
            </div>

            <DialogRaad
                titleMsg={'Confirmar reserva'}
                longMsg={'Está seguro de que quiere reservar'}
                activate={showPopUp}
                deactivate={function (): void {
                    setShowPopUp(false);
                }} confirmHandler={function (): void {
                    // Fechas disponibles: retornar "0-6" : selectedItem.hour
                    let weekday: number = new Date().getDay(); // It starts on sunday:
                    if (weekday === 0)
                        weekday = 6;
                    else
                        weekday -= 1;
                    weekday += selectedItem.date;
                    if (weekday > 6)
                        weekday = weekday - 7;
                    // Horario: retornar "09:00" : selectedItem.hour
                    let time: string = hours[selectedItem.hour].title;
                    //Tiempo de reserva : "1" : selectedItem.
                    let duration = selectedItem.time.toString();

                    let b: Booker = {
                        court_id: selectedItem.courtId,
                        duration: duration,
                        day: selectedItem.courtId,
                        time: time,

                        token: "",
                        id: "",
                    }
                    console.log(b);
                    /*
                    MakeBook(b, (resp: any) => {
                        if (resp.error == true) {
                            modalMsg.current = "No es posible llevar a cabo su reserva, por favor compruebe las fechas y que no haya reservado previamente ese día.";
                            setOpenModal(true)
                            setTimeout(() => setOpenModal(false), 3000)
                        }
                        else {
                            modalMsg.current = "Su reserva se ha guardado correctamente. Disfrute de su partida.";
                            setOpenModal(true)
                            setTimeout(() => {
                                setOpenModal(false)
                                navigate('/');
                            }, 3000)
                        }
                    })
                    */
                    setShowPopUp(false);
                }} />
            <Modal
                open={openModal}
            >
                <Box sx={styleModalRaad}>
                    <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                        {modalMsg.current}
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default Courts;
