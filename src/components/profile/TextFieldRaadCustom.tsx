import TextFieldRaad from "../TextFieldRaad";

interface TextFieldRaadCustomProps {
    value: string;
    label: string;
    type?: string;
    onChange: (e: any) => void;
}
export const TextFieldRaadCustom: React.FC<TextFieldRaadCustomProps> = ({
    value,
    label,
    type,
    onChange,
}) => (
    <TextFieldRaad
        style={{ marginBottom: "18px" }}
        InputLabelProps={{ style: { color: "grey" } }}
        fullWidth
        inputProps={{
            style: {
                color: "white",
                borderColor: "white",
            },
        }}
        value={value}
        label={label}
        type={type}
        onChange={onChange}
    />
);