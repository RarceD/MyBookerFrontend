
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { colorDarkCard, colorLetter, colorLogo } from '../../interfaces/colors';

interface NormativeParams {
    main: string,
    second: string
}
const NormativeAccordion = (props: NormativeParams) => {
    return (
        <Accordion style={{ backgroundColor: colorDarkCard, color: colorLetter }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: colorLogo }} />}
            >
                <Typography style={{ color: "white" }}> {props.main}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography style={{ color: "#dbdbdb" }} align={"justify"}>{props.second}</Typography>
            </AccordionDetails>
        </Accordion>
    )
}
export default NormativeAccordion;
