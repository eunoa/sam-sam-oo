import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getProjects,
  createProject,
  deleteProject as deleteProjectApi,
} from '../services/projectService';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 프로젝트 목록 조회
  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getProjects();

      setProjects(data);
    } catch (error) {
      console.error('프로젝트 목록 조회 실패:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // 프로젝트 추가
  const addProject = async ({ name, description }) => {
    const createdProject = await createProject({
      name,
      description,
    });

    setProjects((prevProjects) => [
      ...prevProjects,
      createdProject,
    ]);

    return createdProject;
  };

  // 프로젝트 수정
  const updateProject = (projectId, updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.projectId === projectId
          ? {
              ...project,
              ...updatedProject,
            }
          : project
      )
    );
  };

  // 프로젝트 삭제
  const deleteProject = async (projectId) => {
    await deleteProjectApi(projectId);

    setProjects((prevProjects) =>
      prevProjects.filter(
        (project) => project.projectId !== projectId
      )
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        addProject,
        updateProject,
        deleteProject,
        loadProjects,
        isLoading,
        error,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      'useProjects는 ProjectProvider 안에서 사용해야 합니다.'
    );
  }

  return context;
}
