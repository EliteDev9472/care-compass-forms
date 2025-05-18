
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import AdminStaffPatientsList from '../../components/admin/AdminStaffPatientsList';

const StaffPatientsPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <AdminStaffPatientsList staffId={staffId} />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default StaffPatientsPage;
