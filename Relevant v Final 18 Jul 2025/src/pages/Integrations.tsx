import React, { useState } from 'react';
import { 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  X,
  Save,
  RefreshCw,
  XCircle
} from 'lucide-react';

const IconMap = {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe
};

interface Platform {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: string;
  icon: string;
  credentials: {
    [key: string]: string;
  };
  requiredFields: {
    key: string;
    label: string;
    type: 'text' | 'password';
    placeholder: string;
  }[];
}

const Integrations: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'meta',
      name: 'Meta Ads',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      icon: 'Facebook',
      credentials: {
        accessToken: 'EAABwzLixnjYBO...',
        appId: '1234567890123456'
      },
      requiredFields: [
        { key: 'accessToken', label: 'Access Token (Graph API)', type: 'password', placeholder: 'Ingresa tu Access Token de Meta' },
        { key: 'appId', label: 'App ID', type: 'text', placeholder: 'ID de tu aplicación de Meta' }
      ]
    },
    {
      id: 'google',
      name: 'Google Ads',
      status: 'connected',
      lastSync: '2024-01-15T10:25:00Z',
      icon: 'Globe',
      credentials: {
        clientId: '123456789-abc.apps.googleusercontent.com',
        clientSecret: 'GOCSPX-abcd1234...'
      },
      requiredFields: [
        { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Client ID de Google OAuth' },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Client Secret de Google OAuth' }
      ]
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads',
      status: 'disconnected',
      icon: 'Youtube',
      credentials: {
        advertiserId: '',
        accessToken: ''
      },
      requiredFields: [
        { key: 'advertiserId', label: 'Advertiser ID', type: 'text', placeholder: 'ID del anunciante de TikTok' },
        { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Token de acceso de TikTok Ads' }
      ]
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      status: 'connected',
      lastSync: '2024-01-15T10:25:00Z',
      icon: 'Globe',
      credentials: {
        apiKey: 'pina_ABC123...',
        accessToken: 'pina_AT_ABC123...'
      },
      requiredFields: [
        { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'API Key de Pinterest' },
        { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Token de acceso de Pinterest' }
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Ads',
      status: 'error',
      lastSync: '2024-01-15T08:15:00Z',
      icon: 'Linkedin',
      credentials: {
        clientId: '86abc123def456',
        clientSecret: 'WjHb9M2L...'
      },
      requiredFields: [
        { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Client ID de LinkedIn OAuth' },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Client Secret de LinkedIn OAuth' }
      ]
    }
  ]);

  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [editingCredentials, setEditingCredentials] = useState<{ [key: string]: string }>({});
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleCredentialsVisibility = (platformId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  const openConfigModal = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      setEditingCredentials(platform.credentials);
      setShowConfigModal(platformId);
    }
  };

  const closeConfigModal = () => {
    setShowConfigModal(null);
    setEditingCredentials({});
  };

  const handleCredentialChange = (key: string, value: string) => {
    setEditingCredentials(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveCredentials = () => {
    if (!showConfigModal) return;

    const platform = platforms.find(p => p.id === showConfigModal);
    if (!platform) return;

    // Basic validation
    const missingFields = platform.requiredFields.filter(field => !editingCredentials[field.key]?.trim());
    if (missingFields.length > 0) {
      showNotification('error', `Campos requeridos faltantes: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    setPlatforms(prev => prev.map(p => 
      p.id === showConfigModal 
        ? { ...p, credentials: { ...editingCredentials } }
        : p
    ));

    showNotification('success', `Credenciales de ${platform.name} guardadas exitosamente`);
    closeConfigModal();
  };

  const handleConnect = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    // Check if credentials are complete
    const missingFields = platform.requiredFields.filter(field => !platform.credentials[field.key]?.trim());
    if (missingFields.length > 0) {
      showNotification('error', `Configure las credenciales primero usando el botón de configuración`);
      return;
    }

    setConnectingPlatform(platformId);
    showNotification('info', `Conectando con ${platform.name}...`);
    
    setTimeout(() => {
      setPlatforms(prev => prev.map(p => 
        p.id === platformId 
          ? { ...p, status: 'connected' as const, lastSync: new Date('2025-07-15T' + new Date().toTimeString().split(' ')[0]).toISOString() }
          : p
      ));
      setConnectingPlatform(null);
      showNotification('success', `${platform.name} conectado exitosamente`);
    }, 3000);
  };

  const handleDisconnect = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    
    if (window.confirm(`¿Estás seguro de que deseas desconectar ${platform?.name}?`)) {
      setPlatforms(prev => prev.map(p => 
        p.id === platformId 
          ? { ...p, status: 'disconnected' as const, lastSync: undefined }
          : p
      ));
      showNotification('info', `${platform?.name} desconectado`);
    }
  };

  const handleSync = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    showNotification('info', `Sincronizando datos de ${platform?.name}...`);
    
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, status: 'syncing' as const }
        : p
    ));

    setTimeout(() => {
      setPlatforms(prev => prev.map(p => 
        p.id === platformId 
          ? { ...p, status: 'connected' as const, lastSync: new Date().toISOString() }
          : p
      ));
      showNotification('success', `Sincronización de ${platform?.name} completada`);
    }, 2500);
  };

  const getStatusIcon = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-[#28C76F]" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-[#7F4FFF] animate-spin" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-[#FF4D6D]" />;
      case 'disconnected':
        return <AlertCircle className="w-5 h-5 text-[#AAB3CC]" />;
      default:
        return <AlertCircle className="w-5 h-5 text-[#AAB3CC]" />;
    }
  };

  const getStatusText = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'syncing':
        return 'Sincronizando...';
      case 'error':
        return 'Error';
      case 'disconnected':
        return 'Desconectado';
      default:
        return 'Desconocido';
    }
  };

  const maskCredential = (value: string) => {
    if (!value) return '';
    if (value.length <= 8) return '•'.repeat(value.length);
    return value.substring(0, 4) + '•'.repeat(value.length - 8) + value.substring(value.length - 4);
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#F0F3FA] text-2xl font-bold">Integraciones de Plataformas</h1>
          <p className="text-[#AAB3CC] mt-1">Conecta y administra tus plataformas publicitarias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const Icon = IconMap[platform.icon as keyof typeof IconMap] || Globe;
          const isConnecting = connectingPlatform === platform.id;
          
          return (
            <div key={platform.id} className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-6 hover:border-[#7F4FFF]/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#7F4FFF]/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#7F4FFF]" />
                  </div>
                  <div>
                    <h3 className="text-[#F0F3FA] font-semibold">{platform.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(platform.status)}
                      <span className={`text-sm ${
                        platform.status === 'connected' ? 'text-[#28C76F]' :
                        platform.status === 'error' ? 'text-[#FF4D6D]' :
                        platform.status === 'syncing' ? 'text-[#7F4FFF]' :
                        'text-[#AAB3CC]'
                      }`}>
                        {getStatusText(platform.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => openConfigModal(platform.id)}
                  className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors p-2 hover:bg-[#0E0F2B]/30 rounded-lg"
                  title="Configurar credenciales"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {/* Last Sync Info */}
              <div className="mb-4">
                <div className="bg-[#0E0F2B] rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#AAB3CC]">Última Sincronización:</span>
                    <span className="text-[#F0F3FA]">
                      {platform.lastSync ? new Date(platform.lastSync).toLocaleString('es-ES') : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credentials Preview */}
              <div className="mb-4">
                <h4 className="text-[#AAB3CC] text-sm font-medium mb-2">Credenciales Configuradas:</h4>
                <div className="space-y-2">
                  {platform.requiredFields.map((field) => (
                    <div key={field.key} className="flex justify-between items-center text-sm">
                      <span className="text-[#AAB3CC]">{field.label}:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#F0F3FA] font-mono text-xs">
                          {platform.credentials[field.key] ? maskCredential(platform.credentials[field.key]) : 'No configurado'}
                        </span>
                        {platform.credentials[field.key] && (
                          <button
                            onClick={() => toggleCredentialsVisibility(platform.id + field.key)}
                            className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
                          >
                            {showCredentials[platform.id + field.key] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {platform.status === 'disconnected' ? (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting}
                    className="w-full py-2 px-4 rounded-lg transition-opacity disabled:cursor-not-allowed"
                    style={isConnecting ? { backgroundColor: '#2D2D3B', color: '#94A3B8' } : { backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                    onMouseEnter={(e) => !isConnecting && (e.currentTarget.style.backgroundColor = '#6B42E6')}
                    onMouseLeave={(e) => !isConnecting && (e.currentTarget.style.backgroundColor = '#7F4EFF')}
                  >
                    {isConnecting ? 'Conectando...' : 'Conectar Plataforma'}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleSync(platform.id)}
                      disabled={platform.status === 'syncing'}
                      className="flex items-center justify-center space-x-1 py-2 px-3 bg-[#22E4AC]/20 text-[#22E4AC] rounded-lg hover:bg-[#22E4AC]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <RefreshCw className={`w-3 h-3 ${platform.status === 'syncing' ? 'animate-spin' : ''}`} />
                      <span>Sincronizar Ahora</span>
                    </button>
                    <button 
                      onClick={() => handleDisconnect(platform.id)}
                      className="flex items-center justify-center space-x-1 py-2 px-3 bg-[#FF4D6D]/20 text-[#FF4D6D] rounded-lg hover:bg-[#FF4D6D]/30 transition-colors text-sm"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Desconectar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            {(() => {
              const platform = platforms.find(p => p.id === showConfigModal);
              if (!platform) return null;

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#7F4FFF]/20 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-[#7F4FFF]" />
                      </div>
                      <div>
                        <h2 className="text-[#F0F3FA] font-semibold text-xl">Configurar {platform.name}</h2>
                        <p className="text-[#AAB3CC] text-sm">Configura las credenciales de API para n8n</p>
                      </div>
                    </div>
                    <button
                      onClick={closeConfigModal}
                      className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors p-2 hover:bg-[#0E0F2B]/30 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {platform.requiredFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type={field.type === 'password' && !showCredentials[showConfigModal + field.key] ? 'password' : 'text'}
                            value={editingCredentials[field.key] || ''}
                            onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                            className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 pr-10 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                            placeholder={field.placeholder}
                          />
                          {field.type === 'password' && (
                            <button
                              type="button"
                              onClick={() => toggleCredentialsVisibility(showConfigModal + field.key)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
                            >
                              {showCredentials[showConfigModal + field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-4">
                      <h4 className="text-[#F0F3FA] font-medium mb-2">Información de n8n:</h4>
                      <p className="text-[#AAB3CC] text-sm">
                        Estas credenciales se utilizarán en los nodos de n8n para conectar con {platform.name}. 
                        Asegúrate de que los permisos sean correctos para las operaciones requeridas.
                      </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={closeConfigModal}
                        className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={saveCredentials}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
                        style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar Credenciales</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;