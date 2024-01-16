import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import PersonIcon from '@mui/icons-material/Person';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { PageType, PageTypeNumber } from '../interfaces/pages';
import { colorLetter, colorLogo } from '../interfaces/colors';
import { useState } from 'react';
import { translate } from 'react-i18nify';

interface FooterProps {
    pageToShow: PageType
    setPageToShow: (t: PageTypeNumber) => void
}
export default function Footer(props: FooterProps) {
    const [value, setValue] = useState(0);
    const calculateColor = (idx: number): string => value == idx ? colorLogo : colorLetter;
    const navigationList = [
        {
            label: translate('components.footer.books'),
            comp: <RestoreIcon style={{ color: calculateColor(0) }} />
        },
        {
            label: translate('components.footer.signIn'),
            comp: <SportsBaseballIcon style={{ color: calculateColor(1) }} />
        },
        {
            label: translate('components.footer.profile'),
            comp: <PersonIcon style={{ color: calculateColor(2) }} />
        },
        {
            label: translate('components.footer.normative'),
            comp: <MenuBookIcon style={{ color: calculateColor(3) }} />
        }
    ]
    return (
        <div style={{ width: "100%", position: "fixed", bottom: 0, left: 0 }}>
            <BottomNavigation
                style={{ backgroundColor: '#202123' }}
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    let v: PageTypeNumber = newValue;
                    props.setPageToShow(v);
                    setValue(newValue);
                }}
            >
                {navigationList.map((item, idx) => <BottomNavigationAction key={idx} label={item.label} style={{ color: calculateColor(idx) }} icon={item.comp} />)}
            </BottomNavigation>
        </div>
    );
}