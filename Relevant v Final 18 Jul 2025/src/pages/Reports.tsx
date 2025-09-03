import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Calendar, 
  Filter, 
  FileText, 
  Eye, 
  Settings, 
  Clock,
  BarChart3,
  Sparkles,
  Users,
  X,
  Bot,
  Send,
  ExternalLink,
  History,
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Share2,
  Trash2,
  MessageCircle,
  Slack,
  Globe,
  ChevronDown,
  Loader,
  Info,
  Target,
  TrendingUp,
  Zap,
  Shuffle,
  PieChart,
  Search,
  DollarSign,
  Layers
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  agentType: 'performance' | 'creative' | 'audience' | 'costs' | 'roas' | 'conversion' | 'platform';
  agentName: string;
  generatedDate: string;
  period: string;
  platforms: string[];
  recipients: string[];
  status: 'completed' | 'generating' | 'error';
  schedule: 'manual' | 'automatic';
}

interface GenerateReportForm {
  agentType: 'performance' | 'creative' | 'audience' | 'costs' | 'roas' | 'conversion' | 'platform';
  period: 'last_7_days' | 'last_30_days' | 'custom';
  customStartDate: string;
  customEndDate: string;
  platforms: string[];
  recipients: string[];
  // Dynamic fields based on agent type
  minCPA?: string;
  roasRange?: string;
  audienceSegment?: string;
  conversionStage?: string;
  platformFocus?: string;
  creativeFormat?: string;
  performanceThreshold?: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [showAgentSelection, setShowAgentSelection] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  
  const [formData, setFormData] = useState<GenerateReportForm>({
    agentType: 'performance',
    period: 'last_30_days',
    customStartDate: '',
    customEndDate: '',
    platforms: ['meta'],
    recipients: [],
    minCPA: '15.00',
    roasRange: '4.0',
    audienceSegment: 'all',
    conversionStage: 'all',
    platformFocus: 'all',
    creativeFormat: 'all',
    performanceThreshold: '4.0'
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const availablePlatforms = [
    { id: 'meta', name: 'Meta Ads', connected: true },
    { id: 'google', name: 'Google Ads', connected: true },
    { id: 'tiktok', name: 'TikTok Ads', connected: false },
    { id: 'linkedin', name: 'LinkedIn Ads', connected: false },
    { id: 'pinterest', name: 'Pinterest', connected: true }
  ];

  const aiAgents = {
    performance: {
      name: 'Resumen Semanal de Rendimiento',
      description: 'Analiza el rendimiento total de campañas activas',
      icon: '📊',
      iconComponent: BarChart3,
      color: '#7F4FFF'
    },
    creative: {
      name: 'Análisis de Creativos Publicitarios',
      description: 'Evalúa qué anuncios creativos tienen mejor o peor performance',
      icon: '🎨',
      iconComponent: Sparkles,
      color: '#22E4AC'
    },
    audience: {
      name: 'Insights de Audiencia',
      description: 'Descubre qué segmentos están generando más valor',
      icon: '🧠',
      iconComponent: Users,
      color: '#FFB547'
    },
    costs: {
      name: 'Análisis de Costos y CPA',
      description: 'Revisa cómo varían tus costos por acción entre plataformas',
      icon: '💰',
      iconComponent: DollarSign,
      color: '#FF6B9D'
    },
    roas: {
      name: 'Comparativa de ROAS',
      description: 'Compara tu retorno de inversión entre campañas y días',
      icon: '📈',
      iconComponent: TrendingUp,
      color: '#36A2EB'
    },
    conversion: {
      name: 'Flujo de Conversión',
      description: 'Representa en qué etapas se pierde la conversión (embudo)',
      icon: '🪜',
      iconComponent: Target,
      color: '#28C76F'
    },
    platform: {
      name: 'Análisis por Plataforma',
      description: 'Reporte por red publicitaria conectada (Meta, Google, TikTok, etc)',
      icon: '🕸️',
      iconComponent: Layers,
      color: '#9B6BFF'
    }
  };

  const handleAgentSelection = (agentType: string) => {
    setSelectedAgent(agentType);
    setFormData(prev => ({ ...prev, agentType: agentType as any }));
    setShowAgentSelection(false);
    setShowConfigModal(true);
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    const agent = aiAgents[formData.agentType as keyof typeof aiAgents];
    showNotification('info', `Ejecutando ${agent.name}...`);

    try {
      // Simulate AI agent processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newReport: Report = {
        id: Date.now().toString(),
        name: `${agent.name} - ${new Date().toLocaleDateString('es-ES')}`,
        agentType: formData.agentType,
        agentName: agent.name,
        generatedDate: new Date().toISOString(),
        period: formData.period === 'custom' 
          ? `${formData.customStartDate} - ${formData.customEndDate}`
          : formData.period === 'last_7_days' ? 'Últimos 7 días' : 'Últimos 30 días',
        platforms: formData.platforms,
        recipients: formData.recipients,
        status: 'completed',
        schedule: 'manual'
      };

      setReports(prev => [newReport, ...prev]);
      setShowConfigModal(false);
      setGeneratingReport(false);
      showNotification('success', `Reporte generado exitosamente por ${agent.name}`);
      
      // Reset form
      setFormData({
        agentType: 'performance',
        period: 'last_30_days',
        customStartDate: '',
        customEndDate: '',
        platforms: ['meta'],
        recipients: [],
        minCPA: '15.00',
        roasRange: '4.0',
        audienceSegment: 'all',
        conversionStage: 'all',
        platformFocus: 'all',
        creativeFormat: 'all',
        performanceThreshold: '4.0'
      });

    } catch (error) {
      setGeneratingReport(false);
      showNotification('error', 'Error al generar el reporte. Intenta nuevamente.');
    }
  };

  const handleDownloadPDF = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    showNotification('success', `Descargando PDF: ${report?.name}`);
  };

  const handleShare = (reportId: string, channel: string) => {
    const report = reports.find(r => r.id === reportId);
    showNotification('success', `Compartiendo "${report?.name}" vía ${channel}`);
    setShowShareModal(null);
  };

  const getPlatformName = (platformId: string) => {
    return availablePlatforms.find(p => p.id === platformId)?.name || platformId;
  };

  const getAgentIcon = (agentType: string) => {
    const agent = aiAgents[agentType as keyof typeof aiAgents];
    return agent ? agent.iconComponent : FileText;
  };

  const getAgentColor = (agentType: string) => {
    const agent = aiAgents[agentType as keyof typeof aiAgents];
    return agent ? agent.color : '#AAB3CC';
  };

  const renderDynamicFields = () => {
    switch (formData.agentType) {
      case 'creative':
        return (
          <div>
            <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
              Formato de Creativos
            </label>
            <select
              value={formData.creativeFormat}
              onChange={(e) => setFormData(prev => ({ ...prev, creativeFormat: e.target.value }))}
              className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
            >
              <option value="all">Todos los formatos</option>
              <option value="image">Solo imágenes</option>
              <option value="video">Solo videos</option>
              <option value="carousel">Carrusel</option>
              <option value="collection">Colección</option>
            </select>
          </div>
        );
      case 'audience':
        return (
          <div>
            <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
              Segmento de Audiencia
            </label>
            <select
              value={formData.audienceSegment}
              onChange={(e) => setFormData(prev => ({ ...prev, audienceSegment: e.target.value }))}
              className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
            >
              <option value="all">Todos los segmentos</option>
              <option value="lookalike">Audiencias Lookalike</option>
              <option value="retargeting">Retargeting</option>
              <option value="interests">Por Intereses</option>
              <option value="demographics">Demográfico</option>
              <option value="custom">Audiencias Personalizadas</option>
            </select>
          </div>
        );
      case 'costs':
        return (
          <div>
            <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
              CPA Mínimo para Análisis ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.minCPA}
              onChange={(e) => setFormData(prev => ({ ...prev, minCPA: e.target.value }))}
              className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              placeholder="15.00"
            />
          </div>
        );
      case 'roas':
        return (
          <div>
            <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
              Rango de ROAS Objetivo
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.roasRange}
              onChange={(e) => setFormData(prev => ({ ...prev, roasRange: e.target.value }))}
              className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              placeholder="4.0"
            />
          </div>
        );
      case 'conversion':
        return (
          <div>
            <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
              Etapa de Conversión
            </label>
            <select
              value={formData.conversionStage}
              onChange={(e) => setFormData(prev => ({ ...prev, conversionStage: e.target.value }))}
              className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
            >
              <option value="all">Todas las etapas</option>
              <option value="awareness">Conocimiento</option>
              <option value="consideration">Consideración</option>
              <option value="conversion">Conversión</option>
              <option value="retention">Retención</option>
            </select>
          </div>
        );
      case 'platform':
        return (
          <div>
            <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
              Enfoque de Plataforma
            </label>
            <select
              value={formData.platformFocus}
              onChange={(e) => setFormData(prev => ({ ...prev, platformFocus: e.target.value }))}
              className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
            >
              <option value="all">Comparativa general</option>
              <option value="meta">Enfoque en Meta Ads</option>
              <option value="google">Enfoque en Google Ads</option>
              <option value="tiktok">Enfoque en TikTok Ads</option>
              <option value="cross">Análisis cross-platform</option>
            </select>
          </div>
        );
      case 'performance':
        return (
          <div>
            <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
              Umbral de Rendimiento (ROAS)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.performanceThreshold}
              onChange={(e) => setFormData(prev => ({ ...prev, performanceThreshold: e.target.value }))}
              className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              placeholder="4.0"
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Empty State
  if (reports.length === 0 && !showAgentSelection && !showConfigModal) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8">
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

        <div className="text-center space-y-6">
          {/* Icon with gradient background */}
          <div className="w-24 h-24 bg-gradient-to-br from-[#7F4FFF] to-[#22E4AC] rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-12 h-12 text-white" />
          </div>
          
          {/* Title */}
          <h2 className="text-[#F0F3FA] text-2xl font-bold">Aún no tienes reportes generados</h2>
          
          {/* Description */}
          <p className="text-[#AAB3CC] max-w-md mx-auto leading-relaxed">
            Los reportes se crean con base en los análisis realizados por tus Agentes IA. 
            Puedes generar uno manualmente o esperar a que el sistema los cree automáticamente.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAgentSelection(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-violet-pulse text-white rounded-lg hover:bg-violet-pulse/90 transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Generar Reporte</span>
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-[#F0F3FA] text-2xl font-bold">Reportes Inteligentes</h1>
          <p className="text-[#AAB3CC] mt-1">Reportes generados automáticamente por Agentes IA</p>
        </div>
        <button 
          onClick={() => setShowAgentSelection(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg transition-all font-semibold"
          style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
          style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
        >
          <Plus className="w-4 h-4" />
          <span>Generar Reporte</span>
        </button>
      </div>

      {/* Reports Grid - Maximum 3 per row on desktop, 1 per row on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = getAgentIcon(report.agentType);
          const agentColor = getAgentColor(report.agentType);
          
          return (
            <div key={report.id} className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-6 hover:border-[#7F4FFF]/40 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${agentColor}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: agentColor }} />
                  </div>
                  <div>
                    <h3 className="text-[#F0F3FA] font-semibold text-sm">{report.name}</h3>
                    <p className="text-[#AAB3CC] text-xs">Agente IA: {report.agentName}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#AAB3CC]">Último generado:</span>
                  <span className="text-[#F0F3FA]">
                    {new Date(report.generatedDate).toLocaleDateString('es-ES')} {new Date(report.generatedDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#AAB3CC]">Programación:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.schedule === 'automatic' 
                      ? 'bg-[#22E4AC]/20 text-[#22E4AC]' 
                      : 'bg-[#FFB547]/20 text-[#FFB547]'
                  }`}>
                    {report.schedule === 'automatic' ? 'Automática' : 'Manual'}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-[#AAB3CC]">Plataformas analizadas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {report.platforms.map((platform) => (
                      <span 
                        key={platform}
                        className="px-2 py-1 bg-[#7F4FFF]/20 text-[#7F4FFF] text-xs rounded-md"
                      >
                        {getPlatformName(platform)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-[#AAB3CC]">Destinatarios:</span>
                  <div className="mt-1">
                    {report.recipients.length === 0 ? (
                      <span className="text-[#AAB3CC] text-xs">Sin destinatarios</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {report.recipients.slice(0, 3).map((email, index) => (
                          <span key={index} className="text-[#F0F3FA] text-xs bg-[#0E0F2B] px-2 py-1 rounded">
                            {email}
                          </span>
                        ))}
                        {report.recipients.length > 3 && (
                          <span className="text-[#AAB3CC] text-xs">+{report.recipients.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setShowShareModal(report.id)}
                  className="flex items-center justify-center space-x-1 py-2 px-3 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors text-sm"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Compartir</span>
                </button>
                <button 
                  onClick={() => handleDownloadPDF(report.id)}
                  className="flex items-center justify-center space-x-1 py-2 px-3 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors text-sm"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar PDF</span>
                </button>
                <button 
                  onClick={() => setShowViewModal(report.id)}
                  className="flex items-center justify-center space-x-1 py-2 px-3 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors text-sm"
                >
                  <Eye className="w-3 h-3" />
                  <span>Ver Reporte</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Selection Modal */}
      {showAgentSelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#F0F3FA] font-semibold text-xl">Selecciona un Agente IA para generar tu reporte</h2>
              <button
                onClick={() => setShowAgentSelection(false)}
                className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 7 AI Agents - 3 per row on desktop, 1 per row on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(aiAgents).map(([key, agent]) => {
                const Icon = agent.iconComponent;
                
                return (
                  <div
                    key={key}
                    className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6 hover:border-[#7F4FFF]/40 transition-all cursor-pointer"
                    onClick={() => handleAgentSelection(key)}
                  >
                    <div className="text-center space-y-4">
                      {/* Icon with emoji and component */}
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">{agent.icon}</span>
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${agent.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: agent.color }} />
                        </div>
                      </div>
                      
                      {/* Agent name */}
                      <h3 className="text-[#F0F3FA] font-semibold text-sm">{agent.name}</h3>
                      
                      {/* Description */}
                      <p className="text-[#AAB3CC] text-xs leading-relaxed">{agent.description}</p>
                      
                      {/* Select button */}
                      <button
                       className="w-full py-2 px-4 rounded-lg transition-all text-sm font-medium"
                       style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                       onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                       onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {(() => {
                  const agent = aiAgents[selectedAgent as keyof typeof aiAgents];
                  const Icon = agent.iconComponent;
                  return (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{agent.icon}</span>
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${agent.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: agent.color }} />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-[#F0F3FA] font-semibold text-xl">Configurar Reporte</h2>
                        <p className="text-[#AAB3CC] text-sm">{agent.name}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                disabled={generatingReport}
                className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Fixed Functionality */}
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Funcionalidad
                </label>
                <div className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA]">
                  {aiAgents[selectedAgent as keyof typeof aiAgents].name}
                </div>
              </div>

              {/* Period Selection */}
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Periodo
                </label>
                <select 
                  value={formData.period}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as any }))}
                  disabled={generatingReport}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors disabled:opacity-50"
                >
                  <option value="last_7_days">Últimos 7 días</option>
                  <option value="last_30_days">Últimos 30 días</option>
                  <option value="custom">Rango personalizado</option>
                </select>
              </div>

              {/* Custom Date Range */}
              {formData.period === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={formData.customStartDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, customStartDate: e.target.value }))}
                      disabled={generatingReport}
                      className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={formData.customEndDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, customEndDate: e.target.value }))}
                      disabled={generatingReport}
                      className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {/* Platform Multiselect - Only connected platforms */}
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Plataformas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePlatforms.filter(p => p.connected).map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          platforms: prev.platforms.includes(platform.id)
                            ? prev.platforms.filter(p => p !== platform.id)
                            : [...prev.platforms, platform.id]
                        }));
                      }}
                      disabled={generatingReport}
                      className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all disabled:opacity-50 ${
                        formData.platforms.includes(platform.id)
                          ? 'border-[#22E4AC] bg-[#22E4AC]/10 text-[#22E4AC]'
                          : 'border-[#9B6BFF]/20 text-[#F0F3FA] hover:border-[#7F4FFF]/40'
                      }`}
                    >
                      <span>{platform.name}</span>
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Fields based on agent type */}
              {renderDynamicFields()}

              {/* Recipients */}
              <div>
                <label className="block text-[#AAB3CC] text-sm font-medium mb-2">
                  Destinatarios
                </label>
                <input
                  type="email"
                  placeholder="Correos para recibir el reporte (separados por comas)"
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  }))}
                  disabled={generatingReport}
                  className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors disabled:opacity-50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowConfigModal(false)}
                  disabled={generatingReport}
                  className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={generatingReport || formData.platforms.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all disabled:cursor-not-allowed"
                  style={(generatingReport || formData.platforms.length === 0) ? { backgroundColor: '#2D2D3B', color: '#94A3B8' } : { backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                  onMouseEnter={(e) => !(generatingReport || formData.platforms.length === 0) && (e.currentTarget.style.backgroundColor = '#6B42E6')}
                  onMouseLeave={(e) => !(generatingReport || formData.platforms.length === 0) && (e.currentTarget.style.backgroundColor = '#7F4EFF')}
                >
                  {generatingReport ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Generar Reporte</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-md mx-4">
            {(() => {
              const report = reports.find(r => r.id === showShareModal);
              if (!report) return null;

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[#F0F3FA] font-semibold text-xl">¿Dónde quieres compartir tu reporte?</h2>
                    <button
                      onClick={() => setShowShareModal(null)}
                      className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleShare(report.id, 'WhatsApp')}
                      className="w-full flex items-center space-x-4 p-4 bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg hover:border-[#25D366]/40 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-[#25D366]/20 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-[#25D366]" />
                      </div>
                      <div>
                        <p className="text-[#F0F3FA] font-medium">WhatsApp</p>
                        <p className="text-[#AAB3CC] text-sm">Genera link para compartir</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleShare(report.id, 'Slack')}
                      className="w-full flex items-center space-x-4 p-4 bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg hover:border-[#4A154B]/40 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-[#4A154B]/20 rounded-lg flex items-center justify-center">
                        <Slack className="w-6 h-6 text-[#4A154B]" />
                      </div>
                      <div>
                        <p className="text-[#F0F3FA] font-medium">Slack</p>
                        <p className="text-[#AAB3CC] text-sm">Lista canales conectados vía integración</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleShare(report.id, 'Gmail')}
                      className="w-full flex items-center space-x-4 p-4 bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg hover:border-[#EA4335]/40 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-[#EA4335]/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-[#EA4335]" />
                      </div>
                      <div>
                        <p className="text-[#F0F3FA] font-medium">Gmail</p>
                        <p className="text-[#AAB3CC] text-sm">Abre plantilla editable prellenada con destinatarios</p>
                      </div>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            {(() => {
              const report = reports.find(r => r.id === showViewModal);
              if (!report) return null;

              const Icon = getAgentIcon(report.agentType);
              const agentColor = getAgentColor(report.agentType);
              const agent = aiAgents[report.agentType as keyof typeof aiAgents];

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{agent.icon}</span>
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${agentColor}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: agentColor }} />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-[#F0F3FA] font-semibold text-xl">{report.name}</h2>
                        <p className="text-[#AAB3CC] text-sm">Generado por {report.agentName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowViewModal(null)}
                      className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Report Header */}
                    <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
                      <h3 className="text-[#F0F3FA] font-medium mb-3">Objetivo del Análisis</h3>
                      <p className="text-[#AAB3CC] text-sm leading-relaxed mb-4">
                        {agent.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-[#AAB3CC]">Periodo:</span>
                          <p className="text-[#F0F3FA] font-medium">{report.period}</p>
                        </div>
                        <div>
                          <span className="text-[#AAB3CC]">Plataformas:</span>
                          <p className="text-[#F0F3FA] font-medium">{report.platforms.length}</p>
                        </div>
                        <div>
                          <span className="text-[#AAB3CC]">Generado:</span>
                          <p className="text-[#F0F3FA] font-medium">{new Date(report.generatedDate).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                          <span className="text-[#AAB3CC]">Estado:</span>
                          <p className="text-[#22E4AC] font-medium">Completado</p>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
                      <h3 className="text-[#F0F3FA] font-medium mb-4">Métricas Clave</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-[#22E4AC] text-3xl font-bold mb-1">4.8x</div>
                          <div className="text-[#AAB3CC] text-sm">ROAS Promedio</div>
                          <div className="text-[#22E4AC] text-xs">+15.3%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#7F4FFF] text-3xl font-bold mb-1">$12.45</div>
                          <div className="text-[#AAB3CC] text-sm">CPA Promedio</div>
                          <div className="text-[#22E4AC] text-xs">-8.7%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#FFB547] text-3xl font-bold mb-1">1,247</div>
                          <div className="text-[#AAB3CC] text-sm">Conversiones</div>
                          <div className="text-[#22E4AC] text-xs">+8.9%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#FF6B9D] text-3xl font-bold mb-1">2.1%</div>
                          <div className="text-[#AAB3CC] text-sm">CTR Promedio</div>
                          <div className="text-[#FF6B9D] text-xs">-15.1%</div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
                        <h4 className="text-[#F0F3FA] font-medium mb-4">Rendimiento por Plataforma</h4>
                        <div className="space-y-3">
                          {report.platforms.map((platform, index) => {
                            const colors = ['#22E4AC', '#7F4FFF', '#FFB547', '#FF6B9D'];
                            const values = [85, 72, 63, 45];
                            return (
                              <div key={platform} className="flex items-center justify-between">
                                <span className="text-[#F0F3FA] text-sm">{getPlatformName(platform)}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 h-2 bg-[#0E0F2B] rounded-full overflow-hidden">
                                    <div 
                                      className="h-full rounded-full transition-all duration-300"
                                      style={{ 
                                        width: `${values[index]}%`,
                                        backgroundColor: colors[index]
                                      }}
                                    />
                                  </div>
                                  <span className="text-[#F0F3FA] text-sm font-medium">{values[index]}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-6">
                        <h4 className="text-[#F0F3FA] font-medium mb-4">Tendencia Semanal</h4>
                        <div className="flex items-end justify-between h-32">
                          {[65, 72, 68, 85, 92, 88, 95].map((value, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div 
                                className="w-6 bg-gradient-to-t from-[#7F4FFF] to-[#22E4AC] rounded-t transition-all duration-300"
                                style={{ height: `${value}%` }}
                              />
                              <span className="text-[#AAB3CC] text-xs mt-2">D{index + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Conclusion */}
                    <div className="bg-gradient-to-r from-[#7F4FFF]/10 to-[#22E4AC]/10 border border-[#7F4FFF]/20 rounded-lg p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Bot className="w-5 h-5 text-[#7F4FFF]" />
                        <h3 className="text-[#F0F3FA] font-medium">Conclusión del Agente IA</h3>
                      </div>
                      <p className="text-[#F0F3FA] leading-relaxed mb-4">
                        {report.agentType === 'performance' && 
                          "El análisis Q3 2025 revela un rendimiento sólido con oportunidades de optimización en 3 campañas específicas. Se recomienda aumentar el presupuesto en campañas con ROAS superior a 6x y pausar aquellas con CPA por encima del umbral establecido."
                        }
                        {report.agentType === 'creative' && 
                          "Se detectó fatiga creativa en 4 anuncios con CTR en declive del 25% en los últimos 7 días. Se recomienda renovar creativos y probar nuevos formatos de video para restaurar el engagement."
                        }
                        {report.agentType === 'audience' && 
                          "Las audiencias lookalike 1% muestran el mejor rendimiento con un CPA 30% menor al promedio. Se recomienda expandir a audiencias similares 2% y 3% para escalar manteniendo la eficiencia."
                        }
                        {report.agentType === 'costs' && 
                          "El análisis de costos revela variaciones significativas entre plataformas. Meta Ads mantiene el CPA más bajo ($10.20) mientras que Google Ads excede el umbral objetivo en 18%."
                        }
                        {report.agentType === 'roas' && 
                          "La comparativa de ROAS muestra Meta Ads liderando con 6.2x, seguido de Google Ads con 4.1x. Se identificaron 3 campañas con potencial de escalamiento inmediato."
                        }
                        {report.agentType === 'conversion' && 
                          "El análisis del embudo de conversión identifica una caída del 35% en la etapa de consideración. Se recomienda optimizar las landing pages e implementar retargeting más agresivo."
                        }
                        {report.agentType === 'platform' && 
                          "El análisis por plataforma Q3 2025 revela que Meta Ads genera el 45% de las conversiones totales con el mejor ROAS. TikTok Ads muestra potencial de crecimiento con audiencias más jóvenes."
                        }
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#AAB3CC]">Confianza del análisis:</span>
                          <p className="text-[#22E4AC] font-medium">92%</p>
                        </div>
                        <div>
                          <span className="text-[#AAB3CC]">Próxima revisión:</span>
                          <p className="text-[#F0F3FA] font-medium">7 días</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      onClick={() => handleDownloadPDF(report.id)}
                       className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
                       style={{ backgroundColor: '#28C76F', color: '#FFFFFF' }}
                       onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#22B365'}
                       onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28C76F'}
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF</span>
                    </button>
                    <button
                      onClick={() => setShowViewModal(null)}
                      className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors"
                    >
                      Cerrar
                    </button>
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

export default Reports;