import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';

import DashboardPage from './pages/dashboard/DashboardPage';

import MeetingsPage from './pages/meetings/MeetingsPage';
import MeetingCreatePage from './pages/meetings/MeetingCreatePage';
import MeetingMinutesPage from './pages/meeting/MeetingMinutesPage';

import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectCreatePage from './pages/projects/ProjectCreatePage';

import MemberInvitePage from './pages/members/MemberInvitePage';

import TaskCreatePage from './pages/tasks/TaskCreatePage';
import ProjectTasksPage from './pages/tasks/ProjectTasksPage';
import TasksPage from './pages/tasks/TasksPage';
import SettingsPage from './pages/settings/SettingsPage';

import { MeetingProvider } from './context/MeetingContext';
import { TaskProvider } from './context/TaskContext';
import { ProjectProvider } from './context/ProjectContext';
import { MemberProvider } from './context/MemberContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ComingSoon from './pages/ComingSoon';


function App() {
  return (
    <BrowserRouter>

      <MeetingProvider>
        <TaskProvider>
          <ProjectProvider>
            <MemberProvider>

              <Routes>

                {/* =========================
                    인증 (레이아웃 없음)
                ========================= */}

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />


                {/* =========================
                    Dashboard
                ========================= */}

                <Route
                  path="/dashboard"
                  element={<MainLayout><DashboardPage /></MainLayout>}
                />


                {/* =========================
                    Meetings
                ========================= */}

                <Route
                  path="/meetings"
                  element={<MainLayout><MeetingsPage /></MainLayout>}
                />

                <Route
                  path="/meetings/create"
                  element={<MainLayout><MeetingCreatePage /></MainLayout>}
                />

                <Route
                  path="/meetings/:meetingId/minutes"
                  element={<MainLayout><MeetingMinutesPage /></MainLayout>}
                />


                {/* =========================
                    Projects
                ========================= */}

                <Route
                  path="/projects"
                  element={<MainLayout><ProjectsPage /></MainLayout>}
                />

                <Route
                  path="/projects/create"
                  element={<MainLayout><ProjectCreatePage /></MainLayout>}
                />


                {/* =========================
                    Members
                ========================= */}

                <Route
                  path="/members/invite"
                  element={<MainLayout><MemberInvitePage /></MainLayout>}
                />


                {/* =========================
                    Tasks
                ========================= */}

                <Route
                  path="/tasks"
                  element={<MainLayout><TasksPage /></MainLayout>}
                />

                <Route
                  path="/tasks/create"
                  element={<MainLayout><TaskCreatePage /></MainLayout>}
                />

                <Route
                  path="/projects/tasks"
                  element={<MainLayout><ProjectTasksPage /></MainLayout>}
                />


                {/* =========================
                    Settings
                ========================= */}

                <Route
                  path="/settings"
                  element={<MainLayout><SettingsPage /></MainLayout>}
                />


                {/* =========================
                    404
                ========================= */}

                <Route
                  path="*"
                  element={<ComingSoon title="페이지를 찾을 수 없어요" />}
                />

              </Routes>

            </MemberProvider>
          </ProjectProvider>
        </TaskProvider>
      </MeetingProvider>

    </BrowserRouter>
  );
}

export default App;