import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2, AreaChart as MarkAsUnread, Filter, Search, Calendar, Clock, Eye, EyeOff, Settings, Download, Archive, Star, StarOff } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  category: 'campaign' | 'system' | 'ai' | 'report';
  source?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Campaña superó objetivo de ROAS',
      message: 'La campaña "Oferta Navideña 2025" alcanzó un ROAS de 6.2x, superando el objetivo de 4.0x en un 55%',
      timestamp: '2025-07-15T10:30:00Z',
      read: false,
      starred: true,
      category: 'campaign',
      source: 'Meta Ads'
    },
    {
      id: '2',
      type: 'warning',
      title: 'CPA excedió el umbral establecido',
      message: 'Google Ads - Campaña "Promoción Q3" tiene un CPA de $23.50, excediendo el límite de $15.00',
      timestamp: '2025-07-15T09:45:00Z',
      read: false,
      starred: false,
      category: 'campaign',
      source: 'Google Ads'
    },
    {
      id: '3',
      type: 'info',
      title: 'Nuevo reporte generado',
      message: 'El reporte "Análisis Semanal de Rendimiento" ha sido generado y está listo para descargar',
      timestamp: '2025-07-15T08:20:00Z',
      read: true,
      starred: false,
      category: 'report',
      source: 'Sistema'
    },
    {
      id: '4',
      type: 'info',
      title: 'Agente IA completó análisis',
      message: 'El agente "Analizador de Rendimiento" identificó 3 nuevas oportunidades de optimización',
      timestamp: '2025-07-15T07:15:00Z',
      read: true,
      starred: false,
      category: 'ai',
      source: 'IA'
    },
    {
      id: '5',
      type: 'error',
      title: 'Error de sincronización',
      message: 'No se pudo sincronizar datos de TikTok Ads. Verifica la conexión en Integraciones',
      timestamp: '2025-07-14T16:30:00Z',
      read: false,
      starred: false,
      category: 'system',
      source: 'TikTok Ads'
    },
    {
      id: '6',
      type: 'success',
      title: 'Optimización aplicada exitosamente',
      message: 'Se aumentó el presupuesto de la campaña "Retargeting Verano" en 30% según recomendación IA',
      timestamp: '2025-07-14T14:45:00Z',
      read: true,
      starred: true,
      category: 'ai',
      source: 'Meta Ads'
    }
  ]);

  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    read: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return X;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#28C76F';
      case 'warning': return '#FFB547';
      case 'error': return '#FF4D6D';
      case 'info': return '#7F4FFF';
      default: return '#AAB3CC';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'campaign': return 'Campaña';
      case 'system': return 'Sistema';
      case 'ai': return 'IA';
      case 'report': return 'Reporte';
      default: return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'campaign': return '#22E4AC';
      case 'system': return '#FFB547';
      case 'ai': return '#7F4FFF';
      case 'report': return '#FF6B9D';
      default: return '#AAB3CC';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: false } : notif
    ));
  };

  const toggleStar = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, starred: !notif.starred } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    showNotification('info', 'Notificación eliminada');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    showNotification('success', 'Todas las notificaciones marcadas como leídas');
  };

  const clearAll = () => {
    if (window.confirm('¿Estás seguro de eliminar todas las notificaciones?')) {
      setNotifications([]);
      showNotification('info', 'Todas las notificaciones eliminadas');
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filters.category !== 'all' && notif.category !== filters.category) return false;
    if (filters.type !== 'all' && notif.type !== filters.type) return false;
    if (filters.read === 'read' && !notif.read) return false;
    if (filters.read === 'unread' && notif.read) return false;
    if (searchTerm && !notif.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notif.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const starredCount = notifications.filter(n => n.starred).length;

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
          <h1 className="text-[#F0F3FA] text-2xl font-bold">Notificaciones</h1>
          <p className="text-[#AAB3CC] mt-1">Centro de alertas y actualizaciones del sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Marcar todas como leídas</span>
          </button>
          <button
            onClick={clearAll}
            className="flex items-center space-x-2 px-4 py-2 bg-[#FF4D6D]/20 text-[#FF4D6D] rounded-lg hover:bg-[#FF4D6D]/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpiar todo</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#7F4FFF]/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#7F4FFF]" />
            </div>
            <div>
              <p className="text-[#F0F3FA] font-bold text-xl">{notifications.length}</p>
              <p className="text-[#AAB3CC] text-sm">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FF6B9D]/20 rounded-lg flex items-center justify-center">
              <MarkAsUnread className="w-5 h-5 text-[#FF6B9D]" />
            </div>
            <div>
              <p className="text-[#F0F3FA] font-bold text-xl">{unreadCount}</p>
              <p className="text-[#AAB3CC] text-sm">Sin leer</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FFB547]/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-[#FFB547]" />
            </div>
            <div>
              <p className="text-[#F0F3FA] font-bold text-xl">{starredCount}</p>
              <p className="text-[#AAB3CC] text-sm">Destacadas</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#22E4AC]/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#22E4AC]" />
            </div>
            <div>
              <p className="text-[#F0F3FA] font-bold text-xl">Hoy</p>
              <p className="text-[#AAB3CC] text-sm">{notifications.filter(n => 
                new Date(n.timestamp).toDateString() === new Date().toDateString()
              ).length} nuevas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#AAB3CC]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar notificaciones..."
            className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg pl-10 pr-4 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[#AAB3CC] text-sm font-medium mb-2">Categoría</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              >
                <option value="all">Todas las categorías</option>
                <option value="campaign">Campañas</option>
                <option value="system">Sistema</option>
                <option value="ai">IA</option>
                <option value="report">Reportes</option>
              </select>
            </div>
            <div>
              <label className="block text-[#AAB3CC] text-sm font-medium mb-2">Tipo</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              >
                <option value="all">Todos los tipos</option>
                <option value="success">Éxito</option>
                <option value="warning">Advertencia</option>
                <option value="error">Error</option>
                <option value="info">Información</option>
              </select>
            </div>
            <div>
              <label className="block text-[#AAB3CC] text-sm font-medium mb-2">Estado</label>
              <select 
                value={filters.read}
                onChange={(e) => setFilters(prev => ({ ...prev, read: e.target.value }))}
                className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              >
                <option value="all">Todas</option>
                <option value="unread">Sin leer</option>
                <option value="read">Leídas</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-[#AAB3CC] mx-auto mb-4 opacity-50" />
            <h3 className="text-[#F0F3FA] text-lg font-medium mb-2">No hay notificaciones</h3>
            <p className="text-[#AAB3CC]">
              {searchTerm || filters.category !== 'all' || filters.type !== 'all' || filters.read !== 'all'
                ? 'No se encontraron notificaciones con los filtros aplicados'
                : 'Todas las notificaciones están al día'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const Icon = getNotificationIcon(notif.type);
            const notifColor = getNotificationColor(notif.type);
            const categoryColor = getCategoryColor(notif.category);
            
            return (
              <div
                key={notif.id}
                className={`bg-[#1E1F3F] border rounded-lg p-4 transition-all duration-200 ${
                  notif.read 
                    ? 'border-[#9B6BFF]/20 opacity-75' 
                    : 'border-[#7F4FFF]/40 shadow-lg shadow-[#7F4FFF]/10'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${notifColor}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: notifColor }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-medium ${notif.read ? 'text-[#AAB3CC]' : 'text-[#F0F3FA]'}`}>
                        {notif.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleStar(notif.id)}
                          className="text-[#AAB3CC] hover:text-[#FFB547] transition-colors"
                        >
                          {notif.starred ? <Star className="w-4 h-4 text-[#FFB547] fill-current" /> : <StarOff className="w-4 h-4" />}
                        </button>
                        <span className="text-[#AAB3CC] text-xs">
                          {new Date(notif.timestamp).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-3 ${notif.read ? 'text-[#AAB3CC]' : 'text-[#F0F3FA]'}`}>
                      {notif.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: `${categoryColor}20`,
                            color: categoryColor
                          }}
                        >
                          {getCategoryLabel(notif.category)}
                        </span>
                        {notif.source && (
                          <span className="text-[#AAB3CC] text-xs">
                            • {notif.source}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {notif.read ? (
                          <button
                            onClick={() => markAsUnread(notif.id)}
                            className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors p-1"
                            title="Marcar como no leída"
                          >
                            <MarkAsUnread className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors p-1"
                            title="Marcar como leída"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-[#AAB3CC] hover:text-[#FF4D6D] transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;