
import React from 'react';
import Layout from '../../components/layout/Layout';
import Dashboard from '../../components/admin/Dashboard';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

const AdminDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;
