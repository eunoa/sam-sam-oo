import './ProjectMeetingsPage.css';

import { useNavigate, useParams } from 'react-router-dom';

import MeetingCard from '../../components/meeting/MeetingCard';
import { useMeetings } from '../../context/MeetingContext';
import { useProjects } from '../../context/ProjectContext';
import { useMembers } from '../../context/MemberContext';

function ProjectMeetingsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { meetings } = useMeetings();
  const { projects } = useProjects();
  const { members } = useMembers();

  const project = projects.find(
    (item) =>
      String(item.projectId) ===
      String(projectId)
  );

  /*
   * =========================
   * 현재 프로젝트의 내 역할
   * =========================
   */

  const currentMember = members.find(
    (member) =>
      String(member.projectId) ===
        String(projectId) &&
      member.memberId === 1
  );

  const isLeader =
    currentMember?.role === 'LEADER';


  /*
   * =========================
   * 프로젝트 회의
   * =========================
   */

  const projectMeetings = meetings.filter(
    (meeting) =>
      String(meeting.projectId) ===
      String(projectId)
  );


  /*
   * =========================
   * 회의 상태
   * =========================
   */

  const now = new Date();

  const isUpcomingMeeting = (meeting) => {
    return (
      new Date(meeting.scheduledAt) >= now
    );
  };

  const hasMinutes = (meeting) => {
    return (
      typeof meeting.manualContent === 'string' &&
      meeting.manualContent.trim() !== ''
    );
  };


  /*
   * =========================
   * 회의 분류
   *
   * 예정된 회의
   * → 회의록 작성 완료
   * → 회의록 작성 필요
   * =========================
   */

  const upcomingMeetings =
    projectMeetings
      .filter(isUpcomingMeeting)
      .sort(
        (a, b) =>
          new Date(a.scheduledAt) -
          new Date(b.scheduledAt)
      );

  const completedMeetings =
    projectMeetings
      .filter(
        (meeting) =>
          !isUpcomingMeeting(meeting) &&
          hasMinutes(meeting)
      )
      .sort(
        (a, b) =>
          new Date(b.scheduledAt) -
          new Date(a.scheduledAt)
      );

  const meetingsNeedingMinutes =
    projectMeetings
      .filter(
        (meeting) =>
          !isUpcomingMeeting(meeting) &&
          !hasMinutes(meeting)
      )
      .sort(
        (a, b) =>
          new Date(b.scheduledAt) -
          new Date(a.scheduledAt)
      );


  /*
   * =========================
   * 회의록 이동
   * =========================
   */

  const handleMinutesInput = (
    meetingId
  ) => {
    navigate(
      `/meetings/${meetingId}/minutes`,
      {
        state: {
          mode: 'edit',
          fromProject: true,
          projectId,
        },
      }
    );
  };

  const handleMinutesView = (
    meetingId
  ) => {
    navigate(
      `/meetings/${meetingId}/minutes`,
      {
        state: {
          mode: 'view',
          fromProject: true,
          projectId,
        },
      }
    );
  };


  /*
   * =========================
   * 돌아가기
   * =========================
   */

  const handleBack = () => {
    navigate('/dashboard');
  };


  /*
   * =========================
   * 프로젝트 없음
   * =========================
   */

  if (!project) {
    return (
      <div className="project-meetings-page">

        <section className="project-meetings-empty">

          <p>
            프로젝트를 찾을 수 없습니다.
          </p>

          <button
            type="button"
            className="project-meetings-back-button"
            onClick={handleBack}
          >
            돌아가기
          </button>

        </section>

      </div>
    );
  }


  /*
   * =========================
   * 회의 섹션
   * =========================
   */

  const renderMeetingSection = ({
    title,
    description,
    meetings: sectionMeetings,
    type,
  }) => {

    const isNeedsMinutes =
      type === 'needs-minutes';

    const isCompleted =
      type === 'completed';

    return (
      <section
        className={`project-meetings-section ${
          isNeedsMinutes
            ? 'needs-minutes'
            : ''
        } ${
          isCompleted
            ? 'completed'
            : ''
        }`}
      >

        <div className="project-meetings-section-header">

          <div>

            <h2>
              {title}
            </h2>

            {description && (
              <p>
                {description}
              </p>
            )}

          </div>

          <span className="project-meetings-count">
            {sectionMeetings.length}
          </span>

        </div>


        {sectionMeetings.length > 0 ? (

          <div className="project-meetings-list">

            {sectionMeetings.map(
              (meeting) => {

                const showMinutesButton =
                  isCompleted ||
                  isNeedsMinutes;

                const minutesButtonText =
                  isCompleted
                    ? '상세보기'
                    : isLeader
                      ? '회의록 입력'
                      : '상세보기';

                const handleClick =
                  isCompleted
                    ? () =>
                        handleMinutesView(
                          meeting.meetingId
                        )
                    : isNeedsMinutes
                      ? isLeader
                        ? () =>
                            handleMinutesInput(
                              meeting.meetingId
                            )
                        : () =>
                            handleMinutesView(
                              meeting.meetingId
                            )
                      : undefined;

                return (
                  <MeetingCard
                    key={meeting.meetingId}
                    meeting={meeting}
                    showProject={false}
                    showMinutesButton={
                      showMinutesButton
                    }
                    minutesButtonText={
                      minutesButtonText
                    }
                    onMinutesClick={
                      handleClick
                    }
                  />
                );
              }
            )}

          </div>

        ) : (

          <div className="project-meetings-empty-list">

            <p>
              {isNeedsMinutes
                ? '회의록 작성이 필요한 회의가 없습니다.'
                : isCompleted
                  ? '회의록이 작성된 회의가 없습니다.'
                  : '예정된 회의가 없습니다.'}
            </p>

          </div>

        )}

      </section>
    );
  };


  return (
    <div className="project-meetings-page">

      {/* =========================
          Header
      ========================= */}

      <header className="project-meetings-header">

        <div>

          <p className="project-meetings-label">
            프로젝트
          </p>

          <h1>
            {project.name}
          </h1>

        </div>

      </header>


      {/* =========================
          Meetings
      ========================= */}

      <div className="project-meetings-content">

        {renderMeetingSection({
          title: '예정된 회의',
          description:
            '앞으로 진행될 회의입니다.',
          meetings: upcomingMeetings,
          type: 'upcoming',
        })}


        {renderMeetingSection({
          title: '회의록 작성 완료',
          description:
            '회의록 작성이 완료된 회의입니다.',
          meetings: completedMeetings,
          type: 'completed',
        })}


        {renderMeetingSection({
          title: '회의록 작성 필요',
          description:
            isLeader
              ? '회의가 끝났지만 아직 회의록이 작성되지 않았습니다.'
              : '회의가 끝났지만 아직 회의록이 작성되지 않았습니다.',
          meetings: meetingsNeedingMinutes,
          type: 'needs-minutes',
        })}

      </div>


      {/* =========================
          Back
      ========================= */}

      <div className="project-meetings-actions">

        <button
          type="button"
          className="project-meetings-back-button"
          onClick={handleBack}
        >
          돌아가기
        </button>

      </div>

    </div>
  );
}

export default ProjectMeetingsPage;
