import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getMeetings } from '../services/meetingService';
import { useProject } from './ProjectContext';

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const {
    currentProject,
  } = useProject();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeetings = async (projectId) => {
    if (!projectId) {
      setMeetings([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getMeetings(projectId);

      setMeetings(data || []);
    } catch (error) {
      console.error('회의 목록 로드 실패:', error);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (currentProject?.projectId) {
      fetchMeetings(currentProject.projectId);
    } else {
      setMeetings([]);
    }
  }, [currentProject?.projectId]);

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        setMeetings,
        fetchMeetings,
        toggleImportant,
        loading,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () =>
  useContext(MeetingContext) || {};

export const useMeetings = () =>
  useContext(MeetingContext) || {};
