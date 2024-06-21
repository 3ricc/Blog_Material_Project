import React from 'react';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

function Post() {

    const location = useLocation()
    const account = location.state.account;
    const defaultTheme = createTheme();
    const [title, setTitle] = useState('');
    const [body, setBody]  = useState('');
    const navigate = useNavigate();

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleBodyChange = (event) => {
        setBody(event.target.value);
    }

    const handleSubmit = () =>{
        if (title != '' && body != ''){
            navigate('/', {state: {createdTitle: title, createdBody: body, account: account}})
        }
    }

  return (
    <ThemeProvider theme={defaultTheme}>
        <Typography variant="h3" gutterBottom>CREATE A POST PAGE!</Typography>
        <Typography variant="h3" gutterBottom>TITLE</Typography>
        <TextField onChange={(handleTitleChange)}></TextField>
        <Typography variant="h3" gutterBottom>FIELD!</Typography>
        <TextField onChange={handleBodyChange}></TextField>
        <div>
            <Button variant="contained" onClick={() => handleSubmit()}>SUBMIT!</Button>
        </div>
        
    </ThemeProvider>
  );
}

export default Post;