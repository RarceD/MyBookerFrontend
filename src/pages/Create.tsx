
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Modal } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ChangeEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Md5 } from 'ts-md5';
import { tryCreateUser } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { NewUser } from '../interfaces/NewUser';
import { styleModalRaad } from '../util/util';

const Create = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };
    const [pass, setPass] = useState("");
    const handleChangePass = (event: ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value);
    };
    const [passSecond, setPassSecond] = useState("");
    const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setPassSecond(event.target.value);
    };
    const [openModal, setOpenModal] = useState(false);
    const [openModalErrorPass, setOpenModalErrorPass] = useState(false);

    const createUser = () => {
        if (username === "" || pass === "" || passSecond === "") return;
        let floor = searchParams.get("f");
        let door = searchParams.get("d");
        let key = searchParams.get("k");
        let house = searchParams.get("h");
        let name_id = searchParams.get("i");
        if (pass !== passSecond) {
            setOpenModalErrorPass(true);
            setTimeout(() => {
                setOpenModalErrorPass(false);
            }, 2500)
            return;
        }
        let passServer = new Md5().appendStr(pass).end()?.toString();
        if (key !== undefined) {
            const data: NewUser = {
                user: username,
                pass: passServer == undefined ? "" : passServer,
                key: key == null ? "" : key,
                name: name_id == null ? "" : name_id,
                floor: floor == null ? "" : floor,
                door: door == null ? "" : door,
                house: house == null ? "" : house
            }
            tryCreateUser(data, (response: any) => {
                const r: any = response;
                if (r.status === 200)
                    navigate('/login');
                else {
                    setOpenModal(true);
                    setTimeout(() => {
                        setOpenModal(false);
                    }, 2500)
                }
            })

        }
    };
    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: "95vh",
                padding: "0% 25% 0% 25%"
            }}>
                <Typography variant="h5">
                    Creación de nuevos usuarios:
                </Typography>
                <TextFieldRaad style={{ marginTop: "1em" }} id="outlined-basic" label="Correo:" variant="outlined" fullWidth
                    InputLabelProps={{ style: { color: "grey" } }}
                    value={username}
                    inputProps={{
                        style: {
                            color: 'white',
                            borderColor: "white",
                        }
                    }}
                    onChange={handleChangeUsername} />
                <TextFieldRaad style={{ marginTop: "1em" }} id="filled-basic" label="Contraseña" variant="outlined" fullWidth
                    InputLabelProps={{ style: { color: "grey" } }}
                    value={pass}
                    onChange={handleChangePass}
                    inputProps={{
                        style: {
                            color: 'white',
                            borderColor: "white",
                        }
                    }}
                    type="password" />
                {pass != "" && <TextFieldRaad style={{ marginTop: "1em" }} id="outline-basic" label="Repita contraseña" variant="outlined" fullWidth
                    InputLabelProps={{ style: { color: "grey" } }}
                    value={passSecond}
                    type="password"
                    inputProps={{
                        style: {
                            color: 'white',
                            borderColor: "white",
                        }
                    }}
                    onChange={handleChangeName} />}
                <Button style={{ marginTop: "1em" }} variant="contained" endIcon={<SendIcon />} color="warning" onClick={createUser}>
                    Crear Usuario
                </Button>

                <Button style={{ marginTop: "1em" }} variant="outlined" color="warning" onClick={() => navigate("/")}>
                    Volver
                </Button>
            </Box >

            <Modal open={openModal} >
                <Box sx={styleModalRaad}>
                    <Typography mx={{ xs: 12 }}>
                        No es posible crear su cuenta, por favor use otro correo o pruebe más tarde. Sentimos las molestias.
                    </Typography>
                </Box>
            </Modal>

            <Modal open={openModalErrorPass} >
                <Box sx={styleModalRaad}>
                    <Typography mx={{ xs: 12 }}>
                        No es posible crear su cuenta, por favor verifique que la contraseña coincide en ambos casos.
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}
export default Create;