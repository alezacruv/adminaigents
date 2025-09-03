import React from 'react';
import { UserPlus, LogIn, Bot } from 'lucide-react';

interface ChooseAuthMethodProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

const ChooseAuthMethod: React.FC<ChooseAuthMethodProps> = ({ onCreateAccount, onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-slate-purple to-midnight flex items-center justify-center p-4 sm:p-6 animate-fade-in">
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
            ¡Hola! ¿Ya tienes una cuenta con nosotros?
          </h2>
          <p className="text-cloud-gray text-base">
            Elige una opción para continuar
          </p>
        </div>

        {/* Main Card */}
        <div className="modal-content space-y-4">
          {/* Create Account Button */}
          <button
            onClick={onCreateAccount}
            className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl transition-all duration-200 font-semibold shadow-lg"
            style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
          >
            <UserPlus className="w-5 h-5" />
            <span>Crear una cuenta</span>
          </button>

          {/* Login Button */}
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center space-x-3 py-4 px-6 border border-violet-light/30 hover:border-violet-pulse/50 transition-all duration-200 font-semibold shadow-soft"
            style={{ backgroundColor: '#1ED5A9', color: '#FFFFFF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1BC299'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1ED5A9'}
          >
            <LogIn className="w-5 h-5" />
            <span>Iniciar sesión</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-cloud-gray text-sm font-medium">
            © 2025 Relevant AIgents Platform. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseAuthMethod;