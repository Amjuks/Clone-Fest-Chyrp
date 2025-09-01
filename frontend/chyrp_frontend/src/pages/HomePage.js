import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MovieIcon from '@mui/icons-material/Movie';
import DescriptionIcon from '@mui/icons-material/Description';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PaletteIcon from '@mui/icons-material/Palette';
import BoltIcon from '@mui/icons-material/Bolt';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
// If you have auth, import it; otherwise omit these 3 lines.
import { getCurrentUser } from '../services/auth';

// import './homeLanding.scss';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function HomeLanding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // OPTIONAL: hook up auth; or just comment this block out if not needed
  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
    setUser(null);
  }, []);

  const features = [
    {
      icon: <PhotoCameraIcon />,
      title: 'Images',
      desc: 'Showcase crisp photos, art, and designs.',
    },
    {
      icon: <MovieIcon />,
      title: 'Videos',
      desc: 'Embed or upload short clips with ease.',
    },
    {
      icon: <DescriptionIcon />,
      title: 'Files & PDFs',
      desc: 'Attach notes, decks, reports—stay organized.',
    },
    {
      icon: <EditNoteIcon />,
      title: 'Drafts',
      desc: 'Save, revisit, and publish when it’s perfect.',
    },
    {
      icon: <PaletteIcon />,
      title: 'Themes',
      desc: 'Dial in your vibe with custom themes.',
    },
    {
      icon: <BoltIcon />,
      title: 'Fast & Minimal',
      desc: 'Zero clutter. Just focused writing.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Lin',
      role: 'Photographer',
      quote:
        'Chyrp made publishing my photo journals effortless. Clean UI, zero friction.',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Mike Rhodes',
      role: 'Videographer',
      quote:
        'Embedding reels is smooth and the editor is 🔥. Feels premium, no cap.',
      avatar:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Aisha Khan',
      role: 'Writer',
      quote:
        'I write more because everything feels so minimal and distraction-free.',
      avatar:
        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop',
    },
  ];

  // Basic carousel index (no external deps)
  const [tIndex, setTIndex] = useState(0);
  const next = () => setTIndex((tIndex + 1) % testimonials.length);
  const prev = () =>
    setTIndex((tIndex - 1 + testimonials.length) % testimonials.length);

  const displayName = user?.display_name || user?.username;
  const greet =
    displayName ? `Welcome back, ${displayName}` : 'Write. Share. Inspire.';

  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Chip className="badge" label="New: Elegant Themes" />
                <Typography variant="h2" className="headline">
                  {greet}
                </Typography>
                <Typography variant="body1" className="subtext">
                  Chyrp is your lightweight space to publish stories, photos,
                  and ideas—beautifully and fast.
                </Typography>
                <Stack direction="row" spacing={2} className="cta-row">
                  <Button
                    variant="contained"
                    className="cta-primary"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/create')}
                  >
                    Start Writing
                  </Button>
                  <Button
                    variant="outlined"
                    className="cta-secondary"
                    onClick={() => navigate('/explore')}
                  >
                    Explore Blogs
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} className="social-proof">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <Typography variant="caption">
                    Loved by 5k+ creators
                  </Typography>
                </Stack>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                className="hero-visual"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              >
                {/* Replace this mock with a real screenshot later */}
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
                  alt="Editor Preview"
                />
                <div className="floating-card">
                  <BoltIcon />
                  <span>Fast autosave</span>
                </div>
                <div className="floating-card fc2">
                  <PaletteIcon />
                  <span>Instant theming</span>
                </div>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
        <div className="hero-blob blob-1" />
        <div className="hero-blob blob-2" />
      </section>

      {/* ABOUT */}
      <section className="about">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionCard
                className="about-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                elevation={0}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=1200&auto=format&fit=crop"
                  alt="Minimal writing"
                />
                <CardContent>
                  <Typography variant="h6" className="about-eyebrow">
                    Why Chyrp?
                  </Typography>
                  <Typography variant="h4" className="about-title">
                    Beautifully simple, built for focus
                  </Typography>
                  <Typography variant="body2" className="about-copy">
                    No clutter, no distractions—just your words and your
                    audience. Attach media, customize themes, and publish in a
                    snap.
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3} className="about-points">
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar className="about-icon">
                    <BoltIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Lightning workflow</Typography>
                    <Typography variant="body2">
                      Drafts, autosave, and keyboard-first editing for speed.
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar className="about-icon">
                    <PaletteIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Personal themes</Typography>
                    <Typography variant="body2">
                      Flip between themes or craft your own look with SCSS.
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar className="about-icon">
                    <DescriptionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Django-powered</Typography>
                    <Typography variant="body2">
                      Solid backend, clean APIs, and secure auth out of the box.
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="features">
        <Container maxWidth="lg">
          <Typography variant="h4" className="section-title" align="center">
            Everything you need to publish with style
          </Typography>

          <Grid container spacing={3} className="features-grid">
            {features.map((f, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <MotionCard
                  className="feature-card"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  elevation={0}
                >
                  <div className="feature-icon">{f.icon}</div>
                  <CardContent>
                    <Typography variant="h6">{f.title}</Typography>
                    <Typography variant="body2" className="muted">
                      {f.desc}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* EXAMPLE BLOG */}
      <section className="example">
        <Container maxWidth="md">
          <MotionCard
            className="example-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            elevation={0}
          >
            <CardMedia
              component="img"
              image="https://images.unsplash.com/photo-1529336953121-a0ce23d39a38?q=80&w=1200&auto=format&fit=crop"
              height="260"
              alt="Example blog"
            />
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
                className="tags"
              >
                <Chip size="small" label="Design" />
                <Chip size="small" label="Photography" />
                <Chip size="small" label="Inspiration" />
              </Stack>
              <Typography variant="h5" className="example-title">
                Minimalism in Storytelling
              </Typography>
              <Typography variant="body2" className="muted">
                A quick preview of how your post can look—clean, readable, and
                easy on the eyes across all devices.
              </Typography>

              <Stack direction="row" spacing={2} className="example-cta">
                <Button
                  variant="contained"
                  className="cta-primary"
                  onClick={() => navigate('/create')}
                >
                  Start Your Blog
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate('/docs/get-started')}
                >
                  Read the Guide
                </Button>
              </Stack>
            </CardContent>
          </MotionCard>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <Container maxWidth="md">
          <Typography variant="h4" align="center" className="section-title">
            Creators are vibing with Chyrp
          </Typography>

          <Box className="carousel">
            <Button className="nav prev" onClick={prev} aria-label="Previous">
              <ChevronLeftIcon />
            </Button>

            <MotionCard
              key={tIndex}
              className="testimonial-card"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              elevation={0}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={testimonials[tIndex].avatar} />
                  <Box>
                    <Typography variant="subtitle1">
                      {testimonials[tIndex].name}
                    </Typography>
                    <Typography variant="caption" className="muted">
                      {testimonials[tIndex].role}
                    </Typography>
                  </Box>
                </Stack>
                <Divider className="divider" />
                <Typography variant="body1" className="quote">
                  “{testimonials[tIndex].quote}”
                </Typography>
              </CardContent>
            </MotionCard>

            <Button className="nav next" onClick={next} aria-label="Next">
              <ChevronRightIcon />
            </Button>
          </Box>
        </Container>
      </section>

      {/* CTA BANNER (pre-footer) */}
      <section className="cta-banner">
        <Container maxWidth="lg">
          <Box className="cta-content">
            <Typography variant="h4" className="cta-title">
              Your words deserve a stage.
            </Typography>
            <Typography variant="body1" className="cta-sub">
              Spin up your first post in minutes and make it shine.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                className="cta-primary"
                onClick={() => navigate('/create')}
              >
                Start Blogging Now
              </Button>
              <Button
                variant="outlined"
                className="cta-secondary"
                onClick={() => navigate('/pricing')}
              >
                View Pricing
              </Button>
            </Stack>
          </Box>
        </Container>
        <div className="cta-blob" />
      </section>
      {/* FOOTER IS SEPARATE */}
    </div>
  );
}
