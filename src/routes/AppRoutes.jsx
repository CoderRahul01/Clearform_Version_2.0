import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import OnboardingPage from '../pages/OnboardingPage';
import AllFormsPage from '../pages/AllFormsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing / Signup page */}
      <Route path="/" element={<OnboardingPage />} />

      {/* App dashboard */}
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<AllFormsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
