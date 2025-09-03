import React, { useState } from 'react';
import { 
  Share2, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Target, 
  ShoppingCart, 
  CreditCard,
  Percent,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Lightbulb,
  FileText,
  Download,
  ExternalLink,
  Zap,
  RefreshCw,
  Info,
  X,
  Calendar,
  Filter,
  MapPin,
  Award,
  TrendingDown as TrendingDownIcon,
  Users,
  Globe,
  ChevronDown
} from 'lucide-react';
import PlatformStatus from '../components/Dashboard/PlatformStatus';
import MetricsChart from '../components/Dashboard/MetricsChart';
import { mockPlatforms } from '../data/mockData';

interface KPICardData {
  id: string;
  name: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: any;
  color: string;
  tooltip: string;
  microTrend: number[];
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  action: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  threshold: string;
  current: string;
}

const Dashboard: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [platforms, setPlatforms] = useState(mockPlatforms);
  
  // New global filters state
  const [globalFilters, setGlobalFilters] = useState({
    period: 'last_30_days',
    platforms: ['meta', 'google', 'tiktok'],
    campaignTypes: ['conversions', 'traffic', 'reach']
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Add selected metric state for the chart
  const [selectedMetric, setSelectedMetric] = useState('impresiones');

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Enhanced KPI data with micro trends
  const kpiData: KPICardData[] = [
    {
      id: 'impresiones',
      name: 'Impresiones',
      value: '2.4M',
      change: 12.5,
      changeType: 'increase',
      icon: Eye,
      color: '#22E4AC',
      tooltip: 'Número total de veces que se mostraron tus anuncios',
      microTrend: [2.1, 2.2, 2.3, 2.4, 2.5, 2.4, 2.4]
    },
    {
      id: 'clics',
      name: 'Clics',
      value: '48.2K',
      change: -3.2,
      changeType: 'decrease',
      icon: MousePointer,
      color: '#FFB547',
      tooltip: 'Número de clics recibidos en tus anuncios',
      microTrend: [50, 49, 48.5, 48.2, 47.8, 48.1, 48.2]
    },
    {
      id: 'ctr',
      name: 'CTR',
      value: '2.01%',
      change: -15.1,
      changeType: 'decrease',
      icon: Target,
      color: '#7F4FFF',
      tooltip: 'Porcentaje de clics sobre impresiones (Click-Through Rate)',
      microTrend: [2.4, 2.3, 2.1, 2.0, 1.9, 2.0, 2.01]
    },
    {
      id: 'cpa',
      name: 'CPA',
      value: '$12.45',
      change: -8.7,
      changeType: 'decrease',
      icon: DollarSign,
      color: '#28C76F',
      tooltip: 'Costo promedio por adquisición de cliente',
      microTrend: [14, 13.5, 13, 12.8, 12.5, 12.4, 12.45]
    },
    {
      id: 'roas',
      name: 'ROAS',
      value: '4.8x',
      change: 15.3,
      changeType: 'increase',
      icon: TrendingUp,
      color: '#845BFF',
      tooltip: 'Retorno de inversión publicitaria (Return on Ad Spend)',
      microTrend: [4.1, 4.3, 4.5, 4.6, 4.7, 4.8, 4.8]
    },
    {
      id: 'conversiones',
      name: 'Conversiones',
      value: '1,247',
      change: 8.9,
      changeType: 'increase',
      icon: ShoppingCart,
      color: '#FF6B9D',
      tooltip: 'Número total de conversiones obtenidas',
      microTrend: [1100, 1150, 1200, 1220, 1240, 1245, 1247]
    },
    {
      id: 'gasto',
      name: 'Gasto Total',
      value: '$15,523',
      change: 5.2,
      changeType: 'increase',
      icon: CreditCard,
      color: '#FF8A4C',
      tooltip: 'Inversión total en publicidad del período',
      microTrend: [14500, 14800, 15000, 15200, 15400, 15500, 15523]
    },
    {
      id: 'ingresos',
      name: 'Ingresos',
      value: '$74,510',
      change: 18.7,
      changeType: 'increase',
      icon: TrendingUp,
      color: '#00D4AA',
      tooltip: 'Ingresos totales generados por las campañas',
      microTrend: [62000, 65000, 68000, 70000, 72000, 74000, 74510]
    },
    {
      id: 'cpc',
      name: 'CPC',
      value: '$0.32',
      change: -12.3,
      changeType: 'decrease',
      icon: MousePointer,
      color: '#36A2EB',
      tooltip: 'Costo promedio por clic',
      microTrend: [0.38, 0.36, 0.34, 0.33, 0.32, 0.32, 0.32]
    },
    {
      id: 'bajo_kpi',
      name: 'Campañas Bajo KPI',
      value: '23%',
      change: -5.4,
      changeType: 'decrease',
      icon: AlertTriangle,
      color: '#FF4D6D',
      tooltip: 'Porcentaje de campañas que no alcanzan los KPIs objetivo',
      microTrend: [30, 28, 26, 25, 24, 23, 23]
    }
  ];

  // AI Recommendations
  const aiRecommendations: AIRecommendation[] = [
    {
      id: '1',
      title: 'Aumentar Presupuesto Meta Ads',
      description: 'Campaña "Oferta Navideña" con ROAS 6.2x, 45% sobre objetivo',
      impact: 'high',
      category: 'Optimización de Presupuesto',
      action: 'Incrementar inversión en $5,000 para maximizar retorno'
    },
    {
      id: '2',
      title: 'Pausar Campaña Google Display',
      description: 'CPA excede umbral en 85% ($23.50 vs $12.50 objetivo)',
      impact: 'high',
      category: 'Control de Costos',
      action: 'Pausar inmediatamente para evitar desperdicio de presupuesto'
    },
    {
      id: '3',
      title: 'Renovar Creativos TikTok',
      description: 'Fatiga creativa detectada: CTR bajó 25% en últimos 3 días',
      impact: 'medium',
      category: 'Optimización Creativa',
      action: 'Probar 3 nuevos formatos de video con A/B testing'
    },
    {
      id: '4',
      title: 'Expandir Audiencia Lookalike',
      description: 'Audiencia similar 1% agotada, oportunidad en 2-3%',
      impact: 'medium',
      category: 'Segmentación',
      action: 'Crear audiencias lookalike 2% y 3% para escalar'
    }
  ];

  // Alerts
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Presupuesto Diario Excedido',
      description: 'Google Ads superó el límite diario establecido',
      threshold: '$1,000',
      current: '$1,247'
    },
    {
      id: '2',
      type: 'warning',
      title: 'ROAS Bajo Objetivo',
      description: 'TikTok Ads por debajo del ROAS mínimo',
      threshold: '4.0x',
      current: '3.2x'
    }
  ];

  const generateMicroTrendPath = (data: number[]) => {
    const width = 60;
    const height = 20;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const normalizedValue = (value - Math.min(...data)) / (Math.max(...data) - Math.min(...data));
      const y = height - (normalizedValue * height);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const generateShareLink = () => {
    const shareUrl = `${window.location.origin}/dashboard/public/${Date.now()}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showNotification('success', 'Link público copiado al portapapeles');
        setShowShareModal(false);
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('success', 'Link público copiado al portapapeles');
        setShowShareModal(false);
      });
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotification('success', 'Link público copiado al portapapeles');
      setShowShareModal(false);
    }
  };

  const generateReport = (type: string) => {
    setGeneratingReport(true);
    showNotification('info', `Generando reporte ${type}...`);
    
    setTimeout(() => {
      setGeneratingReport(false);
      showNotification('success', `Reporte ${type} generado exitosamente`);
    }, 3000);
  };

  const handlePlatformConnect = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      showNotification('info', `Conectando con ${platform.name}...`);
      
      setPlatforms(prev => prev.map(p => 
        p.id === platformId 
          ? { ...p, status: 'syncing' as const }
          : p
      ));

      setTimeout(() => {
        setPlatforms(prev => prev.map(p => 
          p.id === platformId 
            ? { ...p, status: 'connected' as const, lastSync: new Date('2025-07-15T' + new Date().toTimeString().split(' ')[0]).toISOString() }
            : p
        ));
        showNotification('success', `${platform.name} conectado exitosamente`);
      }, 3000);
    }
  };

  const handlePlatformSync = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      showNotification('info', `Sincronizando datos de ${platform.name}...`);
      
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
        showNotification('success', `Sincronización de ${platform.name} completada`);
      }, 2500);
    }
  };

  // Mock data for new sections
  const executiveSummary = {
    totalSpent: '$47,230',
    mostEfficientChannel: 'Meta Ads',
    topCampaign: 'Oferta Navideña 2025',
    budgetExecuted: 78,
    topConversionCampaign: 'Retargeting Q3 2025'
  };

  const platformComparison = [
    { platform: 'Meta Ads', spend: 18500, conversions: 1247, cpa: 10.20, roas: 6.2 },
    { platform: 'Google Ads', spend: 15200, conversions: 892, cpa: 14.80, roas: 4.1 },
    { platform: 'TikTok Ads', spend: 8900, conversions: 445, cpa: 11.90, roas: 3.2 },
    { platform: 'Pinterest', spend: 4630, conversions: 201, cpa: 16.50, roas: 2.8 }
  ];

  const topLocations = [
    { city: 'Ciudad de México', conversions: 342, percentage: 27.4 },
    { city: 'Guadalajara', conversions: 198, percentage: 15.9 },
    { city: 'Monterrey', conversions: 156, percentage: 12.5 },
    { city: 'Puebla', conversions: 89, percentage: 7.1 },
    { city: 'Tijuana', conversions: 67, percentage: 5.4 }
  ];

  const underperformingCampaigns = [
    { name: 'Promoción Q3 2025', platform: 'Google Ads', issue: 'CPA Alto', current: '$23.50', target: '$12.50', severity: 'high' },
    { name: 'Display Retargeting', platform: 'Meta Ads', issue: 'ROAS Bajo', current: '2.1x', target: '4.0x', severity: 'medium' },
    { name: 'Video Awareness Q3', platform: 'TikTok Ads', issue: 'CTR Bajo', current: '0.8%', target: '2.0%', severity: 'medium' }
  ];

  const conversionFunnel = [
    { stage: 'Impresiones', value: 2400000, percentage: 100 },
    { stage: 'Clics', value: 48200, percentage: 2.01 },
    { stage: 'Landing Page', value: 38560, percentage: 80.0 },
    { stage: 'Conversiones', value: 1247, percentage: 3.23 }
  ];

  const handleFilterChange = (filterType: string, value: any) => {
    setGlobalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'today': return 'Hoy';
      case 'yesterday': return 'Ayer';
      case 'last_7_days': return 'Últimos 7 días';
      case 'last_30_days': return 'Últimos 30 días';
      case 'this_month': return 'Este mes';
      default: return 'Últimos 30 días';
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-[#9B6BFF]/20 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-[#F0F3FA] text-2xl font-bold">Dashboard de Marketing</h1>
          <p className="text-[#AAB3CC] text-xs sm:text-sm">Última actualización: {new Date().toLocaleString('es-ES')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Global Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-[#9B6BFF]/30 rounded-lg hover:border-[#7F4FFF]/40 transition-colors"
            style={{ backgroundColor: '#1ED5A9', color: '#FFFFFF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1BC299'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1ED5A9'}
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
            style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      {/* Global Filters Panel */}
      {showFilters && (
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Period Filter */}
            <div>
              <label className="block text-[#AAB3CC] text-sm font-medium mb-2">Período</label>
              <select 
                value={globalFilters.period}
                onChange={(e) => handleFilterChange('period', e.target.value)}
                className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              >
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="last_7_days">Últimos 7 días</option>
                <option value="last_30_days">Últimos 30 días</option>
                <option value="this_month">Este mes</option>
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-[#AAB3CC] text-sm font-medium mb-2">Plataformas</label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {['Meta Ads', 'Google Ads', 'TikTok', 'Pinterest'].map((platform) => {
                  const platformKey = platform.toLowerCase().replace(' ads', '').replace(' ', '');
                  const isSelected = globalFilters.platforms.includes(platformKey);
                  return (
                    <button
                      key={platform}
                      onClick={() => {
                        const newPlatforms = isSelected 
                          ? globalFilters.platforms.filter(p => p !== platformKey)
                          : [...globalFilters.platforms, platformKey];
                        handleFilterChange('platforms', newPlatforms);
                      }}
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors text-center ${
                        isSelected
                          ? 'bg-[#7F4FFF] text-white'
                          : 'bg-[#0E0F2B] text-[#AAB3CC] hover:text-[#F0F3FA]'
                      }`}
                    >
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campaign Type Filter */}
            <div>
              <label className="block text-[#AAB3CC] text-sm font-medium mb-2">Tipo de Campaña</label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {['Conversiones', 'Tráfico', 'Alcance', 'Leads'].map((type) => {
                  const typeKey = type.toLowerCase();
                  const isSelected = globalFilters.campaignTypes.includes(typeKey);
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        const newTypes = isSelected 
                          ? globalFilters.campaignTypes.filter(t => t !== typeKey)
                          : [...globalFilters.campaignTypes, typeKey];
                        handleFilterChange('campaignTypes', newTypes);
                      }}
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors text-center ${
                        isSelected
                          ? 'bg-[#22E4AC] text-white'
                          : 'bg-[#0E0F2B] text-[#AAB3CC] hover:text-[#F0F3FA]'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#9B6BFF]/20 text-center">
            <span className="text-[#AAB3CC] text-xs sm:text-sm">
              Filtros aplicados: {getPeriodLabel(globalFilters.period)} • {globalFilters.platforms.length} plataformas • {globalFilters.campaignTypes.length} tipos de campaña
            </span>
          </div>
        </div>
      )}

      {/* Executive Summary */}
      <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-emerald-green rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[#F0F3FA] font-semibold text-lg">Resumen Ejecutivo</h3>
            <p className="text-[#AAB3CC] text-sm">Vista general del rendimiento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-[#0E0F2B] rounded-lg p-3 sm:p-4 text-center">
            <div className="text-[#22E4AC] text-xl sm:text-2xl font-bold">{executiveSummary.totalSpent}</div>
            <div className="text-[#AAB3CC] text-xs sm:text-sm">Total Gastado</div>
          </div>
          <div className="bg-[#0E0F2B] rounded-lg p-3 sm:p-4 text-center">
            <div className="text-[#7F4FFF] text-sm sm:text-lg font-bold truncate">{executiveSummary.mostEfficientChannel}</div>
            <div className="text-[#AAB3CC] text-xs sm:text-sm">Canal Más Eficiente</div>
          </div>
          <div className="bg-[#0E0F2B] rounded-lg p-3 sm:p-4 text-center">
            <div className="text-[#FFB547] text-sm sm:text-lg font-bold truncate">{executiveSummary.topCampaign}</div>
            <div className="text-[#AAB3CC] text-xs sm:text-sm">Mayor Inversión</div>
          </div>
          <div className="bg-[#0E0F2B] rounded-lg p-3 sm:p-4 text-center">
            <div className="text-[#28C76F] text-xl sm:text-2xl font-bold">{executiveSummary.budgetExecuted}%</div>
            <div className="text-[#AAB3CC] text-xs sm:text-sm">Presupuesto Ejecutado</div>
          </div>
          <div className="bg-[#0E0F2B] rounded-lg p-3 sm:p-4 text-center sm:col-span-2 lg:col-span-1">
            <div className="text-[#FF6B9D] text-sm sm:text-lg font-bold truncate">{executiveSummary.topConversionCampaign}</div>
            <div className="text-[#AAB3CC] text-xs sm:text-sm">Mayor Conversión</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          
          return (
            <div
              key={kpi.id}
              className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-3 sm:p-4 hover:border-[#7F4FFF]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#7F4FFF]/10 group relative"
            >
              {/* Tooltip */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#0E0F2B] text-[#F0F3FA] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 border border-[#9B6BFF]/30 hidden sm:block">
                {kpi.tooltip}
              </div>

              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${kpi.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  kpi.changeType === 'increase' 
                    ? 'bg-[#28C76F]/20 text-[#28C76F]' 
                    : 'bg-[#FF4D6D]/20 text-[#FF4D6D]'
                }`}>
                  {kpi.changeType === 'increase' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(kpi.change)}%</span>
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-cloud-gray text-xs font-medium mb-1">{kpi.name}</h3>
                <span className="text-[#F0F3FA] text-base sm:text-lg font-bold">{kpi.value}</span>
              </div>

              {/* Micro Trend */}
              <div className="h-4 sm:h-5 mb-2">
                <svg width="60" height="20" className="w-full h-full">
                  <path
                    d={generateMicroTrendPath(kpi.microTrend)}
                    fill="none"
                    stroke={kpi.color}
                    strokeWidth="2"
                    opacity="0.7"
                  />
                </svg>
              </div>

              <p className="text-[#AAB3CC] text-xs">
                {kpi.changeType === 'increase' ? '+' : ''}
                {kpi.change}% vs mes anterior
              </p>
            </div>
          );
        })}
      </div>

      {/* Multi-variable Chart */}
      <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#F0F3FA] font-semibold text-base sm:text-lg">Tendencias Diarias</h3>
          <div className="flex items-center space-x-2">
            <span className="text-[#AAB3CC] text-xs sm:text-sm hidden sm:inline">Métricas:</span>
          </div>
        </div>
        
        {/* Metric selector buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4 sm:mb-6">
          {[
            { id: 'impresiones', name: 'Impresiones', color: '#22E4AC' },
            { id: 'clics', name: 'Clics', color: '#FFB547' },
            { id: 'cpa', name: 'CPA', color: '#FF6B9D' },
            { id: 'roas', name: 'ROAS', color: '#7F4FFF' },
            { id: 'ctr', name: 'CTR', color: '#36A2EB' },
            { id: 'conversiones', name: 'Conversiones', color: '#28C76F' }
          ].map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 text-center ${
                selectedMetric === metric.id
                  ? 'text-white shadow-md'
                  : 'bg-[#0E0F2B] text-[#AAB3CC] hover:text-[#F0F3FA] hover:bg-[#0E0F2B]/70'
              }`}
              style={{
                backgroundColor: selectedMetric === metric.id ? metric.color : undefined
              }}
            >
              {metric.name}
            </button>
          ))}
        </div>
        
        <MetricsChart 
          selectedMetric={selectedMetric} 
          dateRange={globalFilters.period === 'last_7_days' ? '7' : globalFilters.period === 'last_30_days' ? '30' : '14'} 
        />
      </div>

      {/* Platform Comparison Chart */}
      <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7F4FFF] to-[#9B6BFF] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-[#F0F3FA] font-semibold text-lg">Comparativo de Plataformas</h3>
              <p className="text-[#AAB3CC] text-sm">Rendimiento por canal publicitario</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Spend Comparison */}
          <div>
            <h4 className="text-[#F0F3FA] font-medium text-sm sm:text-base mb-4">Inversión por Plataforma</h4>
            <div className="space-y-3">
              {platformComparison.map((platform, index) => {
                const maxSpend = Math.max(...platformComparison.map(p => p.spend));
                const percentage = (platform.spend / maxSpend) * 100;
                const colors = ['#22E4AC', '#7F4FFF', '#FFB547', '#FF6B9D'];
                
                return (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[#F0F3FA] text-xs sm:text-sm truncate">{platform.platform}</span>
                      <span className="text-[#F0F3FA] font-medium text-xs sm:text-sm">${platform.spend.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#0E0F2B] rounded-full h-1.5 sm:h-2">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: colors[index]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ROAS Comparison */}
          <div>
            <h4 className="text-[#F0F3FA] font-medium text-sm sm:text-base mb-4">ROAS por Plataforma</h4>
            <div className="space-y-3">
              {platformComparison.map((platform, index) => {
                const maxRoas = Math.max(...platformComparison.map(p => p.roas));
                const percentage = (platform.roas / maxRoas) * 100;
                const colors = ['#22E4AC', '#7F4FFF', '#FFB547', '#FF6B9D'];
                
                return (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[#F0F3FA] text-xs sm:text-sm truncate">{platform.platform}</span>
                      <span className="text-[#F0F3FA] font-medium text-xs sm:text-sm">{platform.roas}x</span>
                    </div>
                    <div className="w-full bg-[#0E0F2B] rounded-full h-1.5 sm:h-2">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: colors[index]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Locations */}
      <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFB547] to-[#FF8A4C] rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[#F0F3FA] font-semibold text-lg">Top Ubicaciones</h3>
            <p className="text-[#AAB3CC] text-sm">Conversiones por ciudad</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { city: 'Ciudad de México', conversions: 342, percentage: 27.4, color: '#FF4D6D' },
            { city: 'Guadalajara', conversions: 198, percentage: 15.9, color: '#FFB547' },
            { city: 'Monterrey', conversions: 156, percentage: 12.5, color: '#22E4AC' },
            { city: 'Puebla', conversions: 89, percentage: 7.1, color: '#7F4FFF' },
            { city: 'Tijuana', conversions: 67, percentage: 5.4, color: '#9B6BFF' }
          ].map((location, index) => (
            <div key={index} className="bg-[#0E0F2B] rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: location.color }}
                  />
                  <h4 className="text-[#F0F3FA] font-medium text-sm sm:text-base truncate">{location.city}</h4>
                </div>
                <span className="text-[#F0F3FA] font-bold text-sm sm:text-base">{location.conversions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-[#0E0F2B] rounded-full h-1.5 sm:h-2 mr-3">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${location.percentage}%`,
                      backgroundColor: location.color
                    }}
                  />
                </div>
                <span className="text-[#AAB3CC] text-xs sm:text-sm">{location.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Underperforming Campaigns */}
      <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF4D6D] to-[#FF6B9D] rounded-lg flex items-center justify-center">
            <TrendingDownIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[#F0F3FA] font-semibold text-lg">Campañas Bajo Rendimiento</h3>
            <p className="text-[#AAB3CC] text-sm">Requieren atención inmediata</p>
          </div>
        </div>

        <div className="space-y-4">
          {underperformingCampaigns.map((campaign, index) => (
            <div key={index} className={`p-3 sm:p-4 rounded-lg border ${
              campaign.severity === 'high' 
                ? 'bg-[#FF4D6D]/10 border-[#FF4D6D]/30' 
                : 'bg-[#FFB547]/10 border-[#FFB547]/30'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-[#F0F3FA] font-medium text-sm sm:text-base truncate">{campaign.name}</h4>
                    <span className="px-2 py-1 bg-[#7F4FFF]/20 text-[#7F4FFF] text-xs rounded-full whitespace-nowrap">
                      {campaign.platform}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm space-y-1 sm:space-y-0">
                    <span className="text-[#AAB3CC]">Problema: {campaign.issue}</span>
                    <span className="text-[#AAB3CC]">Actual: {campaign.current}</span>
                    <span className="text-[#AAB3CC]">Objetivo: {campaign.target}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    campaign.severity === 'high' 
                      ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' 
                      : 'bg-[#FFB547]/20 text-[#FFB547]'
                  }`}>
                    {campaign.severity === 'high' ? 'CRÍTICO' : 'MEDIO'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7F4FFF] to-[#22E4AC] rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-[#F0F3FA] font-semibold text-lg">Recomendaciones IA</h3>
              <p className="text-[#AAB3CC] text-sm">Insights generados automáticamente</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#AAB3CC]">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-[#FF4D6D] rounded-full"></div>
              <span>{aiRecommendations.filter(r => r.impact === 'high').length} Alto</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-[#FFB547] rounded-full"></div>
              <span>{aiRecommendations.filter(r => r.impact === 'medium').length} Medio</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiRecommendations.map((rec) => {
            const impactColor = rec.impact === 'high' ? '#FF4D6D' : rec.impact === 'medium' ? '#FFB547' : '#22E4AC';
            
            return (
              <div
                key={rec.id}
                className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-3 sm:p-4 hover:border-[#7F4FFF]/40 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedRecommendation(rec);
                  setShowRecommendationModal(true);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-[#F0F3FA] font-medium text-sm sm:text-base mb-1 leading-tight">{rec.title}</h4>
                    <p className="text-[#AAB3CC] text-xs sm:text-sm leading-relaxed">{rec.description}</p>
                  </div>
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full ml-2 whitespace-nowrap"
                    style={{ 
                      backgroundColor: `${impactColor}20`,
                      color: impactColor
                    }}
                  >
                    {rec.impact.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#7F4FFF] text-xs truncate">{rec.category}</span>
                  <ExternalLink className="w-4 h-4 text-[#AAB3CC]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reports Generation */}
      <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#22E4AC]/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#22E4AC]" />
          </div>
          <div>
            <h3 className="text-[#F0F3FA] font-semibold text-lg">Generación de Reportes</h3>
            <p className="text-[#AAB3CC] text-sm">Reportes automatizados listos para compartir</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { type: 'Últimos 30 días', desc: 'Resumen completo del mes', icon: Calendar },
            { type: 'Campañas bajo rendimiento', desc: 'Análisis de optimización', icon: AlertTriangle },
            { type: 'Resumen ejecutivo', desc: 'Vista de alto nivel para directivos', icon: TrendingUp }
          ].map((report, index) => {
            const Icon = report.icon;
            
            return (
              <button
                key={index}
                onClick={() => generateReport(report.type)}
                disabled={generatingReport}
                className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-3 sm:p-4 hover:border-[#22E4AC]/40 transition-all text-left disabled:opacity-50"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="w-5 h-5 text-[#22E4AC]" />
                  <h4 className="text-[#F0F3FA] font-medium text-sm sm:text-base leading-tight">{report.type}</h4>
                </div>
                <p className="text-[#AAB3CC] text-xs sm:text-sm mb-3 leading-relaxed">{report.desc}</p>
                <div className="flex items-center space-x-2 text-[#22E4AC] text-xs sm:text-sm">
                  <Download className="w-4 h-4" />
                  <span>Generar PDF</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-[#1E1F3F] border border-[#FF4D6D]/30 rounded-xl p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-[#FF4D6D]" />
            <h3 className="text-[#F0F3FA] font-semibold text-lg">Alertas de Límites</h3>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 sm:p-4 rounded-lg border ${
                  alert.type === 'critical' 
                    ? 'bg-[#FF4D6D]/10 border-[#FF4D6D]/30' 
                    : 'bg-[#FFB547]/10 border-[#FFB547]/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      alert.type === 'critical' ? 'text-[#FF4D6D]' : 'text-[#FFB547]'
                    }`}>
                      {alert.title}
                    </h4>
                    <p className="text-[#AAB3CC] text-xs sm:text-sm leading-relaxed">{alert.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-xs space-y-1 sm:space-y-0">
                      <span className="text-[#AAB3CC]">Límite: {alert.threshold}</span>
                      <span className={alert.type === 'critical' ? 'text-[#FF4D6D]' : 'text-[#FFB547]'}>
                        Actual: {alert.current}
                      </span>
                    </div>
                  </div>
                  <button className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors self-end sm:self-start">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-4 sm:p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#F0F3FA] font-semibold text-lg sm:text-xl">Compartir Dashboard</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-[#AAB3CC] text-xs sm:text-sm leading-relaxed">
                Genera un enlace público de solo lectura para compartir este dashboard sin requerir inicio de sesión.
              </p>

              <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-[#7F4FFF]" />
                  <span className="text-[#F0F3FA] text-sm font-medium">Características del enlace:</span>
                </div>
                <ul className="text-[#AAB3CC] text-sm space-y-1">
                  <li className="text-xs sm:text-sm">• Solo lectura (sin edición)</li>
                  <li className="text-xs sm:text-sm">• Sin menú de navegación</li>
                  <li className="text-xs sm:text-sm">• Acceso sin autenticación</li>
                  <li className="text-xs sm:text-sm">• Datos actualizados en tiempo real</li>
                </ul>
              </div>

              <button
                onClick={generateShareLink}
                className="w-full py-2 px-4 rounded-lg transition-all text-sm sm:text-base"
                style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
              >
                Generar Enlace Público
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Detail Modal */}
      {showRecommendationModal && selectedRecommendation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-4 sm:p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#F0F3FA] font-semibold text-lg sm:text-xl">Detalle de Recomendación</h2>
              <button
                onClick={() => setShowRecommendationModal(false)}
                className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-[#F0F3FA] font-semibold text-base sm:text-lg mb-2 leading-tight">{selectedRecommendation.title}</h3>
                <p className="text-[#AAB3CC] text-sm sm:text-base leading-relaxed">{selectedRecommendation.description}</p>
              </div>

              <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-3 sm:p-4">
                <h4 className="text-[#F0F3FA] font-medium text-sm sm:text-base mb-2">Acción Recomendada:</h4>
                <p className="text-[#AAB3CC] text-xs sm:text-sm leading-relaxed">{selectedRecommendation.action}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[#AAB3CC] text-xs sm:text-sm">Categoría:</span>
                  <span className="text-[#7F4FFF] text-xs sm:text-sm">{selectedRecommendation.category}</span>
                </div>
                <span 
                  className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full self-start sm:self-center"
                  style={{ 
                    backgroundColor: selectedRecommendation.impact === 'high' ? '#FF4D6D20' : '#FFB54720',
                    color: selectedRecommendation.impact === 'high' ? '#FF4D6D' : '#FFB547'
                  }}
                >
                  Impacto {selectedRecommendation.impact.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={() => setShowRecommendationModal(false)}
                  className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors text-sm sm:text-base"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    showNotification('success', 'Recomendación aplicada exitosamente');
                    setShowRecommendationModal(false);
                  }}
                  className="px-4 py-2 rounded-lg transition-all text-sm sm:text-base"
                  style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                >
                  Aplicar Recomendación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;