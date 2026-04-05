import { Box, CircularProgress, Typography } from '@mui/material';
import { translate } from 'react-i18nify';

export const NoConnection = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 3,
                px: 4,
                textAlign: 'center',
            }}
        >
            <CircularProgress
                size={56}
                thickness={3}
                sx={{ color: 'primary.main' }}
            />
            <Typography variant="body2" color="text.secondary">
                {translate('noConnection.loading')}
            </Typography>
            <Typography variant="caption" color="text.disabled">
                {translate('noConnection.genericError')}
            </Typography>
        </Box>
    );
};

export default NoConnection;
