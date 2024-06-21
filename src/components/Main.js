import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';
import Button from '@mui/material/Button';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { getOpenAIResponse } from '../Agent.js';
import FormControlLabel from '@mui/material/FormControlLabel';

// const { Client } = require('@elastic/elasticsearch')


function Main(props) {

  const { posts, title } = props;
  const [hiddenPosts, setHiddenPosts] = useState([]);
  const [replies, setReplies] = useState(Array(posts.length).fill(""));
  const [textFieldValues, setTextFieldValues] = useState(Array(posts.length).fill(""));

  const handleButtonClick = (postIndex) => {
    setHiddenPosts([...hiddenPosts, postIndex]);
  };

  const handleReplyClick = (index) =>{
    //setReplies([...replies, value]);
    const repliesXD = [...replies];
    repliesXD[index] = textFieldValues[index];
    setReplies(repliesXD);
  }

  const handleChange = (index) => (event) => {
    //setValue(event.target.value);
    const newTextFieldValues = [...textFieldValues];
    newTextFieldValues[index] = event.target.value;
    setTextFieldValues(newTextFieldValues);
  }

  const [isChecked, setIsChecked] = useState(Array(posts.length).fill(false));

  const handleCheckboxChange = (index) => (event) => {
    const newIsChecked = [...isChecked];
    newIsChecked[index] = event.target.checked;
    setIsChecked(newIsChecked);

    console.log("once")
    if (event.target.checked){
      getOpenAIResponse("").then(response=>{
        const newTextFieldValues = [...textFieldValues];
        newTextFieldValues[index] = response.message.content;
        setTextFieldValues(newTextFieldValues);
      });
      
    }
    else{
      const newTextFieldValues = [...textFieldValues];
      newTextFieldValues[index] = "";
      setTextFieldValues(newTextFieldValues);
    }
  };

  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      {posts.map((post, index) => (
        !hiddenPosts.includes(index) &&(
          <div key={index}>
            <Markdown className="markdown">
              {post}
            </Markdown>
            <TextField value={textFieldValues[index]} onChange={handleChange(index)}/>
            <div>
              <Button variant="contained" onClick={() => handleReplyClick(index)}>Reply</Button>
              <FormControlLabel
                  control={<Checkbox checked={isChecked[index]} onChange={handleCheckboxChange(index)} />}
                  label="Generate Reply with OpenAI"
              />
              {props.account != null && props.account == 'moderator' &&(
                <Button variant="contained" onClick={() => handleButtonClick(index)}>Delete</Button>
              )}
              <Button variant='contained'>Store</Button>
            </div>
            {replies[index]}
          </div>
        )
      ))}
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

export default Main;
