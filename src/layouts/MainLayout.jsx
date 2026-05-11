import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from '../components/common/Sidebar';

const pageEase = [0.25, 0.1, 0.25, 1];

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f3ef]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: pageEase }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;
