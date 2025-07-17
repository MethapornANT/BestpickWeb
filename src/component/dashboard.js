import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CssBaseline,
  Paper, // Import Paper for styled component
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import moment from 'moment';

// Import createTheme and styled from Material-UI
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Keyframes for Animations ---
// Background gradient animation: Mainly grey with pastel at ends
const backgroundGradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Soft fade-in for elements
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Slide-in from bottom for cards (re-applied here specifically)
const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Bubble animation
const bubbleMovement = keyframes`
  0% { transform: translate(0, 0); opacity: 0.1; }
  25% { transform: translate(20vw, 15vh); opacity: 0.15; }
  50% { transform: translate(-10vw, 30vh); opacity: 0.1; }
  75% { transform: translate(15vw, 40vh); opacity: 0.12; }
  100% { transform: translate(0, 0); opacity: 0.1; }
`;


// --- Custom Theme Definition ---
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A1A1A', // Dark grey for AppBar, Sidebar background
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    // Muted Pastels for charts - Adjusted for more vibrancy
    chartBlue: {
      main: '#9AC7E7', // Fresher, slightly more vibrant blue
      light: '#BDE3FF',
      dark: '#6D9BCD',
      contrastText: '#1A1A1A',
    },
    chartPink: {
      main: '#E79ACB', // Fresher, slightly more vibrant pink
      light: '#FFBEE3',
      dark: '#CD6D9B',
      contrastText: '#1A1A1A',
    },
    // Pastels for background (slightly more vibrant for corner effect)
    pastelBlue: {
      main: '#C0E0F0', // Light pastel blue
    },
    pastelPink: {
      main: '#F0C0E0', // Light pastel pink
    },
    background: {
      default: '#E0E0E0', // Overall grey background
      paper: '#FFFFFF',   // Pure White for cards/containers
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    h3: {
        fontWeight: 700,
        color: '#212121',
        fontSize: '3.5rem',
        '@media (max-width:960px)': {
            fontSize: '2.8rem',
        },
        '@media (max-width:600px)': {
            fontSize: '2.2rem',
        },
    },
    h4: {
      fontWeight: 600,
      color: '#212121',
      fontSize: '2.2rem',
      '@media (max-width:960px)': {
        fontSize: '1.8rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1.4rem',
      },
    },
    h5: {
      fontWeight: 600,
      color: '#212121',
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    h6: {
        fontWeight: 500,
        color: '#FFFFFF',
        fontSize: '1.05rem',
    },
    body1: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
      color: '#424242',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          minHeight: '48px',
          '@media (min-width:600px)': {
            minHeight: '56px',
          },
          borderRadius: 0,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '0 18px',
          '@media (min-width:600px)': {
            paddingLeft: '22px',
            paddingRight: '22px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          width: 250,
          backgroundColor: theme.palette.primary.main, // Changed to theme's primary color
          color: theme.palette.primary.contrastText, // Ensure text is white
          height: '100%',
          boxShadow: '4px 0 8px rgba(0,0,0,0.15)',
          borderRight: 'none',
          borderRadius: 0,
          // Removed explicit transition here, relying on Material-UI's default Drawer animation.
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.contrastText, // Keep list item text white
          padding: '10px 15px',
          margin: '3px 0px',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease, transform 0.2s ease, color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: '#FFFFFF',
            transform: 'translateX(3px)',
            boxShadow: 'none',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            fontWeight: 600,
            '& .MuiSvgIcon-root': {
                color: '#FFFFFF',
            }
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)',
          }
        }),
      },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: ({ theme }) => ({
                minWidth: '35px',
                color: theme.palette.primary.contrastText, // Keep list item icon white
            }),
        },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
          padding: '22px',
          // REMOVED animation from here. It will be applied via AnimatedPaper specifically for charts.
          '@media (max-width:600px)': {
            padding: '16px',
            borderRadius: '8px',
          },
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '5px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'transform 0.15s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 10px rgba(0, 191, 255, 0.1)',
                },
                '&:active': {
                    transform: 'translateY(0px)',
                    boxShadow: '0 1px 3px rgba(0, 191, 255, 0.05)',
                },
            },
            containedPrimary: ({ theme }) => ({
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                },
            }),
            textPrimary: ({ theme }) => ({
                color: theme.palette.text.primary,
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    color: theme.palette.primary.main,
                }
            })
        },
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                color: '#FFFFFF',
                '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.06)',
                }
            }
        }
    },
  },
});

// --- Styled Components ---
const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  zIndex: -1,
  background: `linear-gradient(135deg, ${theme.palette.pastelBlue.main} 0%, ${theme.palette.background.default} 25%, ${theme.palette.background.default} 75%, ${theme.palette.pastelPink.main} 100%)`,
  backgroundSize: '400% 400%',
  animation: `${backgroundGradientShift} 35s ease infinite`,
  filter: 'brightness(1.02)',
}));

const Bubble = styled(Box)(({ theme, index }) => ({
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0.1,
    zIndex: -1,
    filter: 'blur(8px)',
    animation: `${bubbleMovement} ${20 + index * 5}s linear infinite ${index * 2}s`,
    width: `${100 + index * 50}px`,
    height: `${100 + index * 50}px`,
    top: `${Math.random() * 80}vh`,
    left: `${Math.random() * 80}vw`,
    backgroundColor: index % 2 === 0 ? theme.palette.pastelBlue.main : theme.palette.pastelPink.main,
}));

// NEW: Styled component for chart papers to apply specific slide-in animation AND hover effect
const AnimatedPaper = styled(Paper)(({ theme }) => ({
    animation: `${slideInUp} 0.6s ease-out forwards`,
    animationDelay: '0.2s',
    // New hover effect
    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out', // Smooth transition
    '&:hover': {
        transform: 'translateY(-8px)', // Move up by 8px
        boxShadow: '0 12px 25px rgba(0,0,0,0.15)', // Enhanced shadow
    },
}));


// --- Dashboard Component ---
const Dashboard = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Define menu items dynamically (Moved inside component to use theme)
  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Advertisements', path: '/manageadd', icon: <AddCircleIcon /> },
    { text: 'Manage User', path: '/manageuser', icon: <PeopleIcon /> },
    { text: 'Manage Post', path: '/managepost', icon: <AssignmentIcon /> },
    { text: 'Report posts', path: '/manage-reported-posts', icon: <ReportProblemIcon /> },
    { text: 'Manage Categories', path: '/managecategories', icon: <CategoryIcon /> },
  ];

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const [newUsersData, setNewUsersData] = useState([]);
  const [totalPostsData, setTotalPostsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin()) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNewUsersData(response.data.new_users_per_day);
        setTotalPostsData(response.data.total_posts_per_day);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
         if (error.response && error.response.status === 401) {
             handleLogout();
             navigate('/login');
         }
      }
    };
    fetchData();
  }, [handleLogout, isAdmin, navigate]);

  // HandleMenuClick from your ManageUsers.js example: toggles drawer
  const handleMenuClick = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Chart Data Configuration (using new, more vibrant muted pastel colors)
  const newUserChartData = {
    labels: newUsersData.map(data => moment(data.date).format('DD/MM')),
    datasets: [
      {
        label: 'New Users',
        data: newUsersData.map(data => data.new_users),
        backgroundColor: theme.palette.chartBlue.main,
        borderColor: theme.palette.chartBlue.dark,
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const totalPostChartData = {
    labels: totalPostsData.map(data => moment(data.date).format('DD/MM')),
    datasets: [
      {
        label: 'Total Posts',
        data: totalPostsData.map(data => data.total_posts),
        backgroundColor: theme.palette.chartPink.main,
        borderColor: theme.palette.chartPink.dark,
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Chart Options (Responsive and Clean)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: theme.typography.fontFamily,
            size: 13,
          },
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(33,33,33,0.9)',
        bodyFont: {
          family: theme.typography.fontFamily,
          size: 13,
        },
        titleFont: {
          family: theme.typography.fontFamily,
          weight: 'bold',
          size: 15,
        },
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 11,
          },
        },
      },
    },
  };

  if (!isAdmin()) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        textAlign: 'center',
        p: 3
      }}>
        <Paper elevation={3} sx={{ p: 5, borderRadius: '20px' }}>
          <Typography variant="h5" gutterBottom>Access Denied</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You are not authorized to view this page. Please log in with administrator credentials.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBackground>
        {/* Bubbles for background animation */}
        {[...Array(5)].map((_, i) => (
            <Bubble key={i} index={i} />
        ))}
      </AnimatedBackground>

      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'transparent' }}>
        {/* AppBar (Top Navigation) */}
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
              Admin Dashboard
            </Typography>
            <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Sidebar (Drawer) */}
        <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
            <Box
                sx={{
                    width: 250,
                    backgroundColor: theme.palette.primary.main, // Changed to theme's primary color
                    color: theme.palette.primary.contrastText,
                    height: '100%'
                }}
                role="presentation"
                onClick={handleDrawerClose}
                onKeyDown={handleDrawerClose}
            >
                <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                    Menu
                </Typography>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path} // Apply selected state based on current path
                            sx={{ color: theme.palette.primary.contrastText }}
                        >
                            {item.icon && React.cloneElement(item.icon, { sx: { mr: 1 } })}
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            width: '100%',
            marginTop: '56px',
            paddingTop: '150px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Welcome Admin section */}
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              mb: 10,
              mt: 2,
              maxWidth: '90%',
              mx: 'auto',
              animation: `${fadeIn} 0.8s ease-out forwards`,
              animationDelay: '0.2s',
            }}
          >
            Welcome, Admin!
          </Typography>

          {/* Charts Section */}
          <Box sx={{
              maxWidth: '1200px',
              width: '100%',
              mx: 'auto',
              p: { xs: 1, md: 0 },
          }}>
            <Grid container spacing={4}>
              {/* New Users Chart - Now uses AnimatedPaper */}
              <Grid item xs={12} md={6}>
                <AnimatedPaper elevation={3} sx={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
                    New Users Overview
                  </Typography>
                  <Box sx={{ flexGrow: 1, position: 'relative' }}>
                      <Bar data={newUserChartData} options={chartOptions} />
                  </Box>
                </AnimatedPaper>
              </Grid>

              {/* Total Posts Chart - Now uses AnimatedPaper */}
              <Grid item xs={12} md={6}>
                <AnimatedPaper elevation={3} sx={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
                    Total Posts Overview
                  </Typography>
                  <Box sx={{ flexGrow: 1, position: 'relative' }}>
                      <Bar data={totalPostChartData} options={chartOptions} />
                  </Box>
                </AnimatedPaper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;