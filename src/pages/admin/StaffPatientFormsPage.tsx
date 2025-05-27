
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import AdminStaffPatientForms from '../../components/admin/AdminStaffPatientForms';

const StaffPatientFormsPage: React.FC = () => {
  const { staffId, patientId } = useParams<{ staffId: string, patientId: string }>();

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <AdminStaffPatientForms staffId={staffId} patientId={patientId} />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default StaffPatientFormsPage;
