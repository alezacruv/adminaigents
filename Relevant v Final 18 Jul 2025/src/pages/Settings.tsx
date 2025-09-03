import React, { useState } from 'react';
import { 
  Save, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  X, 
  Plus, 
  Upload,
  Trash2,
  Edit3,
  Globe,
  Mail,
  MessageCircle,
  Slack,
  Eye,
  Settings as SettingsIcon,
  Bot,
  Calendar,
  Clock,
  Zap,
  History,
  ChevronDown,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddReceiverModal, setShowAddReceiverModal] = useState(false);
  const [showAnalysisHistory, setShowAnalysisHistory] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoChanged, setLogoChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const [newMember, setNewMember] = useState({ email: '', role: 'lector' });
  const [newReceiver, setNewReceiver] = useState({ 
    type: 'email', 
    value: '', 
    events: [] as string[]
  });
  
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', email: 'juan@agencia.com', role: 'Administrador', lastAccess: '2025-07-15T10:30:00Z' },
    { id: '2', email: 'sara@agencia.com', role: 'Editor', lastAccess: '2025-07-15T09:45:00Z' },
    { id: '3', email: 'carlos@agencia.com', role: 'Lector', lastAccess: '2025-07-14T16:20:00Z' }
  ]);

  const [notificationReceivers, setNotificationReceivers] = useState([
    { 
      id: '1', 
      type: 'email', 
      value: 'admin@empresa.com', 
      events: ['reporte', 'simulacion', 'alertas'] 
    },
    { 
      id: '2', 
      type: 'slack', 
      value: '#marketing-alerts', 
      events: ['fallas', 'alertas'] 
    }
  ]);

  const [settings, setSettings] = useState({
    accountName: 'The Rocket Code',
    industry: 'technology',
    timezone: 'America/Mexico_City',
    logo: null as File | null,
    // AI Configuration
    analysisFrequency: 'weekly',
    defaultSimulation: true,
    autoRecommendations: true,
    defaultDateRange: '30',
    // Notifications
    emailNotifications: true,
    slackNotifications: false,
    whatsappNotifications: false
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const validateSettings = () => {
    const errors: {[key: string]: string} = {};
    
    // Validate account name
    if (!settings.accountName.trim()) {
      errors.accountName = 'El nombre de la cuenta es obligatorio';
    } else if (settings.accountName.length > 40) {
      errors.accountName = 'El nombre no puede exceder 40 caracteres';
    }
    
    // Validate industry
    if (!settings.industry) {
      errors.industry = 'Selecciona una industria';
    }
    
    // Validate timezone
    if (!settings.timezone) {
      errors.timezone = 'Selecciona una zona horaria';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadLogo = async (logoFile: File): Promise<string | null> => {
    try {
      // Simulate successful logo upload with mock URL
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
      
      // Return mock logo URL based on file name
      const mockLogoUrl = `https://example.com/uploads/logos/${Date.now()}-${logoFile.name}`;
      return mockLogoUrl;
    } catch (error) {
      console.error('Logo upload failed:', error);
      return null;
    }
  };

  const handleSave = async () => {
    // Validate all fields
    if (!validateSettings()) {
      showNotification('error', 'Por favor corrige los errores antes de guardar');
      return;
    }
    
    setSaving(true);
    showNotification('info', 'Guardando cambios...');
    
    try {
      let logoUrl = null;
      
      // Upload logo if it was changed
      if (logoChanged && settings.logo) {
        logoUrl = await uploadLogo(settings.logo);
        if (!logoUrl) {
          throw new Error('Error al subir el logo');
        }
      }
      
      // Prepare payload
      const payload = {
        accountName: settings.accountName.trim(),
        industry: settings.industry,
        timezone: settings.timezone,
        ...(logoUrl && { logoFile: logoUrl })
      };
      
      // Simulate API call to save settings
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setLogoChanged(false);
        setValidationErrors({});
        showNotification('success', '✅ Cambios guardados correctamente');
      } else {
        throw new Error('Error saving settings');
      }
    } catch (error) {
      console.error('Save failed:', error);
      showNotification('error', '❌ Ocurrió un error al guardar. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Clear validation error for this field
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) { // 1MB
        showNotification('error', 'El archivo debe ser menor a 1MB');
        return;
      }
      
      // Validate file type
      if (!['image/png', 'image/svg+xml'].includes(file.type)) {
        showNotification('error', 'Solo se permiten archivos PNG o SVG');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        setSettings(prev => ({ ...prev, logo: file }));
        setLogoChanged(true);
        
        // Clear logo validation error if exists
        if (validationErrors.logo) {
          setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.logo;
            return newErrors;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setSettings(prev => ({ ...prev, logo: null }));
    setLogoChanged(true);
  };

  const addTeamMember = () => {
    if (!newMember.email.trim()) {
      showNotification('error', 'El email es obligatorio');
      return;
    }

    if (!newMember.email.includes('@')) {
      showNotification('error', 'Ingresa un email válido');
      return;
    }

    const member = {
      id: Date.now().toString(),
      email: newMember.email,
      role: newMember.role === 'admin' ? 'Administrador' : 
            newMember.role === 'editor' ? 'Editor' : 'Lector',
      lastAccess: new Date().toISOString()
    };

    setTeamMembers(prev => [...prev, member]);
    setNewMember({ email: '', role: 'lector' });
    setShowAddMemberModal(false);
    showNotification('success', `Miembro ${member.email} agregado exitosamente`);
  };

  const removeMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member && window.confirm(`¿Estás seguro de eliminar a ${member.email}?`)) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
      showNotification('info', `${member.email} eliminado del equipo`);
    }
  };

  const addNotificationReceiver = () => {
    if (!newReceiver.value.trim()) {
      showNotification('error', 'El valor es obligatorio');
      return;
    }

    if (newReceiver.events.length === 0) {
      showNotification('error', 'Selecciona al menos un tipo de evento');
      return;
    }

    const receiver = {
      id: Date.now().toString(),
      type: newReceiver.type,
      value: newReceiver.value,
      events: newReceiver.events
    };

    setNotificationReceivers(prev => [...prev, receiver]);
    setNewReceiver({ type: 'email', value: '', events: [] });
    setShowAddReceiverModal(false);
    showNotification('success', 'Receptor de notificaciones agregado');
  };

  const removeReceiver = (receiverId: string) => {
    setNotificationReceivers(prev => prev.filter(r => r.id !== receiverId));
    showNotification('info', 'Receptor eliminado');
  };

  const handleEventToggle = (event: string) => {
    setNewReceiver(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const getReceiverIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'slack': return Slack;
      case 'whatsapp': return MessageCircle;
      default: return Bell;
    }
  };

  const getEventLabel = (event: string) => {
    switch (event) {
      case 'reporte': return 'Generación de reporte';
      case 'simulacion': return 'Simulación de impacto';
      case 'configuracion': return 'Cambio de configuración';
      case 'fallas': return 'Fallas de sincronización';
      case 'alertas': return 'Alertas de IA';
      default: return event;
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Shield },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'ai', name: 'Configuración IA', icon: Database },
    { id: 'team', name: 'Acceso de Equipo', icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-[#F0F3FA] font-semibold text-lg mb-6">Configuración General</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                      Nombre de la Cuenta
                    </label>
                    <input
                      type="text"
                      value={settings.accountName}
                      onChange={(e) => handleSettingChange('accountName', e.target.value)}
                      className={`w-full bg-[#0E0F2B] border rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none transition-colors ${
                        validationErrors.accountName 
                          ? 'border-[#FF4D6D] focus:border-[#FF4D6D]' 
                          : 'border-[#9B6BFF]/20 focus:border-[#7F4FFF]'
                      }`}
                      maxLength={40}
                    />
                    {validationErrors.accountName && (
                      <p className="text-[#FF4D6D] text-xs mt-1">{validationErrors.accountName}</p>
                    )}
                    <p className="text-[#AAB3CC] text-xs mt-1">
                      {settings.accountName.length}/40 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                      Industria
                    </label>
                    <select 
                      value={settings.industry}
                      onChange={(e) => handleSettingChange('industry', e.target.value)}
                      className={`w-full bg-[#0E0F2B] border rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none transition-colors ${
                        validationErrors.industry 
                          ? 'border-[#FF4D6D] focus:border-[#FF4D6D]' 
                          : 'border-[#9B6BFF]/20 focus:border-[#7F4FFF]'
                      }`}
                    >
                      <option value="">Selecciona una industria</option>
                      <option value="technology">Tecnología</option>
                      <option value="retail">Retail</option>
                      <option value="education">Educación</option>
                      <option value="healthcare">Salud</option>
                      <option value="finance">Finanzas</option>
                      <option value="fashion">Moda</option>
                      <option value="food">Alimentación</option>
                      <option value="automotive">Automotriz</option>
                      <option value="real_estate">Bienes Raíces</option>
                      <option value="other">Otro</option>
                    </select>
                    {validationErrors.industry && (
                      <p className="text-[#FF4D6D] text-xs mt-1">{validationErrors.industry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                      Zona Horaria
                    </label>
                    <select 
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className={`w-full bg-[#0E0F2B] border rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none transition-colors ${
                        validationErrors.timezone 
                          ? 'border-[#FF4D6D] focus:border-[#FF4D6D]' 
                          : 'border-[#9B6BFF]/20 focus:border-[#7F4FFF]'
                      }`}
                    >
                      <option value="">Selecciona zona horaria</option>
                      <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                      <option value="America/New_York">Nueva York (GMT-5)</option>
                      <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                      <option value="Europe/Madrid">Madrid (GMT+1)</option>
                      <option value="Europe/London">Londres (GMT+0)</option>
                      <option value="Asia/Tokyo">Tokio (GMT+9)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                    {validationErrors.timezone && (
                      <p className="text-[#FF4D6D] text-xs mt-1">{validationErrors.timezone}</p>
                    )}
                  </div>
                </div>

                {/* Right Column - Logo Upload */}
                <div>
                  <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                    Logo de la Cuenta
                  </label>
                  
                  <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
                    {logoPreview ? (
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 mx-auto bg-white rounded-lg p-4 flex items-center justify-center">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex justify-center space-x-3">
                          <label className="flex items-center space-x-2 px-4 py-2 bg-[#7F4FFF]/20 text-[#7F4FFF] rounded-lg hover:bg-[#7F4FFF]/30 transition-colors cursor-pointer mx-auto w-fit">
                            <Edit3 className="w-4 h-4" />
                            <span>Reemplazar</span>
                            <input
                              type="file"
                              accept=".png,.svg"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                          <button
                            onClick={removeLogo}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#FF4D6D]/20 text-[#FF4D6D] rounded-lg hover:bg-[#FF4D6D]/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 mx-auto border-2 border-dashed border-[#9B6BFF]/30 rounded-lg flex items-center justify-center">
                          <Upload className="w-8 h-8 text-[#AAB3CC]" />
                        </div>
                        <div>
                          <label className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:bg-[#6B42E6] transition-colors cursor-pointer"
                            style={{ backgroundColor: '#7F4EFF' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                          >
                            <Upload className="w-4 h-4" />
                            <span>Subir Logo</span>
                            <input
                              type="file"
                              accept=".png,.svg"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div className="text-[#AAB3CC] text-xs space-y-1">
                          <p>PNG o SVG, fondo transparente</p>
                          <p>Máximo 1MB, 300x300 px recomendado</p>
                        </div>
                        {validationErrors.logo && (
                          <p className="text-[#FF4D6D] text-xs">{validationErrors.logo}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-[#F0F3FA] font-semibold text-lg mb-6">Configuración de Notificaciones</h3>
              
              <div className="space-y-6">
                {/* Notification Receivers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[#F0F3FA] font-medium">Receptores de Notificaciones</h4>
                    <button
                      onClick={() => setShowAddReceiverModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
                      style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Receptor</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notificationReceivers.map((receiver) => {
                      const Icon = getReceiverIcon(receiver.type);
                      return (
                        <div key={receiver.id} className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#7F4FFF]/20 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5 text-[#7F4FFF]" />
                              </div>
                              <div>
                                <h5 className="text-[#F0F3FA] font-medium">{receiver.value}</h5>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {receiver.events.map((event) => (
                                    <span 
                                      key={event}
                                      className="px-2 py-1 bg-[#22E4AC]/20 text-[#22E4AC] text-xs rounded-md"
                                    >
                                      {getEventLabel(event)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeReceiver(receiver.id)}
                              className="text-[#FF4D6D] hover:text-[#FF4D6D]/80 transition-colors p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#F0F3FA] font-semibold text-lg">Configuración de IA</h3>
                <div className="flex items-center space-x-2 text-[#7F4FFF] text-sm">
                  <Bot className="w-4 h-4" />
                  <span>Conectado a n8n</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                      <div className="flex items-center space-x-2">
                        <span>Frecuencia de Análisis IA</span>
                        <Bot className="w-4 h-4 text-[#7F4FFF]" />
                      </div>
                    </label>
                    <select 
                      value={settings.analysisFrequency}
                      onChange={(e) => handleSettingChange('analysisFrequency', e.target.value)}
                      className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                      Rango de Fechas por Defecto
                    </label>
                    <select 
                      value={settings.defaultDateRange}
                      onChange={(e) => handleSettingChange('defaultDateRange', e.target.value)}
                      className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                    >
                      <option value="7">Últimos 7 días</option>
                      <option value="15">Últimos 15 días</option>
                      <option value="30">Últimos 30 días</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[#F0F3FA] font-medium">Activar Simulación por Defecto</h4>
                        <p className="text-[#AAB3CC] text-sm">Ejecuta simulaciones automáticamente en cada análisis</p>
                      </div>
                      <button 
                        onClick={() => toggleSetting('defaultSimulation')}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          settings.defaultSimulation ? 'bg-[#28C76F]' : 'bg-[#AAB3CC]/30'
                        } relative`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                          settings.defaultSimulation ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[#F0F3FA] font-medium">Generación Automática de Recomendaciones</h4>
                        <p className="text-[#AAB3CC] text-sm">Los agentes IA generan recomendaciones automáticamente</p>
                      </div>
                      <button 
                        onClick={() => toggleSetting('autoRecommendations')}
                        className={`w-12 h-6 rounded-full transition-all duration-200 ${
                          settings.autoRecommendations ? 'bg-[#28C76F]' : 'bg-[#AAB3CC]/30'
                        } relative`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                          settings.autoRecommendations ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-[#7F4FFF]/20 rounded-lg flex items-center justify-center">
                        <History className="w-5 h-5 text-[#7F4FFF]" />
                      </div>
                      <div>
                        <h4 className="text-[#F0F3FA] font-medium">Historial de Análisis</h4>
                        <p className="text-[#AAB3CC] text-sm">Últimas ejecuciones de agentes IA</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#AAB3CC]">Último análisis:</span>
                        <span className="text-[#F0F3FA]">15 Jul 2025, 10:30</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#AAB3CC]">Agente ejecutado:</span>
                        <span className="text-[#22E4AC]">Rendimiento General</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#AAB3CC]">Estado:</span>
                        <span className="text-[#28C76F]">Completado</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAnalysisHistory(true)}
                      className="w-full py-2 px-4 bg-[#7F4FFF]/20 text-[#7F4FFF] rounded-lg hover:bg-[#7F4FFF]/30 transition-colors"
                    >
                      Ver Historial Completo
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-[#7F4FFF]/10 to-[#22E4AC]/10 border border-[#7F4FFF]/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-4 h-4 text-[#7F4FFF]" />
                      <span className="text-[#F0F3FA] text-sm font-medium">Conexión n8n</span>
                    </div>
                    <p className="text-[#AAB3CC] text-xs">
                      Estas configuraciones se sincronizan automáticamente con los nodos de análisis en n8n.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#F0F3FA] font-semibold text-lg">Acceso de Equipo</h3>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
                  style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Miembro</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7F4FFF] to-[#22E4AC] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {member.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-[#F0F3FA] font-medium">{member.email}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              member.role === 'Administrador' ? 'bg-[#FF6B9D]/20 text-[#FF6B9D]' :
                              member.role === 'Editor' ? 'bg-[#FFB547]/20 text-[#FFB547]' :
                              'bg-[#22E4AC]/20 text-[#22E4AC]'
                            }`}>
                              {member.role}
                            </span>
                            <span className="text-[#AAB3CC] text-xs">
                              Último acceso: {new Date(member.lastAccess).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-[#7F4FFF] hover:text-[#7F4FFF]/80 transition-colors p-2">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeMember(member.id)}
                          className="text-[#FF4D6D] hover:text-[#FF4D6D]/80 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
                <h4 className="text-[#F0F3FA] font-medium mb-4">Roles y Permisos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#FF6B9D] rounded-full"></div>
                      <span className="text-[#F0F3FA] font-medium">Administrador</span>
                    </div>
                    <p className="text-[#AAB3CC] text-sm">Acceso completo a todas las funciones</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#FFB547] rounded-full"></div>
                      <span className="text-[#F0F3FA] font-medium">Editor</span>
                    </div>
                    <p className="text-[#AAB3CC] text-sm">Puede editar reportes y configuraciones IA</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#22E4AC] rounded-full"></div>
                      <span className="text-[#F0F3FA] font-medium">Lector</span>
                    </div>
                    <p className="text-[#AAB3CC] text-sm">Solo visualiza, sin modificar</p>
                  </div>
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

     <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
  <div>
    <h1 className="text-[#F0F3FA] text-2xl font-bold">Configuración cliente</h1>
    <p className="text-[#AAB3CC] mt-1">Configura tu cuenta y preferencias del sistema</p>
  </div>
  <button
    onClick={handleSave}
    disabled={saving}
    className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all disabled:cursor-not-allowed w-full sm:w-auto"
    style={saving ? { backgroundColor: '#2D2D3B', color: '#94A3B8' } : { backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
    onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#6B42E6')}
    onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#7F4EFF')}
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

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#F0F3FA] font-semibold text-xl">Agregar Miembro del Equipo</h2>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Rol Asignado
                </label>
                <select 
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                >
                  <option value="lector">Lector</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addTeamMember}
                  className="px-4 py-2 rounded-lg transition-all"
                  style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                >
                  Agregar Miembro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Notification Receiver Modal */}
      {showAddReceiverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#F0F3FA] font-semibold text-xl">Agregar Receptor de Notificaciones</h2>
              <button
                onClick={() => setShowAddReceiverModal(false)}
                className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Tipo de Canal
                </label>
                <select 
                  value={newReceiver.type}
                  onChange={(e) => setNewReceiver(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                >
                  <option value="email">Correo Electrónico</option>
                  <option value="slack">Slack</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  {newReceiver.type === 'email' ? 'Correo Electrónico' :
                   newReceiver.type === 'slack' ? 'Canal de Slack' : 'Número de WhatsApp'}
                </label>
                <input
                  type={newReceiver.type === 'email' ? 'email' : 'text'}
                  value={newReceiver.value}
                  onChange={(e) => setNewReceiver(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
                  placeholder={
                    newReceiver.type === 'email' ? 'usuario@ejemplo.com' :
                    newReceiver.type === 'slack' ? '#canal-notificaciones' : '+52 55 1234 5678'
                  }
                />
              </div>

              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Tipos de Eventos a Notificar
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'reporte', label: 'Generación de reporte' },
                    { id: 'simulacion', label: 'Simulación de impacto' },
                    { id: 'configuracion', label: 'Cambio de configuración' },
                    { id: 'fallas', label: 'Fallas de sincronización' },
                    { id: 'alertas', label: 'Alertas de IA' }
                  ].map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventToggle(event.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                        newReceiver.events.includes(event.id)
                          ? 'border-[#22E4AC] bg-[#22E4AC]/10 text-[#22E4AC]'
                          : 'border-[#9B6BFF]/20 text-[#F0F3FA] hover:border-[#7F4FFF]/40'
                      }`}
                    >
                      <span>{event.label}</span>
                      {newReceiver.events.includes(event.id) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddReceiverModal(false)}
                  className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addNotificationReceiver}
                  className="px-4 py-2 rounded-lg transition-all"
                  style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                >
                  Agregar Receptor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis History Modal */}
      {showAnalysisHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#F0F3FA] font-semibold text-xl">Historial de Análisis IA</h2>
              <button
                onClick={() => setShowAnalysisHistory(false)}
                className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { date: '2025-07-15T10:30:00Z', agent: 'Rendimiento General', status: 'Completado', duration: '2.3s' },
                { date: '2025-07-15T08:15:00Z', agent: 'Análisis Creativos', status: 'Completado', duration: '1.8s' },
                { date: '2025-07-14T16:45:00Z', agent: 'Insights Audiencia', status: 'Error', duration: '0.5s' },
                { date: '2025-07-14T14:20:00Z', agent: 'Comparativa ROAS', status: 'Completado', duration: '3.1s' },
                { date: '2025-07-14T10:30:00Z', agent: 'Flujo Conversión', status: 'Completado', duration: '2.7s' }
              ].map((analysis, index) => (
                <div key={index} className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#7F4FFF]/20 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-[#7F4FFF]" />
                      </div>
                      <div>
                        <h4 className="text-[#F0F3FA] font-medium">{analysis.agent}</h4>
                        <p className="text-[#AAB3CC] text-sm">
                          {new Date(analysis.date).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#AAB3CC] text-sm">{analysis.duration}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        analysis.status === 'Completado' ? 'bg-[#28C76F]/20 text-[#28C76F]' :
                        analysis.status === 'Error' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' :
                        'bg-[#FFB547]/20 text-[#FFB547]'
                      }`}>
                        {analysis.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;