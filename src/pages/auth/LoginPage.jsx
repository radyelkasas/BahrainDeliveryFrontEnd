import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

// Layout
import AuthLayout from '../../layouts/AuthLayout';

// Custom components
import { 
  Input, 
  Button, 
  FormContainer, 
  Alert, 
  DividerWithText, 
  SocialButton
} from '../../components/ui';

// Validation schema
import { loginSchema } from '../../utils/validationSchemas';

// Auth context
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });
  
  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'errors.generic');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthLayout>
      <FormContainer
        title={t('auth.welcomeBack')}
        subtitle={t('auth.loginToAccount')}
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && (
          <Alert 
            type="error" 
            dismissible 
            onDismiss={() => setError(null)}
          >
            {t(error)}
          </Alert>
        )}
        
        <Input
          type="email"
          placeholder={t('fields.email')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          error={errors.email}
          register={register}
          name="email"
        />
        
        <Input
          type="password"
          placeholder={t('fields.password')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          error={errors.password}
          register={register}
          name="password"
        />
        
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer" 
              {...register('remember')}
            />
            <span className="ml-2 text-sm text-gray-600">{t('common.remember')}</span>
          </label>
          
          <Link 
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            {t('common.forgotPassword')}
          </Link>
        </div>
        
        <Button 
          type="submit" 
          fullWidth 
          loading={loading}
          className="mb-4"
        >
          {t('auth.login')}
        </Button>
        

        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t('common.doNotHaveAccount')}{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              {t('common.createAccount')}
            </Link>
          </p>
        </div>
      </FormContainer>
    </AuthLayout>
  );
};

export default LoginPage;
