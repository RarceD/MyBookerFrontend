import { useState } from "react";
import { TextFieldRaadCustom } from "../components/profile/TextFieldRaadCustom";
import { Radio, RadioGroup, FormControlLabel, Button, List, ListItem, ListItemButton, ListItemText, Modal, Typography, Box } from '@mui/material';
import { colorLetter, colorLogo } from "../interfaces/colors";
import { AdminInfo, ItemCategory } from "../interfaces/AdminInfo";
import { GetAdminMatchItCode, GetAdminMatchItEmail } from "../api/request";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ResponsiveHandler from "../components/ResponsiveHandler";
import { deleteClientAsAnAdmin } from "../api/actions";
import { styleModalRaad } from "../util/util";

const Admin = () => {
    const [itemToSearch, setItemToSearch] = useState<string>('');
    const [itemToDelete, setItemToDelete] = useState<string>('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalMsg, setModalMsg] = useState<string>('');
    const [categoryToSearch, setCategoryToSearch] = useState<ItemCategory>('code');
    const [foundResults, setFoundResults] = useState<AdminInfo[]>([]);
    const navigator = useNavigate();

    const askForMatching = () => {
        if (itemToSearch == '') return;
        const onError = () => navigator('/login');
        const onSuccess = () => (foundItems: AdminInfo[]) => setFoundResults(foundItems);
        if (categoryToSearch === 'code') {
            GetAdminMatchItCode(itemToSearch, onSuccess(), onError);
        }
        else {
            GetAdminMatchItEmail(itemToSearch, onSuccess(), onError);
        }
    }
    const deleteClient = () => {
        deleteClientAsAnAdmin(itemToDelete, (response) => {
            const responseMsg = response.error ? 'This user does not exist' : 'User deleted successfully!';
            setModalMsg(responseMsg);
            setOpenModal(true);
            setTimeout(() => {
                setOpenModal(false);
            }, 3000)
        });
    }

    return (
        <ResponsiveHandler
            component={() =>
                <>
                    <h1>Search For</h1>

                    <RadioGroup value={categoryToSearch} style={{ color: colorLetter }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCategoryToSearch(event.target.value as ItemCategory)}>
                        <FormControlLabel value={"code"} control={<Radio style={{ color: colorLogo }} />} label={'Code'} />
                        <FormControlLabel value={"email"} control={<Radio style={{ color: colorLogo }} />} label={'Email'} />
                    </RadioGroup >

                    <TextFieldRaadCustom
                        value={itemToSearch}
                        label={"Searching..."}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setItemToSearch(e.target.value); }}
                    />
                    <Button variant="contained" endIcon={<SendIcon />} color="primary" onClick={askForMatching}>
                        Searching
                    </Button>
                    <div style={{ color: colorLogo, fontSize: 18, margin: 30 }}>
                        Found: {foundResults.length} items
                    </div>

                    <List>
                        {foundResults.map((item) => <ListItem disablePadding key={item.code}>
                            <ListItemButton>
                                <ListItemText primary={`${item.code} - ${item.email}`} />
                            </ListItemButton>
                        </ListItem>
                        )}
                    </List>

                    <h1>Reset clients: </h1>
                    <TextFieldRaadCustom
                        value={itemToDelete}
                        label={"Type email to reset"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setItemToDelete(e.target.value); }}
                    />
                    <Button variant="contained" endIcon={<DeleteIcon />} color="error" onClick={deleteClient}>
                        Delete
                    </Button>
                    <Modal open={openModal} >
                        <Box sx={styleModalRaad}>
                            <Typography mx={{ xs: 12 }}>
                                {modalMsg}
                            </Typography>
                        </Box>
                    </Modal>
                </>
            }
        />
    )
}

export default Admin;
