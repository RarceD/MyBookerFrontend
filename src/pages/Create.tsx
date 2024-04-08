
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Modal } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ChangeEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Md5 } from 'ts-md5';
import { tryCreateUser } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { NewUser } from '../interfaces/NewUser';
import { styleModalRaad } from '../util/util';
import { translate } from 'react-i18nify';

const Create = () => {
    const [searchParams, _] = useSearchParams();
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
            <Grid container
                spacing={3}
                style={{marginTop: '15%'}}
                alignItems="center"
                justifyContent="center"
                justifyItems="center"
                direction="column"
            >
                <Grid item>
                    <Typography variant="h5">
                        {translate('create.createNewUsers')} 
                    </Typography>
                </Grid>
                <Grid item>
                    <TextFieldRaad id="outlined-basic" label={translate("create.email")} variant="outlined" fullWidth
                        InputLabelProps={{ style: { color: "grey" } }}
                        value={username}
                        inputProps={{
                            style: {
                                color: 'white',
                                borderColor: "white",
                            }
                        }}
                        onChange={handleChangeUsername} />
                </Grid>
                <Grid item>
                    <TextFieldRaad id="filled-basic" label={translate("create.password")} variant="outlined" fullWidth
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
                </Grid>
                <Grid item>
                    <TextFieldRaad id="outline-basic" label={translate("create.repeatePassword")} variant="outlined" fullWidth
                        InputLabelProps={{ style: { color: "grey" } }}
                        value={passSecond}
                        type="password"
                        inputProps={{
                            style: {
                                color: 'white',
                                borderColor: "white",
                            }
                        }}
                        onChange={handleChangeName} />
                </Grid>

                <Grid item>
                    <Button variant="contained" endIcon={<SendIcon />} color="primary" onClick={createUser}>
                        {translate('create.createUser')} 
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="primary" onClick={() => navigate("/")}>
                        {translate('create.return')} 

                    </Button>
                </Grid>
            </Grid>

            <Modal open={openModal} >
                <Box sx={styleModalRaad}>
                    <Typography mx={{ xs: 12 }}>
                        {translate('create.notPossibleGeneric')} 
                    </Typography>
                </Box>
            </Modal>

            <Modal open={openModalErrorPass} >
                <Box sx={styleModalRaad}>
                    <Typography mx={{ xs: 12 }}>
                        {translate('create.notPossiblePass')} 
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}
export default Create;