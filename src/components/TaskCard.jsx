import React, { useState } from 'react';
import { 
  Tooltip,
  Button,
  IconButton,
  Box,
  Card,
  CardContent,
  Checkbox,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  LinearProgress,
  Collapse
} from '@mui/material';
import { 
  MoreHoriz as MoreHorizIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Event as StartDateIcon,
  EventAvailable as DueDateIcon,
  NotificationsActive as NotificationIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { toggleTaskCompletion, toggleSubtaskCompletion, deleteTask } from '../store/tasksSlice';

const TaskCard = ({ task, onEdit, index, onDragStart, onDragEnter, onDragEnd }) => {
  const priorityColor = task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "green";
  const dispatch = useDispatch();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [subtasksVisible, setSubtasksVisible] = useState(false);

  const handleToggleComplete = () => {
    dispatch(toggleTaskCompletion(task.id));
  };

  const handleToggleSubtaskComplete = (subtaskId) => {
    dispatch(toggleSubtaskCompletion({ taskId: task.id, subtaskId }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const progress = task.subtasks && task.subtasks.length > 0
    ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100
    : task.completed ? 100 : 0;

  return (
    <Card 
      sx={{ 
        minWidth: { xs: '100%', sm: 275 }, 
        maxWidth: { xs: '100%', sm: 340 },
        width: '100%',
        borderLeft: '5px solid',
        borderLeftColor: priorityColor,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        opacity: task.completed ? 0.7 : 1,
      }}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter && onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            <Checkbox 
              checked={task.completed}
              onChange={handleToggleComplete}
              sx={{ 
                color: priorityColor,
                '&.Mui-checked': {
                  color: priorityColor,
                },
              }}
            />
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="h6" color={task.completed ? 'text.secondary' : 'text.primary'}>
                {task.title}
              </Typography>
              {task.description && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1,
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {task.description}
                </Typography>
              )}
              
              {(task.startDate || task.dueDate) && (
                <Box sx={{ mt: 1 }}>
                  {task.startDate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StartDateIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(task.startDate).format('DD MMM YYYY')}
                      </Typography>
                    </Box>
                  )}
                  {task.dueDate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <DueDateIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(task.dueDate).format('DD MMM YYYY')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              
              {task.notification && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <NotificationIcon fontSize="small" color="primary" />
                  <Typography variant="caption" color="primary">
                    {dayjs(task.notification).format('DD MMM HH:mm')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreHorizIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => { setMenuAnchor(null); onEdit(task); }}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Progress: {Math.round(progress)}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
        </Box>
        {task.subtasks && task.subtasks.length > 0 && (
          <>
            <Button 
              onClick={() => setSubtasksVisible(!subtasksVisible)}
              endIcon={<ExpandMoreIcon sx={{ transform: subtasksVisible ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
              sx={{ textTransform: 'none', mt: 1 }}
            >
              Subtasks ({task.subtasks.length})
            </Button>
            <Collapse in={subtasksVisible}>
              <List>
                {task.subtasks.map((subtask) => (
                  <ListItem key={subtask.id} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <Checkbox
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtaskComplete(subtask.id)}
                      />
                    </ListItemIcon>
                    <ListItemText primary={subtask.title} sx={{ textDecoration: subtask.completed ? 'line-through' : 'none' }} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;