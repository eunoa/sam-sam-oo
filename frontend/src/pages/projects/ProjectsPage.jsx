import './ProjectsPage.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useProjects } from '../../context/ProjectContext';

import ProjectCard from '../../components/project/ProjectCard';

function ProjectsPage() {
  const navigate = useNavigate();

  const {
    projects,
    addProject,
  } = useProjects();

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] =
    useState('');


  /*
   * =========================
   * 프로젝트 생성 팝업
   * =========================
   */

  const handleOpenCreateModal = () => {
    setName('');
    setDescription('');
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setName('');
    setDescription('');
  };


  /*
   * =========================
   * 프로젝트 생성
   * =========================
   */

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const nextProjectId =
      projects.length > 0
        ? Math.max(
            ...projects.map(
              (project) =>
                project.projectId
            )
          ) + 1
        : 1;

    const newProject = {
      projectId: nextProjectId,
      name: trimmedName,
      description: description.trim(),
    };

    addProject(newProject);

    handleCloseCreateModal();
  };


  /*
   * =========================
   * 돌아가기
   * =========================
   */

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
          onClick={handleOpenCreateModal}
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

          {projects.map(
            (project) => (

              <div
                key={project.projectId}
                className="projects-card-wrapper"
              >
                <ProjectCard
                  project={project}
                />
              </div>

            )
          )}

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


      {/* =========================
          프로젝트 생성 모달
      ========================= */}

      {isCreateModalOpen && (

        <div
          className="project-create-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              handleCloseCreateModal();
            }
          }}
        >

          <section
            className="project-create-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-create-modal-title"
          >

            {/* Modal Header */}

            <div className="project-create-modal-header">

              <div>

                <h2
                  id="project-create-modal-title"
                >
                  프로젝트 생성
                </h2>

                <p>
                  새로운 프로젝트를 만들어보세요.
                </p>

              </div>

              <button
                type="button"
                className="project-create-modal-close"
                onClick={handleCloseCreateModal}
                aria-label="프로젝트 생성 팝업 닫기"
              >
                ×
              </button>

            </div>


            {/* Modal Form */}

            <form
              className="project-create-modal-form"
              onSubmit={handleSubmit}
            >

              <div className="project-create-modal-field">

                <label htmlFor="project-create-name">
                  프로젝트 제목
                  <span>*</span>
                </label>

                <input
                  id="project-create-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="프로젝트 제목을 입력해주세요"
                  required
                  autoFocus
                />

              </div>


              <div className="project-create-modal-field">

                <label htmlFor="project-create-description">
                  프로젝트 설명
                </label>

                <textarea
                  id="project-create-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="이 프로젝트가 무엇을 하는지 간단하게 설명해주세요"
                  rows={5}
                />

              </div>


              {/* Modal Actions */}

              <div className="project-create-modal-actions">

                <button
                  type="button"
                  className="project-create-modal-cancel"
                  onClick={handleCloseCreateModal}
                >
                  취소
                </button>

                <button
                  type="submit"
                  className="project-create-modal-submit"
                >
                  프로젝트 생성
                </button>

              </div>

            </form>

          </section>

        </div>

      )}

    </div>
  );
}

export default ProjectsPage;
