import { apiClient } from '../api/apiClient';

// 내 프로젝트 목록 조회
export async function getProjects() {
  return apiClient('/projects');
}

// 프로젝트 생성
export async function createProject({ name, description }) {
  return apiClient('/projects', {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
    }),
  });
}

// 프로젝트 삭제
export async function deleteProject(projectId) {
  return apiClient(`/projects/${projectId}`, {
    method: 'DELETE',
  });
}

// 프로젝트 멤버 조회
export async function getProjectMembers(projectId) {
  return apiClient(`/projects/${projectId}/members`);
}
