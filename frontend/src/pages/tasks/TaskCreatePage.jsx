import './TaskCreatePage.css';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';
import { useMembers } from '../../context/MemberContext';

function TaskCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { addTask } = useTasks();
  const { projects } = useProjects();
  const { members } = useMembers();

  const searchParams = new URLSearchParams(location.search);
const projectId = Number(searchParams.get('projectId'));
const meetingId = searchParams.get('meetingId');

  const project = projects.find(
    (item) => item.projectId === projectId
  );

  const projectMembers = members.filter(
    (member) => member.projectId === projectId
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !project || !assigneeId) {
      return;
    }

    const nextTaskId = Date.now();

    addTask({
      taskId: nextTaskId,
      projectId,
      meetingId: meetingId
        ? Number(meetingId)
        : undefined,
      title: trimmedTitle,
      description: description.trim(),
      assigneeId: Number(assigneeId),
      status: 'TODO',
      deadline: deadline || null,
      createdAt: new Date().toISOString(),
    });

    navigate('/dashboard', {
      state: {
        activeTab: 'settings',
      },
    });
  };

  const handleCancel = () => {
    navigate('/dashboard', {
      state: {
        activeTab: 'settings',
      },
    });
  };

  return (
    <div className="task-create-page">

      <header className="task-create-header">
        <h1>업무 추가</h1>

        <p>
          {project?.name || '프로젝트'} 프로젝트에 새로운 업무를 추가해보세요.
        </p>
      </header>


      <form
        className="task-create-form"
        onSubmit={handleSubmit}
      >

        <div className="task-create-section">

          <div className="task-create-project">
            <span>프로젝트</span>

            <strong>
              {project?.name || '프로젝트'}
            </strong>
          </div>


          <div className="task-create-field">

            <label htmlFor="task-title">
              업무 제목
              <span>*</span>
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="업무 제목을 입력해주세요"
              required
            />

          </div>


          <div className="task-create-field">

            <label htmlFor="task-description">
              업무 설명
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="업무 내용을 간단하게 설명해주세요"
              rows={5}
            />

          </div>


          <div className="task-create-field">

            <label htmlFor="task-assignee">
              담당자
              <span>*</span>
            </label>

            <select
              id="task-assignee"
              value={assigneeId}
              onChange={(event) =>
                setAssigneeId(event.target.value)
              }
              required
            >
              <option value="">
                담당자를 선택해주세요
              </option>

              {projectMembers.map((member) => (
                <option
                  key={`${member.projectId}-${member.memberId}`}
                  value={member.memberId}
                >
                  {member.name}
                </option>
              ))}

            </select>

          </div>


          <div className="task-create-field">

            <label htmlFor="task-deadline">
              마감일
            </label>

            <input
              id="task-deadline"
              type="datetime-local"
              value={deadline}
              onChange={(event) =>
                setDeadline(event.target.value)
              }
            />

          </div>

        </div>


        <div className="task-create-actions">

          <button
            type="button"
            className="task-create-cancel-button"
            onClick={handleCancel}
          >
            취소
          </button>

          <button
            type="submit"
            className="task-create-submit-button"
          >
            업무 추가
          </button>

        </div>

      </form>

    </div>
  );
}

export default TaskCreatePage;
