
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { loginStart, loginSuccess, loginFailure, UserRole } from '../../store/authSlice';
import { login } from '../../services/authService';
import { toast } from 'sonner';

const SignInForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast.error('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    dispatch(loginStart());

    try {
      const response = await login(username, password);

      // Store the token in localStorage
      localStorage.setItem('token', response.token);

      // Validate and convert the role to UserRole type
      const userRole = validateRole(response.role);

      dispatch(loginSuccess({
        id: 'temp-id', // The backend doesn't return an id, using a temporary one
        username: response.username,
        name: response.username, // Using username as name since backend doesn't return a name
        role: userRole,
      }));

      toast.success('Logged in successfully');

      // Redirect based on role
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'staff':
          navigate('/staff/patients');
          break;
        default:
          navigate('/');
      }

    } catch (error) {
      // Fix: Properly type the error and safely access error message
      let errorMessage = 'Login failed';

      if (error instanceof Error) {
        // Basic Error object doesn't have response property
        errorMessage = error.response?.data.message;
      } else if (typeof error === 'object' && error !== null) {
        // Handle axios error object which might have response data
        // @ts-ignore - We're safely checking for existence before accessing
        if (error.response?.data?.message) {
          // @ts-ignore
          errorMessage = error.response.data.message;
        }
      }

      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const validateRole = (role: string): UserRole => {
    switch (role) {
      case 'admin':
        return 'admin';
      case 'client':
        return 'client';
      case 'staff':
        return 'staff';
      case 'patient':
        return 'patient';
      default:
        // If the role is not valid, we default to client for safety
        console.warn(`Unknown role received: ${role}, defaulting to 'client'`);
        return 'client';
    }
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
