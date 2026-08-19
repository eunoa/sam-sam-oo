import apiClient from './apiClient';

export const createMeeting = (projectId, meetingData) => {
  return apiClient.post(
    `/projects/${projectId}/meetings`,
    meetingData
  );
};

export const deleteMeeting = (meetingId) => {
  return apiClient.delete(`/meetings/${meetingId}`);
};

export const updateMeetingContent = (
  meetingId,
  manualContent
) => {
  return apiClient.patch(
    `/meetings/${meetingId}/content`,
    { manualContent }
  );
};

export const getMeetings = (projectId) => {
  return apiClient.get(
    `/projects/${projectId}/meetings`
  );
};

export const getMeetingDetail = (meetingId) => {
  return apiClient.get(
    `/meetings/${meetingId}`
  );
};

export const recommendTime = (
  projectId,
  recommendData
) => {
  return apiClient.post(
    `/projects/${projectId}/meetings/recommend-time`,
    recommendData
  );
};

export const generateSummary = (meetingId) => {
  return apiClient.post(
    `/meetings/${meetingId}/summary`
  );
};

export const getSummary = (meetingId) => {
  return apiClient.get(
    `/meetings/${meetingId}/summary`
  );
};

export const translateMeeting = (
  meetingId,
  targetLanguage
) => {
  return apiClient.get(
    `/meetings/${meetingId}/translate?targetLanguage=${targetLanguage}`
  );
};

export const generateTaskSuggestions = (meetingId) => {
  return apiClient.post(
    `/meetings/${meetingId}/task-suggestions`
  );
};

export const getTaskSuggestions = (meetingId) => {
  return apiClient.get(
    `/meetings/${meetingId}/task-suggestions`
  );
};

export const approveTaskSuggestion = (
  meetingId,
  suggestionId,
  assigneeId
) => {
  return apiClient.post(
    `/meetings/${meetingId}/tasks/approve`,
    {
      suggestionId,
      assigneeId,
    }
  );
};

export const deleteTaskSuggestion = (
  meetingId,
  suggestionId
) => {
  return apiClient.delete(
    `/meetings/${meetingId}/suggestions/${suggestionId}`
  );
};

export const meetingService = {
  createMeeting,
  deleteMeeting,
  updateMeetingContent,
  getMeetings,
  getMeetingDetail,
  recommendTime,
  generateSummary,
  getSummary,
  translateMeeting,
  generateTaskSuggestions,
  getTaskSuggestions,
  approveTaskSuggestion,
  deleteTaskSuggestion,
};

export default meetingService;
