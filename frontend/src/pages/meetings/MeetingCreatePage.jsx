import './MeetingCreatePage.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useProjects } from '../../context/ProjectContext';
import { useMeeting } from '../../context/MeetingContext';
import {
  createMeeting,
  recommendTime,
  updateMeetingImportant,
} from '../../services/meetingService';

function MeetingCreatePage() {
  const navigate = useNavigate();

  const { projects } = useProjects();
  const { fetchMeetings } = useMeeting();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState('');

  const selectedProjectId = useMemo(() => {
    if (projectId) {
      return Number(projectId);
    }

    if (projects.length > 0) {
      return projects[0].projectId;
    }

    return '';
  }, [projectId, projects]);

  useEffect(() => {
    if (!selectedProjectId) {
      setAiRecommendation(null);
      return;
    }

    let cancelled = false;

    const fetchRecommendation = async () => {
      try {
        setRecommendLoading(true);
        setRecommendError('');

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const today = `${year}-${month}-${day}`;

        const response = await recommendTime(
            selectedProjectId,
            {
              date: today,
              startTime: '09:00',
              endTime: '22:00',
            }
        );

        if (!cancelled) {
          setAiRecommendation(response);
        }
      } catch (error) {
        console.error('AI 회의 시간 추천 실패:', error);

        if (!cancelled) {
          setAiRecommendation(null);
          setRecommendError(
              error.message ||
              'AI 회의 시간을 추천하지 못했습니다.'
          );
        }
      } finally {
        if (!cancelled) {
          setRecommendLoading(false);
        }
      }
    };

    fetchRecommendation();

    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  const handleSelectRecommendation = () => {
    if (!aiRecommendation) {
      return;
    }

    setDate(aiRecommendation.date);

    const recommendedStartTime =
        aiRecommendation.time
            ?.split('~')[0]
            ?.trim();

    if (recommendedStartTime) {
      setTime(recommendedStartTime);
    }
  };

  const formatRecommendationDate = (dateString) => {
    if (!dateString) {
      return '';
    }

    const dateObject = new Date(
        `${dateString}T00:00:00`
    );

    return dateObject.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatRecommendationTime = (timeString) => {
    if (!timeString) {
      return '';
    }

    const startTime = timeString
        .split('~')[0]
        ?.trim();

    if (!startTime) {
      return timeString;
    }

    const [hourString, minuteString] =
        startTime.split(':');

    const hour = Number(hourString);
    const minute = minuteString || '00';

    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour % 12 || 12;

    return `${period} ${displayHour}:${minute}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert('회의 제목을 입력해주세요.');
      return;
    }

    if (!selectedProjectId) {
      alert('프로젝트를 선택해주세요.');
      return;
    }

    if (!date) {
      alert('회의 날짜를 선택해주세요.');
      return;
    }

    if (!time) {
      alert('회의 시간을 선택해주세요.');
      return;
    }

    try {
      const response = await createMeeting(
          selectedProjectId,
          {
            title: title.trim(),
            scheduledAt: `${date}T${time}:00`,
          }
      );

      if (
          isImportant &&
          response?.meetingId
      ) {
        await updateMeetingImportant(
            response.meetingId,
            true
        );
      }

      console.log(
          '회의 생성 성공:',
          response
      );

      alert('회의가 생성되었습니다.');

      await fetchMeetings(
          selectedProjectId
      );

      navigate('/meetings', {
        state: {
          refresh: true,
          activeTab: 'all',
        },
      });
    } catch (error) {
      console.error(
          '회의 생성 실패:',
          error
      );

      alert(
          '회의 생성 실패: ' +
          (
              error.response?.data?.message ||
              error.response?.data ||
              error.message
          )
      );
    }
  };

  return (
      <div className="meeting-create-page">
        <header className="meeting-create-header">
          <h1>새 회의</h1>

          <p className="meeting-create-description">
            새로운 회의 일정을 등록하세요.
          </p>
        </header>

        <form
            className="meeting-create-form"
            onSubmit={handleSubmit}
        >
          <div className="meeting-form-field">
            <label htmlFor="meeting-title">
              회의 제목
            </label>

            <input
                id="meeting-title"
                type="text"
                value={title}
                onChange={(event) =>
                    setTitle(event.target.value)
                }
                placeholder="회의 제목을 입력하세요."
            />
          </div>

          <div className="meeting-form-field">
            <label htmlFor="meeting-project">
              프로젝트
            </label>

            <select
                id="meeting-project"
                value={selectedProjectId}
                onChange={(event) =>
                    setProjectId(
                        Number(event.target.value)
                    )
                }
                disabled={projects.length === 0}
            >
              {projects.length === 0 ? (
                  <option value="">
                    프로젝트가 없습니다
                  </option>
              ) : (
                  projects.map((project) => (
                      <option
                          key={project.projectId}
                          value={project.projectId}
                      >
                        {project.name}
                      </option>
                  ))
              )}
            </select>
          </div>

          <section className="ai-recommendation">
            <div className="ai-recommendation-header">
            <span className="ai-recommendation-icon">
              ✨
            </span>

              <h2>AI 추천 일정</h2>
            </div>

            <div className="ai-recommendation-content">
              {!selectedProjectId && (
                  <p className="ai-recommendation-reason">
                    프로젝트를 먼저 선택해주세요.
                  </p>
              )}

              {selectedProjectId &&
                  recommendLoading && (
                      <p className="ai-recommendation-reason">
                        AI가 팀원들의 가능 시간을
                        분석하고 있습니다...
                      </p>
                  )}

              {selectedProjectId &&
                  !recommendLoading &&
                  recommendError && (
                      <p className="ai-recommendation-reason">
                        {recommendError}
                      </p>
                  )}

              {selectedProjectId &&
                  !recommendLoading &&
                  !recommendError &&
                  aiRecommendation && (
                      <>
                        <div className="ai-recommendation-date">
                          <strong>
                            {formatRecommendationDate(
                                aiRecommendation.date
                            )}
                          </strong>

                          <span>
                      {formatRecommendationTime(
                          aiRecommendation.time
                      )}
                    </span>
                        </div>

                        <p className="ai-recommendation-reason">
                          {aiRecommendation.reason}
                        </p>

                        <button
                            type="button"
                            className="ai-recommendation-button"
                            onClick={
                              handleSelectRecommendation
                            }
                        >
                          이 시간 선택
                        </button>
                      </>
                  )}
            </div>
          </section>

          <div className="meeting-form-field">
            <label htmlFor="meeting-date">
              날짜
            </label>

            <input
                id="meeting-date"
                type="date"
                value={date}
                onChange={(event) =>
                    setDate(event.target.value)
                }
            />
          </div>

          <div className="meeting-form-field">
            <label htmlFor="meeting-time">
              시간
            </label>

            <input
                id="meeting-time"
                type="time"
                value={time}
                onChange={(event) =>
                    setTime(event.target.value)
                }
            />
          </div>

          <div className="meeting-form-important">
            <button
                type="button"
                className={`meeting-form-star ${
                    isImportant ? 'active' : ''
                }`}
                onClick={() =>
                    setIsImportant(
                        (prev) => !prev
                    )
                }
                aria-label={
                  isImportant
                      ? '중요 회의 해제'
                      : '중요 회의 설정'
                }
            >
              {isImportant ? '★' : '☆'}
            </button>

            <span>중요 회의</span>
          </div>

          <div className="meeting-create-actions">
            <button
                type="button"
                className="meeting-cancel-button"
                onClick={() =>
                    navigate('/meetings')
                }
            >
              취소
            </button>

            <button
                type="submit"
                className="meeting-create-submit-button"
                disabled={!selectedProjectId}
            >
              회의 생성
            </button>
          </div>
        </form>
      </div>
  );
}

export default MeetingCreatePage;