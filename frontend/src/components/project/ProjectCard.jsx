import './ProjectCard.css';

function ProjectCard({
  project,
  onClick,
  onMenuClick,
  isMenuOpen,
  onDelete,
}) {
  return (
    <article
      className="project-card"
      onClick={onClick}
    >
      <div className="project-card-top">

        <div>
          <h3 className="project-card-name">
            {project.name}
          </h3>

          <p className="project-card-description">
            {project.description}
          </p>
        </div>


        <div className="project-card-actions">

          <span className="project-card-role">
            {project.role === 'LEADER'
              ? '리더'
              : '멤버'}
          </span>


          {project.role === 'LEADER' && (
            <div className="team-project-menu-wrapper">

              <button
                type="button"
                className="team-project-menu-button"
                aria-label="프로젝트 관리"
                onClick={(event) => {
                  event.stopPropagation();
                  onMenuClick?.(event, project);
                }}
              >
                ⋮
              </button>


              {isMenuOpen && (
                <div className="team-project-menu">

                  <button
                    type="button"
                    className="team-project-menu-item team-project-delete-item"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete?.(project);
                    }}
                  >
                    프로젝트 삭제
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </article>
  );
}

export default ProjectCard;