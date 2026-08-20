import apiClient from './apiClient';

export const getTasks = (projectId, status) => {
  const query = status ? `?status=${status}` : '';
  return apiClient.get(`/projects/${projectId}/tasks${query}`);
};

export const getAllTasks = getTasks;

export const createTask = (projectId, taskData) => {
  return apiClient.post(`/projects/${projectId}/tasks`, taskData);
};

export const updateTask = (taskId, taskData) => {
  return apiClient.patch(`/tasks/${taskId}`, taskData);
};

export const deleteTask = (taskId) => {
  return apiClient.delete(`/tasks/${taskId}`);
};

export const getTaskDetail = (taskId) => {
  return apiClient.get(`/tasks/${taskId}`);
};

export const translateTask = (taskId, targetLanguage) => {
  return apiClient.get(
    `/tasks/${taskId}/translate?targetLanguage=${targetLanguage}`
  );
};

export const taskService = {
  getTasks,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskDetail,
  translateTask,
};

export default taskService;
