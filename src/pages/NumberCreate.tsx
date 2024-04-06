import SendIcon from '@mui/icons-material/Send';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { numberCreateCredentials } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { styleModalRaad } from '../util/util';
import { translate } from 'react-i18nify';
import './pages.css';


const NumberCreate = () => {
    const navigate = useNavigate();
    const [secretNumber, setSecretNumber] = useState("");
    const handleSecretNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecretNumber(event.target.value);
    };
    const [openModal, setOpenModal] = useState(false);
    const createUser = () => {
        numberCreateCredentials(secretNumber, (response: any) => {
            if (response.success) {
                const url: any = response["url"];
                window.location.href = url;
            }
            else {
                setOpenModal(true);
                setTimeout(() => {
                    setOpenModal(false);
                }, 2500)
            }
        })
    };
    return (
        <>
            <Grid container
                spacing={2}
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                justifyItems="center"
                direction="column"
            >
                <Grid item style={{ marginTop: "60%" }}>
                    <Typography variant="h5">
                         {translate('numberCreate.newUserMsg')}
                    </Typography>
                </Grid>
                <Grid item>
                    <TextFieldRaad
                        value={secretNumber}
                        InputLabelProps={{ style: { color: "grey" } }}
                        margin="normal"
                        fullWidth
                        inputProps={{
                            style: {
                                color: 'white',
                                borderColor: "white",
                            }
                        }}
                        label={translate('numberCreate.code')}
                        onChange={handleSecretNumber}
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <Button variant="contained" endIcon={<SendIcon />} color="warning" onClick={createUser}>{translate('numberCreate.btnCreateUser')}</Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="warning" onClick={() => navigate("/")}>{translate('numberCreate.btnReturn')}
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
                    <Typography mx={{ xs: 12 }}>
                        {translate('numberCreate.errorMsg')}
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}
export default NumberCreate;