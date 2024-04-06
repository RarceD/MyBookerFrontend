
import SendIcon from '@mui/icons-material/Send';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgetCredentials } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { styleModalRaad } from '../util/util';
import { translate } from 'react-i18nify';
import './pages.css';


const ForgetCredentials = () => {
    const navigate = useNavigate();
    const [secretNumber, setSecretNumber] = useState("");
    const handleSecretNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecretNumber(event.target.value);
    };
    const [openModal, setOpenModal] = useState(false);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);

    const forgetPassRequest = () => {
        if (secretNumber.length == 0) return;
        forgetCredentials(secretNumber, (response: any) => {
            if (response["success"] === false) {
                setOpenModal(true);
                setTimeout(() => {
                    setOpenModal(false);
                }, 4500)
            }
            else {
                setOpenModalSuccess(true);
                setTimeout(() => {
                    setOpenModalSuccess(false);
                    navigate("/login");
                }, 2500)
            }
        });
    };
    return (
        <>
            <Grid container
                style={{ marginTop: '60%' }}
                spacing={2}
                direction="column"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                justifyItems="center"
            >
                <Grid item>
                    <Typography variant="h5">
                        {translate('forget.forgetMyPassword')}
                    </Typography>
                </Grid>
                <Grid item>
                    <TextFieldRaad
                        value={secretNumber}
                        label={translate('forget.mailSignIn')} variant="outlined" fullWidth
                        InputLabelProps={{ style: { color: "grey" } }}
                        margin="normal"
                        inputProps={{
                            style: {
                                color: 'white',
                                borderColor: "white",
                            }
                        }}
                        onChange={handleSecretNumber}
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" endIcon={<SendIcon />} color="warning" onClick={forgetPassRequest}>
                        {translate('forget.requestOne')}
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="warning" onClick={() => navigate("/")}>
                        {translate('forget.return')}
                    </Button>
                </Grid>
                <Grid item>
                    <div className='informative-msg'>
                        {translate('numberCreate.informativeMsg')}
                    </div>
                </Grid>
            </Grid>

            <Modal open={openModal}>
                <Box sx={styleModalRaad}>
                    <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                        {translate('forget.errorMsgNoMail')}
                    </Typography>
                </Box>
            </Modal>

            <Modal open={openModalSuccess}>
                <Box sx={styleModalRaad}>
                    <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                        {translate('forget.successMsg')}
                    </Typography>
                </Box>
            </Modal>

        </>
    )
}
export default ForgetCredentials;