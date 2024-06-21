import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import RecommendationButton from './FetchRecommendation';

function Header(props) {
  const { sections, title, account, accountList } = props;
  const navigate = useNavigate();

  const handleSubmit = () =>{ 
    navigate('post', {state: {account: account}})
  }
  const handleAdmin = () =>{
    navigate('admin', {state: {accountList: accountList}})
  }

  const handleSignin = () =>{
    navigate('sign-in', {state: {accountList: accountList}})
  }

  const handleAgent = () =>{
    navigate('agent')
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  const handleMenuItemClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
    handleMenuClose();
  };

  const handleSubscribeClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Button size="small" onClick={handleSubscribeClick}>Subscribe</Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuItemClick('Academic Resources')}>Academic Resources {selectedOptions.includes('Academic Resources') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Career Services')}>Career Services {selectedOptions.includes('Career Services') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Campus')}>Campus {selectedOptions.includes('Campus') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Culture')}>Culture {selectedOptions.includes('Culture') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Local Community Resources')}>Local Community Resources {selectedOptions.includes('Local Community Resources') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Social')}>Social {selectedOptions.includes('Social') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Sports')}>Sports {selectedOptions.includes('Sports') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Health and Wellness')}>Health and Wellness {selectedOptions.includes('Health and Wellness') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Technology')}>Technology{selectedOptions.includes('Technology') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Travel')}>Travel {selectedOptions.includes('Travel') && <CheckIcon />}</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Alumni')}>Alumni {selectedOptions.includes('Alumni') && <CheckIcon />}</MenuItem>
          {/* Add more MenuItem components for more options */}
        </Menu>
        {account != null &&(
          <Button size="small" onClick={()=>handleSubmit()}>Create a post</Button>
        )}
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        {account != null && account == 'admin' &&(
          <Button size="small" onClick={()=>handleAdmin()}>Admin Dashboard</Button>
        )}
        {account != null &&(
          <Typography variant="outlined" size="small">
            Welcome {account ? account : 'Sign in'}
          </Typography>
        )}
        <Button variant="outlined" size="small" onClick={()=>handleAgent()}>Agent</Button>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <Button variant="outlined" size="small" onClick={()=>handleSignin()}>
          Sign in
        </Button>
        <RecommendationButton></RecommendationButton>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
