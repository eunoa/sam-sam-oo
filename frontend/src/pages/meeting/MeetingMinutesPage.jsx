import './MeetingMinutesPage.css';
import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useMeetings } from '../../context/MeetingContext';

function MeetingMinutesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { meetingId } = useParams();

  const {
    meetings,
    saveMinutes,
  } = useMeetings();

  const meeting = meetings.find(
    (item) =>
      String(item.meetingId) ===
      String(meetingId)
  );

  /*
   * =========================
   * 회의록 존재 여부
   * =========================
   */

  const hasMinutes =
    meeting?.minutes &&
    meeting-minutes.trim() !== '';

  /*
   * =========================
   * 화면 모드
   *
   * edit
   * → 회의록 입력
   *
   * view
   * → 회의록 상세보기
   * =========================
   */

  const mode =
    location.state?.mode ||
    (hasMinutes ? 'view' : 'edit');

  const isViewMode =
    mode === 'view';

  /*
   * =========================
   * 어디에서 들어왔는지
   *
   * all
   * → 전체 회의
   *
   * past
   * → 지난 회의
   *
   * important
   * → 중요한 회의
   * =========================
   */

  const fromTab =
    location.state?.fromTab || 'all';

  /*
   * =========================
   * 대시보드에서 들어왔는지
   * =========================
   */

  const fromDashboard =
    location.state?.fromDashboard || false;

  /*
   * =========================
   * 회의록 입력값
   * =========================
   */

  const [minutes, setMinutes] =
    useState(
      meeting?.minutes || ''
    );

  /*
   * 회의가 변경되면
   * 입력값도 변경
   */

  useEffect(() => {
    setMinutes(
      meeting?.minutes || ''
    );
  }, [meeting]);

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

  const date = new Date(
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

  /*
   * =========================
   * 돌아가기
   *
   * 입력 화면
   * → 전체 회의로 돌아감
   *
   * 상세보기
   * → 들어왔던 탭으로 돌아감
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
    const trimmedMinutes = minutes.trim();

    if (!trimmedMinutes) {
      alert("회의록 내용을 입력해주세요.");
      return;
    }

    try {
      await saveMinutes(
        meeting.meetingId,
        trimmedMinutes
      );

      alert("회의록 저장 완료");

      navigate("/meetings", {
        state: {
          activeTab: "past",
          refresh: true,
        },
      });
    } catch (error) {
      console.error("회의록 저장 실패:", error);
      alert("회의록 저장 실패");
    }
  };

  return (
    <div className="meeting-minutes-page">

      {/* =========================
          Header
      ========================= */}

      <header className="meeting-minutes-header">

        <h1>
          {isViewMode
            ? '회의록 상세보기'
            : fromDashboard && !hasMinutes
              ? '회의록 상세보기'
              : '회의록 입력'}
        </h1>

      </header>


      {/* =========================
          회의 정보
      ========================= */}

      <section className="meeting-minutes-info">

        {meeting.projectName && (
          <p className="meeting-minutes-project">
            {meeting.projectName}
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


      {/* =========================
          회의 내용
      ========================= */}

      <section className="meeting-minutes-content">

        <h2>
          회의 내용
        </h2>


        {/* =========================
            대시보드에서 들어온
            회의록 미작성 상태
        ========================= */}

        {fromDashboard &&
          !hasMinutes && (

          <div className="meeting-minutes-view">

            <p className="meeting-minutes-empty-text">
              아직 작성된 회의록이 없습니다.
            </p>

            <p className="meeting-minutes-empty-description">
              팀장이 회의록을 작성하면 이곳에서 확인할 수 있습니다.
            </p>

          </div>

        )}


        {/* =========================
            회의록 입력
        ========================= */}

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


        {/* =========================
            회의록 상세보기
        ========================= */}

        {isViewMode && (

          <div className="meeting-minutes-view">

            {meeting-minutes ? (

              <p>
                {meeting-minutes}
              </p>

            ) : (

              <p className="meeting-minutes-empty-text">
                입력된 회의록이 없습니다.
              </p>

            )}

          </div>

        )}

      </section>


      {/* =========================
          AI 요약
          
          상세보기에서만 표시
          Context에서 summary로 저장됨
      ========================= */}

      {isViewMode &&
        meeting.summary && (

        <section className="meeting-minutes-summary">

          <h2>
            AI 회의록 요약
          </h2>

          <p>
            {meeting.summary}
          </p>

        </section>

      )}


      {/* =========================
          버튼
      ========================= */}

      <div className="meeting-minutes-actions">

        {/* =========================
            돌아가기
        ========================= */}

        <button
          type="button"
          className="meeting-minutes-back-button"
          onClick={handleBack}
        >
          돌아가기
        </button>


        {/* =========================
            회의록 저장
            입력 화면에서만 표시
        ========================= */}

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