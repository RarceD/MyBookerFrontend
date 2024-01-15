import { Avatar, Box, Button, Checkbox, FormControlLabel, Grid, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Md5 } from 'ts-md5';
import { tryLogin } from '../api/actions';
import TextFieldRaad from '../components/TextFieldRaad';
import { colorLogo } from '../interfaces/colors';
import "./pages.css";
import { APP_NAME, getCorrectLogo } from '../api/request';
import { translate } from 'react-i18nify';

export const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [errorSubmit, setErrorSubmit] = useState(false);
  const navigate = useNavigate();
  const [autologin, setAutologin] = useState(false);
  const handleChangeAutologin = (e: any) => autologin ? setAutologin(false) : setAutologin(true);

  useEffect(() => {
    // Implementado autologin:
    let autoLogin: string | null = localStorage.getItem("autologin")
    if (autoLogin != null)
      navigate("/courts")
  }, [navigate]);

  const handleSubmit = () => {
    if (user === "" || pass === "") return;
    let passServer = new Md5().appendStr(pass).end()?.toString();
    let data = { user: user, pass: passServer }
    tryLogin(data, (response: any) => {
      if (response["success"]) {
        localStorage.setItem("id", response["id"]);
        localStorage.setItem("token", response["token"]);
        if (autologin)
          localStorage.setItem("autologin", "1");
        else
          localStorage.setItem("autologin", "0");
        navigate('/courts');
      }
      else
        setErrorSubmit(true);
    })
  }

  return (
    <>
      <Box
        sx={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 2, width: 240, height: 180 }} variant="rounded" src={getCorrectLogo(APP_NAME)}> </Avatar>
        <Typography component="h1" variant="h5"> {APP_NAME} </Typography>
        <Box component="form" sx={{ mt: 1 }} borderColor={"white"}>
          <TextFieldRaad
            InputLabelProps={{ style: { color: "white" } }}
            label={translate('login.email')}
            type="text"
            fullWidth
            autoComplete="current-password"
            margin="normal"
            inputProps={{
              style: {
                color: 'white',
                borderColor: "white",
              }
            }}
            error={errorSubmit}
            name="email"
            autoFocus
            onChange={(e: any) => { setUser(e.target.value); }}
          />

          <TextFieldRaad
            InputLabelProps={{ style: { color: "#fffff0" } }}
            margin="normal"
            fullWidth
            error={errorSubmit}
            inputProps={{
              style: {
                color: 'white',
                borderColor: "white",
              }
            }}
            name="password"
            label="Constraseña"
            type="password"
            onChange={(e: any) => { setPass(e.target.value); }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
          />
          <FormControlLabel
            control={<Checkbox value={autologin} color="warning" />}
            label={translate('login.remember')}
            onChange={handleChangeAutologin}
          />
          <Button
            fullWidth
            style={{ background: colorLogo }}
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            Acceder
          </Button>
          <Grid container>
            <Grid item xs>
              <Link style={{ color: "#ddd9d9" }} variant="body2" href="forget">
                {translate('login.forgetPassword')}
              </Link>
            </Grid>
            <Grid item>
              <Link style={{ color: "#ddd9d9" }} variant="body2" href="number">
                {translate('login.loginWithCode')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
export default Login;