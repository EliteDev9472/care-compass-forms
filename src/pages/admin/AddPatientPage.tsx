
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import PatientForm from '../../components/admin/PatientForm';

const AddPatientPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>
          <PatientForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AddPatientPage;
