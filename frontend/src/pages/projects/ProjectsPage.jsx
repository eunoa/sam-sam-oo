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
    deleteProject,
  } = useProjects();

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] =
    useState('');

  const [openProjectMenu, setOpenProjectMenu] =
    useState(null);

  const [deleteProjectTarget, setDeleteProjectTarget] =
    useState(null);


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

  const handleProjectMenuClick = (
    event,
    project
  ) => {
    event.stopPropagation();

    setOpenProjectMenu((prev) =>
      prev === project.projectId
        ? null
        : project.projectId
    );
  };

  const handleDeleteProject = (project) => {
    setDeleteProjectTarget(project);
    setOpenProjectMenu(null);
  };

  const handleConfirmDeleteProject = () => {
    if (!deleteProjectTarget) {
      return;
    }

    // ProjectContext에 이미 있는 삭제 함수 사용
    deleteProject(deleteProjectTarget.projectId);

    setDeleteProjectTarget(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      await addProject({
        name: trimmedName,
        description: description.trim(),
      });

      handleCloseCreateModal();
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
    }
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
                  onClick={() => {
                    navigate(
                      `/projects/${project.projectId}/meetings`
                    );
                  }}
                  onMenuClick={handleProjectMenuClick}
                  isMenuOpen={
                    openProjectMenu === project.projectId
                  }
                  onDelete={handleDeleteProject}
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

      {deleteProjectTarget && (

        <div className="project-delete-modal-overlay">

          <div
            className="project-delete-modal"
            role="dialog"
            aria-modal="true"
          >

            <h3 className="project-delete-modal-title">
              프로젝트 삭제
            </h3>

            <p className="project-delete-modal-message">
              &quot;{deleteProjectTarget.name}&quot; 프로젝트를 삭제하시겠습니까?
            </p>

            <p className="project-delete-modal-warning">
              삭제한 프로젝트는 되돌릴 수 없습니다.
            </p>

            <div className="project-delete-modal-actions">

              <button
                type="button"
                className="project-delete-modal-cancel"
                onClick={() =>
                  setDeleteProjectTarget(null)
                }
              >
                취소
              </button>

              <button
                type="button"
                className="project-delete-modal-confirm"
                onClick={handleConfirmDeleteProject}
              >
                삭제
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ProjectsPage;
