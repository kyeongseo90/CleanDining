import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//
import axios from 'axios';

const theme = createTheme();

export default function Signup() {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const addData = async(e) => {
    console.log(name);
    console.log(email);
    console.log(password);
    e.preventDefault();
    const nameInput = name;
    const emailInput = email;
    const passwordInput = password;
    const requestURL = 'http://15.164.46.105:3000/addMember';
    const userInfo = {
      'email': emailInput,
      'name': nameInput,
      'password': passwordInput
    };
    
    if (nameInput.length === 0){
      alert("이름을 입력해주세요!");
    }
    else if(!emailInput.includes('@') || !emailInput.includes('.')){
      alert("올바른 이메일 형식인지 확인하세요!");
    } 
    else if(password.length < 4){
      alert("비밀번호는 4자리 이상입니다!");
    }
    else {
      axios.post(requestURL, userInfo)
      .catch(error => {
        return alert(error);
      })
      .then(response => {
        console.log(response);
        switch(response.data){
          case "Already":
            return alert("이미 가입된 아이디입니다!");
          case "Success":
            alert("Clean Dining 회원이 되신 것을 축하합니다!");
            return window.location.replace("/");
          default :
            return alert("ERROR");
        }
      })
    }   
  }

  function returnClick(e) {
    window.location.replace ("/")
  }

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     Name: data.get('name'),
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            회원가입
          </Typography>
          <Box component="form" noValidate onSubmit={addData} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="이름"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="이메일"
                  name="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="이메일로 이벤트, 마케팅 정보를 받아볼래요!"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              //onClick= {returnClick}
            >
              회원되버리기
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick = {returnClick}>
                  계정이 이미 있으신가요?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}