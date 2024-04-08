import { AppBar, Avatar, Container, Toolbar, Typography } from '@mui/material';
import LogoutIcon from "@mui/icons-material/Logout"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogRaad from './DialogRaad';
import { APP_NAME, getCorrectLogo } from '../api/request';
import { translate } from 'react-i18nify';

function HeaderRaad() {
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const navigation = useNavigate();
    const logOut = () => {
        setShowPopUp(true)
    }
    return (
        <AppBar position="absolute" className="header" style={{ top: 0, left: 0 }} >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Avatar alt="Remy Sharp" src={getCorrectLogo(APP_NAME)} style={{ height: 65, width: 60, backgroundColor: "" }} />
                    <Typography
                        fontFamily={'sans-serif'}
                        sx={{
                            flexGrow: 1,
                            fontSize: 25,
                            fontWeight: 200,
                            letterSpacing: '.1rem',
                            color: '#cbc9c9',
                            paddingLeft: "1em"
                        }}
                    >
                        {APP_NAME}
                    </Typography>
                    <LogoutIcon onClick={logOut} style={{cursor: "pointer"}}/>
                </Toolbar>
            </Container>
            <DialogRaad
                titleMsg={translate('components.logOutHeader')}
                longMsg={translate('components.logOutQuestion')}
                activate={showPopUp}
                deactivate={function (): void {
                    setShowPopUp(false);
                }} confirmHandler={function (): void {
                    localStorage.clear();
                    navigation("/");
                }} />
        </AppBar>
    );
}
export default HeaderRaad;