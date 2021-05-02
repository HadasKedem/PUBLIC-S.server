import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AxiosInstance from "../../services/axios-instance";
import { authService } from '../../services/authService';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        הזכויות שמורות לצוות אוגי - #גליה סמסונג גלקסי אס 10
      </Link>{' '}
    </Typography>
  );
}

// function startLogin() {
//     alert("BOBO")
//     alert("LOGIN BB! : " + this.username)
// }

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function Login() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    username: '',
    password: '',
  });
  const [error, setError] = React.useState("");

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const startLogin = (e) => {
    e.preventDefault()
    let loginObj = {
      username: values.username,
      password: values.password
    }
    AxiosInstance.post(`users/login`, loginObj)
      .then(res => {
        if (res && res.data.length && res != 'failed') {
          authService.updateUser(res.data)
          window.location.href = '/';
        } else {
          setError("אחד או יותר מהפרטים לא נכונים")
        }
      })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          טייס/ת? תוכיח/י לנו!
        </Typography>
        <hr></hr>
        <Typography component="p" variant="p" align="center">
          תתחבר/י למערכת ותתחיל/י להוכיח שאת/ה הטייס/ת הכי טוב/ה בטייסת!
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            value={values.username}
            onChange={handleChange('username')}
            label="שם משתמש/ת"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            value={values.password}
            onChange={handleChange('password')}
            label="סיסמא/ה"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <span>{error}</span>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(event) => startLogin(event)}
          >
            לחצ/י להמראה!
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            {/* <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid> */}
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}