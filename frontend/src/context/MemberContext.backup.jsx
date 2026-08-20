import { createContext, useContext, useEffect, useState } from 'react';

import { useProjects } from './ProjectContext';

import {
  getProjectMembers,
  inviteMember,
  deleteMember as deleteMemberApi,
} from '../services/memberService';

const MemberContext = createContext(null);

function normalizeMember(projectId, member) {
  return {
    ...member,
    projectId,
    memberId: member.userId,
    userId: member.userId,
    profileImage: member.profileImage || '',
    activeTasks: member.activeTasks || 0,
  };
}

export function MemberProvider({ children }) {
  const { projects } = useProjects();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    if (!projects || projects.length === 0) {
      setMembers([]);
      return [];
    }

    try {
      setLoading(true);

      const results = await Promise.all(
        projects.map(async (project) => {
          const data = await getProjectMembers(project.projectId);

          return (data || []).map((member) =>
            normalizeMember(project.projectId, member)
          );
        })
      );

      const allMembers = results.flat();

      setMembers(allMembers);

      return allMembers;
    } catch (error) {
      console.error('팀원 목록 로드 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (projectId, email) => {
    const newMember = await inviteMember(projectId, {
      email,
    });

    await fetchMembers();

    return newMember;
  };

  const deleteMember = async (projectId, userId) => {
    await deleteMemberApi(projectId, userId);

    setMembers((prevMembers) =>
      prevMembers.filter(
        (member) =>
          !(
            String(member.projectId) === String(projectId) &&
            String(member.userId) === String(userId)
          )
      )
    );
  };

  useEffect(() => {
    if (projects.length > 0) {
      fetchMembers();
    }
  }, [projects]);

  return (
    <MemberContext.Provider
      value={{
        members,
        setMembers,
        fetchMembers,
        addMember,
        deleteMember,
        loading,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MemberContext);

  if (!context) {
    throw new Error(
      'useMembers는 MemberProvider 안에서 사용해야 합니다.'
    );
  }

  return context;
}
