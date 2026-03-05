import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    Typography,
    Stack,
    Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Md5 } from 'ts-md5';
import { tryLogin } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { APP_NAME, getCorrectLogo } from '../api/request';
import { translate } from 'react-i18nify';

export const Login = () => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [errorSubmit, setErrorSubmit] = useState(false);
    const navigate = useNavigate();
    const [autologin, setAutologin] = useState(false);

    useEffect(() => {
        const autoLogin = localStorage.getItem('autologin');
        if (autoLogin != null) navigate('/courts');
    }, [navigate]);

    const handleSubmit = () => {
        if (user === '' || pass === '') return;
        const passServer = new Md5().appendStr(pass).end()?.toString();
        tryLogin({ user, pass: passServer }, (response: any) => {
            if (response['success']) {
                localStorage.setItem('id', response['id']);
                localStorage.setItem('token', response['token']);
                localStorage.setItem('autologin', autologin ? '1' : '0');
                navigate('/courts');
            } else {
                setErrorSubmit(true);
            }
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 4,
                bgcolor: 'background.default',
            }}
        >
            {/* Card */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    p: { xs: 3, sm: 4 },
                    boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
                }}
            >
                {/* Logo + app name */}
                <Stack alignItems="center" spacing={1.5} mb={4}>
                    <Avatar
                        alt={APP_NAME}
                        src={getCorrectLogo(APP_NAME)}
                        variant="rounded"
                        sx={{
                            width: 72,
                            height: 72,
                            borderRadius: '18px',
                            bgcolor: 'transparent',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                    <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
                        {APP_NAME}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {translate('login.subtitle') || 'Sign in to your account'}
                    </Typography>
                </Stack>

                {/* Form */}
                <Stack spacing={2} component="form">
                    <TextFieldRaad
                        label={translate('login.email')}
                        type="text"
                        fullWidth
                        autoComplete="email"
                        error={errorSubmit}
                        name="email"
                        autoFocus
                        onChange={(e: any) => {
                            setUser(e.target.value);
                            setErrorSubmit(false);
                        }}
                    />

                    <TextFieldRaad
                        fullWidth
                        error={errorSubmit}
                        helperText={errorSubmit ? translate('login.invalidCredentials') || 'Invalid email or password' : ''}
                        name="password"
                        label={translate('login.password')}
                        type="password"
                        onChange={(e: any) => {
                            setPass(e.target.value);
                            setErrorSubmit(false);
                        }}
                        onKeyPress={(e: any) => {
                            if (e.key === 'Enter') handleSubmit();
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={autologin}
                                onChange={() => setAutologin(v => !v)}
                                size="small"
                            />
                        }
                        label={translate('login.remember')}
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        sx={{ mt: 1, py: 1.4 }}
                    >
                        {translate('login.enter')}
                    </Button>
                </Stack>

                <Divider sx={{ my: 3, borderColor: 'divider' }} />

                {/* Links */}
                <Stack direction="row" justifyContent="space-between">
                    <Link href="forget" variant="body2" underline="hover">
                        {translate('login.forgetPassword')}
                    </Link>
                    <Link href="number" variant="body2" underline="hover">
                        {translate('login.loginWithCode')}
                    </Link>
                </Stack>
            </Box>
        </Box>
    );
};

export default Login;
