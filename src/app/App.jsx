import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import ToastContainer from '@/components/feedback/ToastContainer';
import CreateNewFormModal from '@/features/forms/components/CreateNewFormModal';

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />
      <CreateNewFormModal />
    </BrowserRouter>
  );
};

export default App;
