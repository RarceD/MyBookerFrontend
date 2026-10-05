
import SendIcon from '@mui/icons-material/Send';
import { Alert, Box, Button, Modal } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Md5 } from 'ts-md5';
import { numberCreateCredentials, tryCreateUser } from '../api/actions';
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
    const [usernameSecond, setUsernameSecond] = useState("");
    const handleChangeUsernameSecond = (event: ChangeEvent<HTMLInputElement>) => {
        setUsernameSecond(event.target.value);
    };
    const [pass, setPass] = useState("");
    const handleChangePass = (event: ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value);
    };
    const [passSecond, setPassSecond] = useState("");
    const handleChangePassSecond = (event: ChangeEvent<HTMLInputElement>) => {
        setPassSecond(event.target.value);
    };
    const [openModal, setOpenModal] = useState(false);
    const [openModalErrorPass, setOpenModalErrorPass] = useState(false);
    const [openModalErrorEmail, setOpenModalErrorEmail] = useState(false);
    // Masked email of the account the house already has (e.g. "clau****@gmail.com"), if any
    const [existingAccount, setExistingAccount] = useState<string | null>(null);

    // Coming from the QR: if the house already has an account, say so before the neighbour fills the form
    useEffect(() => {
        const code = searchParams.get("i");
        if (!code) return;
        numberCreateCredentials(code, (response: any) => {
            if (response && !response.success && response.existingAccount) setExistingAccount(response.existingAccount);
        });
    }, [searchParams]);

    const createUser = () => {
        if (username === "" || usernameSecond === "" || pass === "" || passSecond === "") return;
        let floor = searchParams.get("f");
        let door = searchParams.get("d");
        let key = searchParams.get("k");
        let house = searchParams.get("h");
        let name_id = searchParams.get("i");
        if (username !== usernameSecond) {
            setOpenModalErrorEmail(true);
            setTimeout(() => {
                setOpenModalErrorEmail(false);
            }, 2500)
            return;
        }
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
                else if (r.status === 409) {
                    r.json().then((body: any) => setExistingAccount(body?.existingAccount ?? null)).catch(() => setOpenModal(true));
                }
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
                {existingAccount !== null &&
                    <Grid item sx={{ maxWidth: 420 }}>
                        <Alert severity="info" variant="outlined" sx={{ mx: 2 }}>
                            {translate('create.existingAccount', { email: existingAccount })}
                            <Button size="small" variant="outlined" sx={{ mt: 1.5, display: 'block' }} onClick={() => navigate('/forget')}>
                                {translate('create.btnReset')}
                            </Button>
                        </Alert>
                    </Grid>
                }
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
                    <TextFieldRaad id="outlined-basic-email-2" label={translate("create.repeateEmail")} variant="outlined" fullWidth
                        InputLabelProps={{ style: { color: "grey" } }}
                        value={usernameSecond}
                        error={usernameSecond !== "" && usernameSecond !== username}
                        inputProps={{
                            style: {
                                color: 'white',
                                borderColor: "white",
                            }
                        }}
                        onChange={handleChangeUsernameSecond} />
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
                        error={passSecond !== "" && passSecond !== pass}
                        inputProps={{
                            style: {
                                color: 'white',
                                borderColor: "white",
                            }
                        }}
                        onChange={handleChangePassSecond} />
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

            <Modal open={openModalErrorEmail} >
                <Box sx={styleModalRaad}>
                    <Typography mx={{ xs: 12 }}>
                        {translate('create.notPossibleEmail')}
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
