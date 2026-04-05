import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';
import { translate } from 'react-i18nify';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface DialogProps {
    titleMsg: string;
    longMsg: string;
    activate: boolean;
    deactivate: () => void;
    confirmHandler: () => void;
}

export default function DialogRaad(props: DialogProps) {
    const { activate, titleMsg, longMsg } = props;
    return (
        <Dialog
            TransitionComponent={Transition}
            open={activate}
            onClose={() => props.deactivate()}
        >
            <DialogTitle>{titleMsg}</DialogTitle>
            <DialogContent>
                <DialogContentText>{longMsg}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={() => props.deactivate()}>
                    {translate('components.cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => props.confirmHandler()}
                    autoFocus
                >
                    {translate('components.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
