// src/pages/ManagePosts.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, CssBaseline, Drawer, List, ListItem, ListItemText,
  ListItemIcon, Divider, FormControl, InputLabel, Select, MenuItem,
  Chip, Tooltip
} from '@mui/material';
import { ThemeProvider, createTheme, styled, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CategoryIcon from '@mui/icons-material/Category';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../AuthContext';

/* ===== theme / styles ของคุณ (เดิม) ===== */
const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const auroraShift = keyframes`0%{transform:translate3d(-10%,-10%,0) scale(1)}50%{transform:translate3d(10%,10%,0) scale(1.06)}100%{transform:translate3d(-10%,-10%,0) scale(1)}`;
const float = keyframes`0%{transform:translateY(0)}50%{transform:translateY(-12px)}100%{transform:translateY(0)}`;

const theme = createTheme({
  palette: {
    neutral: {900:'#0F1115',800:'#13161D',700:'#1B1F27',600:'#2A2F3A',500:'#3A4150',400:'#6B7280',300:'#9CA3AF',200:'#D1D5DB',100:'#E5E7EB',50:'#F5F7FB'},
    pastel: { blue:'#DDEEFF', pink:'#FFE6F2', mint:'#E9FFF5', lemon:'#FFF9D9', lilac:'#F1E8FF' },
    primary: { main:'#1B1F27', contrastText:'#fff' }, background: { default:'#F5F7FB', paper:'#FFFFFF' },
    text: { primary:'#1B1F27', secondary:'#5B6170' }, divider:'rgba(27,31,39,0.08)'
  },
  typography: {
    fontFamily: ['Inter','system-ui','Segoe UI','Roboto','sans-serif'].join(','),
    h2:{ fontWeight:900, fontSize:'3.8rem', letterSpacing:'-0.02em' }, button:{ textTransform:'none', fontWeight:700 }
  },
  components:{ MuiAppBar:{ styleOverrides:{ root:{ background:'rgba(19,22,29,0.88)', backdropFilter:'blur(10px)', borderBottom:'1px solid rgba(255,255,255,0.06)', boxShadow:'0 12px 28px rgba(15,17,21,0.18)' } } },
              MuiTableCell:{ styleOverrides:{ head:{ fontWeight:800, background:'#fff', whiteSpace:'nowrap' } } } }
});
const Backdrop = styled('div')(({ theme }) => ({ position:'fixed', inset:0, overflow:'hidden', zIndex:0, background:
 `radial-gradient(1000px 500px at 15% -10%, ${alpha(theme.palette.pastel.blue,0.6)} 0%, transparent 60%),
  radial-gradient(900px 500px at 110% 30%, ${alpha(theme.palette.pastel.lilac,0.5)} 0%, transparent 65%),
  radial-gradient(900px 600px at 0% 100%, ${alpha(theme.palette.pastel.mint,0.45)} 0%, transparent 55%),
  ${theme.palette.background.default}` }));
const Aurora = styled('div')(({ theme }) => ({ position:'absolute', left:'-20%', top:'-20%', width:'140%', height:'140%',
  background:`conic-gradient(from 0deg,${alpha(theme.palette.pastel.blue,0.9)},${alpha(theme.palette.pastel.pink,0.9)},${alpha(theme.palette.pastel.mint,0.9)},${alpha(theme.palette.pastel.lemon,0.9)},${alpha(theme.palette.pastel.lilac,0.9)},${alpha(theme.palette.pastel.blue,0.9)})`,
  filter:'blur(80px)', mixBlendMode:'multiply', animation:`${auroraShift} 30s ease-in-out infinite`, opacity:1 }));
const Particle = styled('span')(({ size=8, x=50, y=50, delay=0 }) => ({ position:'absolute', left:`${x}%`, top:`${y}%`, width:size, height:size, borderRadius:999,
  background:'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.4))', boxShadow:`0 0 ${size*1.4}px rgba(27,31,39,0.08)`,
  animation:`${float} ${6+(size%7)}s ease-in-out ${delay}s infinite`, opacity:0.9 }));

const TableShell = styled(TableContainer)(({ theme }) => ({ animation:`${fadeIn} .5s ease-out`, width:'100%', maxWidth:'100%', margin:'0 auto', overflowX:{ xs:'auto', lg:'visible' } }));
const HoverRow = styled(TableRow)(({ theme }) => ({ transition:'transform .18s ease, background .18s ease', '&:hover':{ background: alpha(theme.palette.pastel.blue,.28) } }));
const PastelIconBtn = ({ color, children, ...props }) => (<IconButton {...props} sx={{ width:36, height:36, bgcolor: theme.palette.pastel[color] || theme.palette.pastel.blue, '&:hover':{ bgcolor: alpha(theme.palette.pastel[color] || theme.palette.pastel.blue,.85) } }}>{children}</IconButton>);
const StatusChip = ({ value }) => { const v = String(value || '').toLowerCase(); const map = { active:{bg:theme.palette.pastel.mint,label:'active'}, deactive:{bg:theme.palette.pastel.pink,label:'deactive'} };
  const s = map[v] || { bg: theme.palette.neutral[100], label: v || 'N/A' }; return <Chip size="small" label={s.label} sx={{ bgcolor:s.bg, fontWeight:800, borderRadius:999, height:26, color:theme.palette.neutral[900] }} />; };
const clamp2 = { display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', wordBreak:'break-word', lineHeight:1.45, maxHeight:'2.9em' };
const oneLine = { whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'block' };
const MAX_VISIBLE_THUMBS = 2;

// join base + /api (กัน /api/api)
const apiJoin = (p) => {
  const base = (process.env.REACT_APP_BASE_URL || '').replace(/\/+$/,'');
  const hasApi = /\/api$/.test(base);
  return `${base}${hasApi ? '' : '/api'}/${String(p).replace(/^\/+/, '')}`;
};

const ManagePosts = () => {
  const { handleLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // รูป
  const [newFiles, setNewFiles] = useState([]);          // ไฟล์ใหม่
  const [removed, setRemoved] = useState([]);            // path ที่ติ๊กลบ
  const [clearAll, setClearAll] = useState(false);       // ล้างทุกภาพ

  // fetch
  useEffect(() => { if (!isAdmin()) navigate('/login'); }, [isAdmin, navigate]);
  const fetchPosts = useCallback(async (q='') => {
    const token = localStorage.getItem('token');
    const url = q ? apiJoin(`admin/search/posts?q=${encodeURIComponent(q)}`) : apiJoin('admin/posts');
    const res = await axios.get(url, { headers:{ Authorization:`Bearer ${token}` } });
    setPosts(Array.isArray(res.data) ? res.data : (res.data?.results || []));
  }, []);
  useEffect(() => { const t = setTimeout(()=>setCurrentSearchTerm(searchQuery), 300); return ()=>clearTimeout(t); }, [searchQuery]);
  useEffect(() => { fetchPosts(currentSearchTerm); }, [currentSearchTerm, fetchPosts]);

  const handleEdit = (post) => { setSelectedPost(post); setNewFiles([]); setRemoved([]); setClearAll(false); setOpenEdit(true); };
  const handleCloseEdit = () => { setOpenEdit(false); setNewFiles([]); setRemoved([]); setClearAll(false); };

  // upload -> return paths
  const uploadNewFiles = async () => {
    if (!newFiles.length) return [];
    const token = localStorage.getItem('token');
    const fd = new FormData();
    newFiles.forEach(f => fd.append('images', f));
    const res = await axios.post(apiJoin('admin/uploads'), fd, {
      headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'multipart/form-data' }
    });
    
    return res.data?.paths || [];
  };

  const handleSave = async () => {
    if (!selectedPost) return;
    const token = localStorage.getItem('token');
  
    // 1) อัปโหลดไฟล์ใหม่ → ได้ paths
    const uploadedPaths = await uploadNewFiles();
  
    // 2) คำนวณ photo_url ใหม่
    const original = Array.isArray(selectedPost.photo_url) ? selectedPost.photo_url : [];
    const kept = clearAll ? [] : original.filter(p => !removed.includes(p));
    const next = Array.from(new Set([...kept, ...uploadedPaths]));
  
    // 3) สร้าง payload ชัดเจน (ส่ง photo_url เป็น array เสมอ)
    const payload = {
      Title: selectedPost.Title ?? '',
      content: selectedPost.content ?? '',
      status: selectedPost.status ?? '',
      ProductName: selectedPost.ProductName ?? '',
      photo_url: next
    };
  
    await axios.put(
      apiJoin(`admin/posts/${selectedPost.id}`),
      payload,
      { headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' } }
    );
  
    handleCloseEdit();
    fetchPosts(currentSearchTerm);
  };
  

  const executeDelete = async () => {
    const token = localStorage.getItem('token');
    setOpenConfirm(false);
    await axios.delete(apiJoin(`admin/posts/${deleteId}`), { headers:{ Authorization:`Bearer ${token}` } });
    setDeleteId(null); fetchPosts(currentSearchTerm);
  };

  const openAllImages = (imgs=[]) => {
    if (!imgs.length) return;
    const urls = imgs.map(u => `${process.env.REACT_APP_BASE_URL}${u}`);
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Images</title>
      <style>body{margin:0;padding:24px;font-family:Inter,system-ui,sans-serif;background:#F5F7FB}
      .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px}
      img{width:100%;height:320px;object-fit:contain;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.08)}</style>
      </head><body><h2>Post images (${urls.length})</h2><div class="grid">` +
      urls.map(u=>`<a href="${u}" target="_blank" rel="noopener"><img src="${u}"/></a>`).join('') + `</div></body></html>`;
    const w = window.open('about:blank','_blank'); if (w) { w.document.open(); w.document.write(html); w.document.close(); }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Backdrop><Aurora />{[{size:6,x:12,y:22,delay:.2},{size:10,x:28,y:66,delay:.4},{size:8,x:70,y:28,delay:.1},{size:12,x:84,y:58,delay:.5},{size:9,x:45,y:40,delay:.3},{size:7,x:60,y:75,delay:.2}].map((p,i)=><Particle key={i}{...p}/>)}</Backdrop>

      <AppBar position="fixed">
        <Toolbar sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
            <IconButton edge="start" color="inherit" onClick={()=>setIsDrawerOpen(true)} sx={{ mr:1 }}><MenuIcon/></IconButton>
            <Typography variant="h6" sx={{ fontWeight:800 }}>Manage Posts</Typography>
          </Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:2, ml:'auto' }}>
            <TextField variant="outlined" size="small" placeholder="Search posts..."
              value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
              InputProps={{ startAdornment:<SearchIcon sx={{ mr:1, color:'action.active' }}/> }}
              sx={{ width:{ xs:220, sm:320 }, '& .MuiOutlinedInput-root':{ borderRadius:'999px', bgcolor:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,0.08)' } }} />
            <Button color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon/>}
              sx={{ bgcolor:'#fff', color:'text.primary', borderRadius:1, px:2, '&:hover':{ bgcolor:'neutral.100' } }}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}>
        <Box sx={{ width:280, background:'linear-gradient(180deg, rgba(19,22,29,0.96), rgba(19,22,29,0.92))', color:'#fff', height:'100%' }} role="presentation" onClick={()=>setIsDrawerOpen(false)}>
          <Box sx={{ p:2.5 }}><Typography sx={{ fontWeight:800, letterSpacing:'.06em' }}>MENU</Typography></Box>
          <Divider sx={{ borderColor:'rgba(255,255,255,0.08)' }} />
          <List>
            {[{ text:'Dashboard', path:'/dashboard', icon:<DashboardIcon/> },
              { text:'Manage Advertisements', path:'/manageadd', icon:<AddCircleIcon/> },
              { text:'Manage Order', path:'/manageorder', icon:<ShoppingCartIcon/> },
              { text:'Manage User', path:'/manageuser', icon:<PeopleIcon/> },
              { text:'Manage Post', path:'/managepost', icon:<AssignmentIcon/> },
              { text:'Report posts', path:'/manage-reported-posts', icon:<ReportProblemIcon/> },
              { text:'Manage Categories', path:'/managecategories', icon:<CategoryIcon/> }]
              .map(m=>(
                <ListItem key={m.text} component={Link} to={m.path}
                  selected={location.pathname===m.path}
                  sx={{ mx:1.2, my:0.6, color:'#fff',
                        '& .MuiListItemIcon-root':{ color:'#fff', minWidth:36 },
                        '&.Mui-selected':{ background: alpha('#fff',0.08) },
                        '&:hover':{ background: alpha('#fff',0.12) }}}>
                  <ListItemIcon>{m.icon}</ListItemIcon>
                  <ListItemText primary={m.text} />
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ position:'relative', zIndex:1, px:{ xs:2, md:4 }, pt:{ xs:12, md:14 }, pb:6, maxWidth:1600, mx:'auto' }}>
        <Box sx={{ textAlign:'center', mb:4 }}><Typography variant="h2">Manage Posts</Typography></Box>

        <TableShell component={Paper}>
          <Table stickyHeader sx={{ tableLayout:'fixed', width:'100%' }}>
            <colgroup>
              <col style={{ width: '7%' }} /><col style={{ width: '15%' }} /><col style={{ width: '15%' }} />
              <col style={{ width: '30%' }} /><col style={{ width: '15%' }} /><col style={{ width: '6%' }} /><col style={{ width: '8%' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell><TableCell>Image</TableCell><TableCell>Title</TableCell>
                <TableCell>Content</TableCell><TableCell>Product Name</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center">No posts found.</TableCell></TableRow>
              ) : posts.map(post => {
                const imgs = Array.isArray(post.photo_url) ? post.photo_url : [];
                const hidden = Math.max(0, imgs.length - MAX_VISIBLE_THUMBS);
                return (
                  <HoverRow key={post.id}>
                    <TableCell><Box sx={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{post.id}</Box></TableCell>
                    <TableCell>
                      <Box sx={{ display:'flex', alignItems:'center', gap:1, overflow:'hidden' }}>
                        {imgs.slice(0, MAX_VISIBLE_THUMBS).map((u,i)=>(
                          <a key={i} href={`${process.env.REACT_APP_BASE_URL}${u}`} target="_blank" rel="noopener noreferrer">
                            <img src={`${process.env.REACT_APP_BASE_URL}${u}`} alt={`Post ${post.Title}`} style={{ width:72, height:72, objectFit:'cover', borderRadius:8 }} />
                          </a>
                        ))}
                        {hidden > 0 && (
                          <Chip size="small" clickable label={`+${hidden}`} onClick={()=>openAllImages(imgs)} sx={{ bgcolor:theme.palette.pastel.lemon, fontWeight:700 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell><Tooltip title={post.Title || ''} arrow><span style={oneLine}>{post.Title}</span></Tooltip></TableCell>
                    <TableCell><Tooltip title={post.content || ''} arrow><span style={clamp2}>{post.content}</span></Tooltip></TableCell>
                    <TableCell><Tooltip title={post.ProductName || ''} arrow><span style={clamp2}>{post.ProductName}</span></Tooltip></TableCell>
                    <TableCell><StatusChip value={post.status} /></TableCell>
                    <TableCell>
                      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                        <PastelIconBtn color="blue" onClick={()=>handleEdit(post)}><EditIcon/></PastelIconBtn>
                        <PastelIconBtn color="pink" onClick={()=>{ setDeleteId(post.id); setOpenConfirm(true); }}><DeleteIcon/></PastelIconBtn>
                      </Box>
                    </TableCell>
                  </HoverRow>
                );
              })}
            </TableBody>
          </Table>
        </TableShell>
      </Box>

      {/* Edit dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} PaperProps={{ sx:{ p:0.5, minWidth:520 }}}>
        <DialogTitle sx={{ fontWeight:800 }}>Edit Post</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth margin="dense" label="Title" value={selectedPost?.Title || ''} onChange={e=>setSelectedPost({ ...selectedPost, Title:e.target.value })} sx={{ mb:2 }} />
          <TextField fullWidth margin="dense" label="Content" value={selectedPost?.content || ''} onChange={e=>setSelectedPost({ ...selectedPost, content:e.target.value })} multiline rows={4} sx={{ mb:2 }} />
          <TextField fullWidth margin="dense" label="Product Name" value={selectedPost?.ProductName || ''} onChange={e=>setSelectedPost({ ...selectedPost, ProductName:e.target.value })} sx={{ mb:2 }} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={selectedPost?.status || ''} onChange={e=>setSelectedPost({ ...selectedPost, status:e.target.value })}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="deactive">Deactive</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mt:2, mb:1 }}>
            {(Array.isArray(selectedPost?.photo_url) && selectedPost.photo_url.length>0 && !clearAll) && (
              <Button variant="outlined" color="error" startIcon={<DeleteIcon/>} onClick={()=>{ setRemoved([]); setClearAll(true); }}>
                Clear All Images
              </Button>
            )}
            <input id="post-new-files" type="file" accept="image/*" multiple style={{ display:'none' }}
              onChange={(e)=>{
                const incoming = Array.from(e.target.files || []);
                setNewFiles(prev => {
                  const key = f => `${f.name}-${f.size}-${f.lastModified}`;
                  const map = new Map();
                  [...prev, ...incoming].forEach(f => map.set(key(f), f));
                  return Array.from(map.values());
                });
                e.target.value = '';
              }}/>
            <label htmlFor="post-new-files">
              <Button variant="outlined" startIcon={<AddCircleIcon/>} component="span">Upload Images</Button>
            </label>
            {newFiles.length>0 && (
              <Button variant="text" color="secondary" onClick={()=>setNewFiles([])}>
                Clear selected ({newFiles.length})
              </Button>
            )}
          </Box>

          {!clearAll && (
            <Box sx={{ display:'flex', gap:1, flexWrap:'wrap', mb:1 }}>
              {(Array.isArray(selectedPost?.photo_url) ? selectedPost.photo_url : []).map((u,i)=>{
                const isRemoved = removed.includes(u);
                return (
                  <Box key={u} sx={{ position:'relative' }}>
                    <img src={`${process.env.REACT_APP_BASE_URL}${u}`} alt={`old-${i}`} style={{ width:92, height:92, objectFit:'cover', borderRadius:8, filter:isRemoved?'grayscale(100%) opacity(.5)':'none' }} />
                    <IconButton size="small" onClick={()=>setRemoved(prev => prev.includes(u)? prev.filter(x=>x!==u): [...prev, u])}
                      sx={{ position:'absolute', top:-8, right:-8, bgcolor:'rgba(0,0,0,0.6)', color:'#fff', '&:hover':{ bgcolor:'rgba(0,0,0,0.8)' } }}>
                      {isRemoved ? '↩' : <CloseIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          )}

          {newFiles.length>0 && (
            <Box sx={{ display:'flex', gap:1, flexWrap:'wrap' }}>
              {newFiles.map((f, i)=>(
                <Box key={`${f.name}-${i}`} sx={{ position:'relative' }}>
                  <img src={URL.createObjectURL(f)} alt={`new-${i}`} style={{ width:92, height:92, objectFit:'cover', borderRadius:8 }} />
                  <IconButton size="small" onClick={()=>setNewFiles(prev => prev.filter((_,idx)=>idx!==i))}
                    sx={{ position:'absolute', top:-8, right:-8, bgcolor:'rgba(0,0,0,0.6)', color:'#fff', '&:hover':{ bgcolor:'rgba(0,0,0,0.8)' } }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={()=>setOpenConfirm(false)}>
        <DialogTitle sx={{ fontWeight:800 }}>Confirm Deletion</DialogTitle>
        <DialogContent dividers><Typography>Are you sure you want to delete this post? This action cannot be undone.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={executeDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ManagePosts;
