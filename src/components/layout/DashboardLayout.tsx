import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

// We need to move Header into the layout component to ensure it stays fixed at top
// and main content scrolls independently underneath it.

export const DashboardLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
