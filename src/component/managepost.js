import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../AuthContext';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// --- Keyframes for Animations ---
const backgroundGradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bubbleMovement = keyframes`
  0% { transform: translate(0, 0); opacity: 0.1; }
  25% { transform: translate(20vw, 15vh); opacity: 0.15; }
  50% { transform: translate(-10vw, 30vh); opacity: 0.1; }
  75% { transform: translate(15vw, 40vh); opacity: 0.12; }
  100% { transform: translate(0, 0); opacity: 0.1; }
`;


// --- Custom Theme Definition (Consistent with Dashboard and ManageUsers) ---
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A1A1A', // Dark grey for AppBar, Sidebar background
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
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
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          height: '100%',
          boxShadow: '4px 0 8px rgba(0,0,0,0.15)',
          borderRight: 'none',
          borderRadius: 0,
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.contrastText,
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
                color: theme.palette.primary.contrastText,
            }),
        },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
          padding: '22px',
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
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
        }),
        head: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontWeight: 600,
        }),
        body: ({ theme }) => ({
            color: theme.palette.text.secondary,
        }),
      },
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

const MainContentPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '10px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
    padding: '22px',
    animation: `${slideInUp} 0.6s ease-out forwards`,
    animationDelay: '0.2s',
    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
    },
    '@media (max-width:600px)': {
        padding: '16px',
        borderRadius: '8px',
    },
}));


const ManagePosts = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false); // Changed name for clarity
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // New state for confirm dialog
  const [selectedPost, setSelectedPost] = useState(null);
  const [postIdToDelete, setPostIdToDelete] = useState(null); // New state to store ID of post to be deleted
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // สำหรับ TextField ค้นหา
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // สำหรับส่งไป fetchPosts

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
    } else {
      fetchPosts();
    }
  }, [isAdmin, navigate]);

  // Debounce searchQuery -> currentSearchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentSearchTerm(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // เรียก fetchPosts ทุกครั้งที่ currentSearchTerm เปลี่ยน
  useEffect(() => {
    fetchPosts(currentSearchTerm);
    // eslint-disable-next-line
  }, [currentSearchTerm]);

  // ปรับ fetchPosts ให้รองรับ query
  const fetchPosts = async (query = '') => {
    const token = localStorage.getItem('token');
    try {
      let url;
      if (query) {
        url = `${process.env.REACT_APP_BASE_URL}/admin/search/posts?q=${encodeURIComponent(query)}`;
      } else {
        url = `${process.env.REACT_APP_BASE_URL}/admin/posts`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setPosts(response.data.results);
      } else {
        setPosts([]);
      }
    } catch (error) {
      setPosts([]);
      if (error.response && error.response.status === 401) {
        handleLogout();
        navigate('/login');
      }
    }
  };

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setOpenEditDialog(true); // Open edit dialog
  };

  // --- New function to open confirmation dialog ---
  const handleConfirmDelete = (postId) => {
    setPostIdToDelete(postId); // Store the ID
    setOpenConfirmDialog(true); // Open confirm dialog
  };

  // --- New function to close confirmation dialog ---
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setPostIdToDelete(null); // Clear the stored ID
  };

  // --- Modified handleDelete to be called *after* confirmation ---
  const executeDelete = async () => {
    handleCloseConfirmDialog(); // Close the confirmation dialog
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/posts/${postIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter(post => post.id !== postIdToDelete));
      setPostIdToDelete(null); // Clear the ID after successful deletion
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error.response && error.response.status === 401) {
        handleLogout();
        navigate('/login');
      }
    }
  };

  const handleCloseEditDialog = () => { // Changed name for clarity
    setOpenEditDialog(false);
    setSelectedPost(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      if (selectedPost.id) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/admin/posts/${selectedPost.id}`, selectedPost, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPosts(posts.map(post => (post.id === selectedPost.id ? selectedPost : post)));
      } else {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/posts`, selectedPost, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setPosts([...posts, response.data]);
      }
      setOpenEditDialog(false); // Close edit dialog
    } catch (error) {
      if (error.response) {
        console.error('Error saving post:', error.response.data);
      } else {
        console.error('Error saving post:', error.message);
      }
    }
  };

  if (!isAdmin()) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AnimatedBackground>
          {[...Array(5)].map((_, i) => (
            <Bubble key={i} index={i} />
          ))}
        </AnimatedBackground>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
          textAlign: 'center',
          p: 3
        }}>
          <Paper elevation={3} sx={{ p: 5, borderRadius: '20px', animation: `${fadeIn} 0.6s ease-out forwards` }}>
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
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBackground>
        {[...Array(5)].map((_, i) => (
            <Bubble key={i} index={i} />
        ))}
      </AnimatedBackground>

      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'transparent' }}>
        {/* AppBar (Top Navigation) */}
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleMenuClick} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Manage Posts
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
              backgroundColor: theme.palette.primary.main,
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
                  key={item.text}
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
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
            paddingTop: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                    color: theme.palette.text.primary,
                    mb: 4,
                    mt: 2,
                    maxWidth: '90%',
                    mx: 'auto',
                    animation: `${fadeIn} 0.8s ease-out forwards`,
                    animationDelay: '0.2s',
                }}
            >
                Manage Posts
            </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="ค้นหาโพสต์ (ID, Title, Content, ProductName, ...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />, 
              }}
              sx={{ width: { xs: '100%', sm: 'auto' }, mb: { xs: 2, sm: 0 }, flexGrow: 1, mr: { sm: 2 } }}
            />
          </Box>

          <TableContainer component={MainContentPaper} sx={{ maxWidth: '1200px', width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Content</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      ไม่พบโพสต์
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>{post.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {/* Ensure post.photo_url is an array of strings */}
                          {Array.isArray(post.photo_url) && post.photo_url.map((url, index) => (
                            <img
                              key={index}
                              src={`${process.env.REACT_APP_BASE_URL}${url}`}
                              alt={`Post ${post.Title}`}
                              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>{post.Title}</TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>{post.content}</TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>{post.ProductName}</TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>{post.status.toLowerCase()}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(post)}>
                          <EditIcon sx={{ color: theme.palette.chartBlue.main }}/>
                        </IconButton>
                        {/* --- Call handleConfirmDelete here --- */}
                        <IconButton onClick={() => handleConfirmDelete(post.id)}>
                          <DeleteIcon sx={{ color: theme.palette.chartPink.main }}/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit Post Dialog */}
          <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle sx={{ color: theme.palette.text.primary }}>{selectedPost ? 'Edit Post' : 'Add Post'}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedPost?.Title || ''}
                onChange={(e) => setSelectedPost({ ...selectedPost, Title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Content"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedPost?.content || ''}
                onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Product Name"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedPost?.ProductName || ''}
                onChange={(e) => setSelectedPost({ ...selectedPost, ProductName: e.target.value })}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={selectedPost?.status || ''}
                  label="Status"
                  onChange={(e) => setSelectedPost({ ...selectedPost, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="deactive">Deactive</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>Save</Button>
            </DialogActions>
          </Dialog>

          {/* --- New Confirmation Dialog --- */}
          <Dialog
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" sx={{ color: theme.palette.text.primary }}>
              {"Confirm Deletion"}
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                Are you sure you want to delete this post? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog} sx={{ color: theme.palette.text.secondary }}>
                Cancel
              </Button>
              <Button onClick={executeDelete} variant="contained" color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {/* --- End New Confirmation Dialog --- */}

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManagePosts;