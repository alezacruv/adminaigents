import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe
} from 'lucide-react';
import { Platform } from '../../types';

interface PlatformStatusProps {
  platforms: Platform[];
  onConnect: (platformId: string) => void;
  onSync: (platformId: string) => void;
}

const IconMap = {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe
};

const PlatformStatus: React.FC<PlatformStatusProps> = ({ platforms, onConnect, onSync }) => {
  const getStatusIcon = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-emerald-green" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-violet-pulse animate-spin" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-coral-red" />;
      case 'disconnected':
        return <AlertCircle className="w-5 h-5 text-cloud-gray" />;
      default:
        return <AlertCircle className="w-5 h-5 text-cloud-gray" />;
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

  return (
    <div className="bg-slate-purple border border-violet-pulse/20 rounded-xl p-6 shadow-md">
      <h3 className="text-light-ice font-semibold text-lg mb-4">Estado de Plataformas</h3>
      
      <div className="space-y-4">
        {platforms.map((platform) => {
          const Icon = IconMap[platform.icon as keyof typeof IconMap] || Globe;
          
          return (
            <div
              key={platform.id}
              className="flex items-center justify-between p-4 bg-midnight rounded-lg hover:bg-midnight/70 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6 text-violet-pulse" />
                <div>
                  <h4 className="text-light-ice font-medium">{platform.name}</h4>
                  <p className="text-cloud-gray text-sm">
                    {platform.lastSync 
                      ? `Última sincronización: ${new Date(platform.lastSync).toLocaleTimeString('es-ES')}`
                      : 'Nunca sincronizado'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(platform.status)}
                  <span className="text-cloud-gray text-sm">{getStatusText(platform.status)}</span>
                </div>

                <div className="flex space-x-2">
                  {platform.status === 'disconnected' ? (
                    <button
                      onClick={() => onConnect(platform.id)}
                      className="px-3 py-1 bg-violet-pulse text-white text-sm rounded-md hover:bg-violet-pulse/80 transition-colors"
                    >
                      Conectar
                    </button>
                  ) : (
                    <button
                      onClick={() => onSync(platform.id)}
                      className="px-3 py-1 bg-teal-glow/20 text-teal-glow text-sm rounded-md hover:bg-teal-glow/30 transition-colors"
                      disabled={platform.status === 'syncing'}
                    >
                      {platform.status === 'syncing' ? 'Sincronizando...' : 'Sincronizar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformStatus;