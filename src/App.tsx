import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './Layout/DashboardLayout';
import TaskManagementDashboard from './Pages/TaskManagementDashboard';
import SettingsPage from './Pages/SettingsPage';
import HelpAndSupportPage from './Pages/HelpAndSupportPage';
import { ThemeProvider } from './context/ThemeContext';
import Calendar from './Pages/Calendar';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TaskManagementDashboard />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpAndSupportPage />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
