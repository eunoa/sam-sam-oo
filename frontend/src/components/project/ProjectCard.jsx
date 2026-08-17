import './ProjectCard.css';

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card-top">
        <div>
          <h3 className="project-card-name">
            {project.name}
          </h3>

          <p className="project-card-description">
            {project.description}
          </p>
        </div>

        <span className="project-card-role">
          {project.role === 'LEADER' ? '리더' : '멤버'}
        </span>
      </div>
    </article>
  );
}

export default ProjectCard;