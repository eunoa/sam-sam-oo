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

      setProjects(data || []);

      if (data && data.length > 0) {
        setCurrentProject((prev) => prev || data[0]);
      }
      return data || [];
    } catch (error) {
      console.error('프로젝트 목록 로드 실패:', error);
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

    return createdProject;
  };

  const deleteProject = async (projectId) => {
    await deleteProjectApi(projectId);

    setProjects((prev) =>
      prev.filter(
        (project) => project.projectId !== projectId
      )
    );

    setCurrentProject((prev) =>
      prev?.projectId === projectId ? null : prev
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      fetchProjects();
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
