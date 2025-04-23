
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';
import SignInForm from '../components/auth/SignInForm';

const SignIn: React.FC = () => {
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
          navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return !isAuthenticated ? <SignInForm /> : null;
};

export default SignIn;
