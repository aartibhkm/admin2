import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, RefreshCw } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';

// Validation schemas
const accountSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type AccountFormData = z.infer<typeof accountSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const {
    register: registerAccount,
    handleSubmit: handleSubmitAccount,
    formState: { errors: errorsAccount },
    setValue: setAccountValue,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });
  
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });
  
  // Update account information
  const updateAccount = async (data: AccountFormData) => {
    // This is just a demo implementation
    try {
      // Simulate API call with a delay
      setAccountError(null);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local user data
      if (user) {
        // In a real app, this would make an API call
        // userApi.update(user._id, data);
      }
      
      setAccountSuccess('Account information updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setAccountSuccess(null), 3000);
    } catch (error) {
      setAccountError('Failed to update account information');
    }
  };
  
  // Update password
  const updatePassword = async (data: PasswordFormData) => {
    // This is just a demo implementation
    try {
      // Simulate API call with a delay
      setPasswordError(null);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would make an API call
      // userApi.updatePassword(user._id, data.currentPassword, data.newPassword);
      
      resetPassword();
      setPasswordSuccess('Password updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (error) {
      setPasswordError('Failed to update password');
    }
  };
  
  // Reset account form to user data
  const resetAccountForm = () => {
    if (user) {
      setAccountValue('username', user.username);
      setAccountValue('email', user.email);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      {/* Account settings card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your account details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accountSuccess && (
            <Alert variant="success" className="mb-4">
              {accountSuccess}
            </Alert>
          )}
          
          {accountError && (
            <Alert variant="error" className="mb-4">
              {accountError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmitAccount(updateAccount)} className="space-y-4">
            <Input
              label="Username"
              placeholder="Enter username"
              error={errorsAccount.username?.message}
              {...registerAccount('username')}
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="Enter email"
              error={errorsAccount.email?.message}
              {...registerAccount('email')}
            />
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                leftIcon={<RefreshCw size={16} />}
                onClick={resetAccountForm}
              >
                Reset
              </Button>
              <Button
                type="submit"
                leftIcon={<Save size={16} />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Password settings card */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordSuccess && (
            <Alert variant="success" className="mb-4">
              {passwordSuccess}
            </Alert>
          )}
          
          {passwordError && (
            <Alert variant="error" className="mb-4">
              {passwordError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmitPassword(updatePassword)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              error={errorsPassword.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />
            
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              error={errorsPassword.newPassword?.message}
              {...registerPassword('newPassword')}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              error={errorsPassword.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                leftIcon={<Save size={16} />}
              >
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;