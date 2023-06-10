import SendIcon from '@mui/icons-material/Send';
import { Box, Button } from '@mui/material';
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
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: "95vh",
                padding: "0% 25% 0% 25%"
            }}>
                <Typography variant="h5">
                    Creación de nuevos usuarios:
                </Typography>

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
                <Button style={{ marginTop: "1em" }} variant="contained" endIcon={<SendIcon />} color="warning" onClick={createUser}>Crear Usuario</Button>
                <Button style={{ marginTop: "1em" }} variant="outlined" color="warning" onClick={() => navigate("/")}>Volver</Button>
            </Box >

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