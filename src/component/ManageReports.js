import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Box, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, Select, MenuItem, CssBaseline,
    Drawer, List, ListItem, ListItemText, Avatar, TextField
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../AuthContext';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// --- Keyframes for Animations (Consistent with other pages) ---
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

// --- Custom Theme Definition (Consistent with Dashboard, ManageUsers, ManagePosts) ---
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
                    color: '#FFFFFF', // Default color for AppBar icons
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.06)',
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderBottom: `1px solid rgba(0, 0, 0, 0.1)`, // Changed for clearer lines
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

// --- Styled Components (Consistent with other pages) ---
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


const ManageReportedPosts = () => {
    const { handleLogout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [reportedPosts, setReportedPosts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // สำหรับ TextField ค้นหา
    const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // สำหรับส่งไป fetchReportedPosts

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
            fetchReportedPosts();
        }
    }, [isAdmin, navigate]);

    // Debounce searchQuery -> currentSearchTerm
    useEffect(() => {
        const handler = setTimeout(() => {
            setCurrentSearchTerm(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // เรียก fetchReportedPosts ทุกครั้งที่ currentSearchTerm เปลี่ยน
    useEffect(() => {
        fetchReportedPosts(currentSearchTerm);
        // eslint-disable-next-line
    }, [currentSearchTerm]);

    // ปรับ fetchReportedPosts ให้รองรับ query
    const fetchReportedPosts = async (query = '') => {
        const token = localStorage.getItem('token');
        try {
            let url;
            if (query) {
                url = `${process.env.REACT_APP_BASE_URL}/admin/search/reports?q=${encodeURIComponent(query)}`;
            } else {
                url = `${process.env.REACT_APP_BASE_URL}/admin/reported-posts`;
            }
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (Array.isArray(response.data)) {
                setReportedPosts(response.data);
            } else if (response.data && Array.isArray(response.data.results)) {
                setReportedPosts(response.data.results);
            } else {
                setReportedPosts([]);
            }
        } catch (error) {
            setReportedPosts([]);
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

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPost(null);
    };

    const handleEdit = (report) => {
        setSelectedPost(report);
        setOpenDialog(true);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/admin/reports/${selectedPost.report_id}`, {
                status: selectedPost.status // Send the new status to backend
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Re-fetch all reported posts to ensure UI is up-to-date with new logic
            fetchReportedPosts();
            setOpenDialog(false);
        } catch (error) {
            if (error.response) {
                console.error('Error updating report status:', error.response.data);
                alert(`Error updating report: ${error.response.data.error || error.message}`);
            } else {
                console.error('Error updating report status:', error.message);
                alert(`Error updating report: ${error.message}`);
            }
            if (error.response && error.response.status === 401) {
                handleLogout();
                navigate('/login');
            }
        }
    };

    // Helper to get the first photo URL from a JavaScript Array of strings
    const getFirstPhotoUrl = (photoUrlArray) => {
        console.log("Processing photo_url array:", photoUrlArray); // Log the input
        if (Array.isArray(photoUrlArray) && photoUrlArray.length > 0) {
            const firstValidUrl = photoUrlArray.find(url => typeof url === 'string' && url.trim() !== '');
            if (firstValidUrl) {
                // Prepend base URL if the path is relative (starts with /uploads)
                if (firstValidUrl.startsWith('/uploads/')) {
                    // Ensure REACT_APP_BASE_URL does not end with / to avoid double slash
                    const baseUrl = process.env.REACT_APP_BASE_URL.endsWith('/') ? process.env.REACT_APP_BASE_URL.slice(0, -1) : process.env.REACT_APP_BASE_URL;
                    return `${baseUrl}${firstValidUrl}`;
                }
                return firstValidUrl; // Return as is if it's already an absolute URL
            }
        }
        console.log("No valid photo URL found.");
        return null; // Return null if array is empty, not an array, or no valid URLs
    };


    // Use useMemo to sort reportedPosts for display
    const sortedReportedPosts = useMemo(() => {
        if (!reportedPosts) return [];

        const statusOrder = {
            'pending': 1,
            'normally': 2,
            'block': 3,
        };

        return [...reportedPosts].sort((a, b) => {
            const statusComparison = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
            if (statusComparison !== 0) {
                return statusComparison;
            }

            // Secondary sort by reported_at (newest first) within the same status group
            return new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime();
        });
    }, [reportedPosts]);

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
                            Manage Reported Posts
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
                                    button
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
                        Manage Reported Posts
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="ค้นหารายงาน (ID, Post ID, Username, เหตุผล, สถานะ...)"
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
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Post Image</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Post ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Post Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Reported By</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Reason</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Reported At</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedReportedPosts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            ไม่พบรายการรายงาน
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedReportedPosts.map((report) => (
                                        <TableRow key={report.report_id}>
                                            <TableCell>
                                                {getFirstPhotoUrl(report.post_image_url) ? (
                                                    <img
                                                        src={getFirstPhotoUrl(report.post_image_url)}
                                                        alt="Post"
                                                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                ) : (
                                                    <Avatar variant="rounded" sx={{ width: 50, height: 50, bgcolor: theme.palette.grey[300] }}>
                                                        No Img
                                                    </Avatar>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ color: theme.palette.text.secondary }}>{report.actual_post_id}</TableCell>
                                            <TableCell sx={{ color: theme.palette.text.secondary }}>{report.post_title}</TableCell>
                                            <TableCell sx={{ color: theme.palette.text.secondary }}>{report.reported_by_username}</TableCell>
                                            <TableCell sx={{ color: theme.palette.text.secondary }}>{report.reason}</TableCell>
                                            <TableCell sx={{ color: theme.palette.text.secondary }}>
                                                {new Date(report.reported_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false
                                                })}
                                            </TableCell>
                                            <TableCell sx={{ color: theme.palette.text.secondary }}>{report.status}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(report)}>
                                                    <EditIcon sx={{ color: theme.palette.chartBlue.main }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle sx={{ color: theme.palette.text.primary }}>Edit Report Status</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={selectedPost?.status || ''}
                                    label="Status"
                                    onChange={(e) => setSelectedPost({ ...selectedPost, status: e.target.value })}
                                >
                                    <MenuItem value="block">Block</MenuItem>
                                    <MenuItem value="normally">Normally</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
                            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>Save</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default ManageReportedPosts;