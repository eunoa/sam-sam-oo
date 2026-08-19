import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';

import DashboardPage from './pages/dashboard/DashboardPage';

import MeetingsPage from './pages/meetings/MeetingsPage';
import MeetingCreatePage from './pages/meetings/MeetingCreatePage';
import MeetingMinutesPage from './pages/meeting/MeetingMinutesPage';

import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectCreatePage from './pages/projects/ProjectCreatePage';
import ProjectMeetingsPage from './pages/projects/ProjectMeetingsPage';

import MemberInvitePage from './pages/members/MemberInvitePage';

import TaskCreatePage from './pages/tasks/TaskCreatePage';
import ProjectTasksPage from './pages/tasks/ProjectTasksPage';

import { MeetingProvider } from './context/MeetingContext';
import { TaskProvider } from './context/TaskContext';
import { ProjectProvider } from './context/ProjectContext';
import { MemberProvider } from './context/MemberContext';


function App() {
  return (
    <BrowserRouter>

      <MeetingProvider>
        <TaskProvider>
          <ProjectProvider>
            <MemberProvider>

              <MainLayout>

                <Routes>

                  {/* =========================
                      Dashboard
                  ========================= */}

                  <Route
                    path="/"
                    element={<DashboardPage />}
                  />

                  <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                  />


                  {/* =========================
                      Meetings
                  ========================= */}

                  <Route
                    path="/meetings"
                    element={<MeetingsPage />}
                  />

                  <Route
                    path="/meetings/create"
                    element={<MeetingCreatePage />}
                  />

                  <Route
                    path="/meetings/:meetingId/minutes"
                    element={<MeetingMinutesPage />}
                  />


                  {/* =========================
                      Projects
                  ========================= */}

                  <Route
                    path="/projects"
                    element={<ProjectsPage />}
                  />

                  <Route
                    path="/projects/create"
                    element={<ProjectCreatePage />}
                  />

                  <Route
                    path="/projects/:projectId/meetings"
                    element={<ProjectMeetingsPage />}
                  />


                  {/* =========================
                      Members
                  ========================= */}

                  <Route
                    path="/members/invite"
                    element={<MemberInvitePage />}
                  />


                  {/* =========================
                      Tasks
                  ========================= */}

                  <Route
                    path="/tasks/create"
                    element={<TaskCreatePage />}
                  />

                  <Route
                    path="/projects/tasks"
                    element={<ProjectTasksPage />}
                  />

                </Routes>

              </MainLayout>

            </MemberProvider>
          </ProjectProvider>
        </TaskProvider>
      </MeetingProvider>

    </BrowserRouter>
  );
}

export default App;