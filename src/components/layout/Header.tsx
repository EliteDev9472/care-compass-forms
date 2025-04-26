
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../store/authSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };
  
  const handleNavigateHome = () => {
    if (!user) return;
    
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
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={handleNavigateHome}
              className="flex-shrink-0 flex items-center cursor-pointer"
            >
              <span className="text-xl font-bold text-blue-600">Care Compass</span>
            </button>
          </div>
          
          {isAuthenticated && user && (
            <div className="flex items-center">
              <div className="mr-4">
                <span className="text-sm text-gray-600">Logged in as:</span>{' '}
                <span className="font-semibold">{user.name}</span>{' '}
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800">
                  {user.role}
                </span>
              </div>
              
              <button
                onClick={() => navigate('/change-password')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium mr-2"
              >
                Change Password
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
