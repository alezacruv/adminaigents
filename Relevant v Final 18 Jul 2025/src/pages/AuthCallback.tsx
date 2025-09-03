import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader, Zap } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMagicLinkAuth = async () => {
      try {
        // Get token from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage('Token de autenticación no válido');
          return;
        }

        // Verify magic link token
        const response = await fetch(`/api/auth/callback?token=${token}`, {
          method: 'GET',
          credentials: 'include' // For httpOnly cookies
        });

        if (response.ok) {
          const data = await response.json();
          setStatus('success');
          setMessage('¡Autenticación exitosa! Redirigiendo...');
          
          // Redirect to dashboard after success
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(errorData.message || 'Token expirado o inválido');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error de conexión. Intenta nuevamente.');
      }
    };

    handleMagicLinkAuth();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader className="w-12 h-12 text-violet-pulse animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-emerald-green" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-coral-red" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'from-violet-pulse to-teal-glow';
      case 'success':
        return 'from-emerald-green to-teal-glow';
      case 'error':
        return 'from-coral-red to-amber-alert';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-slate-purple to-midnight flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/assets/logo-relevant-aigents.png" 
            alt="Relevant AIgents Logo" 
            className="mx-auto mb-4 max-w-[120px] h-auto"
          />
          <h1 className="text-light-ice text-xl font-semibold">Relevant AIgents</h1>
        </div>

        {/* Status Card */}
        <div className="bg-slate-purple border border-violet-pulse/30 rounded-xl p-8 shadow-2xl text-center">
          <div className={`w-20 h-20 bg-gradient-to-br ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {getStatusIcon()}
          </div>

          <h2 className="text-light-ice text-xl font-semibold mb-4">
            {status === 'loading' && 'Verificando Magic Link...'}
            {status === 'success' && '¡Bienvenido de vuelta!'}
            {status === 'error' && 'Error de Autenticación'}
          </h2>

          <p className="text-cloud-gray mb-6">
            {message}
          </p>

          {status === 'loading' && (
            <div className="space-y-2">
              <div className="w-full bg-midnight rounded-full h-2">
                <div className="bg-gradient-to-r from-violet-pulse to-teal-glow h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-cloud-gray text-sm">Procesando autenticación segura...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-midnight rounded-lg p-4">
              <p className="text-emerald-green text-sm">
                ✅ Autenticación completada exitosamente
              </p>
              <p className="text-cloud-gray text-xs mt-1">
                Serás redirigido al dashboard en unos segundos...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-midnight rounded-lg p-4">
                <p className="text-coral-red text-sm mb-2">
                  ❌ No se pudo completar la autenticación
                </p>
                <p className="text-cloud-gray text-xs">
                  El enlace puede haber expirado (válido por 15 minutos) o ya fue utilizado.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full py-3 px-4 bg-gradient-to-r from-violet-pulse to-teal-glow text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Volver al Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-cloud-gray text-sm">
            © 2025 Nexus AI Marketing Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;