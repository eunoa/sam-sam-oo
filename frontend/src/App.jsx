import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';

import DashboardPage from './pages/dashboard/DashboardPage';
import MeetingsPage from './pages/meetings/MeetingsPage';
import TasksPage from './pages/tasks/TasksPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;