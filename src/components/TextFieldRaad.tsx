import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

// Replaces the deprecated withStyles()(TextField) pattern.
// The MUI theme already applies proper field styles; this component
// is kept as a named export for backward-compat with existing imports.
const TextFieldRaad = styled(TextField)({});

export default TextFieldRaad;
