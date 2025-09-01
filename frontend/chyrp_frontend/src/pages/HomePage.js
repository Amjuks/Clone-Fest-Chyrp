import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { motion } from 'framer-motion';


function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'));
  }, [navigate]);

  if (!user) return <CircularProgress />;
  let display_name = user.display_name || user.username;

  return (
    <div className="homepage">
      {/* Hero / Welcome */}
      <section className="hero">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                className="typing-text"
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Welcome, {display_name}
              </Typography>
              <Typography variant="body1" className="hero-subtext">
                Chyrp is a lightweight blogging platform for sharing stories,
                media, and more.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className="cta-btn"
                onClick={() => navigate('/create')}
              >
                Create Your Blog
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="hero-illustration" />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* About Chyrp */}
      <section className="about">
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            About Chyrp
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chyrp helps you focus on what matters: your writing. Add text,
            images, videos, or documents — all in a clean, minimal experience.
          </Typography>
        </Container>
      </section>

      {/* What You Can Post Section */}
      <Box className="features-section">
        <Typography variant="h4" gutterBottom className="section-title">
          What You Can Post
        </Typography>
        <Grid container spacing={3} justifyContent="space-evenly">
          {[
            { title: 'Images', desc: 'Share photos, artwork, or designs.' },
            { title: 'Videos', desc: 'Embed or upload video content.' },
            { title: 'PDF & Files', desc: 'Attach documents, notes, and reports.' },
            { title: 'Drafts', desc: 'Save drafts and publish later.' },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="feature-card">
                <CardContent>
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>


      {/* Example Blog */}
      <section className="example-blog">
        <Container maxWidth="md">
          <Card component={motion.div} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
            <CardMedia
              component="img"
              height="200"
              image="https://via.placeholder.com/600x200"
              alt="Example Blog"
            />
            <CardContent>
              <Typography variant="h5">My First Blog</Typography>
              <Typography variant="body2" color="text.secondary">
                Here’s a sneak peek of how your blog post could look. Clean,
                simple, and distraction-free.
              </Typography>
              <Button onClick={() => navigate('/create')} className="cta-btn">
                Start Your Blog
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}

export default HomePage;
