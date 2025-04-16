
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/forms')) return 'forms';
    if (location.pathname.includes('/clients')) return 'clients';
    if (location.pathname.includes('/staff')) return 'staff';
    if (location.pathname.includes('/patients')) return 'patients';
    return 'forms';
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'forms':
        navigate('/admin/dashboard');
        break;
      case 'clients':
        navigate('/admin/clients');
        break;
      case 'staff':
        navigate('/admin/staff');
        break;
      case 'patients':
        navigate('/admin/patients');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  return (
    <div className="mb-6 border-b">
      <div className="flex space-x-1">
        <Button
          variant={activeTab === 'forms' ? 'default' : 'ghost'}
          className="rounded-none rounded-t-lg"
          onClick={() => handleTabChange('forms')}
        >
          Forms
        </Button>
        <Button
          variant={activeTab === 'clients' ? 'default' : 'ghost'}
          className="rounded-none rounded-t-lg"
          onClick={() => handleTabChange('clients')}
        >
          Clients
        </Button>
        <Button
          variant={activeTab === 'staff' ? 'default' : 'ghost'}
          className="rounded-none rounded-t-lg"
          onClick={() => handleTabChange('staff')}
        >
          Staff
        </Button>
        <Button
          variant={activeTab === 'patients' ? 'default' : 'ghost'}
          className="rounded-none rounded-t-lg"
          onClick={() => handleTabChange('patients')}
        >
          Patients
        </Button>
      </div>
    </div>
  );
};

export default AdminTabs;
