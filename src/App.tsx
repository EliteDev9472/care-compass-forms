
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

// Pages
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Staff pages
import PatientsListPage from './pages/staff/PatientsListPage';
import PatientFormsPage from './pages/staff/PatientFormsPage';
import FormPage from './pages/staff/FormPage';

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Redirect from root to signin */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Staff routes */}
          <Route path="/staff/patients" element={<PatientsListPage />} />
          <Route path="/staff/patients/:patientId/forms" element={<PatientFormsPage />} />
          <Route path="/staff/patients/:patientId/forms/:formId" element={<FormPage />} />
          
          {/* Client routes (reusing staff components) */}
          <Route path="/client/patients" element={<PatientsListPage />} />
          <Route path="/client/patients/:patientId/forms" element={<PatientFormsPage />} />
          <Route path="/client/patients/:patientId/forms/:formId" element={<FormPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default App;
