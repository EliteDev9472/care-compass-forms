
import React from 'react';
import Layout from '../../components/layout/Layout';
import ClientList from '../../components/client/ClientList';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

const ClientListPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <Layout>
        <ClientList />
      </Layout>
    </ProtectedRoute>
  );
};

export default ClientListPage;
