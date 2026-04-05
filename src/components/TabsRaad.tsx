import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <div>{children}</div>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

interface TabsProps {
    listComponents: React.ReactNode[];
    listLabels: string[];
}

interface TabsPropsUncontrolled {
    listComponents: React.ReactNode[];
    listLabels: string[];
    value: number;
    setValue: (type: number) => void;
}

export function BasicTabsRaad(props: TabsProps) {
    const [value, setValue] = useState(0);
    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={(_e, newVal: number) => setValue(newVal)}
                    selectionFollowsFocus={false}
                >
                    {props.listLabels.map((item, idx) => (
                        <Tab key={idx} label={item} {...a11yProps(idx)} />
                    ))}
                </Tabs>
            </Box>
            {props.listComponents.map((item, idx) => (
                <TabPanel key={idx} value={value} index={idx}>
                    {item}
                </TabPanel>
            ))}
        </Box>
    );
}

export function BasicTabsRaadUncontrolled(props: TabsPropsUncontrolled) {
    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={props.value}
                    onChange={(_e, newVal: number) => props.setValue(newVal)}
                    selectionFollowsFocus={false}
                >
                    {props.listLabels.map((item, idx) => (
                        <Tab key={idx} label={item} {...a11yProps(idx)} />
                    ))}
                </Tabs>
            </Box>
            {props.listComponents.map((item, idx) => (
                <TabPanel key={idx} value={props.value ?? 0} index={idx}>
                    {item}
                </TabPanel>
            ))}
        </Box>
    );
}
