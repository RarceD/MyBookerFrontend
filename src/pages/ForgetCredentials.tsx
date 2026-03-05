import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgetCredentials } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { styleModalRaad } from '../util/util';
import { translate } from 'react-i18nify';

const ForgetCredentials = () => {
    const navigate = useNavigate();
    const [secretNumber, setSecretNumber] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);

    const forgetPassRequest = () => {
        if (secretNumber.length === 0) return;
        forgetCredentials(secretNumber, (response: any) => {
            if (response['success'] === false) {
                setOpenModal(true);
                setTimeout(() => setOpenModal(false), 4500);
            } else {
                setOpenModalSuccess(true);
                setTimeout(() => { setOpenModalSuccess(false); navigate('/login'); }, 2500);
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
                <Typography variant="body2" color="text.secondary" mb={3}>
                    {translate('numberCreate.informativeMsg')}
                </Typography>

                <Stack spacing={2}>
                    <TextFieldRaad
                        fullWidth
                        value={secretNumber}
                        label={translate('forget.mailSignIn')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSecretNumber(e.target.value)
                        }
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
                </Stack>
            </Box>

            <Modal open={openModal}>
                <Box sx={styleModalRaad}>
                    <Typography>{translate('forget.errorMsgNoMail')}</Typography>
                </Box>
            </Modal>
            <Modal open={openModalSuccess}>
                <Box sx={styleModalRaad}>
                    <Typography>{translate('forget.successMsg')}</Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default ForgetCredentials;
