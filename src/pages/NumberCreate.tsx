import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { numberCreateCredentials } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { styleModalRaad } from '../util/util';
import { translate } from 'react-i18nify';

const NumberCreate = () => {
    const navigate = useNavigate();
    const [secretNumber, setSecretNumber] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const createUser = () => {
        numberCreateCredentials(secretNumber, (response: any) => {
            if (response.success) {
                window.location.href = response['url'];
            } else {
                setOpenModal(true);
                setTimeout(() => setOpenModal(false), 2500);
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
                        label={translate('numberCreate.code')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSecretNumber(e.target.value)
                        }
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
                </Stack>
            </Box>

            <Modal open={openModal}>
                <Box sx={styleModalRaad}>
                    <Typography>{translate('numberCreate.errorMsg')}</Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default NumberCreate;
