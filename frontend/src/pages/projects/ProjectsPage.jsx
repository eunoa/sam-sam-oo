import './ProjectsPage.css';

import { useNavigate } from 'react-router-dom';

import { useProjects } from '../../context/ProjectContext';

import ProjectCard from '../../components/project/ProjectCard';

function ProjectsPage() {
  const navigate = useNavigate();
  const { projects } = useProjects();

  const handleCreateProject = () => {
    navigate('/projects/create', {
      state: {
        from: '/projects',
      },
    });
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="projects-page">

      {/* =========================
          Header
      ========================= */}

      <header className="projects-header">

        <h1>프로젝트</h1>

        <button
          type="button"
          className="projects-create-button"
          onClick={handleCreateProject}
        >
          + 프로젝트 생성
        </button>

      </header>


      {/* =========================
          Project List
      ========================= */}

      <section className="projects-section">

        <h2>내 프로젝트</h2>

        <div className="projects-list">

          {projects.map((project) => (

            <div
              key={project.projectId}
              className="projects-card-wrapper"
            >
              <ProjectCard
                project={project}
              />
            </div>

          ))}

        </div>

      </section>


      {/* =========================
          Back
      ========================= */}

      <div className="projects-back-actions">

        <button
          type="button"
          className="projects-back-button"
          onClick={handleBack}
        >
          돌아가기
        </button>

      </div>

    </div>
  );
}

export default ProjectsPage;