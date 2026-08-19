function formatRowDate(deadlineString) {
  const deadline = new Date(deadlineString);

  const month = deadline.getMonth() + 1;
  const day = deadline.getDate();
  const hours = String(deadline.getHours()).padStart(2, '0');
  const minutes = String(deadline.getMinutes()).padStart(2, '0');

  return `${month}월 ${day}일 ${hours}:${minutes}`;
}

function TaskRow({ task }) {
  return (
    <article className="task-row">
      <div className="task-row-left">
        <h3 className="task-row-title">
          {task.title}
        </h3>

        <p className="task-row-date">
          {formatRowDate(task.deadline)}
        </p>

        <p className="task-row-project">
          {task.projectName}
        </p>
      </div>

      <p className="task-row-description">
        {task.description}
      </p>
    </article>
  );
}

export default TaskRow;
