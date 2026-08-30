import { Box, CircularProgress, Fade, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { translate } from 'react-i18nify';

export const NoConnection = () => {
    // The "network problem" hint only makes sense once loading has clearly
    // taken too long. Show it after 5s, not on the first render.
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowError(true), 5000);
        return () => clearTimeout(timer);
    }, []);

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
            <Fade in={showError}>
                <Typography variant="caption" color="text.disabled">
                    {translate('noConnection.genericError')}
                </Typography>
            </Fade>
        </Box>
    );
};

export default NoConnection;
