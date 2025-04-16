
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

const CreateFormPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Form Template</h1>
          {/* Form creation UI will be implemented later */}
          <p>Form creation interface coming soon...</p>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateFormPage;
