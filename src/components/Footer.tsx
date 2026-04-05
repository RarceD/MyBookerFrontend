import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonIcon from '@mui/icons-material/Person';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { PageType, PageTypeNumber } from '../interfaces/pages';
import { useState } from 'react';
import { translate } from 'react-i18nify';
import { Box } from '@mui/material';

interface FooterProps {
    pageToShow: PageType;
    setPageToShow: (t: PageTypeNumber) => void;
}

export default function Footer(props: FooterProps) {
    const [value, setValue] = useState<number>(0);

    const navItems = [
        {
            label: () => translate('components.footer.books'),
            icon: <RestoreIcon sx={{ fontSize: 22 }} />,
        },
        {
            label: () => translate('components.footer.signIn'),
            icon: <SportsBaseballIcon sx={{ fontSize: 22 }} />,
        },
        {
            label: () => translate('components.footer.profile'),
            icon: <PersonIcon sx={{ fontSize: 22 }} />,
        },
        {
            label: () => translate('components.footer.normative'),
            icon: <MenuBookIcon sx={{ fontSize: 22 }} />,
        },
    ];

    return (
        <Box
            sx={{
                width: '100%',
                position: 'fixed',
                bottom: 0,
                left: 0,
                zIndex: 1200,
            }}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(_event, newValue: number) => {
                    props.setPageToShow(newValue as PageTypeNumber);
                    setValue(newValue);
                }}
                sx={{
                    bgcolor: 'background.paper',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    height: 64,
                    '& .MuiBottomNavigationAction-root': {
                        color: 'text.disabled',
                        minWidth: 56,
                        py: 1,
                        transition: 'color 0.2s',
                    },
                    '& .MuiBottomNavigationAction-root.Mui-selected': {
                        color: 'primary.main',
                    },
                }}
            >
                {navItems.map((item, idx) => (
                    <BottomNavigationAction
                        key={idx}
                        label={item.label()}
                        icon={item.icon}
                        sx={{
                            '& .MuiBottomNavigationAction-label': {
                                fontSize: '0.65rem',
                                fontWeight: value === idx ? 600 : 400,
                                mt: '2px',
                            },
                        }}
                    />
                ))}
            </BottomNavigation>
        </Box>
    );
}
