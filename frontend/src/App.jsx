import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';

import DashboardPage from './pages/dashboard/DashboardPage';
import MeetingsPage from './pages/meetings/MeetingsPage';
import TasksPage from './pages/tasks/TasksPage';

import { ProjectProvider } from './context/ProjectContext';
import { MeetingProvider } from './context/MeetingContext';

function App() {
  return (
    <ProjectProvider>
      <MeetingProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/meetings" element={<MeetingsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </MeetingProvider>
    </ProjectProvider>
  );
}

export default App;
