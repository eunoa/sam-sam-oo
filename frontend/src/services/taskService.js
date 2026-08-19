import { mockTasksByProject } from '../mocks/taskBoardMock';
import { getProjects, getProjectMembers } from './projectService';

function resolveAssigneeName(projectId, assigneeId) {
  return (
    getProjectMembers(projectId).find(
      (member) => member.userId === assigneeId
    )?.name ?? ''
  );
}

// API엔 프로젝트별 조회(GET /projects/{projectId}/tasks)만 있고
// "내 프로젝트 전체의 업무" 를 한 번에 주는 엔드포인트가 없다.
// 그래서 여기서 내 프로젝트 목록을 돌면서 프로젝트별 업무를 합치고
// projectName / assigneeName을 붙여준다.
// TODO: 백엔드에 통합 조회 엔드포인트가 생기면 이 함수 내부만 그 호출로 교체하면 된다.
export function getAllTasks() {
  return getProjects().flatMap((project) => getTasksByProject(project.projectId));
}

// TODO: 백엔드 연동 시 GET /projects/{projectId}/tasks 호출로 교체
export function getTasksByProject(projectId) {
  const project = getProjects().find(
    (candidate) => candidate.projectId === projectId
  );

  const tasks = mockTasksByProject[projectId] ?? [];

  return tasks.map((task) => ({
    ...task,
    projectName: project?.name ?? '',
    assigneeName: resolveAssigneeName(projectId, task.assigneeId),
  }));
}
