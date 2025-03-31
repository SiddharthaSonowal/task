import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Typography } from '@mui/material';
import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';
import { updateTask } from '../store/taskSlice';

const TaskList = ({ filterCategory, filterStatus, sortBy }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks);

  const handleTaskEdit = (updatedTask, skipEditForm = false) => {
    if (skipEditForm) {
      dispatch(updateTask(updatedTask));
    } else {
      setEditingTask(updatedTask);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveEdit = (updatedTask) => {
    dispatch(updateTask(updatedTask));
    handleCloseEditModal();
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;
    // Handle drag and drop reordering logic here if needed
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filterCategory !== 'all' && task.category !== filterCategory) return false;
      if (filterStatus === 'completed' && !task.completed) return false;
      if (filterStatus === 'active' && task.completed) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });

  if (filteredAndSortedTasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No tasks found
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(auto-fill, minmax(300px, 1fr))'
        },
        gap: 2,
        p: 2
      }}>
        {filteredAndSortedTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleTaskEdit}
            index={index}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Box>

      <EditTaskModal
        open={isEditModalOpen}
        task={editingTask}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
    </Container>
  );
};

export default TaskList;