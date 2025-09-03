import React, { useState } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { Account } from '../../types';

interface HeaderProps {
  currentAccount: Account | null;
  onMobileMenuToggle?: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentAccount, onMobileMenuToggle, isMobile }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const handleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  const mockNotifications = [
    { id: '1', message: 'Nueva recomendación IA disponible', time: '5 min', type: 'info' },
    { id: '2', message: 'Campaña "Oferta Navideña" superó el ROAS objetivo', time: '1 hora', type: 'success' },
    { id: '3', message: 'CPA de Google Ads excedió el umbral', time: '2 horas', type: 'warning' }
  ];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
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

      <header className="bg-slate-purple border-b border-violet-light/20 px-6 py-4 shadow-card relative z-20">
        <div className="flex items-center justify-between">
          {/* Account Info */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            {currentAccount && (
              <>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-soft" style={{ backgroundColor: '#7F4EFF' }}>
                  <span className="text-white font-bold text-lg">
                    {currentAccount.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-light-ice font-bold text-lg sm:text-xl truncate">
                    {currentAccount.name}
                  </h1>
                  <p className="text-cloud-gray text-xs sm:text-sm font-medium truncate">
                    {currentAccount.industry} • Última sincronización: {
                      currentAccount.lastSync 
                        ? new Date(currentAccount.lastSync).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Nunca'
                    }
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button 
                onClick={onMobileMenuToggle}
                className="p-3 text-cloud-gray hover:text-light-ice transition-colors rounded-lg hover:bg-deep-slate/50 lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {/* Notifications */}
            <div className="relative dropdown-container hidden sm:block">
              <button 
                onClick={handleNotifications}
                className="relative p-3 text-cloud-gray hover:text-light-ice transition-colors rounded-lg hover:bg-deep-slate/50"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-coral-red rounded-full animate-pulse-soft"></div>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-purple border border-violet-light/30 rounded-xl shadow-glow z-50 animate-slide-up">
                  <div className="p-4 border-b border-violet-light/20">
                    <h3 className="text-light-ice font-bold text-lg">Notificaciones</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="p-3 sm:p-4 border-b border-violet-light/10 hover:bg-deep-slate/30 transition-colors">
                        <p className="text-light-ice text-xs sm:text-sm font-medium mb-1 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-cloud-gray text-xs">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        // Use proper navigation instead of hash and reload
                        const event = new CustomEvent('navigate', { detail: { page: 'notifications' } });
                        window.dispatchEvent(event);
                        window.dispatchEvent(event);
                      }}
                      className="text-violet-pulse text-sm font-medium hover:text-violet-pulse/80 transition-colors"
                    >
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative dropdown-container hidden sm:block">
              <button 
                onClick={handleProfile}
                className="flex items-center space-x-2 p-2 text-cloud-gray hover:text-light-ice transition-colors rounded-lg hover:bg-deep-slate/50"
              >
                <User className="w-5 h-5" />
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-slate-purple border border-violet-light/30 rounded-xl shadow-glow z-50 animate-slide-up">
                  <div className="p-4 border-b border-violet-light/20">
                    <p className="text-light-ice font-semibold text-sm sm:text-base truncate">Usuario Admin</p>
                    <p className="text-cloud-gray text-xs sm:text-sm font-medium truncate">admin@relevantaigents.com</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setShowProfile(false);
                        // Use proper navigation instead of hash and reload
                        const event = new CustomEvent('navigate', { detail: { page: 'profile' } });
                        window.dispatchEvent(event);
                      }}
                      className="w-full text-left px-3 py-2 text-cloud-gray hover:text-light-ice hover:bg-deep-slate/30 rounded-lg transition-colors font-medium text-sm"
                    >
                      Cuenta Relevant
                    </button>
                    <button 
                      onClick={() => {
                        setShowProfile(false);
                        if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                          // Use proper logout instead of direct navigation
                          const event = new CustomEvent('logout');
                          window.dispatchEvent(event);
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-cloud-gray hover:text-light-ice hover:bg-deep-slate/30 rounded-lg transition-colors font-medium text-sm"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile-only notification and profile buttons */}
            <div className="flex items-center space-x-2 sm:hidden">
              <button 
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: { page: 'notifications' } });
                  window.dispatchEvent(event);
                }}
                className="relative p-2 text-cloud-gray hover:text-light-ice transition-colors rounded-lg hover:bg-deep-slate/50"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-coral-red rounded-full animate-pulse-soft"></div>
              </button>
              <button 
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: { page: 'profile' } });
                  window.dispatchEvent(event);
                }}
                className="p-2 text-cloud-gray hover:text-light-ice transition-colors rounded-lg hover:bg-deep-slate/50"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;