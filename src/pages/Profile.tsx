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
import { translate } from 'react-i18nify';

const Profile = () => {
    const [profile, setProfile] = useState<ProfileInfo>({ letter: "", name: "", plays: 1, urbaName: "", username: "" });
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
            modalMsg.current = translate('profile.surePassEmailChange');
        else if (userChanged && !passwordChanged)
            modalMsg.current = translate('profile.sureEmailChange');
        else if (!userChanged && passwordChanged)
            modalMsg.current = translate('profile.surePassChange');
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
                <h4>
                    {firstUser !== profile.username ? translate('profile.changeEmailHeader') : translate('profile.emailHeader')}
                </h4>
                <TextFieldRaadCustom
                    value={firstUser}
                    label={firstUser == profile.username ? translate('profile.email') : translate('profile.newEmail')}
                    onChange={(e: any) => { setFirstUser(e.target.value); }}
                />
                {firstUser !== profile.username &&
                    <TextFieldRaadCustom
                        value={secondUser}
                        label={translate('profile.repeateEmail')}
                        onChange={(e: any) => { setSecondUser(e.target.value); }}
                    />
                }
                <h4>{translate('profile.passwordChange')} </h4>
                <TextFieldRaadCustom
                    value={firstPassword}
                    label={translate('profile.newPassword')}
                    type="password"
                    onChange={(e: any) => { setFirstPassword(e.target.value); }}
                />
                {firstPassword != '' &&
                    <TextFieldRaadCustom
                        value={secondPassword}
                        type="password"
                        label={translate('profile.repeatePassword')}
                        onChange={(e: any) => { setSecondPassword(e.target.value); }}
                    />
                }
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Button variant="outlined" style={{ background: colorLogo, color: "white", borderRadius: "12px" }}
                        onClick={() => HandlerSaveNewValue()}
                    >
                        {translate('profile.updateUser')}
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
                        {translate('profile.successOnEdit')}
                    </Typography>
                </Box>
            </Modal>
            <Modal
                open={openModalError}
            >
                <Box sx={styleModalRaad}>
                    <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                        {translate('profile.errorOnEdit')}
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default Profile;