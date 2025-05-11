import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { twMerge } from 'tailwind-merge';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block text-blue-600 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
              <path d="M12 6L16 8.5V13.5L12 16L8 13.5V8.5L12 6Z" fill="white" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InstaPark Admin</h1>
          <p className="text-gray-600 mb-0">Sign in to access your dashboard</p>
        </div>
        
        <div className={twMerge(
          "bg-white rounded-lg shadow-xl p-8 border border-gray-200",
          "transform transition-all duration-300 hover:shadow-2xl"
        )}>
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Username"
              id="username"
              type="text"
              placeholder="Enter your username"
              fullWidth
              error={errors.username?.message}
              {...register('username')}
            />
            
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              fullWidth
              error={errors.password?.message}
              {...register('password')}
            />
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials:</p>
            <p className="font-medium">Username: admin</p>
            <p className="font-medium">Password: admin123</p>
          </div>
        </div>
        
        <p className="text-center mt-6 text-sm text-gray-600">
          © {new Date().getFullYear()} InstaPark. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;