import React from 'react';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

function Admin() {
    const location = useLocation()
    const defaultTheme = createTheme();
    const navigate = useNavigate();

    const [isAdminEnabled, setA] = useState(location.state.accountList.admin);
    const [isFacultyEnabled, setF] = useState(location.state.accountList.faculty);
    const [isStaffEnabled, setS] = useState(location.state.accountList.staff);
    const [isModEnabled, setM] = useState(location.state.accountList.moderator);
    const [isStudentEnabled, setSt] = useState(location.state.accountList.student);

    const handleAdminClick = () => {
        setA(!isAdminEnabled)
    }
    const handleFacultyClick = () => {
        setF(!isFacultyEnabled)
    }
    const handleStaffClick = () => {
        setS(!isStaffEnabled)
    }
    const handleModClick = () => {
        setM(!isModEnabled)
    }
    const handleStudentClick = () => {
        setSt(!isStudentEnabled)
    }


  return (
    <ThemeProvider theme={defaultTheme}>
        <Typography variant="h3" gutterBottom>ADMIN PAGE</Typography>
        <Button variant="contained" style={{backgroundColor: isAdminEnabled ? 'green' : 'red'}} onClick={()=>handleAdminClick()}>admin</Button>
        <Button variant="contained" style={{backgroundColor: isFacultyEnabled ? 'green' : 'red'}} onClick={()=>handleFacultyClick()}>faculty</Button>
        <Button variant="contained" style={{backgroundColor: isStaffEnabled ? 'green' : 'red'}} onClick={()=>handleStaffClick()}>staff</Button>
        <Button variant="contained" style={{backgroundColor: isModEnabled ? 'green' : 'red'}} onClick={()=>handleModClick()}>moderator</Button>
        <Button variant="contained" style={{backgroundColor: isStudentEnabled ? 'green' : 'red'}} onClick={()=>handleStudentClick()}>student</Button>
        <div>
            <Button variant="contained" onClick={() => navigate('/', {state: {accountList: {admin: isAdminEnabled, faculty: isFacultyEnabled, staff: isStaffEnabled, moderator: isModEnabled, student: isStudentEnabled}}})}>SUBMIT!</Button>
        </div>
    </ThemeProvider>
  );
}

export default Admin;