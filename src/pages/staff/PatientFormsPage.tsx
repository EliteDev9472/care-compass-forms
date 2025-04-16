
import React from 'react';
import Layout from '../../components/layout/Layout';
import PatientForms from '../../components/staff/PatientForms';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

const PatientFormsPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['staff', 'client']}>
      <Layout>
        <PatientForms />
      </Layout>
    </ProtectedRoute>
  );
};

export default PatientFormsPage;
