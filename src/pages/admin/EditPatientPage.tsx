
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import PatientForm from '../../components/admin/PatientForm';

const EditPatientPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Patient</h1>
          <PatientForm mode="edit" />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditPatientPage;
