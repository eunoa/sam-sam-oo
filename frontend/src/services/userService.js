import apiClient from './apiClient';

export const getCurrentUser = () => {
  return apiClient.get('/users/me');
};

export const updateCurrentUser = ({
  name,
  language,
  timezone,
} = {}) => {
  return apiClient.patch('/users/me', {
    ...(name !== undefined && { name }),
    ...(language !== undefined && { language }),
    ...(timezone !== undefined && { timezone }),
  });
};

export const getAvailability = () => {
  return apiClient.get('/users/me/availability');
};

export const updateAvailability = (availabilities) => {
  return apiClient.put('/users/me/availability', {
    availabilities,
  });
};
