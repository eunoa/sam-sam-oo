import './TaskCreatePage.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';
import { useMembers } from '../../context/MemberContext';

function TaskCreatePage() {
  const navigate = useNavigate();

  const { addTask } = useTasks();

  const {
    projects,
    currentProject,
    setCurrentProject,
  } = useProjects();

  const { members } = useMembers();

  /*
   * 내가 LEADER인 프로젝트만
   * 직접 업무 생성 가능
   */
  const leaderProjects =
      projects.filter(
          (project) =>
              project.role === 'LEADER'
      );

  /*
   * 현재 프로젝트가 LEADER라면
   * 기본 선택 프로젝트로 사용
   */
  const defaultProjectId =
      currentProject?.role === 'LEADER'
          ? String(
              currentProject.projectId
          )
          : leaderProjects.length > 0
              ? String(
                  leaderProjects[0].projectId
              )
              : '';

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState('');

  const projectId =
      selectedProjectId ||
      defaultProjectId;

  const selectedProject =
      leaderProjects.find(
          (project) =>
              String(project.projectId) ===
              String(projectId)
      );

  const projectMembers =
      members.filter(
          (member) =>
              String(member.projectId) ===
              String(projectId)
      );

  const [title, setTitle] =
      useState('');

  const [description, setDescription] =
      useState('');

  const [assigneeId, setAssigneeId] =
      useState('');

  const [deadline, setDeadline] =
      useState('');

  const [submitting, setSubmitting] =
      useState(false);

  /*
   * LEADER 프로젝트가 없는 경우
   */
  if (leaderProjects.length === 0) {
    return (
        <div className="task-create-page">

          <header className="task-create-header">
            <h1>업무 추가</h1>
          </header>

          <section className="task-create-section">

            <p>
              업무를 생성할 수 있는 프로젝트가 없습니다.
            </p>

            <p>
              업무 생성은 프로젝트 팀장만 가능합니다.
            </p>

          </section>

          <div className="task-create-actions">

            <button
                type="button"
                className="task-create-cancel-button"
                onClick={() =>
                    navigate('/tasks')
                }
            >
              돌아가기
            </button>

          </div>

        </div>
    );
  }

  const handleProjectChange = (
      event
  ) => {
    setSelectedProjectId(
        event.target.value
    );

    /*
     * 프로젝트가 바뀌면
     * 담당자도 초기화
     */
    setAssigneeId('');
  };

  const handleSubmit = async (
      event
  ) => {
    event.preventDefault();

    const trimmedTitle =
        title.trim();

    if (!projectId) {
      alert(
          '프로젝트를 선택해주세요.'
      );
      return;
    }

    if (!trimmedTitle) {
      alert(
          '업무 제목을 입력해주세요.'
      );
      return;
    }

    if (!assigneeId) {
      alert(
          '담당자를 선택해주세요.'
      );
      return;
    }

    try {
      setSubmitting(true);

      await addTask(
          {
            title: trimmedTitle,
            description:
                description.trim(),
            assigneeId:
                Number(assigneeId),
            deadline:
                deadline || null,
          },
          Number(projectId)
      );

      /*
       * 생성한 프로젝트를
       * 현재 프로젝트로 변경
       */
      if (selectedProject) {
        setCurrentProject(
            selectedProject
        );
      }

      alert(
          '업무가 생성되었습니다.'
      );

      navigate('/tasks');

    } catch (error) {
      console.error(
          '업무 생성 실패:',
          error
      );

      alert(
          error.message ||
          '업무 생성에 실패했습니다.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="task-create-page">

        <header className="task-create-header">

          <h1>업무 추가</h1>

          <p>
            프로젝트에 새로운 업무를 추가해보세요.
          </p>

        </header>

        <form
            className="task-create-form"
            onSubmit={handleSubmit}
        >

          <div className="task-create-section">

            {/* 프로젝트 */}

            <div className="task-create-field">

              <label htmlFor="task-project">
                프로젝트
                <span>*</span>
              </label>

              <select
                  id="task-project"
                  value={projectId}
                  onChange={
                    handleProjectChange
                  }
                  required
              >

                {leaderProjects.map(
                    (project) => (
                        <option
                            key={
                              project.projectId
                            }
                            value={
                              project.projectId
                            }
                        >
                          {project.name}
                        </option>
                    )
                )}

              </select>

            </div>

            {/* 업무 제목 */}

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
                      setTitle(
                          event.target.value
                      )
                  }
                  placeholder="업무 제목을 입력해주세요"
                  required
              />

            </div>

            {/* 설명 */}

            <div className="task-create-field">

              <label htmlFor="task-description">
                업무 설명
              </label>

              <textarea
                  id="task-description"
                  value={description}
                  onChange={(event) =>
                      setDescription(
                          event.target.value
                      )
                  }
                  placeholder="업무 내용을 간단하게 설명해주세요"
                  rows={5}
              />

            </div>

            {/* 담당자 */}

            <div className="task-create-field">

              <label htmlFor="task-assignee">
                담당자
                <span>*</span>
              </label>

              <select
                  id="task-assignee"
                  value={assigneeId}
                  onChange={(event) =>
                      setAssigneeId(
                          event.target.value
                      )
                  }
                  required
              >

                <option value="">
                  담당자를 선택해주세요
                </option>

                {projectMembers.map(
                    (member) => (
                        <option
                            key={
                              member.userId
                            }
                            value={
                              member.userId
                            }
                        >
                          {member.name}
                          {member.role ===
                          'LEADER'
                              ? ' (팀장)'
                              : ''}
                        </option>
                    )
                )}

              </select>

            </div>

            {/* 마감일 */}

            <div className="task-create-field">

              <label htmlFor="task-deadline">
                마감일
              </label>

              <input
                  id="task-deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(event) =>
                      setDeadline(
                          event.target.value
                      )
                  }
              />

            </div>

          </div>

          <div className="task-create-actions">

            <button
                type="button"
                className="task-create-cancel-button"
                onClick={() =>
                    navigate('/tasks')
                }
            >
              취소
            </button>

            <button
                type="submit"
                className="task-create-submit-button"
                disabled={submitting}
            >
              {submitting
                  ? '생성 중...'
                  : '업무 추가'}
            </button>

          </div>

        </form>

      </div>
  );
}

export default TaskCreatePage;