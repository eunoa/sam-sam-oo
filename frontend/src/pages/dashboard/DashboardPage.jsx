import './DashboardPage.css';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ProjectCard from '../../components/project/ProjectCard';
import MeetingCard from '../../components/meeting/MeetingCard';

import { useMeetings } from '../../context/MeetingContext';
import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';
import { useMembers } from '../../context/MemberContext';

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { meetings } = useMeetings();
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { members } = useMembers();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'overview'
  );

  const [expandedProjects, setExpandedProjects] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);

  /*
   * =========================
   * 프로젝트 생성
   * =========================
   */

  const handleCreateProject = () => {
    navigate('/projects/create', {
      state: {
        from: '/dashboard',
        activeTab,
      },
    });
  };

  /*
   * =========================
   * 프로젝트 전체 보기
   * =========================
   */

  const handleViewAllProjects = () => {
    navigate('/projects');
  };

  /*
   * =========================
   * 회의 전체 보기
   * =========================
   */

  const handleViewAllMeetings = () => {
    navigate('/meetings');
  };

  /*
   * =========================
   * 최근 회의
   *
   * 최신순 4개
   * =========================
   */

  const recentMeetings = [...meetings]
    .sort(
      (a, b) =>
        new Date(b.scheduledAt) -
        new Date(a.scheduledAt)
    )
    .slice(0, 4);

  /*
   * =========================
   * 프로젝트별 팀원
   * =========================
   */

  const getProjectMembers = (projectId) => {
    return members.filter(
      (member) => member.projectId === projectId
    );
  };

  const getMemberTasks = (projectId, memberId) => {
    return tasks.filter(
      (task) =>
        task.projectId === projectId &&
        task.assigneeId === memberId
    );
  };

  /*
   * =========================
   * 내가 팀장인 프로젝트
   * =========================
   */

  const leaderProjects = projects.filter((project) =>
    members.some(
      (member) =>
        member.projectId === project.projectId &&
        member.memberId === 1 &&
        member.role === 'LEADER'
    )
  );

  /*
   * =========================
   * 전체 인원 보기 / 접기
   * =========================
   */

  const handleToggleAllMembers = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  /*
   * =========================
   * 팀 현황
   * =========================
   */

  const renderTeamStatus = () => {
    return (
      <div className="team-status-content">

        {projects.slice(0, 4).map((project) => {
          const projectMembers = getProjectMembers(
            project.projectId
          );

          return (
            <section
              key={project.projectId}
              className="team-project-section"
            >

              {/* 프로젝트 헤더 */}

              <div className="team-project-header">

                <div className="team-project-title">

                  <h2>
                    {project.name}
                  </h2>

                  <p>
                    {project.description}
                  </p>

                </div>

                <div className="team-project-actions">

                  <span className="team-member-count">
                    {projectMembers.length}명
                  </span>

                  <button
                    type="button"
                    className="team-invite-button"
                    onClick={() =>
                      navigate(
                        `/members/invite?projectId=${project.projectId}`
                      )
                    }
                  >
                    + 인원 초대
                  </button>

                </div>

              </div>


              {/* 팀원 목록 */}

              <div className="team-member-list">

                {(expandedProjects[project.projectId]
                  ? projectMembers
                  : projectMembers.slice(0, 3)
                ).map((member) => {

                  const memberTasks = getMemberTasks(
                    project.projectId,
                    member.memberId
                  );

                  const isSelected =
                    selectedMember &&
                    selectedMember.projectId === project.projectId &&
                    selectedMember.member.memberId === member.memberId;

                  return (
                    <div
                      key={`${project.projectId}-${member.memberId}`}
                      className="team-member-item"
                    >

                      {/* 팀원 카드 */}

                      <div
                        className={`team-member-card ${
                          isSelected ? 'is-selected' : ''
                        }`}
                        onClick={() =>
                          setSelectedMember(
                            isSelected
                              ? null
                              : {
                                  projectId: project.projectId,
                                  member,
                                }
                          )
                        }
                      >

                        <div className="team-member-profile">

                          <div className="team-member-avatar">

                            {member.profileImage ? (
                              <img
                                src={member.profileImage}
                                alt=""
                              />
                            ) : (
                              member.name.charAt(0)
                            )}

                          </div>

                        </div>


                        <div className="team-member-info">

                          <div className="team-member-name">

                            {member.role === 'LEADER' && (
                              <span
                                className="team-leader-crown"
                                aria-label="팀장"
                                title="팀장"
                              >
                                👑
                              </span>
                            )}

                            <strong>
                              {member.name}
                            </strong>

                            <span className="team-member-role">
                              {member.role === 'LEADER'
                                ? '팀장'
                                : '팀원'}
                            </span>

                          </div>

                          <span className="team-member-email">
                            {member.email}
                          </span>

                        </div>


                        <div className="team-member-task">

                          <span>
                            담당 업무
                          </span>

                          <strong>
                            {memberTasks.length}
                          </strong>

                        </div>

                      </div>


                      {/* 선택한 팀원의 업무 상세 */}

                      {isSelected && (
                        <div className="team-member-task-detail">

                          <div className="team-member-task-detail-header">

                            <div>
                              <strong>
                                업무 현황
                              </strong>

                              <span>
                                {member.name}님의 업무
                              </span>
                            </div>

                            <button
                              type="button"
                              className="team-member-task-detail-close"
                              onClick={() =>
                                setSelectedMember(null)
                              }
                            >
                              닫기
                            </button>

                          </div>


                          {/* 업무 상태 요약 */}

                          <div className="team-member-task-summary">

                            <span className="task-status-summary task-status-waiting">
                              업무 대기{' '}
                              {
                                memberTasks.filter(
                                  (task) =>
                                    task.status === 'TODO'
                                ).length
                              }
                            </span>

                            <span className="task-status-summary task-status-progress">
                              업무 중{' '}
                              {
                                memberTasks.filter(
                                  (task) =>
                                    task.status === 'IN_PROGRESS'
                                ).length
                              }
                            </span>

                            <span className="task-status-summary task-status-done">
                              완료{' '}
                              {
                                memberTasks.filter(
                                  (task) =>
                                    task.status === 'DONE'
                                ).length
                              }
                            </span>

                          </div>


                          {/* 업무 목록 */}

                          <div className="team-member-task-list">

                            {memberTasks.length > 0 ? (
                              memberTasks.map((task) => (

                                <div
                                  key={task.taskId}
                                  className="team-member-task-item"
                                >

                                  <strong>
                                    {task.title}
                                  </strong>

                                  <span
                                    className={
                                      task.status === 'TODO'
                                        ? 'task-status-waiting'
                                        : task.status === 'IN_PROGRESS'
                                          ? 'task-status-progress'
                                          : 'task-status-done'
                                    }
                                  >
                                    {task.status === 'TODO'
                                      ? '업무 대기'
                                      : task.status === 'IN_PROGRESS'
                                        ? '업무 중'
                                        : '완료'}
                                  </span>

                                </div>

                              ))
                            ) : (
                              <p className="task-empty">
                                담당 업무가 없습니다.
                              </p>
                            )}

                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}

              </div>


              {/* 전체 인원 보기 */}

              {projectMembers.length > 3 && (
                <button
                  type="button"
                  className="view-all-button"
                  onClick={() =>
                    handleToggleAllMembers(
                      project.projectId
                    )
                  }
                >
                  {expandedProjects[project.projectId]
                    ? '인원 접기'
                    : '모든 인원 보기'}
                </button>
              )}

            </section>
          );
        })}

      </div>
    );
  };

  return (
    <div className="dashboard-page">

      {/* =========================
          대시보드 상단
      ========================= */}

      <header className="dashboard-header">

        <h1>
          대시보드
        </h1>

        <button
          type="button"
          className="create-project-button"
          onClick={handleCreateProject}
        >
          + 프로젝트 생성
        </button>

      </header>


      {/* =========================
          대시보드 탭
      ========================= */}

      <nav className="dashboard-tabs">

        <button
          type="button"
          className={`tab ${
            activeTab === 'overview'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveTab('overview')
          }
        >
          개요
        </button>

        <button
          type="button"
          className={`tab ${
            activeTab === 'team'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveTab('team')
          }
        >
          팀 현황
        </button>

        <button
          type="button"
          className={`tab ${
            activeTab === 'settings'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveTab('settings')
          }
        >
          업무 설정
        </button>

      </nav>


      {/* =========================
          개요
      ========================= */}

      {activeTab === 'overview' && (

        <div className="dashboard-content">

          {/* 내 프로젝트 */}

          <section className="dashboard-section">

            <h2>
              내 프로젝트
            </h2>

            <div className="project-list">

              {projects.slice(0, 4).map(
                (project) => (
                  <ProjectCard
                    key={project.projectId}
                    project={project}
                  />
                )
              )}

            </div>

            {projects.length > 4 && (
              <button
                type="button"
                className="view-all-button"
                onClick={handleViewAllProjects}
              >
                모든 프로젝트 보기
              </button>
            )}

          </section>


          {/* 최근 회의 */}

          <section className="dashboard-section">

            <h2>
              최근 회의
            </h2>

            <div className="meeting-list">

              {recentMeetings.length > 0 ? (

                recentMeetings.map(
                  (meeting) => (
                    <MeetingCard
                      key={meeting.meetingId}
                      meeting={meeting}
                    />
                  )
                )

              ) : (

                <p className="meeting-empty">
                  최근 회의가 없습니다.
                </p>

              )}

            </div>

            {meetings.length > 4 && (
              <button
                type="button"
                className="view-all-button"
                onClick={handleViewAllMeetings}
              >
                모든 회의 보기
              </button>
            )}

          </section>

        </div>
      )}


      {/* =========================
          팀 현황
      ========================= */}

      {activeTab === 'team' && (
        renderTeamStatus()
      )}


      {/* =========================
          업무 설정
      ========================= */}

      {activeTab === 'settings' && (

        <div className="task-settings-content">

          {/* 업무 상태 범례 */}

          <div className="task-status-legend">

            <span className="task-status-legend-title">
              업무 상태
            </span>

            <span className="task-status-legend-item task-status-legend-waiting">
              <i />
              업무 대기
            </span>

            <span className="task-status-legend-item task-status-legend-progress">
              <i />
              업무 중
            </span>

            <span className="task-status-legend-item task-status-legend-done">
              <i />
              완료
            </span>

          </div>


          {/* 팀장 프로젝트 */}

          {leaderProjects.length === 0 ? (

            <p className="task-settings-empty">
              현재 관리 중인 프로젝트가 없습니다.
            </p>

          ) : (

            leaderProjects.map((project) => {

              const projectTasks = tasks.filter(
                (task) =>
                  task.projectId === project.projectId
              );

              const recentMeetingTasks =
                projectTasks
                  .filter((task) => task.meetingId)
                  .sort((a, b) => {

                    const meetingA = meetings.find(
                      (meeting) =>
                        meeting.meetingId === a.meetingId
                    );

                    const meetingB = meetings.find(
                      (meeting) =>
                        meeting.meetingId === b.meetingId
                    );

                    return (
                      new Date(
                        meetingB?.scheduledAt || 0
                      ) -
                      new Date(
                        meetingA?.scheduledAt || 0
                      )
                    );
                  });

              return (

                <section
                  key={project.projectId}
                  className="task-project-section"
                >

                  {/* 프로젝트 헤더 */}

                  <div className="task-project-header">

                    <div>
                      <h2>
                        {project.name}
                      </h2>

                      <p>
                        {project.description}
                      </p>
                    </div>

                    <span>
                      {projectTasks.length}개 업무
                    </span>

                  </div>


                  <div className="task-settings-grid">

                    {/* =========================
                        프로젝트 업무
                    ========================= */}

                    <div className="task-settings-column">

                      <div className="task-settings-column-header">

                        <div>
                          <h3>
                            프로젝트 업무
                          </h3>

                          <span>
                            현재 등록된 업무
                          </span>
                        </div>

                        <button
                          type="button"
                          className="task-add-button"
                          onClick={() =>
                            navigate(
                              `/tasks/create?projectId=${project.projectId}`
                            )
                          }
                        >
                          + 업무 추가
                        </button>

                      </div>


                      <div className="task-list">

                        {projectTasks.length > 0 ? (

                          projectTasks
                            .slice(0, 4)
                            .map((task) => {

                              const assignee =
                                members.find(
                                  (member) =>
                                    member.memberId ===
                                      task.assigneeId &&
                                    member.projectId ===
                                      task.projectId
                                );

                              return (

                                <div
                                  key={task.taskId}
                                  className="task-card"
                                >

                                  <div className="task-main">

                                    <strong>
                                      {task.title}
                                    </strong>

                                    {task.description && (
                                      <p className="task-description">
                                        {task.description}
                                      </p>
                                    )}

                                    <span className="task-assignee">
                                      {assignee
                                        ? `담당자 ${assignee.name}`
                                        : '담당자 미지정'}
                                    </span>

                                  </div>


                                  <div className="task-meta">

                                    <span
                                      className={`task-status task-status-${task.status.toLowerCase()}`}
                                    >
                                      {task.status === 'TODO' &&
                                        '업무 대기'}

                                      {task.status === 'IN_PROGRESS' &&
                                        '업무 중'}

                                      {task.status === 'DONE' &&
                                        '완료'}
                                    </span>

                                  </div>

                                </div>
                              );
                            })

                        ) : (

                          <p className="task-empty">
                            등록된 업무가 없습니다.
                          </p>

                        )}

                      </div>


                      {projectTasks.length >= 5 && (

                        <div className="task-settings-actions">

                          <button
                            type="button"
                            className="task-view-all-button"
                            onClick={() =>
                              navigate(
                                `/projects/tasks?projectId=${project.projectId}`
                              )
                            }
                          >
                            전체 보기
                          </button>

                        </div>

                      )}

                    </div>


                    {/* =========================
                        최근 회의에서 생성된 업무
                    ========================= */}

                    <div className="task-settings-column task-recent-meetings">

                      <div className="task-settings-column-header">

                        <div>
                          <h3>
                            생성된 업무
                          </h3>

                          <span>
                            최근 회의에서 확인된 업무
                          </span>
                        </div>

                      </div>


                      <div className="task-meeting-list">

                        {recentMeetingTasks.length > 0 ? (

                          recentMeetingTasks
                            .slice(0, 4)
                            .map((task) => {

                              const meeting =
                                meetings.find(
                                  (meeting) =>
                                    meeting.meetingId ===
                                    task.meetingId
                                );

                              const assignee =
                                members.find(
                                  (member) =>
                                    member.memberId ===
                                      task.assigneeId &&
                                    member.projectId ===
                                      task.projectId
                                );

                              return (

                                <div
                                  key={task.taskId}
                                  className="task-meeting-card"
                                >

                                  {/* 회의 정보 */}

                                  <div className="task-meeting-card-header">

                                    <strong>
                                      {meeting
                                        ? meeting.title
                                        : '회의 정보 없음'}
                                    </strong>


                                    <div className="task-meeting-task-content">

                                      <h4 className="task-meeting-task-title">
                                        {task.title}
                                      </h4>

                                      {task.description && (
                                        <p className="task-meeting-task-description">
                                          {task.description}
                                        </p>
                                      )}

                                    </div>


                                    <div className="task-meeting-meta">

                                      <span
                                        className={`task-status task-status-${task.status.toLowerCase()}`}
                                      >
                                        {task.status === 'TODO' &&
                                          '업무 대기'}

                                        {task.status === 'IN_PROGRESS' &&
                                          '업무 중'}

                                        {task.status === 'DONE' &&
                                          '완료'}
                                      </span>

                                      {assignee ? (

                                        <span className="task-meeting-assignee-name">
                                          담당자 {assignee.name}
                                        </span>

                                      ) : (

                                        <span className="task-meeting-unassigned">
                                          담당자 지정 필요
                                        </span>

                                      )}

                                    </div>

                                  </div>

                                </div>
                              );
                            })

                        ) : (

                          <p className="task-empty">
                            최근 회의에서 생성된 업무가 없습니다.
                          </p>

                        )}

                      </div>


                      {recentMeetingTasks.length >= 5 && (

                        <div className="task-settings-actions">

                          <button
                            type="button"
                            className="task-view-all-button"
                            onClick={() =>
                              navigate(
                                `/projects/tasks?projectId=${project.projectId}&source=meeting`
                              )
                            }
                          >
                            전체 보기
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                </section>
              );
            })

          )}

        </div>
      )}

    </div>
  );
}

export default DashboardPage;