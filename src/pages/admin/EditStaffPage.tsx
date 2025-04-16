
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

const EditStaffPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Staff</h1>
          {/* Staff editing form will be implemented later */}
          <p>Staff editing form coming soon...</p>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditStaffPage;
