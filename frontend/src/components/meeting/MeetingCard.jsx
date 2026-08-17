import './MeetingCard.css';

function MeetingCard({
  meeting,
  showProject = false,
  showMinutesButton = false,
  minutesButtonText = '회의록 입력',
  onMinutesClick,
  onToggleImportant,
}) {
  const date = new Date(meeting.scheduledAt);

  const formattedDate = date.toLocaleDateString(
    'ko-KR',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
  );

  const formattedTime = date.toLocaleTimeString(
    'ko-KR',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  /*
   * 회의록이 입력된 경우에만
   * 요약을 보여준다.
   */
  const hasMinutes =
    meeting.minutes &&
    meeting.minutes.trim() !== '';

  return (
    <article className="meeting-card">

      {/* =========================
          회의 기본 정보
      ========================= */}

      <div className="meeting-card-top">

        <div className="meeting-card-info">

          {/* 프로젝트명 */}

          {showProject &&
            meeting.projectName && (
              <p className="meeting-card-project">
                {meeting.projectName}
              </p>
            )}

          {/* 회의 제목 */}

          <h3 className="meeting-card-title">
            {meeting.title}
          </h3>

          {/* 날짜 / 시간 */}

          <p className="meeting-card-date">
            {formattedDate}{' '}
            {formattedTime}
          </p>

          {/* =========================
              AI 요약

              현재는 Context에서 만든
              임시 summary를 사용하고
              나중에 AI API로 교체
          ========================= */}

          {hasMinutes &&
            meeting.summary && (
              <p className="meeting-card-summary">
                {meeting.summary}
              </p>
            )}

        </div>


        {/* =========================
            중요 회의 별
        ========================= */}

        {onToggleImportant && (
          <button
            type="button"
            className={`meeting-important-button ${
              meeting.isImportant
                ? 'active'
                : ''
            }`}
            onClick={() =>
              onToggleImportant(
                meeting.meetingId
              )
            }
            aria-label={
              meeting.isImportant
                ? '중요 회의 해제'
                : '중요 회의 설정'
            }
          >
            {meeting.isImportant
              ? '★'
              : '☆'}
          </button>
        )}

      </div>


      {/* =========================
          회의록 버튼

          예정된 회의
          → 버튼 없음

          전체 회의의 지난 회의
          → 회의록 입력

          지난/중요한 회의 탭
          → 상세보기
      ========================= */}

      {showMinutesButton &&
        onMinutesClick && (

        <div className="meeting-card-actions">

          <button
            type="button"
            className="meeting-minutes-button"
            onClick={onMinutesClick}
          >
            {minutesButtonText}
          </button>

        </div>

      )}

    </article>
  );
}

export default MeetingCard;