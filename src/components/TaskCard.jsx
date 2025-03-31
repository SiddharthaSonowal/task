import React, { useState, useEffect, useRef } from 'react';
import { 
  Tooltip,
  useTheme,
  Button,
  Typography as MuiTypography,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Typography
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

// Add a custom Typography component that can expand/collapse
const ExpandableTypography = ({ text, maxLines = 2, variant = "body2", color = "text.secondary" }) => {
  const [expanded, setExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      // Check if the text is overflowing
      const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight;
      setNeedsExpand(isOverflowing);
    }
  }, [text]);

  return (
    <Box>
      <MuiTypography
        ref={textRef}
        variant={variant}
        color={color}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : maxLines,
          WebkitBoxOrient: 'vertical',
          transition: 'all 0.3s ease',
        }}
      >
        {text}
      </MuiTypography>
      
      {needsExpand && (
        <Button 
          size="small" 
          onClick={() => setExpanded(!expanded)} 
          sx={{ p: 0, minWidth: 'auto', mt: 0.5 }}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </Box>
  );
};

const TaskCard = ({ task, onEdit, index, onDragStart, onDragEnter, onDragEnd }) => {
  const priorityColor = task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "green";
  const isActive = task.status === "active";

  const handleToggleComplete = () => {
    // Function to toggle task completion
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Checkbox 
              checked={task.completed}
              onChange={handleToggleComplete}
              sx={{ 
                color: priorityColor,
                '&.Mui-checked': {
                  color: priorityColor,
                },
                mt: -0.5
              }}
            />
            <Box>
              <ExpandableTypography 
                text={task.title}
                variant="h6"
                color={task.completed ? 'text.secondary' : 'text.primary'}
                maxLines={2}
                sx={{ 
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              />
            </Box>
          </Box>
          
          {isActive && (
            <Chip 
              icon={<TimeIcon />} 
              label="Active" 
              size="small" 
              color="success" 
              variant="outlined"
              sx={{ ml: 1, flexShrink: 0 }}
            />
          )}
        </Box>
        
        <Box sx={{ mt: 1, pl: 4 }}>
          <ExpandableTypography text={task.description} maxLines={3} />
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', pl: 4 }}>
          <Chip 
            label={task.category.charAt(0).toUpperCase() + task.category.slice(1)} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
            size="small"
            sx={{ 
              bgcolor: priorityColor,
              color: 'white',
            }}
          />
        </Box>
        
        <Box sx={{ mt: 2, pl: 4 }}>
          <Typography variant="caption" display="block" color="text.secondary">
            Due: {dayjs(task.dueDate).format('MMM D, YYYY')}
          </Typography>
        </Box>
        
        {/* ... rest of the existing component */}  
      </CardContent>
    </Card>
  );
};

export default TaskCard;
