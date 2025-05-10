
import React from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import AdminTabs from '../../components/admin/AdminTabs';
import TimerTrackingTable from '../../components/admin/TimerTrackingTable';

const TimerTrackingPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <AdminTabs />
          <TimerTrackingTable />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default TimerTrackingPage;
