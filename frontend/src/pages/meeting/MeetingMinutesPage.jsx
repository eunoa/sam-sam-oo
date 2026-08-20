import './MeetingMinutesPage.css';

import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useMeetings } from '../../context/MeetingContext';
import { useMembers } from '../../context/MemberContext';
import { useProjects } from '../../context/ProjectContext';
import { useTasks } from '../../context/TaskContext';

import {
  getMeetingDetail,
  generateSummary,
  getSummary,
  generateTaskSuggestions,
  getTaskSuggestions,
  approveTaskSuggestion,
  translateMeeting,
} from '../../services/meetingService';

const TRANSLATION_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'fr', label: 'Français' },
  { value: 'ko', label: '한국어' },
];

/*
 * 번역 API의 Response 필드명이
 * 현재 문서에서 확정되지 않았으므로
 * 확인 가능한 형태를 안전하게 처리
 */
function extractTranslatedText(result) {
  if (!result) {
    return '';
  }

  if (typeof result === 'string') {
    return result;
  }

  const candidates = [
    result.translatedText,
    result.translatedContent,
    result.translatedSummary,
    result.translation,
    result.content,
    result.summary,
    result.text,
  ];

  const found = candidates.find(
      (value) =>
          typeof value === 'string' &&
          value.trim() !== ''
  );

  return found || '';
}

function MeetingMinutesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { meetingId } = useParams();

  const {
    meetings,
    saveMinutes,
  } = useMeetings();

  const {
    members,
  } = useMembers();

  const {
    projects,
    currentProject,
  } = useProjects();

  const {
    fetchTasks,
  } = useTasks();

  /*
   * =========================
   * Context 기본 회의
   * =========================
   */

  const meetingFromContext =
      meetings.find(
          (item) =>
              String(item.meetingId) ===
              String(meetingId)
      );

  /*
   * =========================
   * State
   * =========================
   */

  const [meeting, setMeeting] =
      useState(
          meetingFromContext || null
      );

  const [minutes, setMinutes] =
      useState('');

  const [summary, setSummary] =
      useState('');

  const [
    taskSuggestions,
    setTaskSuggestions,
  ] = useState([]);

  const [
    suggestionAssignees,
    setSuggestionAssignees,
  ] = useState({});

  const [
    approvedSuggestions,
    setApprovedSuggestions,
  ] = useState({});

  const [loading, setLoading] =
      useState(true);

  const [
    summaryLoading,
    setSummaryLoading,
  ] = useState(false);

  const [
    suggestionsLoading,
    setSuggestionsLoading,
  ] = useState(false);

  /*
   * =========================
   * 번역 State
   * =========================
   */

  const [
    targetLanguage,
    setTargetLanguage,
  ] = useState('en');

  const [
    translatedText,
    setTranslatedText,
  ] = useState('');

  const [
    translationLoading,
    setTranslationLoading,
  ] = useState(false);

  /*
   * =========================
   * 화면 정보
   * =========================
   */

  const requestedMode =
      location.state?.mode;

  const fromTab =
      location.state?.fromTab ||
      'all';

  const fromDashboard =
      location.state?.fromDashboard ||
      false;

  /*
   * =========================
   * 회의 상세 로딩
   * =========================
   */

  useEffect(() => {
    if (!meetingId) {
      return;
    }

    let cancelled = false;

    const loadMeeting = async () => {
      try {
        setLoading(true);

        const detail =
            await getMeetingDetail(
                meetingId
            );

        if (cancelled) {
          return;
        }

        setMeeting(detail);

        setMinutes(
            detail?.manualContent || ''
        );

        /*
         * FINISHED 회의
         * → 요약
         * → AI 추천 업무
         */
        if (
            detail?.status ===
            'FINISHED'
        ) {
          /*
           * AI 요약 조회
           */
          try {
            const summaryData =
                await getSummary(
                    meetingId
                );

            if (!cancelled) {
              setSummary(
                  summaryData?.summary ||
                  ''
              );
            }
          } catch (error) {
            console.log(
                '저장된 AI 요약 없음:',
                error
            );

            if (!cancelled) {
              setSummary('');
            }
          }

          /*
           * AI 추천 업무 조회
           */
          try {
            const suggestionData =
                await getTaskSuggestions(
                    meetingId
                );

            const list =
                Array.isArray(
                    suggestionData
                )
                    ? suggestionData
                    : suggestionData
                        ?.suggestions ||
                    suggestionData
                        ?.content ||
                    [];

            if (!cancelled) {
              setTaskSuggestions(
                  list
              );

              const approvedMap = {};

              list.forEach(
                  (suggestion) => {
                    if (
                        suggestion.approved ===
                        true
                    ) {
                      approvedMap[
                          suggestion.suggestionId
                          ] = true;
                    }
                  }
              );

              setApprovedSuggestions(
                  approvedMap
              );
            }
          } catch (error) {
            console.log(
                '저장된 AI 추천 업무 없음:',
                error
            );

            if (!cancelled) {
              setTaskSuggestions([]);
            }
          }
        }
      } catch (error) {
        console.error(
            '회의 상세 조회 실패:',
            error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadMeeting();

    return () => {
      cancelled = true;
    };
  }, [meetingId]);

  /*
   * =========================
   * 현재 회의 프로젝트
   * =========================
   */

  const meetingProjectId =
      meeting?.projectId ||
      currentProject?.projectId;

  const meetingProject =
      projects.find(
          (project) =>
              String(
                  project.projectId
              ) ===
              String(
                  meetingProjectId
              )
      );

  const isLeader =
      meetingProject?.role ===
      'LEADER';

  const projectMembers =
      members.filter(
          (member) =>
              String(
                  member.projectId
              ) ===
              String(
                  meetingProjectId
              )
      );

  /*
   * =========================
   * 회의록 존재 여부
   * =========================
   */

  const hasMinutes =
      Boolean(
          meeting?.manualContent
              ?.trim()
      );

  const mode =
      requestedMode ||
      (
          meeting?.status ===
          'FINISHED' ||
          hasMinutes
              ? 'view'
              : 'edit'
      );

  const isViewMode =
      mode === 'view';

  /*
   * =========================
   * 돌아가기
   * =========================
   */

  const handleBack = () => {
    navigate('/meetings', {
      state: {
        activeTab: fromTab,
      },
    });
  };

  /*
   * =========================
   * 회의록 저장
   * =========================
   */

  const handleSave = async () => {
    const trimmedMinutes =
        minutes.trim();

    if (!trimmedMinutes) {
      alert(
          '회의록 내용을 입력해주세요.'
      );
      return;
    }

    try {
      await saveMinutes(
          Number(meetingId),
          trimmedMinutes
      );

      const updatedMeeting =
          await getMeetingDetail(
              meetingId
          );

      setMeeting(
          updatedMeeting
      );

      /*
       * AI 요약 자동 생성
       */
      try {
        setSummaryLoading(true);

        const summaryData =
            await generateSummary(
                meetingId
            );

        setSummary(
            summaryData?.summary ||
            ''
        );
      } catch (error) {
        console.error(
            'AI 회의 요약 생성 실패:',
            error
        );
      } finally {
        setSummaryLoading(false);
      }

      alert(
          '회의록이 저장되었습니다.'
      );

      navigate('/meetings', {
        state: {
          activeTab: 'past',
          refresh: true,
        },
      });

    } catch (error) {
      console.error(
          '회의록 저장 실패:',
          error
      );

      alert(
          '회의록 저장에 실패했습니다.'
      );
    }
  };

  /*
   * =========================
   * AI 요약 생성
   * =========================
   */

  const handleGenerateSummary =
      async () => {
        if (!meeting?.manualContent) {
          alert(
              '먼저 회의록을 작성해주세요.'
          );
          return;
        }

        try {
          setSummaryLoading(true);

          const result =
              await generateSummary(
                  meetingId
              );

          setSummary(
              result?.summary || ''
          );

          /*
           * 요약이 새로 생성됐으므로
           * 기존 번역은 초기화
           */
          setTranslatedText('');

        } catch (error) {
          console.error(
              'AI 회의 요약 생성 실패:',
              error
          );

          alert(
              'AI 회의 요약 생성에 실패했습니다.'
          );
        } finally {
          setSummaryLoading(false);
        }
      };

  /*
   * =========================
   * 회의 요약 번역
   * =========================
   */

  const handleTranslate = async () => {
    if (!summary) {
      alert(
          '먼저 AI 회의록 요약을 생성해주세요.'
      );
      return;
    }

    try {
      setTranslationLoading(true);
      setTranslatedText('');

      const result =
          await translateMeeting(
              meetingId,
              targetLanguage
          );

      console.log(
          '회의 번역 API 응답:',
          result
      );

      const translated =
          extractTranslatedText(
              result
          );

      if (!translated) {
        console.warn(
            '번역 결과 필드를 확인할 수 없습니다.',
            result
        );

        alert(
            '번역 요청은 성공했지만 번역 결과 필드를 확인할 수 없습니다. 개발자 콘솔의 "회의 번역 API 응답"을 확인해주세요.'
        );

        return;
      }

      setTranslatedText(
          translated
      );

    } catch (error) {
      console.error(
          '회의 번역 실패:',
          error
      );

      alert(
          error.message ||
          '회의 번역에 실패했습니다.'
      );
    } finally {
      setTranslationLoading(false);
    }
  };

  /*
   * =========================
   * 번역 언어 변경
   * =========================
   */

  const handleLanguageChange = (
      event
  ) => {
    setTargetLanguage(
        event.target.value
    );

    /*
     * 언어 변경 시
     * 이전 번역 결과 초기화
     */
    setTranslatedText('');
  };

  /*
   * =========================
   * AI 업무 추천 생성
   * =========================
   */

  const handleGenerateSuggestions =
      async () => {
        try {
          setSuggestionsLoading(
              true
          );

          await generateTaskSuggestions(
              meetingId
          );

          const fetched =
              await getTaskSuggestions(
                  meetingId
              );

          const fetchedList =
              Array.isArray(fetched)
                  ? fetched
                  : fetched?.suggestions ||
                  fetched?.content ||
                  [];

          setTaskSuggestions(
              fetchedList
          );

          const approvedMap = {};

          fetchedList.forEach(
              (suggestion) => {
                if (
                    suggestion.approved ===
                    true
                ) {
                  approvedMap[
                      suggestion.suggestionId
                      ] = true;
                }
              }
          );

          setApprovedSuggestions(
              approvedMap
          );

        } catch (error) {
          console.error(
              'AI 업무 추천 생성 실패:',
              error
          );

          alert(
              'AI 업무 추천 생성에 실패했습니다.'
          );
        } finally {
          setSuggestionsLoading(
              false
          );
        }
      };

  /*
   * =========================
   * 담당자 선택
   * =========================
   */

  const handleAssigneeChange = (
      suggestionId,
      assigneeId
  ) => {
    setSuggestionAssignees(
        (prev) => ({
          ...prev,
          [suggestionId]:
          assigneeId,
        })
    );
  };

  /*
   * =========================
   * AI 추천 업무 승인
   * =========================
   */

  const handleApproveSuggestion =
      async (suggestion) => {
        const suggestionId =
            suggestion.suggestionId;

        const assigneeId =
            suggestionAssignees[
                suggestionId
                ];

        if (!assigneeId) {
          alert(
              '담당자를 선택해주세요.'
          );
          return;
        }

        try {
          await approveTaskSuggestion(
              meetingId,
              suggestionId,
              Number(assigneeId)
          );

          setApprovedSuggestions(
              (prev) => ({
                ...prev,
                [suggestionId]: true,
              })
          );

          setTaskSuggestions(
              (prev) =>
                  prev.map(
                      (item) =>
                          item.suggestionId ===
                          suggestionId
                              ? {
                                ...item,
                                approved: true,
                              }
                              : item
                  )
          );

          if (meetingProjectId) {
            await fetchTasks(
                meetingProjectId
            );
          }

          alert(
              '업무가 생성되었습니다.'
          );

        } catch (error) {
          console.error(
              'AI 추천 업무 생성 실패:',
              error
          );

          alert(
              error.message ||
              '업무 생성에 실패했습니다.'
          );
        }
      };

  /*
   * =========================
   * 로딩
   * =========================
   */

  if (loading) {
    return (
        <div className="meeting-minutes-page">

          <section className="meeting-minutes-empty">
            <p>
              회의 정보를 불러오고 있습니다.
            </p>
          </section>

        </div>
    );
  }

  /*
   * =========================
   * 회의 없음
   * =========================
   */

  if (!meeting) {
    return (
        <div className="meeting-minutes-page">

          <section className="meeting-minutes-empty">

            <p>
              회의를 찾을 수 없습니다.
            </p>

            <div className="meeting-minutes-actions">

              <button
                  type="button"
                  className="meeting-minutes-back-button"
                  onClick={() =>
                      navigate('/meetings')
                  }
              >
                돌아가기
              </button>

            </div>

          </section>

        </div>
    );
  }

  /*
   * =========================
   * 날짜 / 시간
   * =========================
   */

  const date =
      new Date(
          meeting.scheduledAt
      );

  const formattedDate =
      date.toLocaleDateString(
          'ko-KR',
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short',
          }
      );

  const formattedTime =
      date.toLocaleTimeString(
          'ko-KR',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
      );

  return (
      <div className="meeting-minutes-page">

        {/* Header */}

        <header className="meeting-minutes-header">

          <h1>
            {isViewMode
                ? '회의록 상세보기'
                : '회의록 입력'}
          </h1>

        </header>

        {/* 회의 정보 */}

        <section className="meeting-minutes-info">

          {meetingProject?.name && (
              <p className="meeting-minutes-project">
                {meetingProject.name}
              </p>
          )}

          <h2>
            {meeting.title}
          </h2>

          <p className="meeting-minutes-date">
            {formattedDate}{' '}
            {formattedTime}
          </p>

        </section>

        {/* 회의 내용 */}

        <section className="meeting-minutes-content">

          <h2>
            회의 내용
          </h2>

          {fromDashboard &&
              !hasMinutes &&
              isViewMode && (

                  <div className="meeting-minutes-view">

                    <p className="meeting-minutes-empty-text">
                      아직 작성된 회의록이 없습니다.
                    </p>

                    <p className="meeting-minutes-empty-description">
                      팀장이 회의록을 작성하면 이곳에서 확인할 수 있습니다.
                    </p>

                  </div>

              )}

          {!isViewMode &&
              !fromDashboard && (

                  <div className="meeting-minutes-edit">

              <textarea
                  className="meeting-minutes-textarea"
                  value={minutes}
                  onChange={(event) =>
                      setMinutes(
                          event.target.value
                      )
                  }
                  placeholder="회의 내용을 입력해주세요."
              />

                  </div>

              )}

          {isViewMode &&
              hasMinutes && (

                  <div className="meeting-minutes-view">

                    <p>
                      {meeting.manualContent}
                    </p>

                  </div>

              )}

        </section>

        {/* AI 회의록 요약 */}

        {isViewMode &&
            hasMinutes && (

                <section className="meeting-minutes-summary">

                  <h2>
                    AI 회의록 요약
                  </h2>

                  {summaryLoading ? (

                      <p>
                        AI가 회의 내용을 요약하고 있습니다...
                      </p>

                  ) : summary ? (

                      <p>
                        {summary}
                      </p>

                  ) : (

                      <>
                        <p>
                          아직 생성된 AI 요약이 없습니다.
                        </p>

                        <button
                            type="button"
                            className="meeting-minutes-save-button"
                            onClick={
                              handleGenerateSummary
                            }
                        >
                          AI 요약 생성
                        </button>
                      </>

                  )}

                </section>

            )}

        {/* =========================
          회의 요약 번역
      ========================= */}

        {isViewMode &&
            hasMinutes &&
            summary && (

                <section className="meeting-translation-section">

                  <div className="meeting-translation-header">

                    <div>

                      <h2>
                        회의 요약 번역
                      </h2>

                      <p>
                        AI 회의 요약을 원하는 언어로 번역합니다.
                      </p>

                    </div>

                    <div className="meeting-translation-controls">

                      <select
                          value={
                            targetLanguage
                          }
                          onChange={
                            handleLanguageChange
                          }
                          disabled={
                            translationLoading
                          }
                          aria-label="번역 언어 선택"
                      >

                        {TRANSLATION_LANGUAGES.map(
                            (language) => (
                                <option
                                    key={
                                      language.value
                                    }
                                    value={
                                      language.value
                                    }
                                >
                                  {language.label}
                                </option>
                            )
                        )}

                      </select>

                      <button
                          type="button"
                          className="meeting-translate-button"
                          onClick={
                            handleTranslate
                          }
                          disabled={
                            translationLoading
                          }
                      >
                        {translationLoading
                            ? '번역 중...'
                            : '번역하기'}
                      </button>

                    </div>

                  </div>

                  {translatedText && (

                      <div className="meeting-translation-result">

                        <h3>
                          번역 결과
                        </h3>

                        <p>
                          {translatedText}
                        </p>

                      </div>

                  )}

                </section>

            )}

        {/* AI 추천 업무 */}

        {isViewMode &&
            hasMinutes && (

                <section className="meeting-task-suggestions">

                  <div className="meeting-task-suggestions-header">

                    <div>

                      <h2>
                        AI 추천 업무
                      </h2>

                      <p>
                        회의 내용을 바탕으로 AI가 추천한 업무입니다.
                      </p>

                    </div>

                    {isLeader &&
                        taskSuggestions.length ===
                        0 && (

                            <button
                                type="button"
                                className="meeting-task-generate-button"
                                onClick={
                                  handleGenerateSuggestions
                                }
                                disabled={
                                  suggestionsLoading
                                }
                            >
                              {suggestionsLoading
                                  ? '추천 생성 중...'
                                  : 'AI 업무 추천 생성'}
                            </button>

                        )}

                  </div>

                  {taskSuggestions.length > 0 ? (

                      <div className="meeting-task-suggestion-list">

                        {taskSuggestions.map(
                            (suggestion) => {
                              const suggestionId =
                                  suggestion.suggestionId;

                              const alreadyApproved =
                                  approvedSuggestions[
                                      suggestionId
                                      ] ||
                                  suggestion.approved ===
                                  true;

                              return (
                                  <div
                                      key={
                                        suggestionId
                                      }
                                      className="meeting-task-suggestion-card"
                                  >

                                    <div className="meeting-task-suggestion-info">

                                      <h3>
                                        {suggestion.content}
                                      </h3>

                                    </div>

                                    {isLeader ? (

                                        <div className="meeting-task-suggestion-actions">

                                          <select
                                              value={
                                                  suggestionAssignees[
                                                      suggestionId
                                                      ] || ''
                                              }
                                              onChange={(event) =>
                                                  handleAssigneeChange(
                                                      suggestionId,
                                                      event.target.value
                                                  )
                                              }
                                              disabled={
                                                alreadyApproved
                                              }
                                          >

                                            <option value="">
                                              담당자 선택
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

                                          <button
                                              type="button"
                                              onClick={() =>
                                                  handleApproveSuggestion(
                                                      suggestion
                                                  )
                                              }
                                              disabled={
                                                alreadyApproved
                                              }
                                          >
                                            {alreadyApproved
                                                ? '생성 완료'
                                                : '업무 생성'}
                                          </button>

                                        </div>

                                    ) : (

                                        <p className="meeting-task-leader-only">
                                          업무 생성은 팀장만 가능합니다.
                                        </p>

                                    )}

                                  </div>
                              );
                            }
                        )}

                      </div>

                  ) : (

                      <p className="meeting-minutes-empty-text">
                        아직 생성된 AI 추천 업무가 없습니다.
                      </p>

                  )}

                </section>

            )}

        {/* 하단 버튼 */}

        <div className="meeting-minutes-actions">

          <button
              type="button"
              className="meeting-minutes-back-button"
              onClick={handleBack}
          >
            돌아가기
          </button>

          {!isViewMode &&
              !fromDashboard && (

                  <button
                      type="button"
                      className="meeting-minutes-save-button"
                      onClick={handleSave}
                  >
                    회의록 저장
                  </button>

              )}

        </div>

      </div>
  );
}

export default MeetingMinutesPage;