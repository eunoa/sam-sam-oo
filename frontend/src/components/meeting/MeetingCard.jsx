import './MeetingCard.css';

function MeetingCard({
                       meeting,
                       showProject = false,
                       showMinutesButton = false,
                       minutesButtonText = '회의록 입력',
                       onMinutesClick,
                       onToggleImportant,
                       onClick,
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

  const hasMinutes =
      meeting.manualContent &&
      meeting.manualContent.trim() !== '';

  return (
      <article
          className="meeting-card"
          onClick={onClick}
      >
        <div className="meeting-card-main">

          <div className="meeting-card-info">

            {showProject &&
                meeting.projectName && (
                    <p className="meeting-card-project">
                      {meeting.projectName}
                    </p>
                )}

            <h3 className="meeting-card-title">
              {meeting.title}
            </h3>

            <p className="meeting-card-date">
              {formattedDate}{' '}
              {formattedTime}
            </p>

            {hasMinutes &&
                meeting.summary && (
                    <p className="meeting-card-summary">
                      {meeting.summary}
                    </p>
                )}

          </div>

          <div className="meeting-card-actions">

            {showMinutesButton &&
                onMinutesClick && (
                    <button
                        type="button"
                        className="meeting-minutes-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onMinutesClick();
                        }}
                    >
                      {minutesButtonText}
                    </button>
                )}

            {onToggleImportant && (
                <button
                    type="button"
                    className={`meeting-important-button ${
                        meeting.important
                            ? 'active'
                            : ''
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();

                      onToggleImportant(
                          meeting.meetingId
                      );
                    }}
                    aria-label={
                      meeting.important
                          ? '중요 회의 해제'
                          : '중요 회의 설정'
                    }
                >
                  {meeting.important
                      ? '★'
                      : '☆'}
                </button>
            )}

          </div>

        </div>
      </article>
  );
}

export default MeetingCard;