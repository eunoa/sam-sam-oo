import { mockProjects } from '../mocks/projectMock';
import { mockMembersByProject } from '../mocks/memberByProjectMock';

// TODO: 백엔드 연동 시 GET /projects 호출로 교체
export function getProjects() {
  return mockProjects;
}

// TODO: 백엔드 연동 시 GET /projects/{projectId}/members 호출로 교체
export function getProjectMembers(projectId) {
  return mockMembersByProject[projectId] ?? [];
}
