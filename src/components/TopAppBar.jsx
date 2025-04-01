import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel,
  Select, 
  MenuItem, 
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  Menu as MenuIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Category as CategoryIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import TaskFormDialog from './TaskFormDialog';
import { categoryColors, priorityColors } from '../store/tasksSlice';

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
  const priorities = useSelector(state => state.tasks.priorities);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleHomeClick = () => {
    setFilterCategory('all');
    setFilterStatus('all');
    setSortBy('dueDate');
    if (drawerOpen) setDrawerOpen(false);
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
          <ListItemText primary="ALL" />
        </ListItemButton>
        
        {categories.map(category => (
          <ListItemButton 
            key={category}
            selected={filterCategory === category}
            onClick={() => setFilterCategory(category)}
            sx={{ pl: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{
                width: 10,
                height: 10,
                backgroundColor: categoryColors[category] || categoryColors.default,
                borderRadius: '50%',
                mr: 2
              }} />
              <ListItemText 
                primary={category.toUpperCase()}
                sx={{ color: categoryColors[category] || categoryColors.default }}
              />
            </Box>
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
          <ListItemText primary="ALL" />
        </ListItemButton>
        
        <ListItemButton 
          selected={filterStatus === 'active'}
          onClick={() => setFilterStatus('active')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="ACTIVE" />
        </ListItemButton>
        
        <ListItemButton 
          selected={filterStatus === 'completed'}
          onClick={() => setFilterStatus('completed')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="COMPLETED" />
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
          <ListItemText primary="DUE DATE" />
        </ListItemButton>
        
        <ListItemButton 
          selected={sortBy === 'startDate'}
          onClick={() => setSortBy('startDate')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="START DATE" />
        </ListItemButton>
        
        <ListItemButton 
          selected={sortBy === 'priority'}
          onClick={() => setSortBy('priority')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="PRIORITY" />
        </ListItemButton>
        
        <ListItemButton 
          selected={sortBy === 'progress'}
          onClick={() => setSortBy('progress')}
          sx={{ pl: 4 }}
        >
          <ListItemText primary="PROGRESS" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ 
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
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
            <HomeIcon sx={{ mr: 1, color: categoryColors.home }} />
            <Box 
              component="span"
              sx={{
                background: 'linear-gradient(45deg, #4F46E5 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Task Manager
            </Box>
          </Typography>
          
          {isMobile ? (
            <Box>
              <IconButton 
                color="inherit" 
                edge="end" 
                onClick={toggleDrawer(true)}
                sx={{ mr: 1, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
              
              <IconButton 
                color="primary" 
                edge="end" 
                onClick={() => setOpenTaskForm(true)}
                sx={{
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#4338CA'
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Category"
                    sx={{
                      '.MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center'
                      }
                    }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem 
                        key={category} 
                        value={category}
                        sx={{
                          borderLeft: `4px solid ${categoryColors[category] || categoryColors.default}`,
                          my: 0.5
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{
                            width: 10,
                            height: 10,
                            backgroundColor: categoryColors[category] || categoryColors.default,
                            borderRadius: '50%',
                            mr: 1.5
                          }} />
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Box>
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
                startIcon={<AddIcon />}
                onClick={() => setOpenTaskForm(true)}
                sx={{ 
                  ml: 1,
                  background: 'linear-gradient(45deg, #4F46E5 0%, #7C3AED 100%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4338CA 0%, #6D28D9 100%)'
                  },
                  boxShadow: '0 2px 5px rgba(79, 70, 229, 0.3)'
                }}
              >
                Add Task
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#F9FAFB'
          }
        }}
      >
        {filterDrawer}
      </Drawer>
      
      <TaskFormDialog 
        open={openTaskForm} 
        onClose={() => setOpenTaskForm(false)} 
      />
    </>
  );
};

export default TopAppBar;