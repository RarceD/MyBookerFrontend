import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

interface NormativeParams {
    main: string;
    second: string;
}

const NormativeAccordion = (props: NormativeParams) => (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight={500}>
                {props.main}
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography variant="body2" align="justify">
                {props.second}
            </Typography>
        </AccordionDetails>
    </Accordion>
);

export default NormativeAccordion;
