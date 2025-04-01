import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  useMediaQuery, 
  useTheme, 
  Container,
  LinearProgress
} from '@mui/material';
import TaskCard from './TaskCard';
import TaskFormDialog from './TaskFormDialog';
import { updateTask } from '../store/tasksSlice';
import { categoryColors } from '../store/tasksSlice';

const TaskBoard = ({ filterCategory, filterStatus, sortBy }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const tasks = useSelector(state => state.tasks.tasks);
  
  // State management
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const [dragOverTaskIndex, setDragOverTaskIndex] = useState(null);
  const horizontalScrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);

  // Filter, sort and group tasks
  const { filteredTasks, tasksByCategory } = useMemo(() => {
    const filtered = tasks.filter(task => {
      if (filterCategory !== 'all' && task.category !== filterCategory) return false;
      if (filterStatus === 'completed' && !task.completed) return false;
      if (filterStatus === 'active' && task.completed) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate': return new Date(a.dueDate) - new Date(b.dueDate);
        case 'startDate': return new Date(a.startDate) - new Date(b.startDate);
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
        default: return 0;
      }
    });

    const grouped = !isMobile 
      ? sorted.reduce((acc, task) => {
          if (!acc[task.category]) acc[task.category] = [];
          acc[task.category].push(task);
          return acc;
        }, {})
      : null;

    return { filteredTasks: sorted, tasksByCategory: grouped };
  }, [tasks, filterCategory, filterStatus, sortBy, isMobile]);

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedTaskIndex(index);
    setTimeout(() => { e.target.style.opacity = 0.5; }, 0);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedTaskIndex !== index) setDragOverTaskIndex(index);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = 1;
    
    if (draggedTaskIndex !== null && dragOverTaskIndex !== null) {
      const newTasks = [...filteredTasks];
      const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
      newTasks.splice(dragOverTaskIndex, 0, draggedTask);
      
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

  // Horizontal scroll handlers
  const handleMouseDown = (e) => {
    if (!horizontalScrollRef.current || isMobile) return;
    setIsScrolling(true);
    setStartX(e.pageX - horizontalScrollRef.current.offsetLeft);
    horizontalScrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isScrolling || !horizontalScrollRef.current) return;
    const x = e.pageX - horizontalScrollRef.current.offsetLeft;
    horizontalScrollRef.current.scrollLeft -= (x - startX);
    setStartX(x);
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
    if (horizontalScrollRef.current) horizontalScrollRef.current.style.cursor = 'grab';
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isScrolling, startX]);

  // Empty state
  if (filteredTasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No tasks found. Add a new task to get started!
        </Typography>
        <LinearProgress 
          sx={{ 
            mt: 2, 
            height: 8,
            borderRadius: 4,
            backgroundColor: '#E5E7EB',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4F46E5',
              borderRadius: 4
            }
          }} 
        />
      </Box>
    );
  }

  return (
    <Container maxWidth={isMobile ? false : 'xl'} sx={{ p: 2 , bgcolor: '#fffff'}}>
      {isMobile ? (
        // Mobile view - vertical list
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredTasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={setEditingTask}
              index={index}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd} 
            />
          ))}
        </Box>
      ) : (
        // Desktop view - horizontal categories
        <Box 
          ref={horizontalScrollRef}
          sx={{ 
            display: 'flex', 
            gap: 2, 
            overflowX: 'auto',
            pb: 2,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing'
            },
            '&::-webkit-scrollbar': { height: '8px' },
            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888' }
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={(e) => e.preventDefault()}
        >
          {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
            <Box 
              key={category}
              sx={{ 
                minWidth: 350,
                width: 350,
                flexShrink: 0,
                borderRadius: 2,
                p: 2,
                borderTop: `4px solid ${categoryColors[category] || categoryColors.default}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  pb: 1,
                  textTransform: 'uppercase',
                  color: categoryColors[category] || categoryColors.default,
                  backgroundColor: `${categoryColors[category]}20` || `${categoryColors.default}20`,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {category}
                <Typography variant="caption" sx={{ color: 'inherit' }}>
                  {categoryTasks.length} {categoryTasks.length === 1 ? 'task' : 'tasks'}
                </Typography>
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categoryTasks.map((task, index) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={setEditingTask}
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
      
      <TaskFormDialog 
        open={Boolean(editingTask)} 
        onClose={() => setEditingTask(null)} 
        editTask={editingTask} 
      />
    </Container>
  );
};

export default TaskBoard;