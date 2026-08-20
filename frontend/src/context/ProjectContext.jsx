import { createContext, useContext, useEffect, useState } from 'react';
import {
  getProjects,
  createProject,
  deleteProject as deleteProjectApi,
} from '../services/projectService';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const data = await getProjects();
      const projectList = data || [];

      setProjects(projectList);

      setCurrentProject((prev) => {
        // 현재 선택된 프로젝트가 새로 조회된 프로젝트 목록에도 있으면 유지
        if (
            prev &&
            projectList.some(
                (project) => project.projectId === prev.projectId
            )
        ) {
          return prev;
        }

        // 기존 프로젝트가 현재 사용자에게 속하지 않으면
        // 현재 사용자의 첫 번째 프로젝트로 변경
        if (projectList.length > 0) {
          return projectList[0];
        }

        // 현재 사용자가 속한 프로젝트가 하나도 없으면 초기화
        return null;
      });

      return projectList;
    } catch (error) {
      console.error('프로젝트 목록 로드 실패:', error);

      // API 조회 실패 시 이전 사용자의 프로젝트가 남지 않도록 초기화
      setProjects([]);
      setCurrentProject(null);

      return [];
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    await createProject(projectData);

    const updatedProjects = await fetchProjects();

    const createdProject = updatedProjects.find(
        (project) => project.name === projectData.name
    );

    if (createdProject) {
      setCurrentProject(createdProject);
    }

    return createdProject;
  };

  const deleteProject = async (projectId) => {
    await deleteProjectApi(projectId);

    setProjects((prev) => {
      const updatedProjects = prev.filter(
          (project) => project.projectId !== projectId
      );

      setCurrentProject((current) => {
        if (current?.projectId !== projectId) {
          return current;
        }

        return updatedProjects.length > 0
            ? updatedProjects[0]
            : null;
      });

      return updatedProjects;
    });
  };

  const clearProjects = () => {
    setProjects([]);
    setCurrentProject(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      fetchProjects();
    } else {
      clearProjects();
    }
  }, []);

  return (
      <ProjectContext.Provider
          value={{
            projects,
            currentProject,
            setCurrentProject,
            fetchProjects,
            addProject,
            deleteProject,
            clearProjects,
            loading,
          }}
      >
        {children}
      </ProjectContext.Provider>
  );
}

export const useProject = () =>
    useContext(ProjectContext) || {};

export const useProjects = () =>
    useContext(ProjectContext) || {};