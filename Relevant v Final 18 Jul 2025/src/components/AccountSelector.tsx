import React, { useState, useMemo } from 'react';
import { Search, Building, CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';
import { Account } from '../types';

interface AccountSelectorProps {
  accounts: Account[];
  onSelectAccount: (account: Account) => void;
  onAddAccount: () => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ 
  accounts, 
  onSelectAccount, 
  onAddAccount 
}) => {
  const [hoveredAccount, setHoveredAccount] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter accounts based on search term
  const filteredAccounts = useMemo(() => {
    if (!searchTerm.trim()) return accounts;
    
    return accounts.filter(account => {
      const matchesName = account.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = account.industry?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesName || matchesIndustry;
    });
  }, [accounts, searchTerm]);

  // Sort accounts: favorites/recent first, then by name
  const sortedAccounts = useMemo(() => {
    const recentClients = ['1', '2']; // The Rocket Code and Suma Pay as recent
    
    return [...filteredAccounts].sort((a, b) => {
      const aIsRecent = recentClients.includes(a.id);
      const bIsRecent = recentClients.includes(b.id);
      
      if (aIsRecent && !bIsRecent) return -1;
      if (!aIsRecent && bIsRecent) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [filteredAccounts]);

  const handleSelectAccount = (account: Account) => {
    showNotification('success', `Cliente "${account.name}" seleccionado`);
    setTimeout(() => {
      onSelectAccount(account);
    }, 500);
  };

  const getStatusIcon = (status: Account['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-emerald-green" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-coral-red" />;
      case 'disconnected':
        return <AlertCircle className="w-5 h-5 text-cloud-gray" />;
      default:
        return <AlertCircle className="w-5 h-5 text-cloud-gray" />;
    }
  };

  const getStatusText = (status: Account['status']) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'error':
        return 'Error de conexión';
      case 'disconnected':
        return 'Desconectado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusEmoji = (status: Account['status']) => {
    switch (status) {
      case 'connected':
        return '🟢';
      case 'error':
        return '🔴';
      case 'disconnected':
        return '⚪';
      default:
        return '⚪';
    }
  };

  const getTooltipMessage = (status: Account['status']) => {
    switch (status) {
      case 'error':
        return 'No pudimos conectarnos. Revisa la integración o vuelve a intentar.';
      case 'disconnected':
        return 'Cliente desconectado. Configura las integraciones para sincronizar datos.';
      case 'connected':
        return 'Cliente conectado y sincronizando correctamente.';
      default:
        return '';
    }
  };

  const isRecent = (accountId: string) => {
    return ['1', '2'].includes(accountId); // The Rocket Code and Suma Pay
  };

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fade-in">
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

      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-light-ice text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            Seleccionar Cliente
          </h1>
          <p className="text-cloud-gray text-sm sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-8">
            Elige qué cliente deseas administrar para visualizar su rendimiento y automatizaciones.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-sm sm:max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cloud-gray" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 pr-12"
                placeholder="Buscar cliente o industria..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cloud-gray hover:text-light-ice transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        {searchTerm && (
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-cloud-gray text-sm">
              {sortedAccounts.length === 0 
                ? 'No se encontraron clientes' 
                : `${sortedAccounts.length} cliente${sortedAccounts.length !== 1 ? 's' : ''} encontrado${sortedAccounts.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        )}

        {/* No results message */}
        {searchTerm && sortedAccounts.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <img 
              src="/assets/logo-relevant-aigents.png" 
              alt="Relevant AIgents" 
              className="mx-auto mb-6 max-w-[80px] h-auto opacity-50"
            />
            <h3 className="text-light-ice text-lg sm:text-xl font-semibold mb-3">No se encontraron clientes</h3>
            <p className="text-cloud-gray text-sm sm:text-lg">Intenta con otro término de búsqueda</p>
          </div>
        )}

        {/* Empty state when no accounts and no search */}
        {sortedAccounts.length === 0 && !searchTerm && (
          <div className="text-center py-12 sm:py-16">
            <img 
              src="/assets/logo-relevant-aigents.png" 
              alt="Relevant AIgents" 
              className="mx-auto mb-6 max-w-[100px] h-auto opacity-50"
            />
            <h3 className="text-light-ice text-lg sm:text-xl font-semibold mb-3">No hay clientes configurados</h3>
            <p className="text-cloud-gray text-sm sm:text-lg">Contacta al administrador para configurar clientes</p>
          </div>
        )}

        {/* Clients Grid */}
        {sortedAccounts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {sortedAccounts.map((account) => (
              <div
                key={account.id}
                className={`relative card cursor-pointer group transform hover:scale-[1.02] ${
                  hoveredAccount === account.id
                    ? 'border-violet-pulse shadow-glow'
                    : ''
                }`}
                onMouseEnter={() => setHoveredAccount(account.id)}
                onMouseLeave={() => setHoveredAccount(null)}
                onClick={() => handleSelectAccount(account)}
              >
                {/* Recent Badge */}
                {isRecent(account.id) && (
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-amber-alert to-coral-red text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold shadow-button z-10">
                    Reciente
                  </div>
                )}

                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  {/* Avatar */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-violet-pulse rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                    <span className="text-white font-bold text-lg sm:text-xl">
                      {account.name.charAt(0)}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-light-ice font-bold text-base sm:text-lg mb-2 truncate">
                      {account.name}
                    </h3>
                    <p className="text-cloud-gray text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                      {account.industry}
                    </p>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <span className="text-sm">{getStatusEmoji(account.status)}</span>
                      <span className={`text-sm font-semibold ${
                        account.status === 'connected' ? 'text-emerald-green' :
                        account.status === 'error' ? 'text-coral-red' :
                        'text-cloud-gray'
                      }`}>
                        {getStatusText(account.status)}
                      </span>
                      
                      {/* Tooltip for errors */}
                      {account.status === 'error' && (
                        <div className="group/tooltip relative">
                          <AlertCircle className="w-4 h-4 text-coral-red cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-deep-slate text-light-ice text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 border border-violet-light/30 shadow-glow">
                            {getTooltipMessage(account.status)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Last Sync */}
                    <div className="text-cloud-gray text-xs font-medium leading-tight">
                      Última sincronización: {account.lastSync 
                        ? new Date(account.lastSync).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Nunca'
                      }
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-200 shadow-button text-sm sm:text-base"
                  style={hoveredAccount === account.id 
                    ? { backgroundColor: '#7F4EFF', color: '#FFFFFF' }
                    : { backgroundColor: '#1ED5A9', color: '#FFFFFF' }
                  }
                  onMouseEnter={(e) => {
                    if (hoveredAccount === account.id) {
                      e.currentTarget.style.backgroundColor = '#6B42E6';
                    } else {
                      e.currentTarget.style.backgroundColor = '#1BC299';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (hoveredAccount === account.id) {
                      e.currentTarget.style.backgroundColor = '#7F4EFF';
                    } else {
                      e.currentTarget.style.backgroundColor = '#1ED5A9';
                    }
                  }}
                >
                  Administrar Cliente
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSelector;