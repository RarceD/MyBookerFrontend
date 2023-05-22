import { AppBar, Avatar, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogRaad from './DialogRaad';

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
                    <Typography
                        fontFamily={'sans-serif'}
                        sx={{
                            flexGrow: 1,
                            fontSize: 25,
                            fontWeight: 200,
                            letterSpacing: '.1rem',
                            color: '#cbc9c9',
                        }}
                    >
                        AppDeReservas
                    </Typography>
                    <IconButton onClick={logOut} sx={{ p: 0 }} >
                        <Avatar
                            alt="Remy Sharp" src="/images/logo.png" style={{ height: 65, width: 60, backgroundColor: "" }} />
                    </IconButton>
                </Toolbar>
            </Container>
            <DialogRaad
                titleMsg={'¿Quiere salir de su cuenta?'}
                longMsg={'Su cuenta se cerrará y deberá introducir la contraseña de nuevo'}
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