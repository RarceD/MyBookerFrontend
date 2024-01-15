import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { withStyles } from '@mui/styles';
import { forwardRef } from 'react';
import { colorBackground, colorLogo } from '../interfaces/colors';
import { translate } from 'react-i18nify';


const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Dialogg = withStyles({
  root: {
    '& div div': {
      color: "white",
      backgroundColor: colorBackground,
    }
  }
})(Dialog);

interface DialogProps {
  titleMsg: string
  longMsg: string
  activate: boolean,
  deactivate: () => void;
  confirmHandler: () => void;
}

export default function DialogRaad(props: DialogProps) {
  const { activate, titleMsg, longMsg } = props;
  return (
    <Dialogg
      TransitionComponent={Transition}
      open={activate} onClose={() => props.deactivate()}>
      <DialogTitle>
        {titleMsg}
      </DialogTitle>
      <DialogContent >
        <DialogContentText style={{ color: "white" }}>
          {longMsg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.deactivate()} style={{ color: colorLogo }}>
          {translate('components.cancel')}</Button>
        <Button onClick={() => props.confirmHandler()} variant={"contained"}
          style={{ backgroundColor: colorLogo }}
          autoFocus>{translate('components.confirm')}</Button>
      </DialogActions>
    </Dialogg>
  );
}