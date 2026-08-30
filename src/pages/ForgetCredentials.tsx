import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, Collapse, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgetCredentials } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { translate } from 'react-i18nify';

type Status = 'idle' | 'error' | 'success';

const ForgetCredentials = () => {
    const navigate = useNavigate();
    const [secretNumber, setSecretNumber] = useState('');
    const [status, setStatus] = useState<Status>('idle');

    const forgetPassRequest = () => {
        if (secretNumber.length === 0) return;
        forgetCredentials(secretNumber, (response: any) => {
            if (response['success'] === false) {
                setStatus('error');
            } else {
                setStatus('success');
                setTimeout(() => navigate('/login'), 2500);
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
            }}
        >
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
                <Typography variant="h5" fontWeight={700} mb={0.5} letterSpacing="-0.02em">
                    {translate('forget.forgetMyPassword')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                    {translate('forget.informativeMsg')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    {translate('forget.informativeMsg2')}
                </Typography>

                <Stack spacing={2}>
                    <TextFieldRaad
                        fullWidth
                        value={secretNumber}
                        error={status === 'error'}
                        label={translate('forget.mailSignIn')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSecretNumber(e.target.value);
                            if (status !== 'idle') setStatus('idle');
                        }}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') forgetPassRequest();
                        }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        endIcon={<SendIcon />}
                        onClick={forgetPassRequest}
                        sx={{ py: 1.4 }}
                    >
                        {translate('forget.requestOne')}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                    >
                        {translate('forget.returnBtn')}
                    </Button>

                    <Collapse in={status !== 'idle'}>
                        {status === 'error' && (
                            <Alert severity="error" variant="outlined" sx={{ mt: 1 }}>
                                {translate('forget.errorMsgNoMail')}
                            </Alert>
                        )}
                        {status === 'success' && (
                            <Alert severity="success" variant="outlined" sx={{ mt: 1 }}>
                                {translate('forget.successMsg')}
                            </Alert>
                        )}
                    </Collapse>
                </Stack>
            </Box>
        </Box>
    );
};

export default ForgetCredentials;
