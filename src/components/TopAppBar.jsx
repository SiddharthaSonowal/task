import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HomeIcon from '@mui/icons-material/Home';
import TaskFormDialog from './TaskFormDialog';

const TopAppBar = ({ 
  filterCategory, 
  setFilterCategory, 
  filterStatus, 
  setFilterStatus, 
  sortBy, 
  setSortBy 
}) => {
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const categories = useSelector(state => state.tasks.categories);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleHomeClick = () => {
    // Reset all filters and sorting to default values
    setFilterCategory('all');
    setFilterStatus('all');
    setSortBy('dueDate');
    // Close drawer if open
    if (drawerOpen) {
      setDrawerOpen(false);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const filterDrawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItemButton disabled>
          <ListItemIcon>
            <FilterListIcon />
          </ListItemIcon>
          <ListItemText primary="Filters & Sorting" />
        </ListItemButton>
      </List>
      
      <Divider />
      
      <List>
        <ListItemButton onClick={handleHomeClick}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </List>
      
      <Divider />
      
      <List>
        <ListItemButton disabled>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Category" />
        </ListItemButton>
        
        <ListItemButton 
          selected={filterCategory === 'all'}
          onClick={() => setFilterCategory('all')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="All" />
        </ListItemButton>
        
        {categories.map(category => (
          <ListItemButton 
            key={category}
            selected={filterCategory === category}
            onClick={() => setFilterCategory(category)}
            sx={{ pl: 4 }}
          >
            <ListItemText 
              primary={category.charAt(0).toUpperCase() + category.slice(1)} 
            />
          </ListItemButton>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItemButton disabled>
          <ListItemIcon>
            <AssignmentTurnedInIcon />
          </ListItemIcon>
          <ListItemText primary="Status" />
        </ListItemButton>
        
        <ListItemButton 
          selected={filterStatus === 'all'}
          onClick={() => setFilterStatus('all')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="All" />
        </ListItemButton>
        
        <ListItemButton 
          selected={filterStatus === 'active'}
          onClick={() => setFilterStatus('active')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="Active" />
        </ListItemButton>
        
        <ListItemButton 
          selected={filterStatus === 'completed'}
          onClick={() => setFilterStatus('completed')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="Completed" />
        </ListItemButton>
      </List>
      
      <Divider />
      
      <List>
        <ListItemButton disabled>
          <ListItemIcon>
            <SortIcon />
          </ListItemIcon>
          <ListItemText primary="Sort By" />
        </ListItemButton>
        
        <ListItemButton 
          selected={sortBy === 'dueDate'}
          onClick={() => setSortBy('dueDate')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="Due Date" />
        </ListItemButton>
        
        <ListItemButton 
          selected={sortBy === 'startDate'}
          onClick={() => setSortBy('startDate')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="Start Date" />
        </ListItemButton>
        
        <ListItemButton 
          selected={sortBy === 'priority'}
          onClick={() => setSortBy('priority')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="Priority" />
        </ListItemButton>
        
        <ListItemButton 
          selected={sortBy === 'progress'}
          onClick={() => setSortBy('progress')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="Progress" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={handleHomeClick}
          >
            <HomeIcon sx={{ mr: 1 }} />
            Task Manager
          </Typography>
          
          {isMobile ? (
            // Mobile view - menu button
            <Box>
              <IconButton 
                color="inherit" 
                edge="end" 
                onClick={toggleDrawer(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              
              <IconButton 
                color="inherit" 
                edge="end" 
                onClick={() => setOpenTaskForm(true)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          ) : (
            // Desktop view - visible filters and controls
            <>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="all">All</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="dueDate">Due Date</MenuItem>
                    <MenuItem value="startDate">Start Date</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                    <MenuItem value="progress">Progress</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<AddIcon />}
                onClick={() => setOpenTaskForm(true)}
                sx={{ ml: 1 }}
              >
                Add Task
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Drawer for mobile view */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {filterDrawer}
      </Drawer>
      
      <TaskFormDialog open={openTaskForm} onClose={() => setOpenTaskForm(false)} />
    </>
  );
};

export default TopAppBar; 