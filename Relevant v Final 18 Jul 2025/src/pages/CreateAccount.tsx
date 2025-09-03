import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus,
  ArrowLeft,
  Bot,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CreateAccountForm {
  username: string;
  email: string;
  password: string;
}

interface CreateAccountProps {
  onBack: () => void;
  onAccountCreated: () => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({ onBack, onAccountCreated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  
  const [formData, setFormData] = useState<CreateAccountForm>({
    username: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateAccountForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    showNotification('info', 'Creando tu cuenta...');
    
    // Simulate account creation
    setTimeout(() => {
      setLoading(false);
      showNotification('success', '¡Cuenta creada exitosamente! Redirigiendo...');
      
      setTimeout(() => {
        onAccountCreated();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-slate-purple to-midnight flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-glow transition-all duration-300 animate-slide-up ${
          notification.type === 'success' ? 'notification-success' :
          notification.type === 'error' ? 'notification-error' :
          'notification-info'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-lg">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-violet-pulse rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-light-ice text-xl font-semibold mb-8 tracking-tight">
            Relevant AIgents
          </h1>
          <h2 className="text-light-ice text-2xl font-bold mb-4">
            Crear una cuenta
          </h2>
          <p className="text-cloud-gray text-base">
            Completa los siguientes datos para comenzar
          </p>
        </div>

        {/* Main Card */}
        <div className="modal-content">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-cloud-gray hover:text-light-ice transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-cloud-gray text-sm font-semibold mb-2">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cloud-gray" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`input-field pl-12 ${
                    errors.username ? 'border-coral-red focus:border-coral-red' : ''
                  }`}
                  placeholder="Tu nombre de usuario"
                />
              </div>
              {errors.username && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-coral-red" />
                  <p className="text-coral-red text-sm">{errors.username}</p>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-cloud-gray text-sm font-semibold mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cloud-gray" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-field pl-12 ${
                    errors.email ? 'border-coral-red focus:border-coral-red' : ''
                  }`}
                  placeholder="tu@empresa.com"
                />
              </div>
              {errors.email && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-coral-red" />
                  <p className="text-coral-red text-sm">{errors.email}</p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-cloud-gray text-sm font-semibold mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cloud-gray" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input-field pl-12 pr-12 ${
                    errors.password ? 'border-coral-red focus:border-coral-red' : ''
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cloud-gray hover:text-light-ice transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-coral-red" />
                  <p className="text-coral-red text-sm">{errors.password}</p>
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-deep-slate rounded-xl p-4">
              <h4 className="text-light-ice font-semibold mb-3 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-teal-glow" />
                <span>Requisitos de contraseña</span>
              </h4>
              <ul className="space-y-2 text-cloud-gray text-sm">
                <li className={`flex items-center space-x-2 ${
                  formData.password.length >= 6 ? 'text-emerald-green' : ''
                }`}>
                  <CheckCircle className={`w-3 h-3 ${
                    formData.password.length >= 6 ? 'text-emerald-green' : 'text-cloud-gray'
                  }`} />
                  <span>Mínimo 6 caracteres</span>
                </li>
                <li className={`flex items-center space-x-2 ${
                  /[A-Za-z]/.test(formData.password) && /[0-9]/.test(formData.password) ? 'text-emerald-green' : ''
                }`}>
                  <CheckCircle className={`w-3 h-3 ${
                    /[A-Za-z]/.test(formData.password) && /[0-9]/.test(formData.password) ? 'text-emerald-green' : 'text-cloud-gray'
                  }`} />
                  <span>Combinar letras y números (recomendado)</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-button disabled:cursor-not-allowed disabled:hover:scale-100"
              style={loading ? { backgroundColor: '#2D2D3B', color: '#94A3B8' } : { backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#6B42E6')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#7F4EFF')}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Crear cuenta</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-cloud-gray text-sm font-medium">
            © 2025 Relevant AIgents Platform. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;