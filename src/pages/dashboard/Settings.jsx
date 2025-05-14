import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Layout
import DashboardLayout from '../../layouts/DashboardLayout';

// Components
import { Card, Button, Alert } from '../../components/ui';

// Settings component
const Settings = () => {
  const { t, i18n } = useTranslation();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];
  
  // Theme options
  const themes = [
    { value: 'light', label: t('settings.lightTheme') },
    { value: 'dark', label: t('settings.darkTheme') },
    { value: 'system', label: t('settings.systemTheme') }
  ];
  
  // Handle language change
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
    localStorage.setItem('language', langCode);
    
    // Show success alert
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };
  
  // Handle theme change
  const changeTheme = (theme) => {
    // In a real application, this would update the theme
    console.log('Theme changed to:', theme);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t('dashboard.settings')}
        </h1>
        
        {showSuccessAlert && (
          <Alert
            type="success"
            dismissible
            onDismiss={() => setShowSuccessAlert(false)}
            className="mb-6"
          >
            {t('settings.settingsSaved')}
          </Alert>
        )}
        
        <div className="space-y-6">
          {/* Language settings */}
          <Card title={t('settings.language')}>
            <p className="text-gray-600 mb-4">
              {t('settings.chooseLanguage')}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-4 py-2 rounded-lg border ${
                    i18n.language === lang.code
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </Card>
          
          {/* Theme settings */}
          <Card title={t('settings.themePreference')}>
            <p className="text-gray-600 mb-4">
              {t('settings.chooseTheme')}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => changeTheme(theme.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    theme.value === 'light' // Assuming light is default
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </Card>
          
          {/* Notification settings */}
          <Card title={t('settings.notifications')}>
            <p className="text-gray-600 mb-4">
              {t('settings.manageNotifications')}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('settings.emailNotifications')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('settings.receiveEmailUpdates')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('settings.smsNotifications')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('settings.receiveSmsUpdates')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t('settings.marketingEmails')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('settings.receivePromotionalEmails')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={() => {
                  setShowSuccessAlert(true);
                  setTimeout(() => setShowSuccessAlert(false), 3000);
                }}
              >
                {t('common.save')}
              </Button>
            </div>
          </Card>
          
          {/* Account settings */}
          <Card title={t('settings.accountSettings')}>
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 mb-1">
                  {t('settings.accountDeactivation')}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('settings.temporarilyDeactivateAccount')}
                </p>
                <Button variant="outline">
                  {t('settings.deactivateAccount')}
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium text-red-600 mb-1">
                  {t('settings.dangerZone')}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('settings.permanentlyDeleteAccount')}
                </p>
                <Button variant="danger">
                  {t('settings.deleteAccount')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
