import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Key } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination
} from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';

import { adminsApi } from '../utils/api';
import { AdminUser } from '../types';
import { formatDateTime, ADMIN_ROLES } from '../config';
import { useAuth } from '../context/AuthContext';

// Validation schemas
const adminSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'super-admin']),
});

const updateAdminSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'super-admin']),
  isActive: z.boolean(),
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type AdminFormData = z.infer<typeof adminSchema>;
type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const AdminsPage: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [searching, setSearching] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form hooks
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });
  
  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    setValue: setUpdateValue,
    formState: { errors: errorsUpdate },
  } = useForm<UpdateAdminFormData>({
    resolver: zodResolver(updateAdminSchema),
  });
  
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });
  
  // Fetch admins data
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        const data = await adminsApi.getAll();
        setAdmins(data);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to load admin users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin => {
    if (!searching) return true;
    
    const search = searching.toLowerCase();
    return (
      admin.username.toLowerCase().includes(search) ||
      admin.email.toLowerCase().includes(search) ||
      admin.role.toLowerCase().includes(search)
    );
  });

  // Get current page data
  const indexOfLastAdmin = currentPage * pageSize;
  const indexOfFirstAdmin = indexOfLastAdmin - pageSize;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  // Create new admin
  const createAdmin = async (data: AdminFormData) => {
    try {
      setError(null);
      const newAdmin = await adminsApi.create(data);
      setAdmins([...admins, newAdmin]);
      setShowCreateModal(false);
      resetCreate();
      setSuccess('Admin user created successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create admin user');
    }
  };

  // Update admin
  const updateAdmin = async (data: UpdateAdminFormData) => {
    if (!selectedAdmin) return;
    
    try {
      setError(null);
      const updatedAdmin = await adminsApi.update(selectedAdmin._id, data);
      
      setAdmins(prevAdmins => 
        prevAdmins.map(admin => 
          admin._id === updatedAdmin._id ? updatedAdmin : admin
        )
      );
      
      setShowEditModal(false);
      setSuccess('Admin user updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update admin user');
    }
  };

  // Update password
  const updatePassword = async (data: PasswordFormData) => {
    if (!selectedAdmin) return;
    
    try {
      setError(null);
      await adminsApi.updatePassword(selectedAdmin._id, data.password);
      
      setShowPasswordModal(false);
      resetPassword();
      setSuccess('Password updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  // Delete admin
  const deleteAdmin = async () => {
    if (!selectedAdmin) return;
    
    try {
      setError(null);
      await adminsApi.delete(selectedAdmin._id);
      
      setAdmins(prevAdmins => 
        prevAdmins.filter(admin => admin._id !== selectedAdmin._id)
      );
      
      setShowDeleteModal(false);
      setSuccess('Admin user deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete admin user');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Admin Users</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Input
              placeholder="Search admins..."
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
              className="pl-10 w-full"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setShowCreateModal(true)}
          >
            New Admin
          </Button>
        </div>
      </div>
      
      {/* Success and error alerts */}
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}
      
      {/* Admins table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAdmins.length > 0 ? (
                    currentAdmins.map((admin) => (
                      <TableRow key={admin._id}>
                        <TableCell className="font-medium">{admin.username}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Badge variant={admin.role === 'super-admin' ? 'blue' : 'gray'}>
                            {admin.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.isActive ? 'green' : 'red'}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {admin.lastLogin ? formatDateTime(admin.lastLogin) : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setUpdateValue('username', admin.username);
                                setUpdateValue('email', admin.email);
                                setUpdateValue('role', admin.role);
                                setUpdateValue('isActive', admin.isActive);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit size={16} className="mr-1" /> Edit
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setShowPasswordModal(true);
                              }}
                            >
                              <Key size={16} className="mr-1" /> Password
                            </Button>
                            
                            {admin._id !== user?._id && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 size={16} className="mr-1" /> Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        No admin users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="p-4 border-t border-gray-100">
                <Pagination
                  totalCount={filteredAdmins.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Create admin modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Admin"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="create-form">
              Create Admin
            </Button>
          </div>
        }
      >
        <form id="create-form" onSubmit={handleSubmitCreate(createAdmin)} className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter username"
            error={errorsCreate.username?.message}
            {...registerCreate('username')}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            error={errorsCreate.email?.message}
            {...registerCreate('email')}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errorsCreate.password?.message}
            {...registerCreate('password')}
          />
          
          <Select
            label="Role"
            options={ADMIN_ROLES}
            placeholder="Select role"
            defaultValue="admin"
            error={errorsCreate.role?.message}
            {...registerCreate('role')}
          />
        </form>
      </Modal>
      
      {/* Edit admin modal */}
      {selectedAdmin && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Admin User"
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" form="edit-form">
                Update Admin
              </Button>
            </div>
          }
        >
          <form id="edit-form" onSubmit={handleSubmitUpdate(updateAdmin)} className="space-y-4">
            <Input
              label="Username"
              placeholder="Enter username"
              error={errorsUpdate.username?.message}
              {...registerUpdate('username')}
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="Enter email"
              error={errorsUpdate.email?.message}
              {...registerUpdate('email')}
            />
            
            <Select
              label="Role"
              options={ADMIN_ROLES}
              placeholder="Select role"
              error={errorsUpdate.role?.message}
              {...registerUpdate('role')}
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...registerUpdate('isActive')}
              />
              <label htmlFor="isActive" className="font-medium text-gray-700">
                Active Account
              </label>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Change password modal */}
      {selectedAdmin && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button type="submit" form="password-form">
                Update Password
              </Button>
            </div>
          }
        >
          <form id="password-form" onSubmit={handleSubmitPassword(updatePassword)} className="space-y-4">
            <div className="mb-4">
              <p className="text-gray-700">Changing password for: <strong>{selectedAdmin.username}</strong></p>
            </div>
            
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              error={errorsPassword.password?.message}
              {...registerPassword('password')}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              error={errorsPassword.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />
          </form>
        </Modal>
      )}
      
      {/* Delete confirmation modal */}
      {selectedAdmin && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirm Delete"
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={deleteAdmin}>
                Delete Admin
              </Button>
            </div>
          }
        >
          <p className="text-gray-700">
            Are you sure you want to delete the admin user <strong>{selectedAdmin.username}</strong>?
            This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default AdminsPage;