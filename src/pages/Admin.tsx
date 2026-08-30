import { useState } from "react";
import { TextFieldRaadCustom } from "../components/profile/TextFieldRaadCustom";
import { Radio, RadioGroup, FormControlLabel, Button, List, ListItem, ListItemText, IconButton, Tooltip, Stack, Modal, Typography, Box, Divider } from '@mui/material';
import { colorLogo, colorSuccess, colorError } from "../interfaces/colors";
import { AdminInfo, ItemCategory } from "../interfaces/AdminInfo";
import { GetAdminMatchItCode, GetAdminMatchItEmail } from "../api/request";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import ResponsiveHandler from "../components/ResponsiveHandler";
import { deleteClientAsAnAdmin, updateClientAsAdmin, createClientAsAdmin, checkCodeFree } from "../api/actions";
import { styleModalRaad } from "../util/util";
import { translate } from 'react-i18nify';
import { Md5 } from 'ts-md5';

const hashPass = (pass: string) => new Md5().appendStr(pass).end()?.toString() ?? '';

const Admin = () => {
    const [itemToSearch, setItemToSearch] = useState<string>('');
    const [categoryToSearch, setCategoryToSearch] = useState<ItemCategory>('code');
    const [foundResults, setFoundResults] = useState<AdminInfo[]>([]);
    const [searched, setSearched] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<AdminInfo | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalMsg, setModalMsg] = useState<string>('');

    // Edit account
    const [editItem, setEditItem] = useState<AdminInfo | null>(null);
    const [editEmail, setEditEmail] = useState<string>('');
    const [editPass, setEditPass] = useState<string>('');
    const [editError, setEditError] = useState<string>('');

    // Create account
    const [createCode, setCreateCode] = useState<string>('');
    const [createEmail, setCreateEmail] = useState<string>('');
    const [createPass, setCreatePass] = useState<string>('');
    const [codeStatus, setCodeStatus] = useState<'idle' | 'free' | 'taken'>('idle');
    const [createError, setCreateError] = useState<string>('');

    const navigator = useNavigate();

    const showResult = (msg: string) => {
        setModalMsg(msg);
        setOpenModal(true);
        setTimeout(() => setOpenModal(false), 3000);
    };

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
            showResult(ok ? translate('admin.userDeleted') : translate('admin.userNotExist'));
            if (ok) setFoundResults(prev => prev.filter(r => r.code !== item.code));
        });
    };

    const openEdit = (item: AdminInfo) => {
        setEditItem(item);
        setEditEmail('');
        setEditPass('');
        setEditError('');
    };
    const closeEdit = () => {
        setEditItem(null);
        setEditEmail('');
        setEditPass('');
        setEditError('');
    };
    const doEdit = () => {
        if (editItem == null) return;
        if (editEmail.trim() === '' && editPass === '') {
            setEditError(translate('admin.editEmpty'));
            return;
        }
        const item = editItem;
        const newEmail = editEmail.trim();
        const newPass = editPass !== '' ? hashPass(editPass) : '';
        updateClientAsAdmin(item.code, newEmail, newPass, (response) => {
            const ok = !(response === undefined || response.error);
            showResult(ok ? translate('admin.userUpdated') : translate('admin.updateError'));
            if (ok) {
                setFoundResults(prev => prev.map(r =>
                    r.code === item.code
                        ? { ...r, email: newEmail !== '' ? newEmail : r.email }
                        : r));
                closeEdit();
            }
        });
    };

    const doCheck = () => {
        if (createCode.trim() === '') return;
        checkCodeFree(createCode.trim(), (free) => setCodeStatus(free ? 'free' : 'taken'));
    };
    const doCreate = () => {
        if (createCode.trim() === '' || createEmail.trim() === '' || createPass === '') {
            setCreateError(translate('admin.createEmpty'));
            return;
        }
        createClientAsAdmin(createCode.trim(), createEmail.trim(), hashPass(createPass), (response) => {
            const ok = !(response === undefined || response.error);
            showResult(ok ? translate('admin.userCreated') : translate('admin.createError'));
            if (ok) {
                setCreateCode('');
                setCreateEmail('');
                setCreatePass('');
                setCodeStatus('idle');
                setCreateError('');
            }
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
                                        <Tooltip title={translate('admin.editAria')}>
                                            <IconButton size="small" color="primary" onClick={() => openEdit(item)}>
                                                <EditIcon fontSize="small" />
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

                    <Divider sx={{ my: 4, borderColor: 'divider' }} />

                    {/* Create account */}
                    <Typography variant="h6" fontWeight={700} mb={2}>
                        {translate('admin.createTitle')}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                        <Box sx={{ flexGrow: 1 }}>
                            <TextFieldRaadCustom
                                value={createCode}
                                label={translate('admin.createCodePlaceholder')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCreateCode(e.target.value); setCodeStatus('idle'); }}
                            />
                        </Box>
                        <Button variant="outlined" onClick={doCheck} sx={{ mt: 0.5 }}>
                            {translate('admin.checkBtn')}
                        </Button>
                    </Stack>
                    {codeStatus !== 'idle' && (
                        <Typography variant="body2" sx={{ mb: 2, color: codeStatus === 'free' ? colorSuccess : colorError }}>
                            {codeStatus === 'free' ? translate('admin.codeFree') : translate('admin.codeTaken')}
                        </Typography>
                    )}
                    <TextFieldRaadCustom
                        value={createEmail}
                        label={translate('admin.createEmailPlaceholder')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateEmail(e.target.value)}
                    />
                    <TextFieldRaadCustom
                        value={createPass}
                        type="password"
                        label={translate('admin.createPassPlaceholder')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreatePass(e.target.value)}
                    />
                    {createError && (
                        <Typography variant="body2" sx={{ mb: 2, color: colorError }}>
                            {createError}
                        </Typography>
                    )}
                    <Button variant="contained" endIcon={<PersonAddIcon />} color="primary" onClick={doCreate}>
                        {translate('admin.createBtn')}
                    </Button>

                    {/* Edit account modal */}
                    <Modal open={editItem !== null} onClose={closeEdit}>
                        <Box sx={styleModalRaad}>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                {editItem ? translate('admin.editTitle', { code: editItem.code }) : ''}
                            </Typography>
                            <TextFieldRaadCustom
                                value={editEmail}
                                label={translate('admin.editNewEmail')}
                                error={editError !== ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditEmail(e.target.value); if (editError) setEditError(''); }}
                            />
                            <TextFieldRaadCustom
                                value={editPass}
                                type="password"
                                label={translate('admin.editNewPassword')}
                                error={editError !== ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditPass(e.target.value); if (editError) setEditError(''); }}
                            />
                            {editError && (
                                <Typography variant="body2" sx={{ mb: 2, color: colorError }}>
                                    {editError}
                                </Typography>
                            )}
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="outlined" onClick={closeEdit}>
                                    {translate('components.cancel')}
                                </Button>
                                <Button variant="contained" onClick={doEdit}>
                                    {translate('admin.editSave')}
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>

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
