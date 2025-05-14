import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
import { forgotPasswordSchema } from '../../utils/validationSchemas';

// Auth service
import { authService } from '../../services/api';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });
  
  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
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
        title={t('auth.forgotPassword')}
        subtitle={t('auth.passwordResetInstructions')}
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
        
        {success && (
          <Alert 
            type="success" 
            dismissible 
            onDismiss={() => setSuccess(false)}
          >
            {t('auth.emailSent')}
          </Alert>
        )}
        
        <Input
          type="email"
          placeholder={t('auth.enterEmail')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          error={errors.email}
          register={register}
          name="email"
        />
        
        <div className="mt-6">
          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
          >
            {t('common.submit')}
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

export default ForgotPasswordPage;
