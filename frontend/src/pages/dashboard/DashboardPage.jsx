import './DashboardPage.css';

import { useEffect, useState } from 'react';
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

  const {
    projects,
    addProject,
    deleteProject,
  } = useProjects();

  const {
    members,
    deleteMember,
  } = useMembers();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'overview'
  );

  const [expandedProjects, setExpandedProjects] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);

  const [projectNameError, setProjectNameError] = useState('');

  // 현재 열려 있는 프로젝트 관리 메뉴
  const [openProjectMenu, setOpenProjectMenu] = useState(null);

  // 프로젝트 삭제 확인 팝업 대상
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);

  // 현재 팀원 제외 모드가 활성화된 프로젝트 ID
  const [removeMemberProjectId, setRemoveMemberProjectId] =
    useState(null);

  /*
   * =========================
   * 프로젝트 관리 메뉴 외부 클릭
   * =========================
   */

  useEffect(() => {
    const handleDocumentClick = () => {
      setOpenProjectMenu(null);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener(
        'click',
        handleDocumentClick
      );
    };
  }, []);

  /*
   * =========================
   * 탭 변경
   * =========================
   */

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // 탭 이동 시 열려 있던 메뉴/선택 상태 초기화
    setOpenProjectMenu(null);
    setSelectedMember(null);
  };

  /*
   * =========================
   * 프로젝트 생성
   * =========================
   */

  const handleCreateProject = () => {
    setOpenProjectMenu(null);

    setProjectName('');
    setProjectDescription('');
    setIsCreateProjectModalOpen(true);
  };

  const handleCloseCreateProjectModal = () => {
    setIsCreateProjectModalOpen(false);
    setProjectName('');
    setProjectDescription('');
  };

  const handleSubmitCreateProject = (event) => {
    event.preventDefault();

    const trimmedName = projectName.trim();

    if (!trimmedName) {
      setProjectNameError('프로젝트 제목을 입력해주세요.');
      return;
    }

    const isDuplicateName = projects.some(
      (project) =>
        project.name.trim().toLowerCase() ===
        trimmedName.toLowerCase()
    );

    if (isDuplicateName) {
      setProjectNameError(
        '이미 존재하는 프로젝트 이름입니다.'
      );
      return;
    }

    setProjectNameError('');

    const nextProjectId =
      projects.length > 0
        ? Math.max(
            ...projects.map(
              (project) => project.projectId
            )
          ) + 1
        : 1;

    const newProject = {
      projectId: nextProjectId,
      name: trimmedName,
      description: projectDescription.trim(),
    };

    addProject(newProject);

    handleCloseCreateProjectModal();

    setActiveTab('team');
  };

  /*
   * =========================
   * 프로젝트 전체 보기
   * =========================
   */

  const handleViewAllProjects = () => {
    setOpenProjectMenu(null);
    navigate('/projects');
  };

  /*
   * =========================
   * 회의 전체 보기
   * =========================
   */

  const handleViewAllMeetings = () => {
    setOpenProjectMenu(null);
    navigate('/meetings');
  };

  /*
   * =========================
   * 프로젝트 관리 메뉴
   * =========================
   */

  const handleProjectMenuClick = (
    event,
    project
  ) => {
    // document click으로 바로 닫히는 것 방지
    event.stopPropagation();

    setOpenProjectMenu((prev) =>
      prev === project.projectId
        ? null
        : project.projectId
    );

    // 다른 프로젝트의 팀원 제외 모드 종료
    setRemoveMemberProjectId(null);

    // 선택된 팀원 초기화
    setSelectedMember(null);
  };

  /*
   * =========================
   * 프로젝트 삭제
   * =========================
   */
  const handleDeleteProject = (project) => {
    setDeleteProjectTarget(project);
    setOpenProjectMenu(null);
  };

  const handleConfirmDeleteProject = async () => {
    if (!deleteProjectTarget) {
      return;
    }

    try {
      await deleteProject(deleteProjectTarget.projectId);

      setDeleteProjectTarget(null);
      setRemoveMemberProjectId(null);
      setSelectedMember(null);
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      alert('프로젝트 삭제에 실패했습니다: ' + (error.response?.data?.message || error.message));
    }
  };

  /*
   * =========================
   * 팀원 제외 모드 시작
   * =========================
   */

  const handleStartRemoveMember = (
    event,
    projectId
  ) => {
    event.stopPropagation();

    setOpenProjectMenu(null);
    setSelectedMember(null);

    setRemoveMemberProjectId(projectId);
  };

  /*
   * =========================
   * 팀원 제외 모드 취소
   * =========================
   */

  const handleCancelRemoveMember = () => {
    setRemoveMemberProjectId(null);
    setSelectedMember(null);
  };

  /*
   * =========================
   * 팀원 제외
   * =========================
   */

  const handleRemoveMember = (
    projectId,
    member
  ) => {
    // 팀장은 제외할 수 없음
    if (member.role === 'LEADER') {
      window.alert(
        '팀장은 프로젝트에서 제외할 수 없습니다.'
      );

      return;
    }

    const confirmed = window.confirm(
      `"${member.name}"님을 이 프로젝트에서 제외하시겠습니까?\n\n제외된 팀원은 해당 프로젝트의 팀원 목록에서 사라집니다.`
    );

    if (!confirmed) {
      return;
    }

    deleteMember(
      projectId,
      member.memberId
    );

    setRemoveMemberProjectId(null);
    setSelectedMember(null);
  };

  /*
   * =========================
   * 최근 회의
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
      (member) =>
        member.projectId === projectId
    );
  };

  /*
   * =========================
   * 팀원별 업무
   * =========================
   */

  const getMemberTasks = (
    projectId,
    memberId
  ) => {
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

  const leaderProjects = projects.filter(
    (project) =>
      members.some(
        (member) =>
          member.projectId ===
            project.projectId &&
          member.memberId === 1 &&
          member.role === 'LEADER'
      )
  );

  /*
   * =========================
   * 전체 인원 보기 / 접기
   * =========================
   */

  const handleToggleAllMembers = (
    projectId
  ) => {
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

        {projects.map(
          (project) => {
            const projectMembers =
              getProjectMembers(
                project.projectId
              );

            const isRemoveMode =
              removeMemberProjectId ===
              project.projectId;

            return (
              <section
                key={project.projectId}
                className={`team-project-section ${
                  isRemoveMode
                    ? 'is-remove-mode'
                    : ''
                }`}
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


                    {/* 팀장인 프로젝트에서만 관리 메뉴 */}

                    {project.role === 'LEADER' && (

                      <div
                        className="team-project-menu-wrapper"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >

                        <button
                          type="button"
                          className={`team-project-menu-button ${
                            openProjectMenu ===
                            project.projectId
                              ? 'is-open'
                              : ''
                          }`}
                          aria-label="프로젝트 관리"
                          aria-expanded={
                            openProjectMenu ===
                            project.projectId
                          }
                          onClick={(event) =>
                            handleProjectMenuClick(
                              event,
                              project
                            )
                          }
                        >
                          <span />
                          <span />
                          <span />
                        </button>


                        {openProjectMenu ===
                          project.projectId && (

                          <div
                            className="team-project-menu-dropdown"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >

                            <button
                              type="button"
                              className="team-project-menu-item"
                              onClick={(event) =>
                                handleStartRemoveMember(
                                  event,
                                  project.projectId
                                )
                              }
                            >
                              <span>
                                팀원 제외
                              </span>
                            </button>


                            <button
                              type="button"
                              className="team-project-menu-item team-project-delete-item"
                              onClick={() =>
                                handleDeleteProject(
                                  project
                                )
                              }
                            >
                              <span>
                                프로젝트 삭제
                              </span>
                            </button>

                          </div>
                        )}

                      </div>
                    )}

                  </div>

                </div>


                {/* 팀원 제외 모드 안내 */}

                {isRemoveMode && (

                  <div className="team-member-remove-notice">

                    <div className="team-member-remove-notice-content">

                      <div className="team-member-remove-icon">
                        ×
                      </div>

                      <div>
                        <strong>
                          팀원 제외 모드
                        </strong>

                        <span>
                          제외할 팀원을 선택해주세요.
                        </span>
                      </div>

                    </div>


                    <button
                      type="button"
                      className="team-member-remove-cancel"
                      onClick={
                        handleCancelRemoveMember
                      }
                    >
                      취소
                    </button>

                  </div>
                )}


                {/* 팀원 목록 */}

                <div className="team-member-list">

                  {(expandedProjects[
                    project.projectId
                  ]
                    ? projectMembers
                    : projectMembers.slice(
                        0,
                        3
                      )
                  ).map((member) => {

                    const memberTasks =
                      getMemberTasks(
                        project.projectId,
                        member.memberId
                      );

                    const isSelected =
                      selectedMember &&
                      selectedMember.projectId ===
                        project.projectId &&
                      selectedMember.member.memberId ===
                        member.memberId;

                    const isLeader =
                      member.role === 'LEADER';

                    return (
                      <div
                        key={`${project.projectId}-${member.memberId}`}
                        className="team-member-item"
                      >

                        {/* 팀원 카드 */}

                        <div
                          className={`team-member-card ${
                            isSelected
                              ? 'is-selected'
                              : ''
                          } ${
                            isRemoveMode
                              ? 'is-remove-member-mode'
                              : ''
                          } ${
                            isLeader
                              ? 'is-project-leader'
                              : ''
                          }`}
                          onClick={() => {

                            if (isRemoveMode) {
                              handleRemoveMember(
                                project.projectId,
                                member
                              );

                              return;
                            }

                            setSelectedMember(
                              isSelected
                                ? null
                                : {
                                    projectId:
                                      project.projectId,
                                    member,
                                  }
                            );
                          }}
                        >

                          <div className="team-member-profile">

                            <div className="team-member-avatar">

                              {member.profileImage ? (
                                <img
                                  src={
                                    member.profileImage
                                  }
                                  alt=""
                                />
                              ) : (
                                member.name.charAt(
                                  0
                                )
                              )}

                            </div>

                          </div>


                          <div className="team-member-info">

                            <div className="team-member-name">

                              {isLeader && (
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
                                {isLeader
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
                              {
                                memberTasks.length
                              }
                            </strong>

                          </div>


                          {isRemoveMode && (
                            <div className="team-member-remove-arrow">
                              {isLeader
                                ? '제외 불가'
                                : '제외'}
                            </div>
                          )}

                        </div>


                        {/* 선택한 팀원의 업무 상세 */}

                        {isSelected &&
                          !isRemoveMode && (

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
                                  setSelectedMember(
                                    null
                                  )
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
                                      task.status ===
                                      'TODO'
                                  ).length
                                }
                              </span>

                              <span className="task-status-summary task-status-progress">
                                업무 중{' '}
                                {
                                  memberTasks.filter(
                                    (task) =>
                                      task.status ===
                                      'IN_PROGRESS'
                                  ).length
                                }
                              </span>

                              <span className="task-status-summary task-status-done">
                                완료{' '}
                                {
                                  memberTasks.filter(
                                    (task) =>
                                      task.status ===
                                      'DONE'
                                  ).length
                                }
                              </span>

                            </div>


                            {/* 업무 목록 */}

                            <div className="team-member-task-list">

                              {memberTasks.length >
                              0 ? (

                                memberTasks.map(
                                  (task) => (

                                    <div
                                      key={
                                        task.taskId
                                      }
                                      className="team-member-task-item"
                                    >

                                      <strong>
                                        {task.title}
                                      </strong>

                                      <span
                                        className={
                                          task.status ===
                                          'TODO'
                                            ? 'task-status-waiting'
                                            : task.status ===
                                                'IN_PROGRESS'
                                              ? 'task-status-progress'
                                              : 'task-status-done'
                                        }
                                      >
                                        {task.status ===
                                        'TODO'
                                          ? '업무 대기'
                                          : task.status ===
                                              'IN_PROGRESS'
                                            ? '업무 중'
                                            : '완료'}
                                      </span>

                                    </div>

                                  )
                                )

                              ) : (

                                <p className="task-empty">
                                  담당 업무가
                                  없습니다.
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

                {projectMembers.length >
                  3 && (

                  <button
                    type="button"
                    className="view-all-button"
                    onClick={() =>
                      handleToggleAllMembers(
                        project.projectId
                      )
                    }
                  >
                    {expandedProjects[
                      project.projectId
                    ]
                      ? '인원 접기'
                      : '모든 인원 보기'}
                  </button>

                )}

              </section>
            );
          }
        )}

      </div>
    );
  };

  return (
    <div
      className="dashboard-page"
      onClick={() => {
        setOpenProjectMenu(null);
      }}
    >

      {/* 대시보드 상단 */}

      <header
        className="dashboard-header"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

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


      {/* 대시보드 탭 */}

      <nav
        className="dashboard-tabs"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <button
          type="button"
          className={`tab ${
            activeTab === 'overview'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            handleTabChange('overview')
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
            handleTabChange('team')
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
            handleTabChange('settings')
          }
        >
          업무 설정
        </button>

      </nav>


      {/* 개요 */}

      {activeTab === 'overview' && (

        <div className="dashboard-content">

          <section className="dashboard-section">

            <h2>
              내 프로젝트
            </h2>

            <div className="project-list">

              {projects.map(
                (project) => (

                  <ProjectCard
                    key={project.projectId}
                    project={project}
                    onClick={() => {
                      setOpenProjectMenu(null);

                      navigate(
                        `/projects/${project.projectId}/meetings`
                      );
                    }}
                    onMenuClick={
                      handleProjectMenuClick
                    }
                    isMenuOpen={
                      openProjectMenu ===
                      project.projectId
                    }
                    onDelete={
                      handleDeleteProject
                    }
                  />

                )
              )}

            </div>

            {projects.length > 4 && (

              <button
                type="button"
                className="view-all-button"
                onClick={
                  handleViewAllProjects
                }
              >
                모든 프로젝트 보기
              </button>

            )}

          </section>


          <section className="dashboard-section">

            <h2>
              최근 회의
            </h2>

            <div className="meeting-list">

              {recentMeetings.length > 0 ? (

                recentMeetings.map(
                  (meeting) => (

                    <MeetingCard
                      key={
                        meeting.meetingId
                      }
                      meeting={meeting}
                      onClick={() => {
                        setOpenProjectMenu(null);

                        navigate(
                          `/meetings/${meeting.meetingId}/minutes`,
                          {
                            state: {
                              fromDashboard:
                                true,
                            },
                          }
                        );
                      }}
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
                onClick={
                  handleViewAllMeetings
                }
              >
                모든 회의 보기
              </button>

            )}

          </section>

        </div>
      )}


      {/* 팀 현황 */}

      {activeTab === 'team' &&
        renderTeamStatus()}


      {/* 업무 설정 */}

      {activeTab === 'settings' && (

        <div className="task-settings-content">

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


          {leaderProjects.length ===
          0 ? (

            <p className="task-settings-empty">
              현재 관리 중인 프로젝트가
              없습니다.
            </p>

          ) : (

            leaderProjects.map(
              (project) => {

                const projectTasks =
                  tasks.filter(
                    (task) =>
                      task.projectId ===
                      project.projectId
                  );

                const recentMeetingTasks =
                  projectTasks
                    .filter(
                      (task) =>
                        task.meetingId
                    )
                    .sort((a, b) => {

                      const meetingA =
                        meetings.find(
                          (meeting) =>
                            meeting.meetingId ===
                            a.meetingId
                        );

                      const meetingB =
                        meetings.find(
                          (meeting) =>
                            meeting.meetingId ===
                            b.meetingId
                        );

                      return (
                        new Date(
                          meetingB?.scheduledAt ||
                            0
                        ) -
                        new Date(
                          meetingA?.scheduledAt ||
                            0
                        )
                      );
                    });

                return (

                  <section
                    key={
                      project.projectId
                    }
                    className="task-project-section"
                  >

                    <div className="task-project-header">

                      <div>
                        <h2>
                          {project.name}
                        </h2>

                        <p>
                          {
                            project.description
                          }
                        </p>
                      </div>

                      <span>
                        {projectTasks.length}
                        개 업무
                      </span>

                    </div>


                    <div className="task-settings-grid">

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

                          {projectTasks.length >
                          0 ? (

                            projectTasks
                              .slice(0, 4)
                              .map(
                                (task) => {

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
                                      key={
                                        task.taskId
                                      }
                                      className="task-card"
                                    >

                                      <div className="task-main">

                                        <strong>
                                          {
                                            task.title
                                          }
                                        </strong>

                                        {task.description && (
                                          <p className="task-description">
                                            {
                                              task.description
                                            }
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
                                          {task.status ===
                                            'TODO' &&
                                            '업무 대기'}

                                          {task.status ===
                                            'IN_PROGRESS' &&
                                            '업무 중'}

                                          {task.status ===
                                            'DONE' &&
                                            '완료'}
                                        </span>

                                      </div>

                                    </div>
                                  );
                                }
                              )

                          ) : (

                            <p className="task-empty">
                              등록된 업무가
                              없습니다.
                            </p>

                          )}

                        </div>


                        {projectTasks.length >=
                          5 && (

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


                      <div className="task-settings-column task-recent-meetings">

                        <div className="task-settings-column-header">

                          <div>
                            <h3>
                              생성된 업무
                            </h3>

                            <span>
                              최근 회의에서 확인된
                              업무
                            </span>
                          </div>

                        </div>


                        <div className="task-meeting-list">

                          {recentMeetingTasks.length >
                          0 ? (

                            recentMeetingTasks
                              .slice(0, 4)
                              .map(
                                (task) => {

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
                                      key={
                                        task.taskId
                                      }
                                      className="task-meeting-card"
                                    >

                                      <div className="task-meeting-card-header">

                                        <strong>
                                          {meeting
                                            ? meeting.title
                                            : '회의 정보 없음'}
                                        </strong>


                                        <div className="task-meeting-task-content">

                                          <h4 className="task-meeting-task-title">
                                            {
                                              task.title
                                            }
                                          </h4>

                                          {task.description && (
                                            <p className="task-meeting-task-description">
                                              {
                                                task.description
                                              }
                                            </p>
                                          )}

                                        </div>


                                        <div className="task-meeting-meta">

                                          <span
                                            className={`task-status task-status-${task.status.toLowerCase()}`}
                                          >
                                            {task.status ===
                                              'TODO' &&
                                              '업무 대기'}

                                            {task.status ===
                                              'IN_PROGRESS' &&
                                              '업무 중'}

                                            {task.status ===
                                              'DONE' &&
                                              '완료'}
                                          </span>

                                          {assignee ? (

                                            <span className="task-meeting-assignee-name">
                                              담당자{' '}
                                              {
                                                assignee.name
                                              }
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
                                }
                              )

                          ) : (

                            <p className="task-empty">
                              최근 회의에서 생성된
                              업무가 없습니다.
                            </p>

                          )}

                        </div>


                        {recentMeetingTasks.length >=
                          5 && (

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
              }
            )

          )}

        </div>
      )}


      {deleteProjectTarget && (

        <div className="project-delete-modal-overlay">

          <div className="project-delete-modal" role="dialog" aria-modal="true">

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

            {/* =========================
                    프로젝트 생성 모달
                ========================= */}

                {isCreateProjectModalOpen && (

                  <div
                    className="dashboard-project-create-modal-overlay"
                    role="presentation"
                    onMouseDown={(event) => {
                      if (
                        event.target === event.currentTarget
                      ) {
                        handleCloseCreateProjectModal();
                      }
                    }}
                  >

                    <section
                      className="dashboard-project-create-modal"
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="dashboard-project-create-title"
                    >

                      <div className="dashboard-project-create-header">

                        <div>

                          <h2
                            id="dashboard-project-create-title"
                          >
                            프로젝트 생성
                          </h2>

                          <p>
                            새로운 프로젝트를 만들어보세요.
                          </p>

                        </div>

                        <button
                          type="button"
                          className="dashboard-project-create-close"
                          onClick={
                            handleCloseCreateProjectModal
                          }
                          aria-label="프로젝트 생성 팝업 닫기"
                        >
                          ×
                        </button>

                      </div>


                      <form
                        className="dashboard-project-create-form"
                        onSubmit={
                          handleSubmitCreateProject
                        }
                      >

                        <div className="dashboard-project-create-field">

                          <label htmlFor="dashboard-project-name">
                            프로젝트 제목
                            <span>*</span>
                          </label>

                          <input
                            id="dashboard-project-name"
                            type="text"
                            value={projectName}
                            onChange={(event) => {
                              setProjectName(event.target.value);
                              setProjectNameError('');
                            }}
                            placeholder="프로젝트 제목을 입력해주세요"
                            required
                            autoFocus
                          />

                          {projectNameError && (
                            <p className="project-create-modal-error">
                              {projectNameError}
                            </p>
                          )}

                        </div>


                        <div className="dashboard-project-create-field">

                          <label htmlFor="dashboard-project-description">
                            프로젝트 설명
                          </label>

                          <textarea
                            id="dashboard-project-description"
                            value={projectDescription}
                            onChange={(event) =>
                              setProjectDescription(
                                event.target.value
                              )
                            }
                            placeholder="이 프로젝트가 무엇을 하는지 간단하게 설명해주세요"
                            rows={5}
                          />

                        </div>


                        <div className="dashboard-project-create-actions">

                          <button
                            type="button"
                            className="dashboard-project-create-cancel"
                            onClick={
                              handleCloseCreateProjectModal
                            }
                          >
                            취소
                          </button>

                          <button
                            type="submit"
                            className="dashboard-project-create-submit"
                          >
                            프로젝트 생성
                          </button>

                        </div>

                      </form>

                    </section>

                  </div>

                )}

    </div>
  );
}

export default DashboardPage;