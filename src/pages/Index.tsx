
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'staff':
          navigate('/staff/patients');
          break;
        case 'patient':
          navigate('/patient/forms');
          break;
        default:
          navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [isAuthenticated, user, navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Care Compass</h1>
        <p>Redirecting you to the appropriate page...</p>
      </div>
    </div>
  );
};

export default Index;
