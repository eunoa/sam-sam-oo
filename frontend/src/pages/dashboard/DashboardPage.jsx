import { mockProjects } from '../../mocks/projectMock';
import { mockMeetings } from '../../mocks/meetingMock';

import ProjectCard from '../../components/project/ProjectCard';
import MeetingCard from '../../components/meeting/MeetingCard';

function DashboardPage() {
  return (
    <div className="dashboard-page">

      {/* 대시보드 상단 */}
      <header className="dashboard-header">
        <h1>대시보드</h1>

        <button className="create-project-button">
          + 프로젝트 생성
        </button>
      </header>

      {/* 대시보드 탭 */}
      <nav className="dashboard-tabs">
        <button className="tab active">
          개요
        </button>

        <button className="tab">
          팀원현황
        </button>

        <button className="tab">
          업무설정
        </button>
      </nav>

      {/* 대시보드 본문 */}
      <div className="dashboard-content">

        {/* 내 프로젝트 */}
        <section className="dashboard-section">
          <h2>내 프로젝트</h2>

          <div className="project-list">
            {mockProjects.map((project) => (
              <ProjectCard
                key={project.projectId}
                project={project}
              />
            ))}
          </div>

          <button className="view-all-button">
            모든 프로젝트 보기
          </button>
        </section>

        {/* 최근 회의 */}
        <section className="dashboard-section">
          <h2>최근 회의</h2>

          <div className="meeting-list">
            {mockMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.meetingId}
                meeting={meeting}
              />
            ))}
          </div>

          <button className="view-all-button">
            모든 회의 보기
          </button>
        </section>

      </div>
    </div>
  );
}

export default DashboardPage;