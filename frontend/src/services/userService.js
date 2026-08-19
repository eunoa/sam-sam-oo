import { mockCurrentUser } from '../mocks/currentUserMock';
import { mockAvailability } from '../mocks/availabilityMock';

// TODO: 백엔드 연동 시 GET /users/me 호출로 교체
export function getCurrentUser() {
  return mockCurrentUser;
}

// TODO: 백엔드 연동 시 PATCH /users/me 호출로 교체
// API 명세(PATCH /users/me)상 수정 가능한 필드는 name / language / timezone 뿐이다.
// email은 응답에는 포함되지만 수정 대상이 아니라 여기서도 받지 않는다.
export function updateCurrentUser({ name, language, timezone } = {}) {
  if (name !== undefined) mockCurrentUser.name = name;
  if (language !== undefined) mockCurrentUser.language = language;
  if (timezone !== undefined) mockCurrentUser.timezone = timezone;

  return { ...mockCurrentUser };
}

// TODO: 백엔드 연동 시 GET /users/me/availability 호출로 교체
export function getAvailability() {
  return mockAvailability;
}

// TODO: 백엔드 연동 시 PUT /users/me/availability 호출로 교체
// API 명세: { availabilities: [{ dayOfWeek, startTime, endTime }] } 전체를 보내면
// 서버가 요일별 가능 시간 목록 전체를 그 내용으로 교체한다.
export function updateAvailability(availabilities) {
  mockAvailability.length = 0;
  mockAvailability.push(
    ...availabilities.map((item, index) => ({
      availabilityId: index + 1,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
    }))
  );

  return { message: '회의 가능 시간이 저장되었습니다.' };
}
