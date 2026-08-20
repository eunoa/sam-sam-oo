import './ProjectMeetingsPage.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import MeetingCard from '../../components/meeting/MeetingCard';

import { useProjects } from '../../context/ProjectContext';

import {
  getMeetings,
} from '../../services/meetingService';

function ProjectMeetingsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { projects } = useProjects();

  const [projectMeetings, setProjectMeetings] =
      useState([]);

  const [loading, setLoading] =
      useState(true);

  /*
   * =========================
   * 현재 프로젝트
   * =========================
   */

  const project = projects.find(
      (item) =>
          String(item.projectId) ===
          String(projectId)
  );

  /*
   * =========================
   * 현재 프로젝트의 내 역할
   * =========================
   *
   * 프로젝트 API에서 내려주는
   * 현재 로그인 사용자의 role 사용
   */

  const isLeader =
      project?.role === 'LEADER';

  /*
   * =========================
   * 프로젝트 회의 조회
   * =========================
   *
   * MeetingContext에 남아 있는
   * 다른 프로젝트 회의 데이터에
   * 의존하지 않고 URL projectId로
   * 직접 조회
   */

  useEffect(() => {
    let cancelled = false;

    const loadMeetings = async () => {
      try {
        setLoading(true);

        const data = await getMeetings(
            projectId
        );

        if (!cancelled) {
          setProjectMeetings(
              Array.isArray(data)
                  ? data
                  : data?.meetings ?? []
          );
        }
      } catch (error) {
        console.error(
            '프로젝트 회의 조회 실패:',
            error
        );

        if (!cancelled) {
          setProjectMeetings([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (projectId) {
      void loadMeetings();
    }

    return () => {
      cancelled = true;
    };
  }, [projectId]);

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

  /*
   * =========================
   * 회의 분류
   *
   * 예정된 회의
   * → SCHEDULED + 미래
   *
   * 회의록 작성 완료
   * → FINISHED
   *
   * 회의록 작성 필요
   * → FINISHED가 아니면서
   *   이미 시간이 지난 회의
   * =========================
   */

  const upcomingMeetings =
      projectMeetings
          .filter(
              (meeting) =>
                  meeting.status ===
                  'SCHEDULED' &&
                  isUpcomingMeeting(meeting)
          )
          .sort(
              (a, b) =>
                  new Date(a.scheduledAt) -
                  new Date(b.scheduledAt)
          );

  const completedMeetings =
      projectMeetings
          .filter(
              (meeting) =>
                  meeting.status ===
                  'FINISHED'
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
                  meeting.status !==
                  'FINISHED' &&
                  !isUpcomingMeeting(meeting)
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
   * 로딩
   * =========================
   */

  if (loading) {
    return (
        <div className="project-meetings-page">

          <section className="project-meetings-empty">

            <p>
              회의를 불러오는 중입니다.
            </p>

          </section>

        </div>
    );
  }

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

                      /*
                       * 팀장
                       * - 완료 회의: 상세보기
                       * - 미작성 회의: 회의록 입력
                       *
                       * 팀원
                       * - 완료 회의: 상세보기
                       * - 미작성 회의: 상세보기
                       */

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
                              key={
                                meeting.meetingId
                              }
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
            meetings:
            meetingsNeedingMinutes,
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