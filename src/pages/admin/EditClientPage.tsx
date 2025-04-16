
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

const EditClientPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
          {/* Client editing form will be implemented later */}
          <p>Client editing form coming soon...</p>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditClientPage;
