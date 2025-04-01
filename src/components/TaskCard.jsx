import React, { useState,useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Card, CardContent, Checkbox, Typography, Box, IconButton,
  Menu, MenuItem, LinearProgress, Collapse, Button, Chip,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  MoreHoriz as MoreHorizIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Event as EventIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon
} from '@mui/icons-material';
import { toggleTaskCompletion, toggleSubtaskCompletion, deleteTask } from '../store/tasksSlice';
import { priorityColors } from '../store/tasksSlice';
import dayjs from 'dayjs';

const TaskCard = ({ task, onEdit, index, onDragStart, onDragEnter, onDragEnd }) => {
  const dispatch = useDispatch();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [subtasksVisible, setSubtasksVisible] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setShowExpandButton(isOverflowing);
    }
  }, [task.description]);
  
  const priorityColor = priorityColors[task.priority]?.main || '#6B7280';
  const MAX_DESCRIPTION_LINES = 3;

  const handleToggleComplete = () => {
    dispatch(toggleTaskCompletion(task.id));
  };

  const handleToggleSubtaskComplete = (subtaskId) => {
    dispatch(toggleSubtaskCompletion({ taskId: task.id, subtaskId }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    setMenuAnchor(null);
  };

  const handleEditClick = () => {
    onEdit(task);
    setMenuAnchor(null);
  };

  const progress = task.subtasks && task.subtasks.length > 0
    ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100
    : task.completed ? 100 : 0;

  return (
    <Card
      sx={{
        minWidth: { xs: '100%', sm: 275 },
        maxWidth: { xs: '100%', sm: 340 },
        borderLeft: '5px solid',
        borderLeftColor: priorityColor,
        background: `linear-gradient(to right, ${priorityColor}20, white)`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          background: `linear-gradient(to right, ${priorityColor}40, white)`
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
              <Typography 
                variant="h6" 
                color={task.completed ? 'text.secondary' : 'text.primary'}
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}
              >
                {task.title}
              </Typography>
              
              {task.description && (
          <Box sx={{ mt: 1 }}>
            <Typography 
              ref={descriptionRef}
              variant="body2" 
              sx={{ 
                color: task.completed ? 'text.secondary' : '#595656de',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: descriptionExpanded ? 'none' : MAX_DESCRIPTION_LINES,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.5,
                maxHeight: descriptionExpanded ? 'none' : `${MAX_DESCRIPTION_LINES * 1.5}em`
              }}
            >
              {task.description}
            </Typography>
            {showExpandButton && (
              <Button
                size="small"
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                startIcon={descriptionExpanded ? <CollapseIcon /> : <ExpandIcon />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  p: 0,
                  mt: 0.5,
                  color: 'text.secondary',
                  minWidth: 'auto'
                }}
              >
                {descriptionExpanded ? 'Show less' : 'Show more'}
              </Button>
            )}
          </Box>
        )}
              
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                {task.startDate && (
                  <Typography variant="caption" sx={{ display: 'flex', fontSize: '10px', alignItems: 'center' }}>
                    <EventIcon fontSize="small" sx={{ mr: 0.5, color: '#0369A1' }} />
                    Stat: {dayjs(task.startDate).format('MMM D, YY')}
                  </Typography>
                )}
                
                {task.dueDate && (
                  <Typography variant="caption" sx={{ display: 'flex', fontSize: '10px', alignItems: 'center' }}>
                    <EventIcon fontSize="small" sx={{ mr: 0.5, 
                      color: dayjs(task.dueDate).isBefore(dayjs()) && !task.completed 
                        ? '#DC2626' 
                        : '#059669' 
                    }} />
                    Due: {dayjs(task.dueDate).format('MMM D, YY')}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreHorizIcon />
          </IconButton>
        </Box>

        {/* Priority Chip */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap',pl: 1.5 }}>
          <Chip 
            label={task.priority} 
            size="small"
            sx={{ 
              pl: 1,
              pr: 1,
              backgroundColor: priorityColor,
              color: 'white'
            }}
          />
          
        </Box>
        

        {/* Progress bar */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Progress: {Math.round(progress)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              mt: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#E5E7EB',
              '& .MuiLinearProgress-bar': {
                backgroundColor: progress > 70 ? '#10B981' : 
                                progress > 30 ? '#F59E0B' : '#EF4444',
                borderRadius: 4
              }
            }}
          />
        </Box>

        {/* Subtasks section */}
        {task.subtasks && task.subtasks.length > 0 && (
          <>
            <Button 
              onClick={() => setSubtasksVisible(!subtasksVisible)}
              endIcon={<ExpandMoreIcon sx={{ 
                transform: subtasksVisible ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }} />}
              sx={{ 
                textTransform: 'none', 
                mt: 1,
                color: priorityColor
              }}
            >
              Subtasks ({task.subtasks.length})
            </Button>
            <Collapse in={subtasksVisible}>
              <List>
                {task.subtasks.map((subtask) => (
                  <ListItem 
                    key={subtask.id} 
                    sx={{ 
                      pl: 0,
                      backgroundColor: subtask.completed ? '#F3F4F6' : 'transparent',
                      borderRadius: 1
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtaskComplete(subtask.id)}
                        sx={{
                          color: priorityColor,
                          '&.Mui-checked': {
                            color: priorityColor,
                          },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={subtask.title} 
                      sx={{ 
                        textDecoration: subtask.completed ? 'line-through' : 'none',
                        color: subtask.completed ? 'text.secondary' : 'text.primary'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </CardContent>

      {/* Task menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1, color: '#4B5563' }} /> 
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#EF4444' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> 
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default TaskCard;