import { useMemo, useState } from 'react';

import { mockMeetings } from '../../mocks/meetingMock';
import MeetingCard from '../../components/meeting/MeetingCard';

function MeetingsPage() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [activeTab, setActiveTab] = useState('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i += 1) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= lastDate; day += 1) {
    calendarDays.push(day);
  }

  const getDateKey = (date) => {
    const dateYear = date.getFullYear();
    const dateMonth = String(date.getMonth() + 1).padStart(2, '0');
    const dateDay = String(date.getDate()).padStart(2, '0');

    return `${dateYear}-${dateMonth}-${dateDay}`;
  };

  const meetingDateKeys = useMemo(() => {
    return new Set(
      mockMeetings.map((meeting) => {
        const date = new Date(meeting.scheduledAt);
        return getDateKey(date);
      })
    );
  }, []);

  const isPastMeeting = (meeting) => {
    return new Date(meeting.scheduledAt) < today;
  };

  const upcomingMeetings = mockMeetings.filter(
    (meeting) => !isPastMeeting(meeting)
  );

  const pastMeetings = mockMeetings.filter(
    (meeting) => isPastMeeting(meeting)
  );

  const importantMeetings = mockMeetings.filter(
    (meeting) => meeting.isImportant
  );

  const displayedMeetings = {
    all: {
      upcoming: upcomingMeetings,
      past: pastMeetings,
    },

    past: {
      upcoming: [],
      past: pastMeetings,
    },

    important: {
      upcoming: importantMeetings.filter(
        (meeting) => !isPastMeeting(meeting)
      ),
      past: importantMeetings.filter(
        (meeting) => isPastMeeting(meeting)
      ),
    },
  };

  const currentMeetings = displayedMeetings[activeTab];

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const isToday = (day) => {
    if (!day) {
      return false;
    }

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const hasMeeting = (day) => {
    if (!day) {
      return false;
    }

    const date = new Date(year, month, day);

    return meetingDateKeys.has(
      getDateKey(date)
    );
  };

  return (
    <div className="meetings-page">

      {/* 회의 상단 */}
      <header className="meetings-header">
        <h1>회의</h1>

        <button
          type="button"
          className="create-meeting-button"
        >
          + 새 회의
        </button>
      </header>


      {/* 회의 탭 */}
      <nav className="meetings-tabs">

        <button
          type="button"
          className={`tab ${
            activeTab === 'all' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('all')}
        >
          전체 회의
        </button>

        <button
          type="button"
          className={`tab ${
            activeTab === 'past' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('past')}
        >
          지난 회의
        </button>

        <button
          type="button"
          className={`tab ${
            activeTab === 'important' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('important')}
        >
          중요한 회의
        </button>

      </nav>


      {/* 달력 */}
      <section className="meeting-calendar-section">

        <div className="calendar-header">

          <button
            type="button"
            onClick={goToPreviousMonth}
          >
            이전
          </button>

          <h2>
            {year}년 {month + 1}월
          </h2>

          <button
            type="button"
            onClick={goToNextMonth}
          >
            다음
          </button>

        </div>


        <div className="calendar">

          <div className="calendar-weekdays">
            <span>일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
          </div>


          <div className="calendar-days">

            {calendarDays.map((day, index) => (
              <div
                key={`${year}-${month}-${index}`}
                className={`calendar-day ${
                  isToday(day) ? 'today' : ''
                }`}
              >

                {day && (
                  <>
                    <span className="calendar-day-number">
                      {day}
                    </span>

                    {hasMeeting(day) && (
                      <span className="meeting-indicator">
                        ●
                      </span>
                    )}
                  </>
                )}

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* 예정된 회의 */}
      {currentMeetings.upcoming.length > 0 && (
        <section className="meeting-section">

          <h2>예정된 회의</h2>

          <div className="meeting-list">

            {currentMeetings.upcoming.map((meeting) => (
              <MeetingCard
                key={meeting.meetingId}
                meeting={meeting}
                showProject
              />
            ))}

          </div>

        </section>
      )}


      {/* 지난 회의 */}
      {currentMeetings.past.length > 0 && (
        <section className="meeting-section">

          <h2>지난 회의</h2>

          <div className="meeting-list">

            {currentMeetings.past.map((meeting) => (
              <MeetingCard
                key={meeting.meetingId}
                meeting={meeting}
                showProject
                showMinutesButton
              />
            ))}

          </div>

        </section>
      )}


      {/* 회의가 없을 때 */}
      {currentMeetings.upcoming.length === 0 &&
        currentMeetings.past.length === 0 && (
          <section className="meeting-empty">
            <p>해당하는 회의가 없습니다.</p>
          </section>
        )}

    </div>
  );
}

export default MeetingsPage;