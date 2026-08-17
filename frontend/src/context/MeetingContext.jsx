import { createContext, useContext, useState } from 'react';
import { mockMeetings } from '../mocks/meetingMock';

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const [meetings, setMeetings] = useState(
    mockMeetings.map((meeting) => ({
      ...meeting,
      minutes: meeting.minutes || '',
      summary: meeting.summary || '',
    }))
  );

    // 회의 생성
  const addMeeting = (meeting) => {
    setMeetings((prevMeetings) => [
      ...prevMeetings,
      {
        ...meeting,
        minutes: meeting.minutes || '',
        summary: meeting.summary || '',
      },
    ]);
  };


  // 회의 중요 여부 변경
  const toggleImportant = (meetingId) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((meeting) =>
        meeting.meetingId === meetingId
          ? {
              ...meeting,
              isImportant: !meeting.isImportant,
            }
          : meeting
      )
    );
  };

  // 회의록 저장
  const saveMinutes = (meetingId, minutes) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((meeting) =>
        meeting.meetingId === meetingId
          ? {
              ...meeting,
              minutes,
              summary: createSummary(minutes),
            }
          : meeting
      )
    );
  };

  // 회의록 한 문장 요약
  const createSummary = (minutes) => {
    if (!minutes || !minutes.trim()) {
      return '';
    }

    const cleanText = minutes
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanText.length <= 80) {
      return cleanText;
    }

    return `${cleanText.slice(0, 80)}...`;
  };

  const getMeetingById = (meetingId) => {
    return meetings.find(
      (meeting) =>
        String(meeting.meetingId) === String(meetingId)
    );
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        setMeetings,
        addMeeting,
        toggleImportant,
        saveMinutes,
        getMeetingById,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeetings() {
  const context = useContext(MeetingContext);

  if (!context) {
    throw new Error(
      'useMeetings는 MeetingProvider 안에서 사용해야 합니다.'
    );
  }

  return context;
}