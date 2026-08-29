import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, Collapse, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { numberCreateCredentials } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { translate } from 'react-i18nify';

const NumberCreate = () => {
    const navigate = useNavigate();
    const [secretNumber, setSecretNumber] = useState('');
    const [error, setError] = useState(false);

    const createUser = () => {
        if (secretNumber.length === 0) return;
        numberCreateCredentials(secretNumber, (response: any) => {
            if (response.success) {
                window.location.href = response['url'];
            } else {
                setError(true);
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
                    {translate('numberCreate.newUserMsg')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    {translate('numberCreate.informativeMsg')}
                </Typography>

                <Stack spacing={2}>
                    <TextFieldRaad
                        fullWidth
                        value={secretNumber}
                        error={error}
                        label={translate('numberCreate.code')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSecretNumber(e.target.value);
                            if (error) setError(false);
                        }}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') createUser();
                        }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        endIcon={<SendIcon />}
                        onClick={createUser}
                        sx={{ py: 1.4 }}
                    >
                        {translate('numberCreate.btnCreateUser')}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                    >
                        {translate('numberCreate.btnReturn')}
                    </Button>

                    <Collapse in={error}>
                        <Alert severity="error" variant="outlined" sx={{ mt: 1 }}>
                            {translate('numberCreate.errorMsg')}
                        </Alert>
                    </Collapse>
                </Stack>
            </Box>
        </Box>
    );
};

export default NumberCreate;
