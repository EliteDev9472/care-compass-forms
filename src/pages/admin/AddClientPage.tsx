
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import ClientForm from '../../components/admin/ClientForm';

const AddClientPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Client</h1>
          <ClientForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AddClientPage;
