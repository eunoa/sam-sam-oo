import TaskCard from './TaskCard';

function TaskColumn({
                        title,
                        tasks,
                        onStatusChange,
                    }) {
    return (
        <section className="taskboard-column">

            <div className="taskboard-column-header">

                <h2>
                    {title}
                </h2>

                <span className="taskboard-column-count">
          {tasks.length}
        </span>

            </div>

            <div className="taskboard-column-body">

                {tasks.length > 0 ? (

                    tasks.map((task) => (
                        <TaskCard
                            key={task.taskId}
                            task={task}
                            onStatusChange={
                                onStatusChange
                            }
                        />
                    ))

                ) : (

                    <p className="taskboard-column-empty">
                        해당하는 업무가 없습니다.
                    </p>

                )}

            </div>

        </section>
    );
}

export default TaskColumn;