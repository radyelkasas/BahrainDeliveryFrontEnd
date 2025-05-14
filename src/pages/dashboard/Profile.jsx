import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

// Layout
import DashboardLayout from '../../layouts/DashboardLayout';

// Components
import { Input, Button, Card, Alert } from '../../components/ui';

// Validation schemas
import { updateProfileSchema, updatePasswordSchema } from '../../utils/validationSchemas';

// Auth context
import { useAuth } from '../../context/AuthContext';

// Profile component
const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile, updatePassword } = useAuth();
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  
  // Profile form
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors } 
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });
  
  // Password form
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    reset: resetPassword,
    formState: { errors: passwordErrors } 
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  
  // Handle profile update
  const onProfileSubmit = async (data) => {
    setProfileError(null);
    setProfileSuccess(false);
    setProfileLoading(true);
    
    try {
      await updateProfile(data);
      setProfileSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.message || 'errors.generic');
    } finally {
      setProfileLoading(false);
    }
  };
  
  // Handle password update
  const onPasswordSubmit = async (data) => {
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordLoading(true);
    
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      setPasswordSuccess(true);
      resetPassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setPasswordError(err.response?.data?.message || 'errors.generic');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t('dashboard.myProfile')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <Card>
              <div className="flex flex-col items-center">
                {/* Profile avatar */}
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {user?.email}
                </p>
                
                <div className="w-full border-t border-gray-200 pt-4 mt-2">
                  <div className="flex items-center text-gray-700 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{user?.phone || t('dashboard.noPhoneAdded')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{user?.address || t('dashboard.noAddressAdded')}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Update forms */}
          <div className="md:col-span-2 space-y-6">
            {/* Update profile form */}
            <Card title={t('auth.updateProfile')}>
              {profileSuccess && (
                <Alert type="success" className="mb-4">
                  {t('auth.profileUpdated')}
                </Alert>
              )}
              
              {profileError && (
                <Alert 
                  type="error" 
                  dismissible 
                  onDismiss={() => setProfileError(null)}
                  className="mb-4"
                >
                  {t(profileError)}
                </Alert>
              )}
              
              <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <div className="space-y-4">
                  <Input
                    placeholder={t('fields.name')}
                    error={profileErrors.name}
                    register={registerProfile}
                    name="name"
                  />
                  
                  <Input
                    type="email"
                    placeholder={t('fields.email')}
                    error={profileErrors.email}
                    register={registerProfile}
                    name="email"
                  />
                  
                  <Input
                    type="tel"
                    placeholder={t('fields.phone')}
                    error={profileErrors.phone}
                    register={registerProfile}
                    name="phone"
                  />
                  
                  <Input
                    placeholder={t('fields.address')}
                    error={profileErrors.address}
                    register={registerProfile}
                    name="address"
                  />
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    loading={profileLoading}
                  >
                    {t('common.save')}
                  </Button>
                </div>
              </form>
            </Card>
            
            {/* Update password form */}
            <Card title={t('auth.updatePassword')}>
              {passwordSuccess && (
                <Alert type="success" className="mb-4">
                  {t('auth.passwordUpdated')}
                </Alert>
              )}
              
              {passwordError && (
                <Alert 
                  type="error" 
                  dismissible 
                  onDismiss={() => setPasswordError(null)}
                  className="mb-4"
                >
                  {t(passwordError)}
                </Alert>
              )}
              
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder={t('fields.currentPassword')}
                    error={passwordErrors.currentPassword}
                    register={registerPassword}
                    name="currentPassword"
                  />
                  
                  <Input
                    type="password"
                    placeholder={t('fields.newPassword')}
                    error={passwordErrors.newPassword}
                    register={registerPassword}
                    name="newPassword"
                  />
                  
                  <Input
                    type="password"
                    placeholder={t('fields.confirmPassword')}
                    error={passwordErrors.confirmPassword}
                    register={registerPassword}
                    name="confirmPassword"
                  />
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    loading={passwordLoading}
                  >
                    {t('common.save')}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
