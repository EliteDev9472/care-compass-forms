
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import StaffForm from '../../components/admin/StaffForm';

const EditStaffPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Staff</h1>
          <StaffForm mode="edit" />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditStaffPage;
