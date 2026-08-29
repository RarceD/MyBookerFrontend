import { useState } from "react";
import { TextFieldRaadCustom } from "../components/profile/TextFieldRaadCustom";
import { Radio, RadioGroup, FormControlLabel, Button, List, ListItem, ListItemText, IconButton, Tooltip, Stack, Modal, Typography, Box } from '@mui/material';
import { colorLogo } from "../interfaces/colors";
import { AdminInfo, ItemCategory } from "../interfaces/AdminInfo";
import { GetAdminMatchItCode, GetAdminMatchItEmail } from "../api/request";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import ResponsiveHandler from "../components/ResponsiveHandler";
import { deleteClientAsAnAdmin } from "../api/actions";
import { styleModalRaad } from "../util/util";
import { translate } from 'react-i18nify';

const Admin = () => {
    const [itemToSearch, setItemToSearch] = useState<string>('');
    const [categoryToSearch, setCategoryToSearch] = useState<ItemCategory>('code');
    const [foundResults, setFoundResults] = useState<AdminInfo[]>([]);
    const [searched, setSearched] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<AdminInfo | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalMsg, setModalMsg] = useState<string>('');
    const navigator = useNavigate();

    const askForMatching = () => {
        if (itemToSearch === '') return;
        const onError = () => navigator('/login');
        const onSuccess = (foundItems: AdminInfo[]) => {
            setFoundResults(foundItems ?? []);
            setSearched(true);
        };
        if (categoryToSearch === 'code') {
            GetAdminMatchItCode(itemToSearch, onSuccess, onError);
        } else {
            GetAdminMatchItEmail(itemToSearch, onSuccess, onError);
        }
    };

    const doDelete = (item: AdminInfo) => {
        setConfirmDelete(null);
        deleteClientAsAnAdmin(item.email, (response) => {
            const ok = !(response === undefined || response.error);
            setModalMsg(ok ? translate('admin.userDeleted') : translate('admin.userNotExist'));
            setOpenModal(true);
            setTimeout(() => setOpenModal(false), 3000);
            if (ok) setFoundResults(prev => prev.filter(r => r.code !== item.code));
        });
    };

    const copyEmail = async (email: string) => {
        try { await window.navigator.clipboard.writeText(email); } catch { /* clipboard not available */ }
    };

    return (
        <ResponsiveHandler
            component={() =>
                <Box sx={{ p: 3, maxWidth: 640, mx: 'auto' }}>
                    <Typography variant="h5" fontWeight={700} mb={2}>
                        {translate('admin.searchFor')}
                    </Typography>

                    <RadioGroup
                        row
                        value={categoryToSearch}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCategoryToSearch(event.target.value as ItemCategory)}
                        sx={{ mb: 1 }}
                    >
                        <FormControlLabel value={"code"} control={<Radio style={{ color: colorLogo }} />} label={translate('admin.code')} />
                        <FormControlLabel value={"email"} control={<Radio style={{ color: colorLogo }} />} label={translate('admin.email')} />
                    </RadioGroup>

                    <TextFieldRaadCustom
                        value={itemToSearch}
                        label={translate('admin.searchPlaceholder')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setItemToSearch(e.target.value); }}
                    />
                    <Button variant="contained" endIcon={<SendIcon />} color="primary" onClick={askForMatching}>
                        {translate('admin.searchBtn')}
                    </Button>

                    <Typography sx={{ color: colorLogo, fontWeight: 600, mt: 3, mb: 1 }}>
                        {translate('admin.found', { count: foundResults.length })}
                    </Typography>

                    <List>
                        {foundResults.map((item) => (
                            <ListItem
                                key={item.code}
                                sx={{
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    mb: 1,
                                }}
                                secondaryAction={
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title={translate('admin.copyAria')}>
                                            <IconButton size="small" onClick={() => copyEmail(item.email)}>
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={translate('admin.deleteAria')}>
                                            <IconButton size="small" color="error" onClick={() => setConfirmDelete(item)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                }
                            >
                                <ListItemText primary={item.code} secondary={item.email} />
                            </ListItem>
                        ))}
                    </List>

                    {searched && foundResults.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            {translate('admin.noResults')}
                        </Typography>
                    )}

                    {/* Confirm delete */}
                    <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)}>
                        <Box sx={styleModalRaad}>
                            <Typography mb={3}>
                                {confirmDelete ? translate('admin.deleteConfirm', { code: confirmDelete.code }) : ''}
                            </Typography>
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="outlined" onClick={() => setConfirmDelete(null)}>
                                    {translate('components.cancel')}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => confirmDelete && doDelete(confirmDelete)}
                                >
                                    {translate('admin.deleteBtn')}
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>

                    {/* Result feedback */}
                    <Modal open={openModal}>
                        <Box sx={styleModalRaad}>
                            <Typography mx={{ xs: 12 }}>
                                {modalMsg}
                            </Typography>
                        </Box>
                    </Modal>
                </Box>
            }
        />
    )
}

export default Admin;
