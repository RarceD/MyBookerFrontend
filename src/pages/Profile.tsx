import { Alert, Box, Button, Modal, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Md5 } from 'ts-md5';
import { updateUserPost } from '../api/actions';
import { GetTokenId } from '../api/auth';
import { GetProfileInfo } from '../api/request';
import DialogRaad from '../components/DialogRaad';
import ProfileCardRaad from '../components/profile/ProfileCardRaad';
import { TextFieldRaadCustom } from '../components/profile/TextFieldRaadCustom';
import { ProfileInfo } from '../interfaces/ProfileInfo';
import { ProfileToChange } from '../interfaces/profile';
import { styleModalRaad } from '../util/util';
import { translate } from 'react-i18nify';
import NoConnection from './NoConnection';

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            variant="caption"
            sx={{
                display: 'block',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                mb: 1.5,
            }}
        >
            {children}
        </Typography>
    );
}

const Profile = () => {
    const [profile, setProfile] = useState<ProfileInfo>({
        letter: '',
        name: '',
        plays: 1,
        urbaName: '',
        username: '',
    });
    const [firstUser, setFirstUser] = useState<string>(profile.username);
    const [secondUser, setSecondUser] = useState<string>('');
    const [firstPassword, setFirstPassword] = useState<string>('');
    const [secondPassword, setSecondPassword] = useState<string>('');
    const [editingEmail, setEditingEmail] = useState<boolean>(false);
    const [editingPassword, setEditingPassword] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [open, setOpen] = useState(false);
    const modalMsg = useRef('');
    const navigate = useNavigate();
    const [openModalError, setOpenModalError] = useState(false);
    const [openModalOk, setOpenModalOk] = useState(false);

    const cancelEmailEdit = () => {
        setFirstUser(profile.username);
        setSecondUser('');
        setEmailError('');
        setEditingEmail(false);
    };
    const cancelPasswordEdit = () => {
        setFirstPassword('');
        setSecondPassword('');
        setPasswordError('');
        setEditingPassword(false);
    };

    // Sends the profile change. Same payload the app already used in production:
    // the username only when it actually changed, and the (MD5) password.
    const updateUser = () => {
        const [token, id] = GetTokenId();
        const data: ProfileToChange = {
            id: +id,
            password: new Md5().appendStr(firstPassword).end()?.toString() ?? '',
            token: token ?? '',
            username: firstUser !== profile.username ? firstUser : '',
        };
        updateUserPost(data, (response) => {
            const r: any = response;
            if (r.status === 200) {
                setOpenModalOk(true);
                setTimeout(() => { setOpenModalOk(false); navigate('/'); }, 3500);
            } else {
                setOpenModalError(true);
                setTimeout(() => setOpenModalError(false), 3500);
            }
        });
    };

    const handlerSaveEmail = () => {
        if (firstUser.trim() === '') { setEmailError(translate('profile.errorEmailEmpty')); return; }
        if (secondUser.trim() === '' || firstUser !== secondUser) { setEmailError(translate('profile.errorEmailMismatch')); return; }
        if (firstUser === profile.username) { setEmailError(translate('profile.errorEmailSame')); return; }
        setEmailError('');
        modalMsg.current = translate('profile.sureEmailChange');
        setOpen(true);
    };

    const handlerSavePassword = () => {
        if (firstPassword === '') { setPasswordError(translate('profile.errorPasswordEmpty')); return; }
        if (secondPassword === '' || firstPassword !== secondPassword) { setPasswordError(translate('profile.errorPasswordMismatch')); return; }
        setPasswordError('');
        modalMsg.current = translate('profile.surePassChange');
        setOpen(true);
    };

    useEffect(() => { GetProfileInfo((n: ProfileInfo) => setProfile(n)); }, []);
    useEffect(() => { setFirstUser(profile.username); }, [profile]);

    if (profile.name === '') return <NoConnection />;

    return (
        <Box sx={{ paddingTop: 'var(--header-height)', pb: '80px', px: 2 }}>
            {/* Profile card */}
            <ProfileCardRaad
                name={profile.name}
                urbaName={profile.urbaName}
                numberPlays={profile.plays}
            />

            {/* Email section */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    p: 2.5,
                    mb: 2,
                }}
            >
                <SectionLabel>
                    {editingEmail
                        ? translate('profile.changeEmailHeader')
                        : translate('profile.emailHeader')}
                </SectionLabel>

                {!editingEmail ? (
                    <>
                        <Typography variant="body1" sx={{ mb: 2, wordBreak: 'break-all' }}>
                            {profile.username}
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setEditingEmail(true)}
                        >
                            {translate('profile.editEmail')}
                        </Button>
                    </>
                ) : (
                    <>
                        <TextFieldRaadCustom
                            value={firstUser}
                            label={translate('profile.newEmail')}
                            error={emailError !== ''}
                            onChange={(e: any) => { setFirstUser(e.target.value); if (emailError) setEmailError(''); }}
                        />
                        <TextFieldRaadCustom
                            value={secondUser}
                            label={translate('profile.repeateEmail')}
                            error={emailError !== ''}
                            onChange={(e: any) => { setSecondUser(e.target.value); if (emailError) setEmailError(''); }}
                        />
                        {emailError && (
                            <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
                                {emailError}
                            </Alert>
                        )}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" onClick={handlerSaveEmail}>
                                {translate('profile.updateUser')}
                            </Button>
                            <Button variant="text" color="inherit" onClick={cancelEmailEdit}>
                                {translate('components.cancel')}
                            </Button>
                        </Stack>
                    </>
                )}
            </Box>

            {/* Password section */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    p: 2.5,
                    mb: 3,
                }}
            >
                <SectionLabel>{translate('profile.passwordChange')}</SectionLabel>

                {!editingPassword ? (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setEditingPassword(true)}
                    >
                        {translate('profile.editPassword')}
                    </Button>
                ) : (
                    <>
                        <TextFieldRaadCustom
                            value={firstPassword}
                            label={translate('profile.newPassword')}
                            type="password"
                            error={passwordError !== ''}
                            onChange={(e: any) => { setFirstPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                        />
                        <TextFieldRaadCustom
                            value={secondPassword}
                            type="password"
                            label={translate('profile.repeatePassword')}
                            error={passwordError !== ''}
                            onChange={(e: any) => { setSecondPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                        />
                        {passwordError && (
                            <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
                                {passwordError}
                            </Alert>
                        )}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" onClick={handlerSavePassword}>
                                {translate('profile.updateUser')}
                            </Button>
                            <Button variant="text" color="inherit" onClick={cancelPasswordEdit}>
                                {translate('components.cancel')}
                            </Button>
                        </Stack>
                    </>
                )}
            </Box>

            {/* Confirm dialog + result modals */}
            <DialogRaad
                titleMsg={translate('profile.updateProfile')}
                longMsg={modalMsg.current}
                activate={open}
                deactivate={() => setOpen(false)}
                confirmHandler={() => { updateUser(); setOpen(false); }}
            />

            <Modal open={openModalOk}>
                <Box sx={styleModalRaad}>
                    <Typography>{translate('profile.successOnEdit')}</Typography>
                </Box>
            </Modal>
            <Modal open={openModalError}>
                <Box sx={styleModalRaad}>
                    <Typography>{translate('profile.errorOnEdit')}</Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default Profile;
