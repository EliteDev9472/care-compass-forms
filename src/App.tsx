
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
import CreateFormPage from './pages/admin/CreateFormPage';
import EditFormPage from './pages/admin/EditFormPage';
import ClientsPage from './pages/admin/ClientsPage';
import StaffPage from './pages/admin/StaffPage';
import PatientsPage from './pages/admin/PatientsPage';
import AddClientPage from './pages/admin/AddClientPage';
import EditClientPage from './pages/admin/EditClientPage';
import AddStaffPage from './pages/admin/AddStaffPage';
import EditStaffPage from './pages/admin/EditStaffPage';
import AddPatientPage from './pages/admin/AddPatientPage';
import EditPatientPage from './pages/admin/EditPatientPage';

// Common pages
import PatientsListPage from './pages/common/PatientsListPage';
import PatientFormsPage from './pages/common/PatientFormsPage';
import FormPage from './pages/staff/FormPage';

// Client pages
import ReviewFormPage from './pages/client/ReviewFormPage';
// commit
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
          <Route path="/admin/clients" element={<ClientsPage />} />
          <Route path="/admin/staff" element={<StaffPage />} />
          <Route path="/admin/patients" element={<PatientsPage />} />
          <Route path="/admin/forms/create" element={<CreateFormPage />} />
          <Route path="/admin/forms/:formId/edit" element={<EditFormPage />} />
          <Route path="/admin/clients/add" element={<AddClientPage />} />
          <Route path="/admin/clients/:clientId/edit" element={<EditClientPage />} />
          <Route path="/admin/staff/add" element={<AddStaffPage />} />
          <Route path="/admin/staff/:staffId/edit" element={<EditStaffPage />} />
          <Route path="/admin/patients/add" element={<AddPatientPage />} />
          <Route path="/admin/patients/:patientId/edit" element={<EditPatientPage />} />

          {/* Staff routes */}
          <Route path="/staff/patients" element={<PatientsListPage />} />
          <Route path="/staff/patients/:patientId/forms" element={<PatientFormsPage />} />
          <Route path="/staff/patients/:patientId/forms/:formId" element={<FormPage />} />

          <Route path="/client" element={<PatientsListPage />} />
          <Route path="/client/patients/:patientId/forms" element={<PatientFormsPage />} />
          <Route path="/client/patients/:patientId/forms/:formId" element={<ReviewFormPage />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default App;
