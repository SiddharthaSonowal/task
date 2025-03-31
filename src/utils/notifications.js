// Check if browser supports notifications
const supportsNotifications = () => {
  return 'Notification' in window;
};

// Request permission for notifications
export const requestNotificationPermission = async () => {
  if (!supportsNotifications()) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Send notification for task
export const sendTaskNotification = (task, type = 'due') => {
  if (!supportsNotifications() || Notification.permission !== 'granted' || !task.notifications) {
    return;
  }
  
  const title = type === 'due' 
    ? `Task Due: ${task.title}` 
    : `Task Starting: ${task.title}`;
    
  const options = {
    body: task.description || `Task is ${type === 'due' ? 'due' : 'starting'} now.`,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `task-${type}-${task.id}`,
    data: { taskId: task.id }
  };
  
  return new Notification(title, options);
};

// Check for tasks requiring notifications
export const checkTasksForNotification = (tasks) => {
  if (!supportsNotifications() || Notification.permission !== 'granted') {
    return;
  }
  
  const now = new Date();
  
  tasks.forEach(task => {
    if (!task.notifications || task.completed) return;
    
    const dueDate = new Date(task.dueDate);
    const startDate = new Date(task.startDate);
    
    // Due date notification (when a task is due in 15 minutes)
    if (Math.abs(dueDate - now) <= 15 * 60 * 1000) {
      sendTaskNotification(task, 'due');
    }
    
    // Start date notification (when a task is starting in 15 minutes)
    if (Math.abs(startDate - now) <= 15 * 60 * 1000) {
      sendTaskNotification(task, 'start');
    }
  });
}; 