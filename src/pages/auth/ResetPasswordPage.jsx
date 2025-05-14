import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { resetPasswordSchema } from '../../utils/validationSchemas';

// Auth service
import { authService } from '../../services/api';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  
  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    
    try {
      await authService.resetPassword(token, data.password);
      // Redirect to login page after successful password reset
      navigate('/login', { 
        state: { 
          notification: {
            type: 'success',
            message: 'auth.passwordResetSuccess'
          }
        }
      });
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
        title={t('auth.resetPassword')}
        subtitle={t('auth.enterNewPassword')}
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
        
        <Input
          type="password"
          placeholder={t('fields.confirmPassword')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          error={errors.confirmPassword}
          register={register}
          name="confirmPassword"
        />
        
        <div className="mt-6">
          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
          >
            {t('auth.resetPassword')}
          </Button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">
              &larr; {t('common.back')} {t('auth.login')}
            </Link>
          </p>
        </div>
      </FormContainer>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
