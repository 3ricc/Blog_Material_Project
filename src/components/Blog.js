import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';
import post1 from './blog-post-1.md';
import post2 from './blog-post-2.md';
import post3 from './blog-post-3.md';
import {useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';


const sections = [
  { title: 'Academic Resources', url: 'academic-resources' },
  { title: 'Career Services', url: 'career-services' },
  { title: 'Campus', url: 'campus' },
  { title: 'Culture', url: 'culture' },
  { title: 'Local Community Resources', url: 'local-resources' },
  { title: 'Social', url: 'social' },
  { title: 'Sports', url: 'sports' },
  { title: 'Health and Wellness', url: 'health' },
  { title: 'Technology', url: 'technology' },
  { title: 'Travel', url: 'travel' },
  { title: 'Alumni', url: 'alumni' },
];

const mainFeaturedPost = {
  title: 'Title of a longer blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random?wallpapers',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
  },
];

const sidebar = {
  title: 'About',
  description:
    'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
  archives: [
    { title: 'March 2020', url: '#' },
    { title: 'February 2020', url: '#' },
    { title: 'January 2020', url: '#' },
    { title: 'November 1999', url: '#' },
    { title: 'October 1999', url: '#' },
    { title: 'September 1999', url: '#' },
    { title: 'August 1999', url: '#' },
    { title: 'July 1999', url: '#' },
    { title: 'June 1999', url: '#' },
    { title: 'May 1999', url: '#' },
    { title: 'April 1999', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'X', icon: XIcon },
    { name: 'Facebook', icon: FacebookIcon },
  ],
};

const accountListDefault = {
  admin: true,
  faculty: true,
  staff: true,
  moderator: true,
  student: true,
}


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Blog() {
  const location = useLocation();

  const accountList = location.state?.accountList || accountListDefault;

  // had to fix this myself
  const [post1Content, setPost1Content] = useState('');
  const [post2Content, setPost2Content] = useState('');
  const [post3Content, setPost3Content] = useState('');

  useEffect(() => {
    fetch(post1)
      .then(response => response.text())
      .then(text => setPost1Content(text));

    fetch(post2)
      .then(response => response.text())
      .then(text => setPost2Content(text));

    fetch(post3)
      .then(response => response.text())
      .then(text => setPost3Content(text));
  }, []);

  const posts = [post1Content, post2Content, post3Content]
  
  if (location.state?.createdTitle != null){
    const placeholder = location.state.createdTitle + '\n' + location.state.createdBody + '\n';
    posts.push(placeholder)
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog" sections={sections} account={location.state?.account} accountList={accountList} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="From the firehose" posts={posts} account={location.state?.account} />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}
