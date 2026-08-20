import apiClient from './apiClient';

export const getProjectMembers = (projectId) => {
  return apiClient.get(`/projects/${projectId}/members`);
};

export const inviteMember = (projectId, data) => {
  return apiClient.post(`/projects/${projectId}/members`, data);
};

export const deleteMember = (projectId, userId) => {
  return apiClient.delete(`/projects/${projectId}/members/${userId}`);
};
