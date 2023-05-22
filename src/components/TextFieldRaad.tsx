import { TextField } from "@mui/material";
import { withStyles } from '@mui/styles'

const TextFieldRaad = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'white',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white',
            },
            "&.Mui-focused": {
                color: "red"
            }
        },
    },
})(TextField);

export default TextFieldRaad;