import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// Layout
import AuthLayout from '../../layouts/AuthLayout';

// Custom components
import { 
  Input, 
  Button, 
  FormContainer, 
  Alert
} from '../../components/ui';

// Validation schema
import { registerSchema } from '../../utils/validationSchemas';

// Auth context
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      role: 'user',
      isActive: true
    }
  });
  
  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    
    try {
      await registerUser(data);
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
        title={t('auth.joinUs')}
        subtitle={t('auth.fillDetails')}
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
        
        <div className="space-y-4">
          <Input
            placeholder={t('fields.name')}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            error={errors.name}
            register={register}
            name="name"
          />
          
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
            type="tel"
            placeholder={t('fields.phone')}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
            error={errors.phone}
            register={register}
            name="phone"
          />
          
          <Input
            placeholder={t('fields.address')}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            error={errors.address}
            register={register}
            name="address"
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
        </div>
        
        <div className="mt-6">
          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
          >
            {t('auth.register')}
          </Button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t('common.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </FormContainer>
    </AuthLayout>
  );
};

export default RegisterPage;
