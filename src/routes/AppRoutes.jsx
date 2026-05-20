import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import SignupPage from '@/features/auth/pages/SignupPage';
import SignInPage from '@/features/auth/pages/SignInPage';
import AllFormsPage from '@/features/forms/pages/AllFormsPage';
import TemplatesPage from '@/features/templates/pages/TemplatesPage';
import FormBuilderPage from '@/features/forms/pages/FormBuilderPage';
import HelpSupportPage from '@/features/support/pages/HelpSupportPage';
import AnalyticsPage from '@/pages/AnalyticsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing / Signup page */}
      <Route path="/" element={<SignupPage />} />

      {/* Sign in page */}
      <Route path="/signin" element={<SignInPage />} />

      {/* App dashboard */}
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<AllFormsPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="help" element={<HelpSupportPage />} />
      </Route>

      {/* Form builder — standalone layout (no MainLayout wrapper) */}
      <Route path="/dashboard/form-builder" element={<FormBuilderPage />} />
    </Routes>
  );
};

export default AppRoutes;
