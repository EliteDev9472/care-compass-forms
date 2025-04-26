import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Index from './pages/Index';
import { UserRole } from './store/authSlice';

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
import ChangePasswordPage from './pages/common/ChangePasswordPage';

// Client pages
import ReviewFormPage from './pages/client/ReviewFormPage';

// Staff pages
import StaffReviewFormPage from './pages/staff/ReviewFormPage';

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Index route with role-based redirection */}
          <Route path="/" element={<Index />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ClientsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/staff" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StaffPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/patients" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PatientsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/forms/create" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateFormPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/forms/:formId/edit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditFormPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/clients/add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddClientPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/clients/:clientId/edit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditClientPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/staff/add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddStaffPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/staff/:staffId/edit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditStaffPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/patients/add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddPatientPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/patients/:patientId/edit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditPatientPage />
            </ProtectedRoute>
          } />

          {/* Staff routes */}
          <Route path="/staff/patients" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <PatientsListPage />
            </ProtectedRoute>
          } />
          <Route path="/staff/patients/:patientId/forms/:patientName" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <PatientFormsPage />
            </ProtectedRoute>
          } />
          <Route path="/staff/patients/:patientId/forms/:formId" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <FormPage />
            </ProtectedRoute>
          } />
          <Route path="/staff/patients/:patientId/forms/:formId/review" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffReviewFormPage />
            </ProtectedRoute>
          } />

          {/* Client routes */}
          <Route path="/client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <PatientsListPage />
            </ProtectedRoute>
          } />
          <Route path="/client/patients/:patientId/forms" element={
            <ProtectedRoute allowedRoles={['client']}>
              <PatientFormsPage />
            </ProtectedRoute>
          } />
          <Route path="/client/patients/:patientId/forms/:formId" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ReviewFormPage />
            </ProtectedRoute>
          } />

          {/* Common routes */}
          <Route path="/change-password" element={
            <ProtectedRoute allowedRoles={['admin', 'client', 'staff']}>
              <ChangePasswordPage />
            </ProtectedRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default App;
