function MeetingCard({ meeting }) {
  const date = new Date(meeting.scheduledAt);

  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedTime = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="meeting-card">
      <div className="meeting-card-info">
        <h3 className="meeting-card-title">
          {meeting.title}
        </h3>

        <p className="meeting-card-date">
          {formattedDate} {formattedTime}
        </p>
      </div>
    </article>
  );
}

export default MeetingCard;