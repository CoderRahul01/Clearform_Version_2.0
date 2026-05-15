import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SignupPage from '../pages/SignupPage';
import SignInPage from '../pages/SignInPage';
import AllFormsPage from '../pages/AllFormsPage';
import TemplatesPage from '../pages/TemplatesPage';
import FormBuilderPage from '../pages/FormBuilderPage';

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
      </Route>

      {/* Form builder — standalone layout (no MainLayout wrapper) */}
      <Route path="/dashboard/form-builder" element={<FormBuilderPage />} />
    </Routes>
  );
};

export default AppRoutes;
