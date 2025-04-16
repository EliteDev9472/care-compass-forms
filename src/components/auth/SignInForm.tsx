
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { loginStart, loginSuccess, loginFailure, UserRole } from '../../store/authSlice';

// Mock users data - this would come from an API in a real app
const mockUsers = [
  { id: '1', username: 'admin1', password: 'password123', name: 'Admin User', role: 'admin' as UserRole },
  { id: '2', username: 'client1', password: 'password123', name: 'Client User', role: 'client' as UserRole },
  { id: '3', username: 'staff1', password: 'password123', name: 'Staff User', role: 'staff' as UserRole },
  { id: '4', username: 'patient1', password: 'password123', name: 'Patient User', role: 'patient' as UserRole },
];

const SignInForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    dispatch(loginStart());
    
    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(
        (user) => user.username === username && user.password === password
      );
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        dispatch(loginSuccess(userWithoutPassword));
        
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'client':
            navigate('/client/patients');
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
      } else {
        dispatch(loginFailure('Invalid username or password'));
        setError('Invalid username or password');
      }
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">SIGN IN</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in with your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              SIGN IN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
