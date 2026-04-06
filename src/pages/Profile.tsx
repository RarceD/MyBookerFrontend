import { Box, Button, Divider, Modal, Typography } from '@mui/material';
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
    const [open, setOpen] = useState(false);
    const modalMsg = useRef('');
    const navigate = useNavigate();
    const [openModalError, setOpenModalError] = useState(false);
    const [openModalOk, setOpenModalOk] = useState(false);

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

    const HandlerSaveNewValue = () => {
        const userChanged =
            firstUser === secondUser && firstUser !== '' && firstUser !== profile.username;
        const passwordChanged = firstPassword === secondPassword && firstPassword !== '';

        if (userChanged && passwordChanged) modalMsg.current = translate('profile.surePassEmailChange');
        else if (userChanged) modalMsg.current = translate('profile.sureEmailChange');
        else if (passwordChanged) modalMsg.current = translate('profile.surePassChange');
        else return;

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
                    {firstUser !== profile.username
                        ? translate('profile.changeEmailHeader')
                        : translate('profile.emailHeader')}
                </SectionLabel>
                <TextFieldRaadCustom
                    value={firstUser}
                    label={
                        firstUser === profile.username
                            ? translate('profile.email')
                            : translate('profile.newEmail')
                    }
                    onChange={(e: any) => setFirstUser(e.target.value)}
                />
                {firstUser !== profile.username && (
                    <TextFieldRaadCustom
                        value={secondUser}
                        label={translate('profile.repeateEmail')}
                        onChange={(e: any) => setSecondUser(e.target.value)}
                    />
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
                <TextFieldRaadCustom
                    value={firstPassword}
                    label={translate('profile.newPassword')}
                    type="password"
                    onChange={(e: any) => setFirstPassword(e.target.value)}
                />
                {firstPassword !== '' && (
                    <TextFieldRaadCustom
                        value={secondPassword}
                        type="password"
                        label={translate('profile.repeatePassword')}
                        onChange={(e: any) => setSecondPassword(e.target.value)}
                    />
                )}
            </Box>

            {/* Save button */}
            <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.5 }}
                onClick={HandlerSaveNewValue}
            >
                {translate('profile.updateUser')}
            </Button>

            {/* Dialogs */}
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
