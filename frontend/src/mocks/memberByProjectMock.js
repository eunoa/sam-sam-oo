// GET /projects/{projectId}/members 응답 형태를 프로젝트별로 흉내낸 mock
export const mockMembersByProject = {
  1: [
    { userId: 2, name: '김철수', role: 'LEADER' },
    { userId: 1, name: '홍길동', role: 'MEMBER' },
    { userId: 3, name: '이영희', role: 'MEMBER' },
  ],
  2: [
    { userId: 1, name: '홍길동', role: 'LEADER' },
    { userId: 2, name: '김철수', role: 'MEMBER' },
    { userId: 3, name: '이영희', role: 'MEMBER' },
  ],
  3: [
    { userId: 2, name: '김철수', role: 'LEADER' },
  ],
};
