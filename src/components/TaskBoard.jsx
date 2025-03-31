import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import TaskCard from './TaskCard';
import TaskFormDialog from './TaskFormDialog';
import { updateTask } from '../store/tasksSlice';

const TaskBoard = ({ filterCategory, filterStatus, sortBy }) => {
  const tasks = useSelector(state => state.tasks.tasks);
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const [dragOverTaskIndex, setDragOverTaskIndex] = useState(null);
  const horizontalScrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  
  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by category
    if (filterCategory !== 'all' && task.category !== filterCategory) {
      return false;
    }
    
    // Filter by status
    if (filterStatus === 'completed' && !task.completed) {
      return false;
    }
    if (filterStatus === 'active' && task.completed) {
      return false;
    }
    
    return true;
  });
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'startDate':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      case 'progress': {
        const getProgress = (task) => {
          if (!task.subtasks || task.subtasks.length === 0) return task.completed ? 100 : 0;
          return (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100;
        };
        return getProgress(b) - getProgress(a);
      }
      default:
        return 0;
    }
  });
  
  // Group tasks by category if on desktop
  const tasksByCategory = !isMobile 
    ? sortedTasks.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = [];
        acc[task.category].push(task);
        return acc;
      }, {})
    : null;
  
  const handleEditTask = (task) => {
    setEditingTask(task);
  };
  
  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedTaskIndex(index);
    // Make the drag image transparent
    setTimeout(() => {
      e.target.style.opacity = 0.5;
    }, 0);
  };
  
  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedTaskIndex !== index) {
      setDragOverTaskIndex(index);
    }
  };
  
  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
    
    if (draggedTaskIndex !== null && dragOverTaskIndex !== null) {
      // Create a new array with reordered tasks
      const newTasks = [...sortedTasks];
      const draggedTask = newTasks[draggedTaskIndex];
      
      // Remove dragged item
      newTasks.splice(draggedTaskIndex, 1);
      
      // Add it at the new position
      newTasks.splice(dragOverTaskIndex, 0, draggedTask);
      
      // Update the order in Redux store - this would need updating in the slice
      // For now, this just updates the category if we're dragging between categories
      if (!isMobile && newTasks[dragOverTaskIndex].category !== draggedTask.category) {
        dispatch(updateTask({
          id: draggedTask.id,
          updatedTask: { category: newTasks[dragOverTaskIndex].category }
        }));
      }
    }
    
    setDraggedTaskIndex(null);
    setDragOverTaskIndex(null);
  };
  
  // Horizontal scroll with mouse hold
  const handleMouseDown = (e) => {
    if (!horizontalScrollRef.current || isMobile) return;
    setIsScrolling(true);
    setStartX(e.pageX - horizontalScrollRef.current.offsetLeft);
    horizontalScrollRef.current.style.cursor = 'grabbing';
  };
  
  const handleMouseMove = (e) => {
    if (!isScrolling || !horizontalScrollRef.current) return;
    const x = e.pageX - horizontalScrollRef.current.offsetLeft;
    const scroll = x - startX;
    horizontalScrollRef.current.scrollLeft -= scroll;
    setStartX(x);
  };
  
  const handleMouseUp = () => {
    setIsScrolling(false);
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.style.cursor = 'grab';
    }
  };
  
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isScrolling, startX]);

  return (
    <Box sx={{ p: 2 }}>
      {isMobile ? (
        // Mobile view - vertical scrolling with responsive cards
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sortedTasks.length === 0 && (
            <Typography variant="h6" align="center" sx={{ my: 4 }}>
              No tasks found. Add a new task to get started!
            </Typography>
          )}
          
          {sortedTasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
              index={index}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd} 
            />
          ))}
        </Box>
      ) : (
        // Desktop view - horizontal scrolling by category with drag and hold
        <Box 
          ref={horizontalScrollRef}
          sx={{ 
            display: 'flex', 
            gap: 2, 
            overflowX: 'auto', 
            pb: 2,
            cursor: 'grab',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '10px',
            },
          }}
          onMouseDown={handleMouseDown}
        >
          {Object.keys(tasksByCategory || {}).length === 0 && (
            <Typography variant="h6" align="center" sx={{ my: 4, width: '100%' }}>
              No tasks found. Add a new task to get started!
            </Typography>
          )}
          
          {Object.entries(tasksByCategory || {}).map(([category, categoryTasks]) => (
            <Box 
              key={category}
              sx={{ 
                minWidth: '300px',
                maxWidth: '320px',
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 2,
                p: 2,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  pb: 1, 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  textTransform: 'capitalize'
                }}
              >
                {category}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categoryTasks.map((task, index) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={handleEditTask}
                    index={index}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
      
      {editingTask && (
        <TaskFormDialog 
          open={Boolean(editingTask)} 
          onClose={() => setEditingTask(null)} 
          editTask={editingTask} 
        />
      )}
    </Box>
  );
};

export default TaskBoard; 