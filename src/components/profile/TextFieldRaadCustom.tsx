import TextFieldRaad from '../TextFieldRaad';

interface TextFieldRaadCustomProps {
    value: string;
    label: string;
    type?: string;
    error?: boolean;
    onChange: (e: any) => void;
}

export const TextFieldRaadCustom: React.FC<TextFieldRaadCustomProps> = ({
    value,
    label,
    type,
    error,
    onChange,
}) => (
    <TextFieldRaad
        fullWidth
        sx={{ mb: 2 }}
        value={value}
        label={label}
        type={type}
        error={error}
        onChange={onChange}
    />
);
