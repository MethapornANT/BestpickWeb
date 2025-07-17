import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Paper, Box } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'; // Import styled from @mui/material/styles
import { keyframes } from '@emotion/react'; // keyframes from @emotion/react for better compatibility
import axios from 'axios';

// 1. Keyframes for Background Animation (Vibrant Gradient Shift)
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 2. Keyframes for Button Shimmer Effect
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// 3. Keyframes for Paper Fade-in Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Custom Theme Definition (Minimal with Vibrant Accents)
const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF', // A modern, vibrant purple-blue
      light: '#8E88FF',
      dark: '#4F47B8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00D1B2', // A bright, energetic teal/turquoise
      light: '#33DDC2',
      dark: '#00A38D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA', // Very light grey for a clean base
      paper: '#FFFFFF', // Pure white for card backgrounds
    },
    text: {
      primary: '#34495E', // Dark slate grey for main text
      secondary: '#7F8C8D', // Lighter grey for secondary text/labels
    },
  },
  typography: {
    fontFamily: ['"Poppins"', 'sans-serif'].join(','), // Using Poppins for a modern, friendly feel
    h4: {
      fontWeight: 700,
      color: '#2C3E50', // Strong dark color for headings
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem', // Responsive font size
      },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '16px 0',
          fontSize: '1.15rem',
          fontWeight: 600,
          textTransform: 'none', // Prevent default uppercase
          transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
          position: 'relative', // For shimmer effect
          overflow: 'hidden',   // For shimmer effect
          zIndex: 1,
          '&:hover': {
            transform: 'translateY(-3px)', // Lift effect on hover
            boxShadow: '0 15px 30px rgba(108, 99, 255, 0.4)', // Enhanced shadow
          },
          '&:active': {
            transform: 'translateY(0px)', // Press down effect on click
            boxShadow: '0 8px 16px rgba(108, 99, 255, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '20px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#FDFEFE', // Almost white for input background
            transition: 'border-color 0.3s ease-out, box-shadow 0.3s ease-out',
            '& fieldset': {
              borderColor: '#E0E0E0', // Light grey border
            },
            '&:hover fieldset': {
              borderColor: '#C0C0C0', // Darker grey on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00D1B2', // Secondary color on focus
              boxShadow: '0 0 0 3px rgba(0, 209, 178, 0.2)', // Soft glow
            },
          },
          '& .MuiInputLabel-root': {
            color: '#A0A0A0', // Lighter label
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00D1B2', // Secondary color on focus
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.18)', // Deeper, more luxurious shadow
          padding: '50px',
          animation: `${fadeIn} 0.8s ease-out forwards`, // Fade-in animation on load
          '@media (max-width:600px)': {
            padding: '30px',
            borderRadius: '18px',
          },
        },
      },
    },
  },
});

// Styled component for Button with shimmer effect
const ShimmerButton = styled(Button)(({ theme }) => ({
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transform: 'translateX(-100%)', // Start off-screen
    transition: 'none', // Disable default transition
    pointerEvents: 'none', // Allow clicks to pass through
  },
  '&:hover::before': {
    animation: `${shimmer} 1.2s infinite`, // Apply shimmer animation on hover
  },
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // It's good practice to ensure REACT_APP_BASE_URL is correctly set in your .env file
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/login`, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      navigate('/dashboard');
    } catch (error) {
      console.error("Login Error:", error); // Log the actual error for debugging
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Full-screen animated background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #FFD700, #FF69B4, #6A5ACD, #40E0D0)', // Gold, Hot Pink, Slate Blue, Turquoise
          backgroundSize: '400% 400%',
          animation: `${gradientShift} 18s ease infinite`, // Slower and smoother animation
          zIndex: -1,
          overflow: 'hidden', // Prevent scrollbars from background
        }}
      />

      <Container
        maxWidth="xs" // Limits the max width of the form but allows it to shrink
        sx={{
          minHeight: '100vh', // Ensure it takes full viewport height
          display: 'flex',
          alignItems: 'center', // Vertically center the content
          justifyContent: 'center', // Horizontally center the content
          padding: { xs: '20px', sm: '0' }, // Add padding on small screens
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%', // Take full width within maxWidth="xs"
            maxWidth: '450px', // Maximum width for the paper
            boxSizing: 'border-box', // Include padding in width calculation
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              marginBottom: '40px',
            }}
          >
            Admin Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ShimmerButton
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            sx={{
              marginTop: '10px', // Spacing above the button
            }}
          >
            Login
          </ShimmerButton>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;