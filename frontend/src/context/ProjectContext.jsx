import { createContext, useContext, useState } from 'react';
import { mockProjects } from '../mocks/projectMock';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(
    mockProjects.map((project) => ({
      ...project,
    }))
  );

  // 프로젝트 추가
  const addProject = (project) => {
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        ...project,
      },
    ]);
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
  const deleteProject = (projectId) => {
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
