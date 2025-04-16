
import React from 'react';
import Layout from '../../components/layout/Layout';
import PatientsList from '../../components/staff/PatientsList';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

const PatientsListPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['staff', 'client']}>
      <Layout>
        <PatientsList />
      </Layout>
    </ProtectedRoute>
  );
};

export default PatientsListPage;
