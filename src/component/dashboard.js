// Dashboard.jsx — fixed Drawer/menu implementation (use this file to replace the broken one)
import React, { useState, useEffect, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Grid, Drawer, List, ListItem, ListItemText,
  IconButton, CssBaseline, Paper, ListItemIcon, Divider
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import moment from 'moment';
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// animations & theme
const auroraShift = keyframes`
  0% { transform: translate3d(-10%, -10%, 0) scale(1); }
  50% { transform: translate3d(10%, 10%, 0) scale(1.06); }
  100% { transform: translate3d(-10%, -10%, 0) scale(1); }
`;
const float = keyframes`
  from { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  to { transform: translateY(0px); }
`;
const theme = createTheme({
  palette: {
    neutral: { 900:'#0F1115', 100:'#E5E7EB', 50:'#F5F7FB' },
    primary: { main:'#1B1F27', contrastText:'#FFFFFF' },
    pastel: { blue:'#DDEEFF', pink:'#FFE6F2', mint:'#E9FFF5', lemon:'#FFF9D9', lilac:'#F1E8FF' },
    background: { default:'#F5F7FB', paper:'#FFFFFF' },
    text: { primary:'#1B1F27', secondary:'#5B6170' }
  },
  typography: { fontFamily: ['Inter','Roboto','sans-serif'].join(',') }
});

const Backdrop = styled('div')(({ theme }) => ({
  position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0,
  background: `radial-gradient(1000px 500px at 15% -10%, ${alpha(theme.palette.pastel.blue,0.6)} 0%, transparent 60%),
               radial-gradient(900px 500px at 110% 30%, ${alpha(theme.palette.pastel.lilac,0.5)} 0%, transparent 65%),
               radial-gradient(900px 600px at 0% 100%, ${alpha(theme.palette.pastel.mint,0.45)} 0%, transparent 55%),
               ${theme.palette.background.default}`,
  pointerEvents: 'none'
}));
const Aurora = styled('div')(({ theme }) => ({
  position:'absolute', left:'-20%', top:'-20%', width:'140%', height:'140%',
  background: `conic-gradient(from 0deg, ${alpha(theme.palette.pastel.blue,0.9)}, ${alpha(theme.palette.pastel.pink,0.9)}, ${alpha(theme.palette.pastel.mint,0.9)}, ${alpha(theme.palette.pastel.lemon,0.9)}, ${alpha(theme.palette.pastel.lilac,0.9)}, ${alpha(theme.palette.pastel.blue,0.9)})`,
  filter:'blur(80px)', mixBlendMode:'multiply', animation:`${auroraShift} 30s ease-in-out infinite`
}));
const Particle = styled('span')(({ size=8, x=50, y=50, delay=0 }) => ({
  position:'absolute', left:`${x}%`, top:`${y}%`, width:size, height:size, borderRadius:999,
  background:'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.4))',
  boxShadow:`0 0 ${size * 1.4}px rgba(27,31,39,0.08)`, animation:`${float} ${6 + (size % 7)}s ease-in-out ${delay}s infinite`, opacity:0.9
}));
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background:'rgba(19,22,29,0.85)', backdropFilter:'blur(10px)', borderBottom:'1px solid rgba(255,255,255,0.06)', color:'#fff'
}));
const Card = styled(Paper)(() => ({
  position:'relative', overflow:'hidden', transition:'transform .35s ease, box-shadow .35s ease', '&:hover':{ transform:'translateY(-6px) scale(1.01)' }
}));

// makeChartOptions accepts xLabel and yLabel and positions them like image 2
const makeChartOptions = (theme, xLabel = '', yLabel = '') => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 700, easing: 'easeOutQuart' },
  plugins: {
    legend: { position: 'top', labels: { color: theme.palette.text.secondary, font: { family: theme.typography.fontFamily, size: 12 } } },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: theme.palette.text.primary,
      bodyColor: theme.palette.text.secondary,
      borderColor: 'rgba(0,0,0,0.08)',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || '';
          const value = context.parsed.y ?? 0;
          if (/revenue|amount|thb/i.test(label)) {
            return `${label}: ${new Intl.NumberFormat('th-TH', { style:'currency', currency:'THB', maximumFractionDigits:2 }).format(value)}`;
          }
          return `${label}: ${new Intl.NumberFormat('en-US', { maximumFractionDigits:0 }).format(value)}`;
        }
      }
    }
  },
  layout: { padding: { right: 12 } },
  scales: {
    x: {
      grid: { display: false },
      title: {
        display: !!xLabel,
        text: xLabel,
        color: theme.palette.text.secondary,
        font: { family: theme.typography.fontFamily, size: 12, weight: '700' },
        padding: { top: 12 },
        align: 'center'
      },
      ticks: { color: theme.palette.text.secondary, maxRotation: 0, autoSkip: true }
    },
    y: {
      grid: { color: 'rgba(27,31,39,0.06)' },
      title: {
        display: !!yLabel,
        text: yLabel,
        color: theme.palette.text.secondary,
        font: { family: theme.typography.fontFamily, size: 12, weight: '700' },
        padding: { right: 10 },
        align: 'center',
      },
      ticks: {
        color: theme.palette.text.secondary,
        callback: function(value) {
          if (Math.abs(value) >= 1000) return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
          return Number.isInteger(value) ? value : value.toFixed(2);
        }
      }
    }
  },
  barPercentage: 0.9,
  categoryPercentage: 0.6
});

// Dashboard component
const Dashboard = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Advertisements', path: '/manageadd', icon: <AddCircleIcon /> },
    { text: 'Manage Order', path: '/manageorder', icon: <ShoppingCartIcon /> },
    { text: 'Manage User', path: '/manageuser', icon: <PeopleIcon /> },
    { text: 'Manage Post', path: '/managepost', icon: <AssignmentIcon /> },
    { text: 'Report posts', path: '/manage-reported-posts', icon: <ReportProblemIcon /> },
    { text: 'Manage Categories', path: '/managecategories', icon: <CategoryIcon /> },
  ];

  const ALL_CATEGORIES = ['Electronics & Gadgets','Furniture','Outdoor Gear','Beauty Products','Accessories'];

  useEffect(() => { if (!isAdmin()) navigate('/login'); }, [isAdmin, navigate]);

  const [newUsersData, setNewUsersData] = useState([]);
  const [totalPostsData, setTotalPostsData] = useState([]);
  const [categoryPopularityData, setCategoryPopularityData] = useState([]);
  const [ageInterestData, setAgeInterestData] = useState([]);
  const [revenueDailyData, setRevenueDailyData] = useState([]);
  const [revenueMonthlyData, setRevenueMonthlyData] = useState([]);
  const [packageUsageData, setPackageUsageData] = useState([]);
  const [adsMonthlyData, setAdsMonthlyData] = useState([]);   // monthly ads

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin()) return;
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/dashboard?days=30`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNewUsersData(res.data.new_users_per_month || []);
        setTotalPostsData(res.data.total_posts_per_month || []);
        setCategoryPopularityData(res.data.category_popularity || []);
        setAgeInterestData(res.data.age_interest || []);
        setRevenueDailyData(res.data.revenue_daily || []);
        setRevenueMonthlyData(res.data.revenue_monthly || []);
        setPackageUsageData(res.data.package_usage || []);
        setAdsMonthlyData(res.data.ads_monthly || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (err?.response?.status === 401) { handleLogout(); navigate('/login'); }
      }
    };
    fetchData();
  }, [handleLogout, isAdmin, navigate]);

  // datasets
  const newUserChartData = useMemo(() => ({
    labels: newUsersData.map(d => moment(d.month_year).format('MM/YYYY')),
    datasets: [{ label: 'New Users', data: newUsersData.map(d => d.new_users), backgroundColor: '#DDEEFF', borderColor: '#B8D3FF', borderWidth: 1, borderRadius: 10 }]
  }), [newUsersData]);

  const totalPostChartData = useMemo(() => ({
    labels: totalPostsData.map(d => moment(d.month_year).format('MM/YYYY')),
    datasets: [{ label: 'Total Posts', data: totalPostsData.map(d => d.total_posts), backgroundColor: '#FFE6F2', borderColor: '#FFC7E1', borderWidth: 1, borderRadius: 10 }]
  }), [totalPostsData]);

  const categoryPopularityChartData = useMemo(() => ({
    labels: ALL_CATEGORIES,
    datasets: [
      { label:'Total Engagement', data: ALL_CATEGORIES.map(cat => { const f = categoryPopularityData.find(x => x.CategoryName === cat); return f ? Number(f.TotalEngagement) : 0; }), backgroundColor:'#E9FFF5', borderColor:'#C9F5E5', borderRadius:10 },
      { label:'Male Engagement', data: ALL_CATEGORIES.map(cat => { const f = categoryPopularityData.find(x => x.CategoryName === cat); return f ? Number(f.MaleEngagement) : 0; }), backgroundColor:'#DDEEFF', borderColor:'#B8D3FF', borderRadius:10 },
      { label:'Female Engagement', data: ALL_CATEGORIES.map(cat => { const f = categoryPopularityData.find(x => x.CategoryName === cat); return f ? Number(f.FemaleEngagement) : 0; }), backgroundColor:'#FFE6F2', borderColor:'#FFC7E1', borderRadius:10 },
      { label:'Other Engagement', data: ALL_CATEGORIES.map(cat => { const f = categoryPopularityData.find(x => x.CategoryName === cat); return f ? Number(f.OtherEngagement) : 0; }), backgroundColor:'#E5E7EB', borderColor:'#D1D5DB', borderRadius:10 }
    ]
  }), [categoryPopularityData]);

  const ageInterestChartData = useMemo(() => ({
    labels: ALL_CATEGORIES,
    datasets: [
      { label:'18-25', data: ALL_CATEGORIES.map(cat => { const f = ageInterestData.find(x => x.CategoryName === cat && x.AgeGroup === '18-25'); return f ? Number(f.TotalEngagement) : 0; }), backgroundColor:'rgba(181,208,255,0.8)', borderColor:'rgba(151,186,246,1)', borderRadius:10 },
      { label:'26-35', data: ALL_CATEGORIES.map(cat => { const f = ageInterestData.find(x => x.CategoryName === cat && x.AgeGroup === '26-35'); return f ? Number(f.TotalEngagement) : 0; }), backgroundColor:'rgba(255,198,221,0.8)', borderColor:'rgba(248,172,204,1)', borderRadius:10 },
      { label:'36+', data: ALL_CATEGORIES.map(cat => { const f = ageInterestData.find(x => x.CategoryName === cat && x.AgeGroup === '36+'); return f ? Number(f.TotalEngagement) : 0; }), backgroundColor:'rgba(201,245,229,0.8)', borderColor:'rgba(171,232,212,1)', borderRadius:10 },
      { label:'Other', data: ALL_CATEGORIES.map(cat => { const f = ageInterestData.find(x => x.CategoryName === cat && x.AgeGroup === 'Other'); return f ? Number(f.TotalEngagement) : 0; }), backgroundColor:'rgba(229,231,235,0.9)', borderColor:'rgba(209,213,219,1)', borderRadius:10 }
    ]
  }), [ageInterestData]);

  const revenueDailyChartData = useMemo(() => ({
    labels: revenueDailyData.map(r => moment(r.date).format('DD/MM')),
    datasets: [
      { label:'Revenue (THB)', data: revenueDailyData.map(r => parseFloat(r.total_amount || 0)), backgroundColor:'#C9F5E5', borderColor:'#9AEBCD', borderRadius:8 },
      { label:'Orders Count', data: revenueDailyData.map(r => parseInt(r.orders_count || 0,10)), backgroundColor:'#DDEEFF', borderColor:'#B8D3FF', borderRadius:8 }
    ]
  }), [revenueDailyData]);

  const revenueMonthlyChartData = useMemo(() => ({
    labels: revenueMonthlyData.map(r => moment(r.month_year + '-01').format('MM/YYYY')),
    datasets: [
      { label:'Revenue (THB)', data: revenueMonthlyData.map(r => parseFloat(r.total_amount || 0)), backgroundColor:'#FFE6F2', borderColor:'#FFC7E1', borderRadius:8 },
      { label:'Orders Count', data: revenueMonthlyData.map(r => parseInt(r.orders_count || 0,10)), backgroundColor:'#E9FFF5', borderColor:'#C9F5E5', borderRadius:8 }
    ]
  }), [revenueMonthlyData]);

  // Popular Package: filter out package_id == null
  const packageUsageChartData = useMemo(() => {
    const filtered = (packageUsageData || []).filter(p => p.package_id !== null && p.package_id !== undefined);
    return {
      labels: filtered.map(p => p.name || `Package ${p.package_id}`),
      datasets: [
        { label:'Orders Count', data: filtered.map(p => parseInt(p.orders_count || 0,10)), backgroundColor:'#DDEEFF', borderColor:'#B8D3FF', borderRadius:8 },
        { label:'Total Amount (THB)', data: filtered.map(p => parseFloat(p.total_amount || 0)), backgroundColor:'#E9FFF5', borderColor:'#C9F5E5', borderRadius:8 }
      ]
    };
  }, [packageUsageData]);

  // Ads monthly charts (keep)
  const adsMonthlyChartData = useMemo(() => ({
    labels: adsMonthlyData.map(a => moment(a.month_year + '-01').format('MM/YYYY')),
    datasets: [
      { label: 'Ads Count', data: adsMonthlyData.map(a => parseInt(a.ads_count || 0, 10)), backgroundColor: '#FFF4D9', borderColor: '#FFE7A8', borderRadius: 8 }
    ]
  }), [adsMonthlyData]);

  // axis label mapping (text only, no X =, no parentheses)
  const axisLabels = {
    newUsers: { x: 'เดือน', y: 'จำนวนผู้ใช้' },
    totalPosts: { x: 'เดือน', y: 'จำนวนโพสต์' },
    categoryPop: { x: 'หมวดหมู่', y: 'จำนวนการมีส่วนร่วม' },
    ageEng: { x: 'หมวดหมู่', y: 'จำนวนการมีส่วนร่วม' },
    revDaily: { x: 'วันที่', y: 'ยอดรวม (บาท)' },
    revMonth: { x: 'เดือน', y: 'ยอดรวม (บาท)' },
    pkgUsage: { x: 'ชื่อแพ็กเกจ', y: 'จำนวนคำสั่งซื้อ / ยอดรวม (บาท)' },
    adsMonth: { x: 'เดือน', y: 'จำนวนโฆษณา' }
  };

  const cards = [
    { key:'newUsers', title:'New Users Overview', data:newUserChartData },
    { key:'totalPosts', title:'Total Posts Overview', data:totalPostChartData },
    { key:'categoryPop', title:'Category Popularity', data:categoryPopularityChartData },
    { key:'ageEng', title:'Total Engagement by Age', data:ageInterestChartData },
    { key:'revDaily', title:'Revenue (Last 30 days)', data:revenueDailyChartData },
    { key:'revMonth', title:'Revenue by Month', data:revenueMonthlyChartData },
    { key:'pkgUsage', title:'Popular Package', data:packageUsageChartData },
    { key:'adsMonth', title:'Ads Posted by Month', data:adsMonthlyChartData }
  ];

  if (!isAdmin()) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display:'grid', placeItems:'center', minHeight:'100vh' }}>
          <Paper sx={{ p:5, textAlign:'center' }}>
            <Typography variant="h5">Access Denied</Typography>
            <Typography variant="body2" sx={{ mb:3 }}>You are not authorized to view this page.</Typography>
            <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Backdrop><Aurora />
        {[{size:6,x:12,y:22,delay:0.2},{size:10,x:28,y:66,delay:0.4},{size:8,x:70,y:28,delay:0.1},
          {size:12,x:84,y:58,delay:0.5},{size:9,x:45,y:40,delay:0.3}].map((p,i)=>(<Particle key={i} {...p}/>))}
      </Backdrop>

      <GlassAppBar position="fixed" elevation={0} sx={{ zIndex:10 }}>
        <Toolbar sx={{ gap:1 }}>
          <IconButton edge="start" color="inherit" onClick={() => setIsDrawerOpen(true)} aria-label="menu"><MenuIcon/></IconButton>
          <Typography variant="h6" sx={{ flexGrow:1, fontWeight:800 }}>Dashboard</Typography>
          <Button variant="contained" color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon/>} sx={{ bgcolor:'#fff', color:theme.palette.neutral[900] }}>Logout</Button>
        </Toolbar>
      </GlassAppBar>

      <Box component="main" sx={{ position:'relative', zIndex:1, px:{xs:2, md:4}, pt:{xs:11, md:12}, pb:6, maxWidth:1280, mx:'auto' }}>
        <Box sx={{ textAlign:'center', mt:{xs:2, md:6}, mb:{xs:4, md:7} }}>
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <Typography component="h1" sx={{ fontWeight:900, fontSize:{ xs:'2.4rem', md:'4rem' } }}>Welcome, Admin!</Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3.2}>
          {cards.map((card, i) => {
            const labels = axisLabels[card.key] || { x:'', y:'' };
            return (
              <Grid item xs={12} md={6} key={card.key}>
                <motion.div initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay: i*0.04 }}>
                  <Card sx={{ height: 440, p:2.2 }}>
                    <Box sx={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', mb:0.8 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight:800 }}>{card.title}</Typography>
                        <Typography variant="caption" sx={{ color:theme.palette.text.secondary, display:'block', mt:0.6 }}>
                          {labels.x} / {labels.y}
                        </Typography>
                      </Box>
                      <Box sx={{ px:1.5, py:.5, borderRadius:999, fontSize:12, color:theme.palette.neutral[900], fontWeight:800, background:theme.palette.pastel.lemon }}>Live</Box>
                    </Box>
                    <Box sx={{ position:'relative', height:360, mt:1 }}>
                      <Bar data={card.data} options={makeChartOptions(theme, labels.x, labels.y)} />
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Drawer: implemented like ManagePosts (fixed styling/behavior) */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ width:280, background:'linear-gradient(180deg, rgba(19,22,29,0.96), rgba(19,22,29,0.92))', color:'#fff', height:'100%' }}
             role="presentation" onClick={() => setIsDrawerOpen(false)}>
          <Box sx={{ p:2.5 }}>
            <Typography sx={{ fontWeight:800, letterSpacing:'.06em' }}>MENU</Typography>
          </Box>
          <Divider sx={{ borderColor:'rgba(255,255,255,0.08)' }} />
          <List>
            {menuItems.map(m => (
              <ListItem
                key={m.text}
                component={Link}
                to={m.path}
                selected={location.pathname === m.path}
                sx={{
                  mx:1.2, my:0.6, color:'#fff',
                  '& .MuiListItemIcon-root': { color:'#fff', minWidth:36 },
                  '&.Mui-selected': { background: alpha('#fff', 0.08) },
                  '&:hover': { background: alpha('#fff', 0.12) }
                }}
              >
                <ListItemIcon>{m.icon}</ListItemIcon>
                <ListItemText primary={m.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Dashboard;
