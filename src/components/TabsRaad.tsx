import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { colorLetter, colorLogo } from '../interfaces/colors';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabsRaad(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: colorLetter }}>
        <Tabs value={value} onChange={handleChange} selectionFollowsFocus={false}>
          {props.listLabels.map((item, idx) =>
            <Tab key={idx} label={item} style={{ color: value == idx ? colorLogo : colorLetter }} {...a11yProps(0)} />
          )}
        </Tabs>
      </Box>
      {props.listComponents.map((item, idx) =>
        <TabsRaad key={idx} value={value} index={idx}>
          {item}
        </TabsRaad>
      )}
    </div>
  );
}

export function BasicTabsRaadUncontrolled(props: TabsPropsUncontrolled) {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (props.setValue)
      props.setValue(newValue);
  };
  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: colorLetter }}>
        <Tabs value={props.value} onChange={handleChange} selectionFollowsFocus={false}>
          {props.listLabels.map((item, idx) =>
            <Tab key={idx} label={item} style={{ color: props.value == idx ? colorLogo : colorLetter }} {...a11yProps(0)} />
          )}
        </Tabs>
      </Box>
      {props.listComponents.map((item, idx) =>
        <TabsRaad value={props.value != undefined ? 0 : props.value} index={idx}>
          {item}
        </TabsRaad>
      )}
    </div>
  );
}