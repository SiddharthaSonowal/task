import React, { useState , useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { addTask, updateTask } from '../store/tasksSlice';
import { v4 as uuidv4 } from 'uuid';

const TaskFormDialog = ({ open, onClose, editTask = null }) => {
  const dispatch = useDispatch();
  const { categories, priorities } = useSelector(state => state.tasks);
  
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [category, setCategory] = useState(editTask?.category || categories[0]);
  const [priority, setPriority] = useState(editTask?.priority || priorities[0]);
  const [startDate, setStartDate] = useState(editTask?.startDate ? dayjs(editTask.startDate) : dayjs());
  const [dueDate, setDueDate] = useState(editTask?.dueDate ? dayjs(editTask.dueDate) : dayjs().add(1, 'day'));
  const [enableNotifications, setEnableNotifications] = useState(editTask?.notifications || false);
  const [subtasks, setSubtasks] = useState(editTask?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setCategory(editTask.category || categories[0]);
      setPriority(editTask.priority || priorities[0]);
      setStartDate(editTask.startDate ? dayjs(editTask.startDate) : dayjs());
      setDueDate(editTask.dueDate ? dayjs(editTask.dueDate) : dayjs().add(1, 'day'));
      setEnableNotifications(Boolean(editTask.notifications));
      setSubtasks(editTask.subtasks || []);
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setCategory(categories[0]);
      setPriority(priorities[0]);
      setStartDate(dayjs());
      setDueDate(dayjs().add(1, 'day'));
      setEnableNotifications(false);
      setSubtasks([]);
    }
  }, [editTask, open, categories, priorities]);
  
  const handleSubmit = () => {
    const taskData = {
      id: editTask?.id || uuidv4(),
      title,
      description,
      category,
      priority,
      startDate: startDate.toISOString(),
      dueDate: dueDate.toISOString(),
      notifications: enableNotifications,
      subtasks,
      completed: editTask?.completed || false,
      createdAt: editTask?.createdAt || new Date().toISOString()
    };
    
    if (editTask) {
      dispatch(updateTask({ 
        id: editTask.id, 
        updatedTask: taskData 
      }));
    } else {
      dispatch(addTask(taskData));
    }
    
    onClose();
  };
  
  const resetForm = () => {
    if (!editTask) {
      setTitle('');
      setDescription('');
      setCategory(categories[0]);
      setPriority(priorities[0]);
      setStartDate(dayjs());
      setDueDate(dayjs().add(1, 'day'));
      setEnableNotifications(false);
      setSubtasks([]);
    }
  };
  
  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        { id: uuidv4(), title: newSubtaskTitle, completed: false }
      ]);
      setNewSubtaskTitle('');
    }
  };
  
  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                label="Priority"
              >
                {priorities.map(pri => (
                  <MenuItem key={pri} value={pri}>
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              sx={{ flex: 1 }}
            />
            
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              sx={{ flex: 1 }}
            />
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
              />
            }
            label="Enable Notifications"
          />
          
          <Divider sx={{ my: 1 }} />
          
          <Typography variant="h6">Subtasks</Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="New Subtask"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              fullWidth
            />
            <Button 
              onClick={handleAddSubtask} 
              variant="contained" 
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
          
          <List>
            {subtasks.map((subtask) => (
              <ListItem key={subtask.id}>
                <ListItemText primary={subtask.title} />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary"
          disabled={!title.trim()}
        >
          {editTask ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormDialog; 