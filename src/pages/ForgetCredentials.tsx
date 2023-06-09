
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
                spacing={2}
                direction="column"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                justifyItems="center"
            >
                <Grid item style={{ marginTop: "50%" }}>
                    <Typography variant="h5">
                        He olvidado mi contraseña
                    </Typography>
                </Grid>
                <Grid item>
                    <TextFieldRaad
                        value={secretNumber}
                        label="Correo de reserva:" variant="outlined" fullWidth
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
                        Solicitar una
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="warning" onClick={() => navigate("/")}>
                        Volver
                    </Button>
                </Grid>
            </Grid>

            <Modal open={openModal}>
                <Box sx={styleModalRaad}>
                    <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                        No existe este correo para restaurar la contraseña, compruebe que está correctamente escrito.
                    </Typography>
                </Box>
            </Modal>

            <Modal open={openModalSuccess}>
                <Box sx={styleModalRaad}>
                    <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                        Contraseña restablecida con éxito, compruebe su correo electrónico con la nueva contraseña.
                    </Typography>
                </Box>
            </Modal>

        </>
    )
}
export default ForgetCredentials;