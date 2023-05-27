
import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Md5 } from "ts-md5";
import { GetTokenId } from "../../api/auth";
import { colorLogo } from "../../interfaces/colors";
import { styleModalRaad } from "../../util/util";
import DialogRaad from "../DialogRaad";
import TextFieldRaad from "../TextFieldRaad";
import { updateUserPost } from "../../api/actions";
import { ProfileToChange } from "../../interfaces/profile";

export default function ChangePassProfile() {
    const [firstUser, setFirstUser] = useState<string>("");
    const [secondUser, setSecondUser] = useState<string>("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [openModalError, setOpenModalError] = useState(false);
    const [openModalOk, setOpenModalOk] = useState(false);

    const updateUser = () => {
        const [token, id] = GetTokenId();
        const data: ProfileToChange = {
            id: +id,
            password: new Md5().appendStr(firstUser).end()?.toString() ?? "",
            token: token == null ? "" : token,
            username: ""
        }
        updateUserPost(data, (response) => {
            let r: any = response;
            if (r.status === 200) {
                setOpenModalOk(true);
                setTimeout(() => {
                    setOpenModalOk(false);
                    navigate("/");
                }, 3500)
            }
            else {
                setOpenModalError(true);
                setTimeout(() => {
                    setOpenModalError(false);
                }, 3500)
            }
        });
    };

    const HandlerSaveNewValue = () => {
        if (firstUser === "" || secondUser === "") return;
        if (firstUser != secondUser) return;
        setOpen(true);
    }

    return <div className="profile-user-tab">
        <div style={{ textAlign: "left" }}
            className="profile-user-tab-current">
            Modificación de contraseña:
        </div>
        <div className="profile-user-tab-current">
            <TextFieldRaad
                style={{ marginBottom: "18px" }}
                InputLabelProps={{ style: { color: "grey" } }}
                margin="normal"
                fullWidth
                inputProps={{
                    style: {
                        color: 'white',
                        borderColor: "white",
                    }
                }}
                name="password"
                value={firstUser}
                label="Nueva contraseña"
                type="password"
                onChange={(e: any) => { setFirstUser(e.target.value); }}
            />
            <TextFieldRaad
                value={secondUser}
                type="password"
                InputLabelProps={{ style: { color: "grey" } }}
                margin="normal"
                fullWidth
                inputProps={{
                    style: {
                        color: 'white',
                        borderColor: "white",
                    }
                }}
                label="Repetición de contraseña"
                onChange={(e: any) => { setSecondUser(e.target.value); }}
                variant="outlined"
            />
        </div>
        <div style={{ textAlign: "center" }}>
            <Button variant="outlined" style={{ background: colorLogo, color: "white" }}
                onClick={() => HandlerSaveNewValue()}
            >
                Modificar contraseña
            </Button>
        </div>

        <DialogRaad titleMsg={"Cambio de contraseña"} longMsg={"¿Desea llevar a cabo el cambio de contraseña?"} activate={open}
            deactivate={function (): void {
                setOpen(false);
            }} confirmHandler={function (): void {
                updateUser();
                setOpen(false);
            }} />

        <Modal
            open={openModalOk}
        >
            <Box sx={styleModalRaad}>
                <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                    Sus datos han sido moficados con éxito.
                </Typography>
            </Box>
        </Modal>
        <Modal
            open={openModalError}
        >
            <Box sx={styleModalRaad}>
                <Typography id="modal-modal-description" mx={{ xs: 12 }}>
                    No es posible modificar su correo o contraseña, pruebe más tarde.
                </Typography>
            </Box>
        </Modal>
    </div>;
}


