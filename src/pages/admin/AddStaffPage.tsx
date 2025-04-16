
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import StaffForm from '../../components/admin/StaffForm';

const AddStaffPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Staff</h1>
          <StaffForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AddStaffPage;
