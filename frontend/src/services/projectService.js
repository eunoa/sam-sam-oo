import apiClient from './apiClient';

export const getProjects = () => {
  return apiClient.get('/projects');
};

export const getProject = (projectId) => {
  return apiClient.get(`/projects/${projectId}`);
};

export const getProjectDashboard = (projectId) => {
  return apiClient.get(`/projects/${projectId}/dashboard`);
};

export const createProject = (data) => {
  return apiClient.post('/projects', data);
};

export const deleteProject = (projectId) => {
  return apiClient.delete(`/projects/${projectId}`);
};
