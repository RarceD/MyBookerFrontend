import { useState, useEffect } from "react";
import { GetTokenId } from "../api/auth";
import { TextFieldRaadCustom } from "../components/profile/TextFieldRaadCustom";
import { Radio, RadioGroup, FormControlLabel, Button, IconButton, Tooltip, Stack, Typography, Box, Divider, Alert, Collapse } from '@mui/material';
import { colorLogo, colorSuccess, colorError } from "../interfaces/colors";
import { AdminInfo, ItemCategory } from "../interfaces/AdminInfo";
import { GetAdminMatchItCode, GetAdminMatchItEmail } from "../api/request";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import ResponsiveHandler from "../components/ResponsiveHandler";
import { deleteClientAsAnAdmin, updateClientAsAdmin, createClientAsAdmin, checkCodeFree } from "../api/actions";
import { translate } from 'react-i18nify';
import { Md5 } from 'ts-md5';

const hashPass = (pass: string) => new Md5().appendStr(pass).end()?.toString() ?? '';

const Admin = () => {
    const [itemToSearch, setItemToSearch] = useState<string>('');
    const [categoryToSearch, setCategoryToSearch] = useState<ItemCategory>('code');
    const [foundResults, setFoundResults] = useState<AdminInfo[]>([]);
    const [searched, setSearched] = useState<boolean>(false);

    // Inline edit / delete (no pop-ups)
    const [editingCode, setEditingCode] = useState<string | null>(null);
    const [editEmail, setEditEmail] = useState<string>('');
    const [editPass, setEditPass] = useState<string>('');
    const [editMsg, setEditMsg] = useState<string>('');
    const [deletingCode, setDeletingCode] = useState<string | null>(null);

    // Global inline feedback
    const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

    // Create account
    const [createCode, setCreateCode] = useState<string>('');
    const [createEmail, setCreateEmail] = useState<string>('');
    const [createPass, setCreatePass] = useState<string>('');
    const [codeStatus, setCodeStatus] = useState<'idle' | 'free' | 'taken'>('idle');
    const [createError, setCreateError] = useState<string>('');

    const navigator = useNavigate();

    // If there is no session on this origin, admin calls would go without
    // id/token (400 from the server). Send the user to log in first.
    useEffect(() => {
        const [token, id] = GetTokenId();
        if (!token || !id) navigator('/login');
    }, []);

    const showFeedback = (msg: string, ok: boolean) => {
        setFeedback({ msg, ok });
        setTimeout(() => setFeedback(null), 5000);
    };

    const askForMatching = () => {
        if (itemToSearch === '') return;
        setEditingCode(null);
        setDeletingCode(null);
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

    const openEdit = (item: AdminInfo) => {
        setDeletingCode(null);
        setEditingCode(item.code);
        setEditEmail('');
        setEditPass('');
        setEditMsg('');
    };
    const doEdit = (item: AdminInfo) => {
        if (editEmail.trim() === '' && editPass === '') {
            setEditMsg(translate('admin.editEmpty'));
            return;
        }
        const newEmail = editEmail.trim();
        const newPass = editPass !== '' ? hashPass(editPass) : '';
        updateClientAsAdmin(item.code, newEmail, newPass, (response) => {
            const ok = !(response === undefined || response.error);
            if (ok) {
                setFoundResults(prev => prev.map(r =>
                    r.code === item.code ? { ...r, email: newEmail !== '' ? newEmail : r.email } : r));
                setEditingCode(null);
                showFeedback(translate('admin.userUpdated'), true);
            } else {
                setEditMsg(translate('admin.updateError'));
            }
        });
    };

    const doDelete = (item: AdminInfo) => {
        setDeletingCode(null);
        deleteClientAsAnAdmin(item.email, (response) => {
            const ok = !(response === undefined || response.error);
            if (ok) setFoundResults(prev => prev.filter(r => r.code !== item.code));
            showFeedback(ok ? translate('admin.userDeleted') : translate('admin.userNotExist'), ok);
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
            if (ok) {
                setCreateCode('');
                setCreateEmail('');
                setCreatePass('');
                setCodeStatus('idle');
                setCreateError('');
                showFeedback(translate('admin.userCreated'), true);
                // Refresh the search list so the new account shows up if it matches the current filter
                if (itemToSearch.trim() !== '') askForMatching();
            } else {
                setCreateError(translate('admin.createError'));
            }
        });
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

                    {/* Global inline feedback (no pop-ups) */}
                    <Collapse in={feedback !== null}>
                        {feedback && (
                            <Alert severity={feedback.ok ? 'success' : 'error'} variant="outlined" sx={{ mb: 2 }}>
                                {feedback.msg}
                            </Alert>
                        )}
                    </Collapse>

                    <Stack spacing={1}>
                        {foundResults.map((item) => (
                            <Box
                                key={item.code}
                                sx={{
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    p: 1.5,
                                }}
                            >
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="body1" fontWeight={600}>{item.code}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                            {item.email}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                                        <Tooltip title={translate('admin.editAria')}>
                                            <IconButton size="small" color="primary" onClick={() => openEdit(item)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={translate('admin.deleteAria')}>
                                            <IconButton size="small" color="error" onClick={() => { setEditingCode(null); setDeletingCode(item.code); }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>

                                {/* Inline edit form */}
                                <Collapse in={editingCode === item.code}>
                                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <TextFieldRaadCustom
                                            value={editEmail}
                                            label={translate('admin.editNewEmail')}
                                            error={editMsg !== ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditEmail(e.target.value); if (editMsg) setEditMsg(''); }}
                                        />
                                        <TextFieldRaadCustom
                                            value={editPass}
                                            type="password"
                                            label={translate('admin.editNewPassword')}
                                            error={editMsg !== ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditPass(e.target.value); if (editMsg) setEditMsg(''); }}
                                        />
                                        {editMsg && (
                                            <Typography variant="body2" sx={{ mb: 1.5, color: colorError }}>
                                                {editMsg}
                                            </Typography>
                                        )}
                                        <Stack direction="row" spacing={2}>
                                            <Button variant="contained" size="small" onClick={() => doEdit(item)}>
                                                {translate('admin.editSave')}
                                            </Button>
                                            <Button variant="text" color="inherit" size="small" onClick={() => setEditingCode(null)}>
                                                {translate('components.cancel')}
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Collapse>

                                {/* Inline delete confirmation */}
                                <Collapse in={deletingCode === item.code}>
                                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ mb: 1.5 }}>
                                            {translate('admin.deleteConfirm', { code: item.code })}
                                        </Typography>
                                        <Stack direction="row" spacing={2}>
                                            <Button variant="contained" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => doDelete(item)}>
                                                {translate('admin.deleteBtn')}
                                            </Button>
                                            <Button variant="text" color="inherit" size="small" onClick={() => setDeletingCode(null)}>
                                                {translate('components.cancel')}
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Collapse>
                            </Box>
                        ))}
                    </Stack>

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
                </Box>
            }
        />
    )
}

export default Admin;
