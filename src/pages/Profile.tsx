import { Box, Button, Modal, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Md5 } from 'ts-md5';
import { updateUserPost } from '../api/actions';
import { GetTokenId } from '../api/auth';
import { GetProfileInfo } from '../api/request';
import DialogRaad from '../components/DialogRaad';
import ProfileCardRaad from '../components/profile/ProfileCardRaad';
import { TextFieldRaadCustom } from "../components/profile/TextFieldRaadCustom";
import { ProfileInfo } from '../interfaces/ProfileInfo';
import { colorLogo } from '../interfaces/colors';
import { ProfileToChange } from '../interfaces/profile';
import { styleModalRaad } from '../util/util';
import './pages.css';

const Profile = () => {
    const [profile, setProfile] = useState<ProfileInfo>({ floor: "", letter: "", name: "", plays: 1, urbaName: "", username: "" });
    const [firstUser, setFirstUser] = useState<string>(profile.username);
    const [secondUser, setSecondUser] = useState<string>("");
    const [firstPassword, setFirstPassword] = useState<string>("");
    const [secondPassword, setSecondPassword] = useState<string>("");
    const [open, setOpen] = useState(false);
    const modalMsg = useRef("");
    const navigate = useNavigate();

    const [openModalError, setOpenModalError] = useState(false);
    const [openModalOk, setOpenModalOk] = useState(false);

    const updateUser = () => {
        const [token, id] = GetTokenId();
        const data: ProfileToChange = {
            id: +id,
            password: new Md5().appendStr(firstPassword).end()?.toString() ?? "",
            token: token == null ? "" : token,
            username: firstUser != profile.username ? firstUser : ""
        }
        updateUserPost(data, (response) => {
            let r: any = response;
            if (r.status === 200) {
                setOpenModalOk(true);
                setTimeout(() => {
                    setOpenModalOk(false);
                    navigate("/");
                }, 3500)
            }
            else {
                setOpenModalError(true);
                setTimeout(() => {
                    setOpenModalError(false);
                }, 3500)
            }
        });
    };

    const HandlerSaveNewValue = () => {
        let userChanged, passwordChanged = false;

        if ((firstUser == secondUser) && (firstUser != "") && (firstUser != profile.username))
            userChanged = true;

        if ((firstPassword == secondPassword) && (firstPassword != ""))
            passwordChanged = true;

        if (userChanged && passwordChanged)
            modalMsg.current = "¿Desea llevar a cabo el cambio de correo electrónico y contraseña?"
        else if (userChanged && !passwordChanged)
            modalMsg.current = "¿Desea llevar a cabo el cambio de correo electrónico?"
        else if (!userChanged && passwordChanged)
            modalMsg.current = "¿Desea llevar a cabo el cambio de contraseña?"
        else
            return


        setOpen(true);
    }

    useEffect(() => {
        GetProfileInfo((n: ProfileInfo) => setProfile(n));
    }, [])

    useEffect(() => {
        setFirstUser(profile.username)
    }, [profile])

    return (
        <>
            <div style={{ marginTop: 80, marginBottom: 120, marginLeft: 20, marginRight: 20 }}>
                <ProfileCardRaad name={profile.name} urbaName={profile.urbaName} numberPlays={profile.plays} />

                {firstUser !== profile.username && <h4>Cambio de correo electrónico</h4>}
                <TextFieldRaadCustom
                    value={firstUser}
                    label={firstUser == profile.username ? "Correo" : "Nuevo correo"}
                    onChange={(e: any) => { setFirstUser(e.target.value); }}
                />
                {firstUser !== profile.username &&
                    <TextFieldRaadCustom
                        value={secondUser}
                        label="Repetición de correo"
                        onChange={(e: any) => { setSecondUser(e.target.value); }}
                    />
                }

                <h4>Cambio de contraseña</h4>
                <TextFieldRaadCustom
                    value={firstPassword}
                    label="Nueva contraseña"
                    type="password"
                    onChange={(e: any) => { setFirstPassword(e.target.value); }}
                />
                {firstPassword != '' &&
                    <TextFieldRaadCustom
                        value={secondPassword}
                        type="password"
                        label="Repetición de contraseña"
                        onChange={(e: any) => { setSecondPassword(e.target.value); }}
                    />
                }
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Button variant="outlined" style={{ background: colorLogo, color: "white", borderRadius: "12px" }}
                        onClick={() => HandlerSaveNewValue()}
                    >
                        Actualizar usuario
                    </Button>
                </div>
            </div>



            <DialogRaad titleMsg={"Actualización perfil"} longMsg={modalMsg.current} activate={open}
                deactivate={function (): void {
                    setOpen(false);
                }} confirmHandler={function (): void {
                    updateUser();
                    setOpen(false);
                }} />

            <Modal
                open={openModalOk}
            >
                <Box sx={styleModalRaad}>
                    <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                        Sus datos han sido moficados con éxito.
                    </Typography>
                </Box>
            </Modal>
            <Modal
                open={openModalError}
            >
                <Box sx={styleModalRaad}>
                    <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                        No es posible modificar su correo o contraseña, pruebe más tarde.
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default Profile;