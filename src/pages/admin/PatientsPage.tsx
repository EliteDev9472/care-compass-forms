
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import AdminTabs from '../../components/admin/AdminTabs';
import AdminPatientsList from '../../components/admin/AdminPatientsList';

const PatientsPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <AdminTabs />
          <AdminPatientsList />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default PatientsPage;
