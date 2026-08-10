# 삼삼오오 API 명세서

---

# 1. 회의

## 1️⃣ 회의 생성

**Method:** `POST`
**URL:** `/projects/{projectId}/meetings`
**사용자:** 팀장

### Request

```json
{
  "title": "주간 프로젝트 회의",
  "scheduledAt": "2026-08-12T20:00:00"
}
```

| 필드          | 타입            | 필수 | 설명       |
| ----------- | ------------- | -- | -------- |
| title       | String        | O  | 회의 제목    |
| scheduledAt | LocalDateTime | O  | 회의 예정 일시 |

### Response

**201 Created**

```json
{
  "meetingId": 1,
  "projectId": 1,
  "title": "주간 프로젝트 회의",
  "scheduledAt": "2026-08-12T20:00:00"
}
```

| 필드          | 타입            | 설명       |
| ----------- | ------------- | -------- |
| meetingId   | Long          | 회의 ID    |
| projectId   | Long          | 프로젝트 ID  |
| title       | String        | 회의 제목    |
| scheduledAt | LocalDateTime | 회의 예정 일시 |

---

## 2️⃣ 회의 삭제

**Method:** `DELETE`
**URL:** `/meetings/{meetingId}`
**사용자:** 팀장

### Request

없음.

### Response

**204 No Content**

Response Body 없음.

---

## 3️⃣ 회의 내용 입력

**Method:** `PATCH`
**URL:** `/meetings/{meetingId}/content`
**사용자:** 팀장

### Request

```json
{
  "manualContent": "오늘 회의에서는 로그인 기능과 프로젝트 생성 기능에 대해 논의했다."
}
```

| 필드            | 타입     | 필수 | 설명               |
| ------------- | ------ | -- | ---------------- |
| manualContent | String | O  | 팀장이 직접 입력한 회의 내용 |

### Response

**200 OK**

```json
{
  "meetingId": 1,
  "manualContent": "오늘 회의에서는 로그인 기능과 프로젝트 생성 기능에 대해 논의했다."
}
```

| 필드            | 타입     | 설명        |
| ------------- | ------ | --------- |
| meetingId     | Long   | 회의 ID     |
| manualContent | String | 저장된 회의 내용 |

---

## 4️⃣ 회의 목록 조회

**Method:** `GET`
**URL:** `/projects/{projectId}/meetings`
**사용자:** 팀원, 팀장

### Request

없음.

### Response

**200 OK**

```json
[
  {
    "meetingId": 1,
    "title": "주간 프로젝트 회의",
    "scheduledAt": "2026-08-12T20:00:00"
  },
  {
    "meetingId": 2,
    "title": "기획 회의",
    "scheduledAt": "2026-08-15T20:00:00"
  }
]
```

| 필드          | 타입            | 설명       |
| ----------- | ------------- | -------- |
| meetingId   | Long          | 회의 ID    |
| title       | String        | 회의 제목    |
| scheduledAt | LocalDateTime | 회의 예정 일시 |

---

## 5️⃣ 회의 상세 내용 조회

**Method:** `GET`
**URL:** `/meetings/{meetingId}`
**사용자:** 팀원, 팀장

### Request

없음.

### Response

**200 OK**

```json
{
  "meetingId": 1,
  "projectId": 1,
  "title": "주간 프로젝트 회의",
  "scheduledAt": "2026-08-12T20:00:00",
  "manualContent": "오늘 회의에서는 로그인 기능과 프로젝트 생성 기능에 대해 논의했다."
}
```

| 필드            | 타입            | 설명       |
| ------------- | ------------- | -------- |
| meetingId     | Long          | 회의 ID    |
| projectId     | Long          | 프로젝트 ID  |
| title         | String        | 회의 제목    |
| scheduledAt   | LocalDateTime | 회의 예정 일시 |
| manualContent | String        | 회의 내용    |

---

# 2. 프로젝트

## 1️⃣ 프로젝트 생성

**Method:** `POST`
**URL:** `/projects`
**사용자:** 유저

### Request

```json
{
  "name": "삼삼오오",
  "description": "AI 기반 글로벌 협업 플랫폼"
}
```

| 필드          | 타입     | 필수 | 설명      |
| ----------- | ------ | -- | ------- |
| name        | String | O  | 프로젝트 이름 |
| description | String | X  | 프로젝트 설명 |

### Response

**201 Created**

```json
{
  "projectId": 1,
  "name": "삼삼오오",
  "description": "AI 기반 글로벌 협업 플랫폼",
  "createdBy": 1,
  "createdAt": "2026-08-10T15:00:00"
}
```

| 필드          | 타입            | 설명          |
| ----------- | ------------- | ----------- |
| projectId   | Long          | 프로젝트 ID     |
| name        | String        | 프로젝트 이름     |
| description | String        | 프로젝트 설명     |
| createdBy   | Long          | 프로젝트 생성자 ID |
| createdAt   | LocalDateTime | 프로젝트 생성일    |

---

## 2️⃣ 프로젝트 조회

**Method:** `GET`
**URL:** `/projects`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
[
  {
    "projectId": 1,
    "name": "삼삼오오",
    "description": "AI 기반 글로벌 협업 플랫폼",
    "role": "LEADER"
  },
  {
    "projectId": 2,
    "name": "해커톤 프로젝트",
    "description": "글로벌 협업 서비스",
    "role": "MEMBER"
  }
]
```

| 필드          | 타입     | 설명        |
| ----------- | ------ | --------- |
| projectId   | Long   | 프로젝트 ID   |
| name        | String | 프로젝트 이름   |
| description | String | 프로젝트 설명   |
| role        | String | 프로젝트 내 역할 |

---

## 3️⃣ 프로젝트 상세 조회

**Method:** `GET`
**URL:** `/projects/{projectId}`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
{
  "projectId": 1,
  "name": "삼삼오오",
  "description": "AI 기반 글로벌 협업 플랫폼",
  "createdBy": 1,
  "members": [
    {
      "userId": 1,
      "name": "홍길동",
      "role": "LEADER"
    },
    {
      "userId": 2,
      "name": "김철수",
      "role": "MEMBER"
    }
  ]
}
```

---

## 4️⃣ 프로젝트 현황 조회

**Method:** `GET`
**URL:** `/projects/{projectId}/dashboard`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
{
  "projectProgress": 60,
  "taskStatus": {
    "total": 10,
    "todo": 3,
    "inProgress": 4,
    "done": 3
  },
  "upcomingMeetings": [
    {
      "meetingId": 3,
      "title": "주간 회의",
      "scheduledAt": "2026-08-12T20:00:00"
    }
  ],
  "recentMeetings": [
    {
      "meetingId": 2,
      "title": "기획 회의",
      "scheduledAt": "2026-08-10T20:00:00"
    }
  ]
}
```

---

## 5️⃣ 프로젝트 삭제

**Method:** `DELETE`
**URL:** `/projects/{projectId}`
**사용자:** 팀장

### Request

없음.

### Response

**204 No Content**

Response Body 없음.

---

# 3. 팀원

## 5️⃣ 팀원 초대

**Method:** `POST`
**URL:** `/projects/{projectId}/members`
**사용자:** 팀장

### Request

```json
{
  "email": "member@example.com"
}
```

| 필드    | 타입     | 필수 | 설명          |
| ----- | ------ | -- | ----------- |
| email | String | O  | 초대할 팀원의 이메일 |

### Response

**201 Created**

```json
{
  "projectMemberId": 1,
  "userId": 2,
  "name": "김철수",
  "email": "member@example.com",
  "role": "MEMBER"
}
```

---

## 6️⃣ 팀원 조회

**Method:** `GET`
**URL:** `/projects/{projectId}/members`
**사용자:** 팀원, 팀장

### Request

없음.

### Response

**200 OK**

```json
[
  {
    "userId": 1,
    "name": "홍길동",
    "email": "hong@example.com",
    "language": "ko",
    "timezone": "Asia/Seoul",
    "role": "LEADER"
  },
  {
    "userId": 2,
    "name": "김철수",
    "email": "kim@example.com",
    "language": "en",
    "timezone": "America/New_York",
    "role": "MEMBER"
  }
]
```

---

## 7️⃣ 팀원 제외

**Method:** `DELETE`
**URL:** `/projects/{projectId}/members/{userId}`
**사용자:** 팀원, 팀장

### Request

없음.

### Response

**204 No Content**

Response Body 없음.

---

# 4. 회원

## 1️⃣ 회원가입 및 프로필 설정

**Method:** `POST`
**URL:** `/users/signup`
**사용자:** 유저

### Request

```json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123",
  "language": "ko",
  "timezone": "Asia/Seoul"
}
```

| 필드       | 타입     | 필수 | 설명    |
| -------- | ------ | -- | ----- |
| name     | String | O  | 이름    |
| email    | String | O  | 이메일   |
| password | String | O  | 비밀번호  |
| language | String | O  | 사용 언어 |
| timezone | String | O  | 시간대   |

### Response

**201 Created**

```json
{
  "userId": 1,
  "name": "홍길동",
  "email": "hong@example.com",
  "language": "ko",
  "timezone": "Asia/Seoul"
}
```

> 비밀번호는 Response에 포함하지 않는다.

---

## 2️⃣ 로그인

**Method:** `POST`
**URL:** `/users/login`
**사용자:** 유저

### Request

```json
{
  "email": "hong@example.com",
  "password": "password123"
}
```

### Response

**200 OK**

```json
{
  "userId": 1,
  "name": "홍길동",
  "accessToken": "JWT_ACCESS_TOKEN"
}
```

---

## 3️⃣ 로그아웃

**Method:** `POST`
**URL:** `/users/logout`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
{
  "message": "로그아웃되었습니다."
}
```

---

# 5. 개인 설정

## 4️⃣ 내 정보 및 설정 조회

**Method:** `GET`
**URL:** `/users/me`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
{
  "userId": 1,
  "name": "홍길동",
  "email": "hong@example.com",
  "language": "ko",
  "timezone": "Asia/Seoul"
}
```

---

## 5️⃣ 개인 프로필 수정

**Method:** `PATCH`
**URL:** `/users/me`
**사용자:** 유저

### Request

```json
{
  "name": "김철수",
  "language": "en",
  "timezone": "America/New_York"
}
```

### Response

**200 OK**

```json
{
  "userId": 1,
  "name": "김철수",
  "email": "hong@example.com",
  "language": "en",
  "timezone": "America/New_York"
}
```

---

## 6️⃣ 회의 가능 시간 조회

**Method:** `GET`
**URL:** `/users/me/availability`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
[
  {
    "availabilityId": 1,
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "12:00"
  },
  {
    "availabilityId": 2,
    "dayOfWeek": "TUESDAY",
    "startTime": "13:00",
    "endTime": "18:00"
  }
]
```

---

## 7️⃣ 회의 가능 시간 설정

**Method:** `PUT`
**URL:** `/users/me/availability`
**사용자:** 유저

### Request

```json
{
  "availabilities": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "12:00"
    },
    {
      "dayOfWeek": "TUESDAY",
      "startTime": "13:00",
      "endTime": "18:00"
    }
  ]
}
```

### Response

**200 OK**

```json
{
  "message": "회의 가능 시간이 저장되었습니다."
}
```

---

# 6. AI Endpoint

## 1️⃣ AI 회의 시간 추천

**Method:** `POST`
**URL:** `/projects/{projectId}/meetings/recommend-time`
**사용자:** 유저

### Request

```json
{
  "date": "2026-08-12",
  "startTime": "18:00",
  "endTime": "22:00"
}
```

| 필드        | 타입        | 필수 | 설명       |
| --------- | --------- | -- | -------- |
| date      | LocalDate | O  | 회의 희망 날짜 |
| startTime | LocalTime | O  | 희망 시작 시간 |
| endTime   | LocalTime | O  | 희망 종료 시간 |

### Response

**200 OK**

```json
{
  "recommendedTimes": [
    {
      "startTime": "20:00",
      "endTime": "21:00"
    },
    {
      "startTime": "21:00",
      "endTime": "22:00"
    }
  ]
}
```

---

## 3️⃣ 회의 종료 후 AI 분석

**Method:** `POST`
**URL:** `/meetings/{meetingId}/summary`
**사용자:** 유저

### Request

없음.

> 백엔드가 `meetingId`를 이용하여 DB에서 회의 내용을 조회한 후 AI에 전달한다.

### Response

**201 Created**

```json
{
  "summaryId": 1,
  "meetingId": 1,
  "summary": "이번 회의에서는 로그인 기능과 프로젝트 생성 기능을 논의했다.",
  "createdAt": "2026-08-12T21:00:00"
}
```

---

## 4️⃣ AI 회의 요약 조회

**Method:** `GET`
**URL:** `/meetings/{meetingId}/summary`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
{
  "summaryId": 1,
  "meetingId": 1,
  "summary": "이번 회의에서는 로그인 기능과 프로젝트 생성 기능을 논의했다.",
  "createdAt": "2026-08-12T21:00:00"
}
```

---

## 5️⃣ 회의 내용 다국어 번역

**Method:** `GET`
**URL:** `/meetings/{meetingId}/translate`
**사용자:** 유저

### Request

Query Parameter:

```text
targetLanguage=en
```

예:

```text
/meetings/1/translate?targetLanguage=en
```

### Response

**200 OK**

```json
{
  "meetingId": 1,
  "targetLanguage": "en",
  "translatedContent": "Today's meeting discussed the login feature and project creation feature."
}
```

---

## 6️⃣ 업무 번역

**Method:** `GET`
**URL:** `/tasks/{taskId}/translate`
**사용자:** 유저

### Request

Query Parameter:

```text
targetLanguage=en
```

예:

```text
/tasks/1/translate?targetLanguage=en
```

### Response

**200 OK**

```json
{
  "taskId": 1,
  "targetLanguage": "en",
  "translatedTitle": "Implement Login API",
  "translatedDescription": "Implement a login API."
}
```

---

## AI 업무 제안 생성

**Method:** `POST`
**URL:** `/meetings/{meetingId}/task-suggestions`
**사용자:** 유저

### Request

없음.

> 백엔드가 해당 회의의 `manualContent`를 조회하여 AI에 전달한다.

### Response

**201 Created**

```json
[
  {
    "suggestionId": 1,
    "meetingId": 1,
    "content": "로그인 API 구현",
    "approved": false
  },
  {
    "suggestionId": 2,
    "meetingId": 1,
    "content": "프로젝트 생성 API 구현",
    "approved": false
  }
]
```

---

# 7. AI 업무 제안

## 1️⃣ AI 업무 제안 승인 및 등록

**Method:** `POST`
**URL:** `/meetings/{meetingId}/tasks/approve`
**사용자:** 팀장

### Request

```json
{
  "suggestionId": 1,
  "assigneeId": 2
}
```

| 필드           | 타입   | 필수 | 설명              |
| ------------ | ---- | -- | --------------- |
| suggestionId | Long | O  | 승인할 AI 업무 제안 ID |
| assigneeId   | Long | O  | 업무 담당자 ID       |

### Response

**201 Created**

```json
{
  "taskId": 1,
  "suggestionId": 1,
  "title": "로그인 API 구현",
  "assigneeId": 2,
  "status": "TODO"
}
```

---

## 2️⃣ AI 업무 제안 목록 조회

**Method:** `GET`
**URL:** `/meetings/{meetingId}/task-suggestions`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
[
  {
    "suggestionId": 1,
    "meetingId": 1,
    "content": "로그인 API 구현",
    "approved": false
  },
  {
    "suggestionId": 2,
    "meetingId": 1,
    "content": "프로젝트 생성 API 구현",
    "approved": false
  }
]
```

---

## 3️⃣ AI 업무 제안 삭제

**Method:** `DELETE`
**URL:** `/meetings/{meetingId}/suggestions/{suggestionId}`
**사용자:** 유저

### Request

없음.

### Response

**204 No Content**

Response Body 없음.

---

# 8. 업무(Task)

## 4️⃣ 프로젝트 업무 목록 조회

**Method:** `GET`
**URL:** `/projects/{projectId}/tasks`
**사용자:** 유저

### Request

Query Parameter 선택:

```text
status=TODO
```

예:

```text
/projects/1/tasks?status=TODO
```

### Response

**200 OK**

```json
[
  {
    "taskId": 1,
    "title": "로그인 API 구현",
    "assigneeId": 2,
    "status": "TODO",
    "deadline": "2026-08-15T23:59:00"
  },
  {
    "taskId": 2,
    "title": "회의 API 구현",
    "assigneeId": 3,
    "status": "IN_PROGRESS",
    "deadline": "2026-08-16T23:59:00"
  }
]
```

---

## 5️⃣ 업무 상태 및 정보 수정

**Method:** `PATCH`
**URL:** `/tasks/{taskId}`
**사용자:** 유저

### Request

```json
{
  "assigneeId": 2,
  "status": "IN_PROGRESS",
  "deadline": "2026-08-16T23:59:00"
}
```

| 필드         | 타입            | 필수 | 설명                        |
| ---------- | ------------- | -- | ------------------------- |
| assigneeId | Long          | X  | 담당자 ID                    |
| status     | String        | X  | TODO / IN_PROGRESS / DONE |
| deadline   | LocalDateTime | X  | 마감일                       |

### Response

**200 OK**

```json
{
  "taskId": 1,
  "title": "로그인 API 구현",
  "assigneeId": 2,
  "status": "IN_PROGRESS",
  "deadline": "2026-08-16T23:59:00"
}
```

---

## 6️⃣ 업무 생성

**Method:** `POST`
**URL:** `/projects/{projectId}/tasks`
**사용자:** 유저

### Request

```json
{
  "title": "로그인 API 구현",
  "description": "Spring Boot를 이용하여 로그인 API를 구현한다.",
  "assigneeId": 2,
  "deadline": "2026-08-15T23:59:00"
}
```

| 필드          | 타입            | 필수 | 설명     |
| ----------- | ------------- | -- | ------ |
| title       | String        | O  | 업무 제목  |
| description | String        | X  | 업무 설명  |
| assigneeId  | Long          | O  | 담당자 ID |
| deadline    | LocalDateTime | X  | 마감일    |

### Response

**201 Created**

```json
{
  "taskId": 1,
  "projectId": 1,
  "title": "로그인 API 구현",
  "description": "Spring Boot를 이용하여 로그인 API를 구현한다.",
  "assigneeId": 2,
  "status": "TODO",
  "deadline": "2026-08-15T23:59:00",
  "createdAt": "2026-08-10T15:00:00"
}
```

---

## 7️⃣ 업무 삭제

**Method:** `DELETE`
**URL:** `/tasks/{taskId}`
**사용자:** 유저

### Request

없음.

### Response

**204 No Content**

Response Body 없음.

---

## 8️⃣ 업무 상세 조회

**Method:** `GET`
**URL:** `/tasks/{taskId}`
**사용자:** 유저

### Request

없음.

### Response

**200 OK**

```json
{
  "taskId": 1,
  "projectId": 1,
  "title": "로그인 API 구현",
  "description": "Spring Boot를 이용하여 로그인 API를 구현한다.",
  "assigneeId": 2,
  "status": "TODO",
  "deadline": "2026-08-15T23:59:00",
  "createdAt": "2026-08-10T15:00:00"
}
```

---

# 공통 상태값

## ProjectMember.role

```text
LEADER
MEMBER
```

## Task.status

```text
TODO
IN_PROGRESS
DONE
```
