import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Chip, Typography } from '@mui/material';
import { ProfileData } from '../../interfaces/profile';

export default function ProfileCardRaad(props: ProfileData) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 3,
                px: 2,
                mb: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
        >
            {/* Avatar circle */}
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 132, 0, 0.12)',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                }}
            >
                <PersonIcon sx={{ color: 'primary.main', fontSize: 36 }} />
            </Box>

            {/* Name */}
            <Typography variant="h6" fontWeight={700} letterSpacing="-0.02em">
                {props.name}
            </Typography>

            {/* Community / urba name */}
            {props.urbaName && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                    {props.urbaName}
                </Typography>
            )}

            {/* Plays chip */}
            <Chip
                avatar={
                    <Avatar
                        alt="icon"
                        src="/images/raqueta2.png"
                        sx={{ bgcolor: 'transparent', '& img': { objectFit: 'contain' } }}
                    />
                }
                label={`Partidos: ${props.numberPlays}`}
                color="warning"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
            />
        </Box>
    );
}
