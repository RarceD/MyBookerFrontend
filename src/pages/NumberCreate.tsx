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
                        Creación de nuevos usuarios:
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
                        label="Código único:"
                        onChange={handleSecretNumber}
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <Button variant="contained" endIcon={<SendIcon />} color="primary" onClick={createUser}>Crear Usuario</Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="primary" onClick={() => navigate("/")}>Volver
                    </Button>
                </Grid>
            </Grid>

            <Modal open={openModal}>
                <Box sx={styleModalRaad}>
                    <Typography mx={{ xs: 12 }}>
                        Este código no existe, pruebe de nuevo con uno válido. Sentimos las molestias.
                    </Typography>
                </Box>
            </Modal>


        </>
    )
}
export default NumberCreate;