import { useState } from "react";
import { TextFieldRaadCustom } from "../components/profile/TextFieldRaadCustom";
import { Radio, RadioGroup, FormControlLabel, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { colorLetter, colorLogo } from "../interfaces/colors";
import { AdminInfo, ItemCategory } from "../interfaces/AdminInfo";
import { GetAdminMatchItCode, GetAdminMatchItEmail } from "../api/request";
import SendIcon from '@mui/icons-material/Send';

const Admin = () => {
    const [itemToSearch, setItemToSearch] = useState<string>('');
    const [categoryToSearch, setCategoryToSearch] = useState<ItemCategory>('code');
    const [foundResults, setFoundResults] = useState<AdminInfo[]>([]);

    const askForMatching = () => {
        if (categoryToSearch === 'code')
            GetAdminMatchItCode(itemToSearch, (foundItems: AdminInfo[]) => {
                setFoundResults(foundItems);
            });
        else
            GetAdminMatchItEmail(itemToSearch, (foundItems: AdminInfo[]) => {
                setFoundResults(foundItems);
            });
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
                Search
            </Button>

            <List>
                {foundResults.map((item) => <ListItem disablePadding>
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
