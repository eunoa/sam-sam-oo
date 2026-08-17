import './ProjectTasksPage.css';

import { useLocation, useNavigate } from 'react-router-dom';

import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';
import { useMembers } from '../../context/MemberContext';

function ProjectTasksPage() {
  const location = useLocation();
const navigate = useNavigate();

  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { members } = useMembers();

  const searchParams = new URLSearchParams(location.search);
  const projectId = Number(searchParams.get('projectId'));
const source = searchParams.get('source');

  const project = projects.find(
    (item) => item.projectId === projectId
  );

  const projectTasks = tasks.filter(
    (task) =>
      task.projectId === projectId &&
      (source !== "meeting" || task.meetingId)
  );

  const getAssigneeName = (task) => {
    const member = members.find(
      (item) =>
        item.memberId === task.assigneeId &&
        item.projectId === task.projectId
    );

    return member?.name || '담당자 미지정';
  };

  const getStatusLabel = (status) => {
    if (status === 'TODO') {
      return '업무 대기';
    }

    if (status === 'IN_PROGRESS') {
      return '업무 중';
    }

    if (status === 'DONE') {
      return '완료';
    }

    return status;
  };

  const formatDeadline = (deadline) => {
    if (!deadline) {
      return '마감일 없음';
    }

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return '마감일 없음';
    }

    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="project-tasks-page">

      <header className="project-tasks-header">

        <div>
          <h1>
            {project?.name || '프로젝트'} {source === 'meeting' ? '생성된 업무' : '업무'}
          </h1>

          <p>
            {source === 'meeting' ? '최근 회의에서 생성된 업무를 확인할 수 있습니다.' : '프로젝트에 등록된 모든 업무를 확인할 수 있습니다.'}
          </p>
        </div>

        <span className="project-tasks-count">
          총 {projectTasks.length}개 업무
        </span>

      </header>


      <section className="project-tasks-section">

        {projectTasks.length > 0 ? (

          <div className="project-tasks-list">

            {projectTasks.map((task) => (

              <article
                key={task.taskId}
                className="project-task-card"
              >

                <div className="project-task-main">

                  <div className="project-task-title-row">

                    <h2>
                      {task.title}
                    </h2>

                    <span
                      className={`project-task-status project-task-status-${task.status.toLowerCase()}`}
                    >
                      {getStatusLabel(task.status)}
                    </span>

                  </div>

                  {task.description && (
                    <p className="project-task-description">
                      {task.description}
                    </p>
                  )}

                </div>


                <div className="project-task-meta">

                  <div className="project-task-meta-item">
                    <span>
                      담당자
                    </span>

                    <strong>
                      {getAssigneeName(task)}
                    </strong>
                  </div>

                  <div className="project-task-meta-item">
                    <span>
                      마감일
                    </span>

                    <strong>
                      {formatDeadline(task.deadline)}
                    </strong>
                  </div>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="project-tasks-empty">
            등록된 업무가 없습니다.
          </div>

        )}

      </section>

      <div className="project-tasks-actions">

        <button
          type="button"
          className="project-tasks-back-button"
          onClick={() =>
            navigate("/dashboard", {
              state: {
                activeTab: "settings",
              },
            })
          }
        >
          돌아가기
        </button>

      </div>



    </div>
  );
}

export default ProjectTasksPage;
