# WorkBridge

> AI Project Coordinator for Global Startup Teams

**WorkBridge**는 언어, 시간대, 업무 맥락의 차이로 발생하는 글로벌 협업 문제를 해결하기 위한  
**AI 기반 글로벌 프로젝트 협업 플랫폼**입니다.

멋쟁이사자처럼 대학 해커톤 프로젝트 **삼삼오오(sam-sam-oo)** 팀에서 개발했습니다.

---

## 프로젝트 소개

글로벌 스타트업 팀에서는 서로 다른 국가와 시간대에서 협업하면서 다음과 같은 문제가 발생합니다.

- 팀원 간 시간대 차이로 인한 회의 일정 조율의 어려움
- 언어 차이로 인한 회의 및 업무 내용 전달 문제
- 회의 결과가 실제 업무로 연결되지 않는 문제
- 여러 프로젝트의 업무와 회의 맥락이 분산되는 문제

WorkBridge는 이러한 문제를 AI를 활용하여 해결합니다.

**회의 일정 추천 → 회의록 관리 → AI 요약 → 번역 → AI 업무 추천 → 담당자 업무 배정**

까지 하나의 흐름으로 연결하여 글로벌 팀의 협업을 지원합니다.

---

## 핵심 기능

### 1. 프로젝트 관리

- 프로젝트 생성 및 관리
- 프로젝트별 팀원 관리
- 팀장(LEADER) / 팀원(MEMBER) 권한 구분
- 여러 프로젝트 참여 및 관리
- 프로젝트별 회의 및 업무 관리

### 2. AI 회의 시간 추천

팀원들의 시간대와 가능한 시간을 기반으로  
AI가 글로벌 팀이 함께 참여할 수 있는 회의 시간을 추천합니다.

- 팀원별 Timezone 관리
- 가능한 시간대 입력
- 프로젝트 참여 인원 기준 회의 시간 추천
- 추천 시간을 이용한 회의 생성

### 3. 회의 및 회의록 관리

- 프로젝트별 회의 생성
- 예정된 회의 / 완료된 회의 구분
- 회의 종료 후 회의록 작성
- 중요 회의 설정
- 최근 완료 회의 대시보드 제공

### 4. AI 회의 요약

작성된 회의록을 기반으로 OpenAI API가 핵심 내용을 요약합니다.

이를 통해 긴 회의 내용을 다시 확인하지 않고도  
팀원이 주요 논의사항을 빠르게 파악할 수 있습니다.

### 5. 다국어 번역

글로벌 협업을 위해 AI 기반 번역 기능을 제공합니다.

- 회의 요약 번역
- 업무 제목 및 설명 번역
- 한국어 / 영어 / 일본어 / 프랑스어 지원

### 6. AI 업무 추천

회의록을 분석하여 후속 조치가 필요한 업무를 AI가 추천합니다.

팀장은 추천된 업무를 확인한 후 담당자를 지정하여  
실제 프로젝트 업무로 생성할 수 있습니다.

**회의 → AI 분석 → 업무 추천 → 담당자 지정 → 업무 생성**

의 흐름을 지원합니다.

### 7. 업무 관리

- 직접 업무 생성
- AI 추천 기반 업무 생성
- 담당자 지정
- 마감일 설정
- 업무 상태 관리

업무 상태는 다음과 같이 관리됩니다.

- `TODO` - 할 일
- `IN_PROGRESS` - 진행 중
- `DONE` - 완료

### 8. MY 업무

로그인한 사용자가 자신에게 배정된 업무를 한눈에 확인할 수 있습니다.

- 참여 프로젝트 전체 업무 조회
- 내 업무 필터
- 완료된 업무 조회
- 보드형 / 리스트형 보기
- 업무 상태 변경

---

## 권한 관리

WorkBridge는 프로젝트 내 역할에 따라 기능을 구분합니다.

### LEADER

- 프로젝트 관리
- 팀원 초대 및 제외
- 회의 생성
- 회의록 작성
- 직접 업무 생성
- AI 추천 업무 승인
- 업무 담당자 지정

### MEMBER

- 참여 프로젝트 조회
- 프로젝트 회의 조회
- 완료된 회의록 확인
- 본인에게 배정된 업무 조회
- 업무 상태 변경
- 회의 및 업무 번역 기능 사용

---

## 서비스 흐름

```text
프로젝트 생성
      ↓
팀원 참여
      ↓
팀원별 시간대 / 가능 시간 설정
      ↓
AI 회의 시간 추천
      ↓
회의 생성
      ↓
회의 진행
      ↓
회의록 작성
      ↓
AI 회의 요약
      ↓
다국어 번역
      ↓
AI 업무 추천
      ↓
팀장이 담당자 지정
      ↓
업무 생성
      ↓
담당자의 MY 업무에 전달
      ↓
TODO → IN_PROGRESS → DONE
```

---

## 기술 스택

### 백엔드

- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT Authentication
- Gradle
- H2 Database

### 프론트엔드

- React
- Vite
- JavaScript
- React Router
- Axios
- CSS

### AI

- OpenAI API
- AI Meeting Summary
- AI Meeting Time Recommendation
- AI Task Suggestion
- AI Translation

### 협업 도구

- Git
- GitHub
- GitHub Pull Request
- Feature Branch Workflow

---

## 프로젝트 구조

```text
sam-sam-oo/
│
├── backend/
│   └── coordinator/
│       ├── src/
│       ├── build.gradle
│       └── gradlew
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│
└── README.md
```

---

## 실행 방법

### 백엔드

#### Linux / macOS

```bash
cd backend/coordinator
./gradlew bootRun
```

#### Windows PowerShell

```powershell
cd backend\coordinator
.\gradlew bootRun
```

기본 실행 주소:

```text
http://localhost:8080
```

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

기본 실행 주소:

```text
http://localhost:5173
```

---

## 배포용 빌드

### 프론트엔드

```bash
cd frontend
npm run build
```

### 백엔드

#### Linux / macOS

```bash
cd backend/coordinator
./gradlew clean build
```

#### Windows PowerShell

```powershell
cd backend\coordinator
.\gradlew clean build
```

---

## 인증 방식

WorkBridge는 JWT 기반 인증 방식을 사용합니다.

로그인 성공 시 발급된 Access Token을 API 요청의 `Authorization` Header에 전달합니다.

```http
Authorization: Bearer {accessToken}
```

---

## 팀원

| 이름 | 역할 |
| --- | --- |
| 이도빈 | Backend |
| 김우진 | Backend |
| 이재원 | Frontend |
| 김민준 | Frontend |
| 이예나 | Design |
| 지혜미 | Design |

---

## Git 협업 규칙

### 브랜치 전략

```text
main
  ↑
develop
  ↑
feature/* / fix/*
```

- `main` 브랜치에 직접 push하지 않습니다.
- `develop` 브랜치를 기준으로 기능별 브랜치를 생성합니다.
- 기능 개발 완료 후 Pull Request를 생성합니다.
- 코드 및 기능 확인 후 `develop`에 merge합니다.
- 최종 통합 및 검증이 완료되면 `develop`을 `main`에 merge합니다.

### 커밋 규칙

```text
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: UI / 스타일 수정
refactor: 코드 구조 개선
merge: 브랜치 병합 및 충돌 해결
```

---

## WorkBridge

**AI가 회의 시간을 조율하고,  
회의 내용을 이해하고,  
언어의 장벽을 줄이고,  
회의 결과를 실제 업무로 연결합니다.**

> From Meeting to Action, WorkBridge connects global teams.
