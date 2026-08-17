import './MeetingsPage.css';

import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import MeetingCard from '../../components/meeting/MeetingCard';
import { useMeetings } from '../../context/MeetingContext';

function MeetingsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    meetings,
    toggleImportant,
  } = useMeetings();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'all'
  );

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
  );


  /*
   * =========================
   * 회의 상태
   * =========================
   */

  const isPastMeeting = (meeting) => {
    return (
      new Date(meeting.scheduledAt) < today
    );
  };

  const hasMinutes = (meeting) => {
    return (
      meeting.minutes &&
      meeting.minutes.trim() !== ''
    );
  };


  /*
   * =========================
   * 회의 목록
   * =========================
   */

  const upcomingMeetings = meetings.filter(
    (meeting) =>
      !isPastMeeting(meeting)
  );

  /*
   * 전체 회의에서 보여줄 지난 회의
   *
   * 회의록이 없어도 표시
   * → 회의록 입력 가능
   */

  const allPastMeetings = meetings.filter(
    (meeting) =>
      isPastMeeting(meeting)
  );

  /*
   * 지난 회의 탭
   *
   * 회의록이 입력된 회의만
   */

  const pastMeetings = meetings.filter(
    (meeting) =>
      isPastMeeting(meeting) &&
      hasMinutes(meeting)
  );

  /*
   * 중요한 회의 탭
   *
   * 중요 + 회의록 입력 완료
   */

  const importantMeetings = meetings.filter(
    (meeting) =>
      meeting.isImportant &&
      hasMinutes(meeting)
  );


  /*
   * =========================
   * 프로젝트별 회의 그룹
   * =========================
   */

  const groupMeetingsByProject = (
    meetingList
  ) => {
    return meetingList.reduce(
      (groups, meeting) => {

        const projectName =
          meeting.projectName ||
          '프로젝트 없음';

        if (!groups[projectName]) {
          groups[projectName] = [];
        }

        groups[projectName].push(
          meeting
        );

        return groups;
      },
      {}
    );
  };


  const groupedUpcomingMeetings =
    groupMeetingsByProject(
      upcomingMeetings
    );

  const groupedAllPastMeetings =
    groupMeetingsByProject(
      allPastMeetings
    );

  const groupedPastMeetings =
    groupMeetingsByProject(
      pastMeetings
    );

  const groupedImportantMeetings =
    groupMeetingsByProject(
      importantMeetings
    );


  /*
   * =========================
   * 현재 날짜
   * =========================
   */

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const lastDate =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const calendarDays = [];


  for (
    let i = 0;
    i < firstDay;
    i += 1
  ) {
    calendarDays.push(null);
  }


  for (
    let day = 1;
    day <= lastDate;
    day += 1
  ) {
    calendarDays.push(day);
  }


  /*
   * =========================
   * 날짜 Key
   * =========================
   */

  const getDateKey = (date) => {
    const dateYear =
      date.getFullYear();

    const dateMonth =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const dateDay =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${dateYear}-${dateMonth}-${dateDay}`;
  };


  /*
   * =========================
   * 캘린더 회의
   *
   * 예정된 회의만 표시
   * =========================
   */

  const meetingsByDate = useMemo(() => {
    const map = {};

    upcomingMeetings.forEach(
      (meeting) => {

        const date =
          new Date(
            meeting.scheduledAt
          );

        const key =
          getDateKey(date);

        if (!map[key]) {
          map[key] = [];
        }

        map[key].push(meeting);
      }
    );

    return map;
  }, [upcomingMeetings]);


  /*
   * =========================
   * 오늘
   * =========================
   */

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


  /*
   * =========================
   * 날짜별 회의
   * =========================
   */

  const getMeetingsForDay = (day) => {
    if (!day) {
      return [];
    }

    const date =
      new Date(
        year,
        month,
        day
      );

    return (
      meetingsByDate[
        getDateKey(date)
      ] || []
    );
  };


  /*
   * =========================
   * 달력 이동
   * =========================
   */

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };


  const goToNextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };


  /*
   * =========================
   * 새 회의
   * =========================
   */

  const handleCreateMeeting = () => {
    navigate('/meetings/create');
  };


  /*
   * =========================
   * 회의록 입력
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
          fromTab: 'all',
        },
      }
    );
  };


  /*
   * =========================
   * 회의록 상세보기
   * =========================
   */

  const handleMinutesView = (
    meetingId,
    fromTab
  ) => {
    navigate(
      `/meetings/${meetingId}/minutes`,
      {
        state: {
          mode: 'view',
          fromTab,
        },
      }
    );
  };


  /*
   * =========================
   * 프로젝트별 회의 그룹 렌더링
   * =========================
   */

  const renderMeetingGroups = (
    groupedMeetings,
    options = {}
  ) => {

    const {
      showMinutesButton = false,
      minutesButtonText = '회의록 입력',
      onMinutesClick,
    } = options;

    return Object.entries(
      groupedMeetings
    ).map(
      (
        [
          projectName,
          projectMeetings,
        ]
      ) => (

        <div
          key={projectName}
          className="meeting-project-group"
        >

          <h3 className="meeting-project-group-title">
            {projectName}
          </h3>

          <div className="meeting-list">

            {projectMeetings.map(
              (meeting) => (

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
                    onMinutesClick
                      ? () =>
                          onMinutesClick(
                            meeting.meetingId
                          )
                      : undefined
                  }
                  onToggleImportant={
                    toggleImportant
                  }
                />

              )
            )}

          </div>

        </div>

      )
    );
  };


  /*
   * =========================
   * Render
   * =========================
   */

  return (
    <div className="meetings-page">

      {/* =========================
          Header
      ========================= */}

      <header className="meetings-header">

        <h1>회의</h1>

        <button
          type="button"
          className="create-meeting-button"
          onClick={
            handleCreateMeeting
          }
        >
          + 새 회의
        </button>

      </header>


      {/* =========================
          Tabs
      ========================= */}

      <nav className="meetings-tabs">

        <button
          type="button"
          className={`tab ${
            activeTab === 'all'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveTab('all')
          }
        >
          전체 회의
        </button>

        <button
          type="button"
          className={`tab ${
            activeTab === 'past'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveTab('past')
          }
        >
          지난 회의
        </button>

        <button
          type="button"
          className={`tab ${
            activeTab === 'important'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveTab('important')
          }
        >
          중요한 회의
        </button>

      </nav>


      {/* =========================
          Calendar
          
          전체 회의에서만 표시
      ========================= */}

      {activeTab === 'all' && (

        <section className="meeting-calendar-section">

          <div className="calendar-header">

            <button
              type="button"
              className="calendar-button"
              onClick={
                goToPreviousMonth
              }
            >
              ‹
            </button>

            <h2>
              {year}년 {month + 1}월
            </h2>

            <button
              type="button"
              className="calendar-button"
              onClick={
                goToNextMonth
              }
            >
              ›
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

              {calendarDays.map(
                (day, index) => {

                  const dayMeetings =
                    getMeetingsForDay(
                      day
                    );

                  return (
                    <div
                      key={`${year}-${month}-${index}`}
                      className={`calendar-day ${
                        isToday(day)
                          ? 'today'
                          : ''
                      }`}
                    >

                      {day && (
                        <>

                          <span className="calendar-day-number">
                            {day}
                          </span>


                          {dayMeetings.length >
                            0 && (

                            <div className="calendar-meetings">

                              {dayMeetings.map(
                                (meeting) => (

                                  <div
                                    key={
                                      meeting.meetingId
                                    }
                                    className={`calendar-meeting ${
                                      meeting.isImportant
                                        ? 'important'
                                        : ''
                                    }`}
                                    title={
                                      meeting.title
                                    }
                                  >
                                    {
                                      meeting.title
                                    }
                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>

      )}


      {/* =========================
          전체 회의
          예정된 회의
      ========================= */}

      {activeTab === 'all' &&
        upcomingMeetings.length > 0 && (

        <section className="meeting-section">

          <h2>예정된 회의</h2>

          {renderMeetingGroups(
            groupedUpcomingMeetings
          )}

        </section>

      )}


      {/* =========================
          전체 회의
          지난 회의
          
          회의록 입력 가능
      ========================= */}

      {activeTab === 'all' &&
        allPastMeetings.length > 0 && (

        <section className="meeting-section">

          <h2>지난 회의</h2>

          {renderMeetingGroups(
            groupedAllPastMeetings,
            {
              showMinutesButton: true,
              minutesButtonText:
                '회의록 입력',
              onMinutesClick:
                handleMinutesInput,
            }
          )}

        </section>

      )}


      {/* =========================
          지난 회의 탭
          
          회의록 입력 완료만
      ========================= */}

      {activeTab === 'past' &&
        pastMeetings.length > 0 && (

        <section className="meeting-section">

          <h2>지난 회의</h2>

          {renderMeetingGroups(
            groupedPastMeetings,
            {
              showMinutesButton: true,
              minutesButtonText:
                '상세보기',
              onMinutesClick:
                (meetingId) =>
                  handleMinutesView(
                    meetingId,
                    'past'
                  ),
            }
          )}

        </section>

      )}


      {/* =========================
          중요한 회의
          
          중요 + 회의록 입력 완료
      ========================= */}

      {activeTab === 'important' &&
        importantMeetings.length > 0 && (

        <section className="meeting-section">

          <h2>중요한 회의</h2>

          {renderMeetingGroups(
            groupedImportantMeetings,
            {
              showMinutesButton: true,
              minutesButtonText:
                '상세보기',
              onMinutesClick:
                (meetingId) =>
                  handleMinutesView(
                    meetingId,
                    'important'
                  ),
            }
          )}

        </section>

      )}


      {/* =========================
          회의 없음
      ========================= */}

      {(
        activeTab === 'all'
          ? (
              upcomingMeetings.length === 0 &&
              allPastMeetings.length === 0
            )
          : activeTab === 'past'
            ? pastMeetings.length === 0
            : importantMeetings.length === 0
      ) && (

        <section className="meeting-empty">

          <p>
            해당하는 회의가 없습니다.
          </p>

        </section>

      )}

    </div>
  );
}

export default MeetingsPage;