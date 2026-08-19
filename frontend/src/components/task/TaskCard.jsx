const STATUS_BADGE_CLASS = {
  TODO: 'badge-todo',
  IN_PROGRESS: 'badge-in-progress',
  DONE: 'badge-done',
};

function getDday(deadlineString) {
  const deadline = new Date(deadlineString);
  const today = new Date();

  const startOfDeadline = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate()
  );

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const days = Math.round(
    (startOfDeadline - startOfToday) / (1000 * 60 * 60 * 24)
  );

  if (days > 0) return `D-${days}`;
  if (days === 0) return 'D-day';
  return `D+${Math.abs(days)}`;
}

function TaskCard({ task }) {
  const deadline = new Date(task.deadline);
  const formattedDeadline = `${deadline.getMonth() + 1}/${deadline.getDate()}`;

  const badgeLabel =
    task.status === 'DONE' ? '완료' : getDday(task.deadline);

  return (
    <article className="taskboard-card">
      <p className="taskboard-card-project">
        {task.projectName}
      </p>

      <div className="taskboard-card-top">
        <h3 className="taskboard-card-title">
          {task.title}
        </h3>

        <span
          className={`taskboard-card-badge ${STATUS_BADGE_CLASS[task.status]}`}
        >
          {badgeLabel}
        </span>
      </div>

      <p className="taskboard-card-description">
        {task.description}
      </p>

      <div className="taskboard-card-bottom">
        <span className="taskboard-card-assignee">
          <span className="taskboard-card-avatar" />
          {task.assigneeName}
        </span>

        <span className="taskboard-card-date">
          {formattedDeadline}
        </span>
      </div>
    </article>
  );
}

export default TaskCard;
