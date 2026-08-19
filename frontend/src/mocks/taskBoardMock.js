// GET /projects/{projectId}/tasks 응답 형태를 프로젝트별로 흉내낸 mock
// description: 실제 목록 API에는 없고 상세 조회(GET /tasks/{taskId})에만 있는 필드.
// 카드에 계속 보여줄지는 백엔드와 논의 필요 - 지금은 화면 편의상 유지
// assigneeId: API처럼 숫자 id만 들고 있고, 이름은 taskService에서 멤버 mock과 join해서 붙인다
export const mockTasksByProject = {
  1: [
    {
      taskId: 1,
      title: '로그인 API 명세 검토',
      description: '팀 API 명세서를 기준으로 로그인 요청/응답을 검토한다.',
      assigneeId: 2,
      status: 'TODO',
      deadline: '2026-09-01T23:59:00',
    },
    {
      taskId: 2,
      title: '회의 예약 기능 구현',
      description: '팀장이 회의를 생성하고 참석자를 등록하는 기능을 구현한다.',
      assigneeId: 2,
      status: 'IN_PROGRESS',
      deadline: '2026-09-04T23:59:00',
    },
    {
      taskId: 4,
      title: '업무 보드 UI 퍼블리싱',
      description: 'MY 업무 화면의 칸반 보드 레이아웃을 마크업한다.',
      assigneeId: 2,
      status: 'IN_PROGRESS',
      deadline: '2026-08-20T23:59:00',
    },
    {
      taskId: 6,
      title: '회원가입 화면 구현',
      description: '국가 기반 언어/시간대 선택 회원가입 화면을 구현한다.',
      assigneeId: 2,
      status: 'DONE',
      deadline: '2026-08-14T23:59:00',
    },
    {
      taskId: 7,
      title: '로그인 화면 구현',
      description: '이메일/비밀번호 로그인 화면을 구현한다.',
      assigneeId: 3,
      status: 'DONE',
      deadline: '2026-08-10T23:59:00',
    },
  ],
  2: [
    {
      taskId: 3,
      title: 'AI 요약 API 연동',
      description: '회의 종료 후 AI 요약 결과를 화면에 표시한다.',
      assigneeId: 3,
      status: 'IN_PROGRESS',
      deadline: '2026-08-25T23:59:00',
    },
  ],
  3: [
    {
      taskId: 5,
      title: '번역 API 연동',
      description: '업무 상세 내용을 사용자 언어로 번역해 보여준다.',
      assigneeId: 2,
      status: 'IN_PROGRESS',
      deadline: '2026-08-22T23:59:00',
    },
  ],
};
