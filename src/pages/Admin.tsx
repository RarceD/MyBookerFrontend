import { useState } from "react";
import { TextFieldRaadCustom } from "../components/profile/TextFieldRaadCustom";
import { Radio, RadioGroup, FormControlLabel, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { colorLetter, colorLogo } from "../interfaces/colors";
import { AdminInfo, ItemCategory } from "../interfaces/AdminInfo";
import { GetAdminMatchItCode, GetAdminMatchItEmail } from "../api/request";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [itemToSearch, setItemToSearch] = useState<string>('');
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

    return (
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
        </>
    )
}

export default Admin;
