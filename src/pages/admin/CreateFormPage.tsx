
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import FormBuilder from '../../components/admin/FormBuilder';

const CreateFormPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Form Template</h1>
          <FormBuilder />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateFormPage;
