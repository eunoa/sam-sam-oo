import { createContext, useContext, useState } from 'react';
import { mockMembers } from '../mocks/memberMock';

const MemberContext = createContext(null);

export function MemberProvider({ children }) {
  const [members, setMembers] = useState(
    mockMembers.map((member) => ({
      ...member,
    }))
  );

  // 팀원 추가
  const addMember = (member) => {
    setMembers((prevMembers) => [
      ...prevMembers,
      {
        ...member,
      },
    ]);
  };

  // 팀원 수정
  const updateMember = (projectId, memberId, updatedMember) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.projectId === projectId &&
        member.memberId === memberId
          ? {
              ...member,
              ...updatedMember,
            }
          : member
      )
    );
  };

  // 팀원 삭제
  const deleteMember = (projectId, memberId) => {
    setMembers((prevMembers) =>
      prevMembers.filter(
        (member) =>
          !(
            member.projectId === projectId &&
            member.memberId === memberId
          )
      )
    );
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        setMembers,
        addMember,
        updateMember,
        deleteMember,
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
