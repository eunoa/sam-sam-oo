import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getMeetings,
  updateMeetingImportant,
  updateMeetingContent,
} from '../services/meetingService';

import { useProject } from './ProjectContext';

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const { currentProject } = useProject();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeetings = async (projectId) => {
    if (!projectId) {
      return [];
    }

    try {
      setLoading(true);

      const data = await getMeetings(projectId);

      const list = Array.isArray(data)
          ? data
          : data?.meetings || data?.content || [];

      setMeetings(list);

      console.log('회의 목록 데이터:', list);

      return list;
    } catch (error) {
      console.error(
          '회의 목록 로드 실패:',
          error
      );

      setMeetings([]);

      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveMinutes = async (
      meetingId,
      manualContent
  ) => {
    await updateMeetingContent(
        meetingId,
        manualContent
    );

    if (currentProject?.projectId) {
      await fetchMeetings(
          currentProject.projectId
      );
    }
  };

  const toggleImportant = async (
      meetingId
  ) => {
    const target = meetings.find(
        (meeting) =>
            meeting.meetingId === meetingId
    );

    if (!target) {
      return;
    }

    const next = !target.important;

    try {
      await updateMeetingImportant(
          meetingId,
          next
      );

      setMeetings((prev) =>
          prev.map((meeting) =>
              meeting.meetingId === meetingId
                  ? {
                    ...meeting,
                    important: next,
                  }
                  : meeting
          )
      );
    } catch (error) {
      console.error(
          '중요 회의 상태 변경 실패:',
          error
      );
    }
  };

  useEffect(() => {
    const loadMeetings = async () => {
      if (!currentProject?.projectId) {
        return;
      }

      await fetchMeetings(
          currentProject.projectId
      );
    };

    void loadMeetings();
  }, [currentProject?.projectId]);

  const value = {
    meetings,
    setMeetings,
    fetchMeetings,
    saveMinutes,
    toggleImportant,
    loading,
  };

  return (
      <MeetingContext.Provider value={value}>
        {children}
      </MeetingContext.Provider>
  );
}

export function useMeeting() {
  return useContext(MeetingContext) || {};
}

export function useMeetings() {
  return useContext(MeetingContext) || {};
}