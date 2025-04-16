
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  
  // Admin dashboard would typically have summary statistics and links to various reports
  const reports = [
    { 
      id: 'billingByClient',
      title: 'Billing by Client',
      description: 'View billing summaries for each client/practice',
      path: '/admin/reports/billing-by-client'
    },
    { 
      id: 'patientsByPractice',
      title: 'Patients by Practice',
      description: 'View patient lists organized by practice',
      path: '/admin/reports/patients-by-practice'
    },
    { 
      id: 'staffActivity',
      title: 'Staff Activity',
      description: 'View activity and time tracking for all staff members',
      path: '/admin/reports/staff-activity'
    },
    { 
      id: 'monthlyBilling',
      title: 'Monthly Billing',
      description: 'Generate end-of-month billing reports with ICD codes',
      path: '/admin/reports/monthly-billing'
    }
  ];
  
  const handleReportClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
        <p className="text-gray-600">
          From here, you can manage clients, staff, patients, and access various reports.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(report => (
          <div 
            key={report.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleReportClick(report.path)}
          >
            <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
            <p className="text-gray-600">{report.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-2">Clients</h3>
          <div className="text-3xl font-bold">12</div>
          <button 
            className="mt-4 text-blue-600 hover:underline"
            onClick={() => navigate('/admin/clients')}
          >
            Manage Clients
          </button>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-2">Staff</h3>
          <div className="text-3xl font-bold">24</div>
          <button 
            className="mt-4 text-green-600 hover:underline"
            onClick={() => navigate('/admin/staff')}
          >
            Manage Staff
          </button>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold mb-2">Patients</h3>
          <div className="text-3xl font-bold">156</div>
          <button 
            className="mt-4 text-purple-600 hover:underline"
            onClick={() => navigate('/admin/patients')}
          >
            View All Patients
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
