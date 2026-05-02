import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f3ef]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
