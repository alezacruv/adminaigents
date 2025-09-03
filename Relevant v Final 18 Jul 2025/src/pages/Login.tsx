import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Loader,
  ArrowRight,
  Shield,
  Bot
} from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface MagicLinkForm {
  email: string;
}

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'password' | 'magic'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [magicForm, setMagicForm] = useState<MagicLinkForm>({
    email: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    showNotification('success', '¡Bienvenido a Relevant AIgents Platform!');
    
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!magicForm.email.trim()) {
      showNotification('error', 'El correo electrónico es obligatorio');
      return;
    }

    setLoading(true);
    showNotification('info', 'Enviando Magic Link...');
    
    setTimeout(() => {
      setLoading(false);
      setMagicLinkSent(true);
      showNotification('success', 'Magic Link enviado exitosamente');
    }, 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (activeTab === 'password') {
      setLoginForm(prev => ({ ...prev, [field]: value }));
    } else {
      setMagicForm(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
            <div className="w-20 h-20 bg-gradient-to-br from-violet-pulse to-teal-glow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-light-ice text-xl font-semibold mb-8 tracking-tight">
            Relevant AIgents
          </h1>
          <p className="text-cloud-gray text-base">
            Plataforma de Marketing Inteligente
          </p>
        </div>

        {/* Main Card */}
        <div className="modal-content">
          
        
          
          {/* Tabs */}
          <div className="flex bg-deep-slate rounded-xl p-1.5 mb-6">
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold ${
                activeTab === 'password' ? 'shadow-button' : 'text-cloud-gray hover:text-light-ice'
              }`}
              style={activeTab === 'password' ? { backgroundColor: '#7F4EFF', color: '#FFFFFF' } : {}}
            >
              <Lock className="w-4 h-4" />
              <span>Correo y Contraseña</span>
            </button>
            <button
              onClick={() => setActiveTab('magic')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold ${
                activeTab === 'magic' ? 'shadow-button' : 'text-cloud-gray hover:text-light-ice'
              }`}
              style={activeTab === 'magic' ? { backgroundColor: '#7F4EFF', color: '#FFFFFF' } : {}}
            >
              <Zap className="w-4 h-4" />
              <span>Magic Link</span>
            </button>
          </div>

          {/* Password Tab Content */}
          {activeTab === 'password' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-cloud-gray text-sm font-semibold mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cloud-gray" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field pl-12"
                    placeholder="tu@empresa.com"
                  />
                </div>
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
                    value={loginForm.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="input-field pl-12 pr-12"
                    placeholder="Tu contraseña segura"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cloud-gray hover:text-light-ice transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-violet-pulse bg-deep-slate border-violet-light/30 rounded focus:ring-violet-pulse focus:ring-2"
                  />
                  <span className="text-cloud-gray text-sm font-medium">Recordarme</span>
                </label>
                <button
                  type="button"
                  className="text-violet-pulse text-sm font-medium hover:text-violet-pulse/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Magic Link Tab Content */}
          {activeTab === 'magic' && (
            <div className="space-y-6">
              {!magicLinkSent ? (
                <form onSubmit={handleMagicLinkSubmit} className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-violet-pulse rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-light-ice font-bold text-lg mb-3">Acceso sin contraseña</h3>
                    <p className="text-cloud-gray text-base">Te enviaremos un enlace seguro para acceder directamente</p>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-cloud-gray text-sm font-semibold mb-2">
                      Tu Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cloud-gray" />
                      <input
                        type="email"
                        value={magicForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="input-field pl-12"
                        placeholder="tu@empresa.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Enviar Magic Link</span>
                      </>
                    )}
                  </button>

                  {/* Benefits */}
                  <div className="bg-deep-slate rounded-xl p-4 mt-6">
                    <h4 className="text-light-ice font-semibold mb-3 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-teal-glow" />
                      <span>Ventajas del Magic Link</span>
                    </h4>
                    <ul className="space-y-2 text-cloud-gray text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-emerald-green flex-shrink-0" />
                        <span>Sin necesidad de recordar contraseñas</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-emerald-green flex-shrink-0" />
                        <span>Experiencia fluida y moderna</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-emerald-green flex-shrink-0" />
                        <span>Seguridad avanzada</span>
                      </li>
                    </ul>
                  </div>
                </form>
              ) : (
                /* Magic Link Sent State */
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-green rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-light-ice font-bold text-xl">¡Magic Link Enviado!</h3>
                  <p className="text-cloud-gray text-base">
                    Hemos enviado un enlace seguro a <strong className="text-light-ice font-semibold">{magicForm.email}</strong>
                  </p>
                  <div className="bg-deep-slate rounded-xl p-4">
                    <p className="text-cloud-gray text-sm mb-3 font-semibold">
                      <strong>Próximos pasos:</strong>
                    </p>
                    <ol className="text-cloud-gray text-sm space-y-2 text-left">
                      <li>1. Revisa tu bandeja de entrada</li>
                      <li>2. Haz clic en el enlace (válido por 15 minutos)</li>
                      <li>3. Accederás automáticamente al dashboard</li>
                    </ol>
                  </div>
                  <button
                    onClick={() => {
                      setMagicLinkSent(false);
                      setMagicForm({ email: '' });
                    }}
                    className="text-sm font-medium transition-colors"
                    style={{ color: '#7F4EFF' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B42E6'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#7F4EFF'}
                  >
                    ← Volver a intentar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <div className="bg-violet-pulse/10 border border-violet-pulse/20 rounded-xl p-4">
            <p className="text-violet-pulse text-sm font-semibold">🧪 Modo Pruebas Activo</p>
            <p className="text-cloud-gray text-xs font-medium">Haz clic en "Iniciar sesión" para acceder directamente</p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-cloud-gray text-sm font-medium">
            © 2025 Relevant AIgents Platform. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;