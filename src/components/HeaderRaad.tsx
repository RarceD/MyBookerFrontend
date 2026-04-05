import { AppBar, Avatar, Box, Container, Toolbar, Typography } from '@mui/material';
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogRaad from './DialogRaad';
import { APP_NAME, getCorrectLogo } from '../api/request';
import { translate } from 'react-i18nify';

function HeaderRaad() {
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const navigation = useNavigate();

    return (
        <AppBar position="fixed" elevation={0} className="header" sx={{ top: 0, left: 0 }}>
            <Container maxWidth="md" disableGutters>
                <Toolbar disableGutters sx={{ px: { xs: 2, sm: 3 }, minHeight: '64px !important' }}>
                    {/* Logo */}
                    <Avatar
                        alt={APP_NAME}
                        src={getCorrectLogo(APP_NAME)}
                        variant="rounded"
                        sx={{
                            height: 40,
                            width: 40,
                            borderRadius: '10px',
                            mr: 1.5,
                            bgcolor: 'transparent',
                        }}
                    />

                    {/* App name */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            sx={{
                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                color: 'text.primary',
                                lineHeight: 1,
                            }}
                        >
                            {APP_NAME}
                        </Typography>
                    </Box>

                    {/* Logout */}
                    <Box
                        onClick={() => setShowPopUp(true)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            color: 'text.secondary',
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                bgcolor: 'rgba(255,132,0,0.08)',
                            },
                        }}
                    >
                        <LogoutIcon sx={{ fontSize: 18 }} />
                    </Box>
                </Toolbar>
            </Container>

            <DialogRaad
                titleMsg={translate('components.logOutHeader')}
                longMsg={translate('components.logOutQuestion')}
                activate={showPopUp}
                deactivate={() => setShowPopUp(false)}
                confirmHandler={() => {
                    localStorage.clear();
                    navigation('/');
                }}
            />
        </AppBar>
    );
}

export default HeaderRaad;
