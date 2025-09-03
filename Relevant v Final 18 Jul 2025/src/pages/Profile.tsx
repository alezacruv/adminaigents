import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Upload,
  Trash2,
  Edit3,
  Shield,
  Key,
  Bell,
  Globe,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Juan Carlos',
    lastName: 'Rodríguez',
    email: 'admin@relevantaigents.com',
    phone: '+52 55 1234 5678',
    timezone: 'America/Mexico_City',
    language: 'es',
    avatar: null as File | null,
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    // Preferences
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReports: true
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    showNotification('info', 'Guardando cambios...');
    
    setTimeout(() => {
      setSaving(false);
      showNotification('success', 'Perfil actualizado exitosamente');
    }, 2000);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB
        showNotification('error', 'El archivo debe ser menor a 2MB');
        return;
      }
      
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showNotification('error', 'Solo se permiten archivos JPG o PNG');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
        setProfileData(prev => ({ ...prev, avatar: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setProfileData(prev => ({ ...prev, avatar: null }));
  };

  const handlePasswordChange = () => {
    if (!profileData.currentPassword) {
      showNotification('error', 'Ingresa tu contraseña actual');
      return;
    }
    if (profileData.newPassword.length < 6) {
      showNotification('error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (profileData.newPassword !== profileData.confirmPassword) {
      showNotification('error', 'Las contraseñas no coinciden');
      return;
    }
    
    showNotification('success', 'Contraseña actualizada exitosamente');
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const tabs = [
    { id: 'personal', name: 'Información Personal', icon: User },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'preferences', name: 'Preferencias', icon: Bell }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#7F4FFF]/20"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-[#7F4FFF] to-[#22E4AC] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center space-x-2 px-4 py-2 bg-[#7F4FFF] text-white rounded-lg hover:bg-[#6B42E6] transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Cambiar Foto</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                {avatarPreview && (
                  <button
                    onClick={removeAvatar}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#FF4D6D]/20 text-[#FF4D6D] rounded-lg hover:bg-[#FF4D6D]/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                )}
                <p className="text-[#AAB3CC] text-xs">JPG o PNG, máximo 2MB</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Zona Horaria
                </label>
                <select 
                  value={profileData.timezone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                >
                  <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                  <option value="America/New_York">Nueva York (GMT-5)</option>
                  <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                  <option value="Europe/Madrid">Madrid (GMT+1)</option>
                  <option value="Europe/London">Londres (GMT+0)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Idioma
                </label>
                <select 
                  value={profileData.language}
                  onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
              <h4 className="text-[#F0F3FA] font-medium mb-4">Cambiar Contraseña</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 pr-10 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 pr-10 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 pr-10 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-[#7F4FFF] text-white rounded-lg hover:bg-[#6B42E6] transition-colors"
                >
                  Actualizar Contraseña
                </button>
              </div>
            </div>

            {/* Two Factor Authentication */}
            <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[#F0F3FA] font-medium">Autenticación de Dos Factores</h4>
                  <p className="text-[#AAB3CC] text-sm">Agrega una capa extra de seguridad a tu cuenta</p>
                </div>
                <button 
                  onClick={() => setProfileData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    profileData.twoFactorEnabled ? 'bg-[#28C76F]' : 'bg-[#AAB3CC]/30'
                  } relative`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                    profileData.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            {/* Notification Preferences */}
            <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
              <h4 className="text-[#F0F3FA] font-medium mb-4">Preferencias de Notificaciones</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[#F0F3FA] font-medium">Notificaciones por Email</h5>
                    <p className="text-[#AAB3CC] text-sm">Recibe alertas importantes por correo</p>
                  </div>
                  <button 
                    onClick={() => setProfileData(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      profileData.emailNotifications ? 'bg-[#28C76F]' : 'bg-[#AAB3CC]/30'
                    } relative`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                      profileData.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[#F0F3FA] font-medium">Notificaciones Push</h5>
                    <p className="text-[#AAB3CC] text-sm">Alertas en tiempo real en el navegador</p>
                  </div>
                  <button 
                    onClick={() => setProfileData(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      profileData.pushNotifications ? 'bg-[#28C76F]' : 'bg-[#AAB3CC]/30'
                    } relative`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                      profileData.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[#F0F3FA] font-medium">Emails de Marketing</h5>
                    <p className="text-[#AAB3CC] text-sm">Novedades y consejos sobre marketing digital</p>
                  </div>
                  <button 
                    onClick={() => setProfileData(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }))}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      profileData.marketingEmails ? 'bg-[#28C76F]' : 'bg-[#AAB3CC]/30'
                    } relative`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                      profileData.marketingEmails ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[#F0F3FA] font-medium">Reportes Semanales</h5>
                    <p className="text-[#AAB3CC] text-sm">Resumen semanal de rendimiento</p>
                  </div>
                  <button 
                    onClick={() => setProfileData(prev => ({ ...prev, weeklyReports: !prev.weeklyReports }))}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      profileData.weeklyReports ? 'bg-[#28C76F]' : 'bg-[#AAB3CC]/30'
                    } relative`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                      profileData.weeklyReports ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-[#28C76F] text-white' :
          notification.type === 'error' ? 'bg-[#FF4D6D] text-white' :
          'bg-[#7F4FFF] text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#F0F3FA] text-2xl font-bold">Mi Perfil</h1>
          <p className="text-[#AAB3CC] mt-1">Administra tu información personal y preferencias</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-[#7F4FFF] text-white rounded-lg hover:bg-[#6B42E6] transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#7F4FFF]/20 to-[#22E4AC]/20 text-[#F0F3FA] border border-[#9B6BFF]/30'
                      : 'text-[#AAB3CC] hover:text-[#F0F3FA] hover:bg-[#0E0F2B]/30'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#7F4FFF]' : ''}`} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;