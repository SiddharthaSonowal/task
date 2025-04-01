import { createSlice } from '@reduxjs/toolkit';

export const categoryColors = {
  work: '#FF6B6B',
  home: '#4ECDC4',
  school: '#FFD166',
  fitness: '#06D6A0',
  shopping: '#A78BFA',
  default: '#E2E8F0'
};

export const priorityColors = {
  high: { main: '#EF4444', light: '#FEE2E2' },
  medium: { main: '#F59E0B', light: '#FEF3C7' },
  low: { main: '#10B981', light: '#D1FAE5' }
};

// Load tasks from local storage if available
const loadTasksFromStorage = () => {
  try {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

// Save tasks to local storage
const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

const initialState = {
  tasks: loadTasksFromStorage(),
  categories: ['home', 'work', 'school', 'fitness', 'shopping'],
  priorities: ['low', 'medium', 'high'],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      saveTasksToStorage(state.tasks);
    },
    updateTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const index = state.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...updatedTask };
        saveTasksToStorage(state.tasks);
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      saveTasksToStorage(state.tasks);
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksToStorage(state.tasks);
      }
    },
    addSubtask: (state, action) => {
      const { taskId, subtask } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push(subtask);
        saveTasksToStorage(state.tasks);
      }
    },
    updateSubtask: (state, action) => {
      const { taskId, subtaskId, updatedSubtask } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task && task.subtasks) {
        const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
        if (subtaskIndex !== -1) {
          task.subtasks[subtaskIndex] = { 
            ...task.subtasks[subtaskIndex], 
            ...updatedSubtask 
          };
          saveTasksToStorage(state.tasks);
        }
      }
    },
    toggleSubtaskCompletion: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task && task.subtasks) {
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
          saveTasksToStorage(state.tasks);
        }
      }
    },
    deleteSubtask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task && task.subtasks) {
        task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
        saveTasksToStorage(state.tasks);
      }
    }
  },
});

export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  toggleTaskCompletion,
  addSubtask,
  updateSubtask,
  toggleSubtaskCompletion,
  deleteSubtask
} = tasksSlice.actions;

export default tasksSlice.reducer; 