import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Eye,
  Filter,
  DollarSign,
  Target,
  Palette,
  Users,
  BarChart3,
  X,
  ChevronDown,
  Info,
  Download,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { mockRecommendations } from '../data/mockData';

interface SimulationData {
  currentRoas: number;
  projectedRoas: number;
  currentConversions: number;
  projectedConversions: number;
  currentCpa: number;
  projectedCpa: number;
  revenueImpact: string;
  confidenceLevel: number;
  timeframe: string;
}

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [showSimulationModal, setShowSimulationModal] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [filters, setFilters] = useState({
    platform: 'all',
    impact: 'all',
    type: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSimulation, setShowSimulation] = useState<string | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const generateNewSimulations = () => {
    showNotification('info', 'Generando nuevas simulaciones con IA...');
    
    setTimeout(() => {
      const newRec = {
        id: (Date.now() + Math.floor(Math.random() * 1000)).toString(),
        type: 'adjust_targeting' as const,
        title: 'Expandir Audiencia Lookalike 2%',
        description: 'Oportunidad detectada para escalar con audiencias similares más amplias',
        impact: 'medium' as const,
        platform: 'Meta Ads',
        timestamp: new Date('2025-07-15T' + new Date().toTimeString().split(' ')[0]).toISOString(),
        applied: false,
        insight: 'El modelo proyecta que expandir a audiencias lookalike 2% podría incrementar el volumen de conversiones en 35% manteniendo un CPA similar al actual.'
      };
      
      setRecommendations(prev => [newRec, ...prev]);
      showNotification('success', 'Nuevas simulaciones generadas exitosamente');
    }, 3000);
  };

  const simulateImpact = (recommendationId: string) => {
    const rec = recommendations.find(r => r.id === recommendationId);
    if (rec) {
      setShowSimulationModal(recommendationId);
      setShowSimulation(recommendationId);
      showNotification('info', `Simulando impacto de: ${rec.title}`);
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'increase_budget': return DollarSign;
      case 'pause_campaign': return AlertTriangle;
      case 'change_creative': return Palette;
      case 'adjust_targeting': return Users;
      default: return Target;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#FF4D6D';
      case 'medium': return '#FFB547';
      case 'low': return '#22E4AC';
      default: return '#AAB3CC';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'increase_budget': return 'Optimización de Inversión';
      case 'pause_campaign': return 'Campaña Ineficiente';
      case 'change_creative': return 'Creatividad Fatigada';
      case 'adjust_targeting': return 'Segmentación Subóptima';
      default: return 'Optimización General';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'increase_budget': return '💰';
      case 'pause_campaign': return '⛔';
      case 'change_creative': return '🧠';
      case 'adjust_targeting': return '⚙️';
      default: return '🎯';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return 'ALTO';
      case 'medium': return 'MEDIO';
      case 'low': return 'BAJO';
      default: return 'DESCONOCIDO';
    }
  };

  const generateSimulationData = (recommendationId: string): SimulationData => {
    const rec = recommendations.find(r => r.id === recommendationId);
    if (!rec) return {} as SimulationData;

    // Generate realistic simulation data based on recommendation type
    switch (rec.type) {
      case 'increase_budget':
        return {
          currentRoas: 4.8,
          projectedRoas: 5.2,
          currentConversions: 1247,
          projectedConversions: 1623,
          currentCpa: 12.45,
          projectedCpa: 11.80,
          revenueImpact: '+$15,000',
          confidenceLevel: 92,
          timeframe: '30 días'
        };
      case 'pause_campaign':
        return {
          currentRoas: 2.1,
          projectedRoas: 4.8,
          currentConversions: 892,
          projectedConversions: 892,
          currentCpa: 23.50,
          projectedCpa: 12.45,
          revenueImpact: '+$4,200 (ahorro)',
          confidenceLevel: 87,
          timeframe: 'Inmediato'
        };
      case 'change_creative':
        return {
          currentRoas: 3.2,
          projectedRoas: 4.1,
          currentConversions: 445,
          projectedConversions: 525,
          currentCpa: 11.90,
          projectedCpa: 10.20,
          revenueImpact: '+$2,800',
          confidenceLevel: 79,
          timeframe: '14 días'
        };
      default:
        return {
          currentRoas: 4.0,
          projectedRoas: 4.6,
          currentConversions: 1000,
          projectedConversions: 1150,
          currentCpa: 15.00,
          projectedCpa: 13.50,
          revenueImpact: '+$3,500',
          confidenceLevel: 85,
          timeframe: '21 días'
        };
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.platform !== 'all' && !rec.platform.toLowerCase().includes(filters.platform)) return false;
    if (filters.impact !== 'all' && rec.impact !== filters.impact) return false;
    if (filters.type !== 'all' && rec.type !== filters.type) return false;
    return true;
  });

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

      {/* Simulation Impact Modal */}
      {showSimulationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const rec = recommendations.find(r => r.id === showSimulationModal);
              if (!rec) return null;
              
              const simulationData = generateSimulationData(rec.id);
              const impactColor = getImpactColor(rec.impact);
              
              return (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#7F4FFF] to-[#22E4AC] rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-[#F0F3FA] font-bold text-xl">💡 Simulación de Impacto</h2>
                        <div className="text-[#AAB3CC] text-sm mt-1">
                          <p><strong>Campaña:</strong> {rec.title}</p>
                          <p><strong>Plataforma:</strong> {rec.platform}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSimulationModal(null)}
                      className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors p-2 hover:bg-[#0E0F2B]/30 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Impact Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Revenue Card */}
                    <div className="bg-gradient-to-br from-[#22E4AC]/10 to-[#28C76F]/10 border border-[#22E4AC]/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-[#22E4AC]/20 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-[#22E4AC]" />
                        </div>
                        <h3 className="text-[#F0F3FA] font-semibold">🟢 Ingresos Estimados</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-sm">Actual:</span>
                          <span className="text-[#F0F3FA]">$74,521</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-[#22E4AC]" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-sm">Simulado:</span>
                          <span className="text-[#22E4AC] font-bold">$99,587</span>
                        </div>
                        <div className="text-center">
                          <span className="bg-[#22E4AC]/20 text-[#22E4AC] px-2 py-1 rounded-full text-xs font-medium">
                            +33.6%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Conversions Card */}
                    <div className="bg-gradient-to-br from-[#7F4FFF]/10 to-[#9B6BFF]/10 border border-[#7F4FFF]/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-[#7F4FFF]/20 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-[#7F4FFF]" />
                        </div>
                        <h3 className="text-[#F0F3FA] font-semibold">🟢 Conversiones</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-sm">Actual:</span>
                          <span className="text-[#F0F3FA]">1,247</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-[#7F4FFF]" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-sm">Simulado:</span>
                          <span className="text-[#7F4FFF] font-bold">1,623</span>
                        </div>
                        <div className="text-center">
                          <span className="bg-[#7F4FFF]/20 text-[#7F4FFF] px-2 py-1 rounded-full text-xs font-medium">
                            +30.2%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ROAS Card */}
                    <div className="bg-gradient-to-br from-[#FFB547]/10 to-[#FF8A4C]/10 border border-[#FFB547]/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-[#FFB547]/20 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-[#FFB547]" />
                        </div>
                        <h3 className="text-[#F0F3FA] font-semibold">🔵 ROAS</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-sm">Actual:</span>
                          <span className="text-[#F0F3FA]">4.8x</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-[#FFB547]" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-sm">Simulado:</span>
                          <span className="text-[#FFB547] font-bold">5.2x</span>
                        </div>
                        <div className="text-center">
                          <span className="bg-[#FFB547]/20 text-[#FFB547] px-2 py-1 rounded-full text-xs font-medium">
                            +8.3%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CPA Card */}
                    <div className="bg-gradient-to-br from-[#FF6B9D]/10 to-[#FF4D6D]/10 border border-[#FF6B9D]/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-[#FF6B9D]/20 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-[#FF6B9D]" />
                        </div>
                        <h3 className="text-[#F0F3FA] font-semibold">🟣 CPA</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-sm">Actual:</span>
                          <span className="text-[#F0F3FA]">$12.45</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <TrendingDown className="w-4 h-4 text-[#22E4AC]" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-sm">Simulado:</span>
                          <span className="text-[#22E4AC] font-bold">$11.80</span>
                        </div>
                        <div className="text-center">
                          <span className="bg-[#22E4AC]/20 text-[#22E4AC] px-2 py-1 rounded-full text-xs font-medium">
                            –5.2%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Comparison Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* ROAS Chart */}
                    <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-4">
                      <h4 className="text-[#F0F3FA] font-medium mb-3 text-center text-sm">Comparación ROAS</h4>
                      <div className="flex items-end justify-center space-x-6 h-24">
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-gradient-to-t from-[#AAB3CC] to-[#AAB3CC]/70 rounded-t-lg transition-all duration-1000 flex items-end justify-center pb-1"
                            style={{ height: '70%' }}
                          >
                            <span className="text-white text-xs">4.8x</span>
                          </div>
                          <span className="text-[#AAB3CC] text-xs mt-1">Actual</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-gradient-to-t from-[#FFB547] to-[#FFB547]/70 rounded-t-lg transition-all duration-1000 flex items-end justify-center pb-1"
                            style={{ height: '100%' }}
                          >
                            <span className="text-white text-xs">5.2x</span>
                          </div>
                          <span className="text-[#FFB547] text-xs mt-1">Simulado</span>
                        </div>
                      </div>
                    </div>

                    {/* Conversions Chart */}
                    <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-4">
                      <h4 className="text-[#F0F3FA] font-medium mb-3 text-center text-sm">Comparación Conversiones</h4>
                      <div className="flex items-end justify-center space-x-6 h-24">
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-gradient-to-t from-[#AAB3CC] to-[#AAB3CC]/70 rounded-t-lg transition-all duration-1000 flex items-end justify-center pb-1"
                            style={{ height: '77%' }}
                          >
                            <span className="text-white text-xs">1,247</span>
                          </div>
                          <span className="text-[#AAB3CC] text-xs mt-1">Actual</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-gradient-to-t from-[#7F4FFF] to-[#7F4FFF]/70 rounded-t-lg transition-all duration-1000 flex items-end justify-center pb-1"
                            style={{ height: '100%' }}
                          >
                            <span className="text-white text-xs">1,623</span>
                          </div>
                          <span className="text-[#7F4FFF] text-xs mt-1">Simulado</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="bg-gradient-to-r from-[#7F4FFF]/10 to-[#22E4AC]/10 border border-[#7F4FFF]/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-[#7F4FFF]/20 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-[#7F4FFF]" />
                      </div>
                      <h4 className="text-[#F0F3FA] font-semibold">Insight de IA</h4>
                    </div>
                    <p className="text-[#F0F3FA] leading-relaxed mb-3 text-sm">
                      {rec.type === 'increase_budget' && 
                        `Aumentar el presupuesto en 30% podría generar +$25K sin afectar la rentabilidad. Esta campaña ya supera el ROAS esperado (5.2x vs 4.0x). Se recomienda monitorear evolución semanal posterior a la acción.`
                      }
                      {rec.type === 'pause_campaign' && 
                        `Pausar esta campaña evitará el desperdicio de presupuesto y permitirá redistribuir la inversión hacia campañas más eficientes. El CPA actual está muy por encima del objetivo, impactando negativamente la rentabilidad general.`
                      }
                      {rec.type === 'change_creative' && 
                        `Los creativos actuales muestran fatiga, evidenciada por la caída en CTR. Renovar los creativos podría restaurar el rendimiento y mejorar las métricas de engagement. Se proyecta una mejora del 30% en conversiones.`
                      }
                      {rec.type === 'adjust_targeting' && 
                        `Expandir la segmentación a audiencias similares más amplias podría incrementar el volumen manteniendo la eficiencia. El modelo proyecta un aumento del 30% en conversiones con un CPA similar.`
                      }
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#AAB3CC]">Confianza del modelo:</span>
                        <span className="text-[#22E4AC] font-medium">{simulationData.confidenceLevel}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#AAB3CC]">Tiempo estimado:</span>
                        <span className="text-[#F0F3FA] font-medium">{simulationData.timeframe}</span>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-[#7F4FFF]/10 border border-[#7F4FFF]/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-[#7F4FFF]" />
                      <p className="text-[#F0F3FA] text-xs">
                        <strong>Esta simulación es una estimación basada en datos reales.</strong> Los resultados pueden variar según las condiciones del mercado y otros factores externos.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowSimulationModal(null)}
                      className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        showNotification('info', 'Función de descarga en desarrollo...');
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-violet-pulse text-white rounded-lg hover:bg-violet-pulse/90 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Simulación</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
  <div>
    <h1 className="text-[#F0F3FA] text-2xl font-bold">Recomendaciones IA</h1>
  </div>
  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
    <button 
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:text-[#F0F3FA] hover:border-[#7F4FFF]/40 transition-colors text-sm w-full sm:w-auto"
    >
      <Filter className="w-4 h-4" />
      <span>Filtros</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
    </button>
    <button 
      onClick={generateNewSimulations}
      className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm w-full sm:w-auto"
      style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
    >
      <Zap className="w-4 h-4" />
      <span>Generar recomendaciones</span>
    </button>
  </div>
</div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-[#AAB3CC] text-sm font-medium mb-2">Plataforma</label>
              <select 
                value={filters.platform}
                onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              >
                <option value="all">Todas las plataformas</option>
                <option value="meta">Meta Ads</option>
                <option value="google">Google Ads</option>
                <option value="tiktok">TikTok Ads</option>
              </select>
            </div>
            <div>
              <label className="block text-[#AAB3CC] text-sm font-medium mb-2">Nivel de Impacto</label>
              <select 
                value={filters.impact}
                onChange={(e) => setFilters(prev => ({ ...prev, impact: e.target.value }))}
                className="w-full bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg px-3 py-2 text-[#F0F3FA] focus:outline-none focus:border-[#7F4FFF] transition-colors"
              >
                <option value="all">Todos los niveles</option>
                <option value="high">Alto Impacto</option>
                <option value="medium">Medio Impacto</option>
                <option value="low">Bajo Impacto</option>
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
                <option value="increase_budget">Optimización de Inversión</option>
                <option value="pause_campaign">Campaña Ineficiente</option>
                <option value="change_creative">Creatividad Fatigada</option>
                <option value="adjust_targeting">Segmentación Subóptima</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-[#7F4FFF]/10 border border-[#7F4FFF]/20 rounded-xl p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-[#7F4FFF]" />
          <p className="text-[#F0F3FA] text-xs sm:text-sm">
            <strong>Estas simulaciones han sido generadas por nuestros agentes de IA.</strong> No se aplicarán cambios reales en tus campañas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recommendations List */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {filteredRecommendations.map((recommendation) => {
            const Icon = getRecommendationIcon(recommendation.type);
            const impactColor = getImpactColor(recommendation.impact);
            const typeIcon = getTypeIcon(recommendation.type);
            
            return (
              <div
                key={recommendation.id}
                className={`bg-[#1E1F3F] border rounded-xl p-4 sm:p-6 transition-all duration-300 cursor-pointer ${
                  selectedRecommendation === recommendation.id
                    ? 'border-[#7F4FFF] shadow-lg shadow-[#7F4FFF]/20'
                    : 'border-[#9B6BFF]/20 hover:border-[#7F4FFF]/40'
                }`}
                onClick={() => setSelectedRecommendation(recommendation.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${impactColor}20` }}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: impactColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[#F0F3FA] font-semibold text-sm sm:text-base leading-tight">{recommendation.title}</h3>
                      <p className="text-[#AAB3CC] text-xs sm:text-sm mt-1 leading-relaxed">{recommendation.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#AAB3CC] text-xs sm:text-sm">Impacto:</span>
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                        style={{ 
                          backgroundColor: `${impactColor}20`,
                          color: impactColor
                        }}
                      >
                        {getImpactLabel(recommendation.impact)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#AAB3CC] text-xs sm:text-sm">Plataforma:</span>
                      <span className="text-[#F0F3FA] text-xs sm:text-sm">{recommendation.platform}</span>
                    </div>
                  </div>
                  
                  <span className="text-[#AAB3CC] text-xs self-start sm:self-center">
                    {new Date(recommendation.timestamp).toLocaleString('es-ES')}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{typeIcon}</span>
                    <span className="px-2 py-1 bg-[#7F4FFF]/20 text-[#7F4FFF] text-xs font-medium rounded-md whitespace-nowrap">
                      {getTypeLabel(recommendation.type)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#9B6BFF]/20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      simulateImpact(recommendation.id);
                    }}
                    className="w-full py-2 px-4 rounded-lg transition-all text-sm sm:text-base"
                    style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                  >
                    Simular Impacto
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-4 sm:p-6">
          <h3 className="text-[#F0F3FA] font-semibold text-base sm:text-lg mb-4">Simulación de Escenario</h3>
          
          {selectedRecommendation ? (
            <div className="space-y-3 sm:space-y-4">
              {(() => {
                const rec = recommendations.find(r => r.id === selectedRecommendation);
                if (!rec) return null;
                
                const Icon = getRecommendationIcon(rec.type);
                const impactColor = getImpactColor(rec.impact);
                const simulationData = generateSimulationData(rec.id);
                const typeIcon = getTypeIcon(rec.type);
                
                return (
                  <>
                    <div className="flex items-center space-x-3 mb-4">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${impactColor}20` }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: impactColor }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[#F0F3FA] font-semibold text-sm sm:text-base leading-tight">{rec.title}</h4>
                        <p className="text-[#AAB3CC] text-xs sm:text-sm">{rec.platform}</p>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{typeIcon}</span>
                        <span 
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full"
                          style={{ 
                            backgroundColor: `${impactColor}20`,
                            color: impactColor
                          }}
                        >
                          {getTypeLabel(rec.type)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#AAB3CC] text-xs sm:text-sm font-medium">Generado:</span>
                        <p className="text-[#F0F3FA] text-xs sm:text-sm mt-1">
                          {new Date(rec.timestamp).toLocaleString('es-ES')}
                        </p>
                      </div>

                      <div>
                        <span className="text-[#AAB3CC] text-xs sm:text-sm font-medium">Análisis de IA:</span>
                        <p className="text-[#F0F3FA] text-xs sm:text-sm mt-1 leading-relaxed">
                          {rec.insight}
                        </p>
                      </div>

                      {showSimulation === rec.id && (
                        <div className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                          <h5 className="text-[#F0F3FA] font-medium text-sm sm:text-base mb-3">🎯 Escenario Simulado</h5>
                          
                          {/* Metrics Comparison */}
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[#AAB3CC] text-xs sm:text-sm">ROAS:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-[#F0F3FA] text-xs sm:text-sm">{simulationData.currentRoas}x</span>
                                <span className="text-[#AAB3CC]">→</span>
                                <span className="text-[#22E4AC] text-xs sm:text-sm font-medium">{simulationData.projectedRoas}x</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-[#AAB3CC] text-xs sm:text-sm">Conversiones:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-[#F0F3FA] text-xs sm:text-sm">{simulationData.currentConversions.toLocaleString()}</span>
                                <span className="text-[#AAB3CC]">→</span>
                                <span className="text-[#22E4AC] text-xs sm:text-sm font-medium">{simulationData.projectedConversions.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-[#AAB3CC] text-xs sm:text-sm">CPA:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-[#F0F3FA] text-xs sm:text-sm">${simulationData.currentCpa}</span>
                                <span className="text-[#AAB3CC]">→</span>
                                <span className="text-[#22E4AC] text-xs sm:text-sm font-medium">${simulationData.projectedCpa}</span>
                              </div>
                            </div>
                          </div>

                          {/* Impact Summary */}
                          <div className="mt-3 sm:mt-4 pt-3 border-t border-[#9B6BFF]/20">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#AAB3CC] text-xs sm:text-sm">Impacto en Ingresos:</span>
                              <span className="text-[#22E4AC] font-medium text-xs sm:text-sm">{simulationData.revenueImpact}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#AAB3CC] text-xs sm:text-sm">Confianza del Modelo:</span>
                              <span className="text-[#F0F3FA] font-medium text-xs sm:text-sm">{simulationData.confidenceLevel}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#AAB3CC] text-xs sm:text-sm">Tiempo Estimado:</span>
                              <span className="text-[#F0F3FA] font-medium text-xs sm:text-sm">{simulationData.timeframe}</span>
                            </div>
                          </div>

                          {/* Mini Chart */}
                          <div className="mt-3 sm:mt-4">
                            <h6 className="text-[#AAB3CC] text-xs font-medium mb-2 hidden sm:block">📈 Comparativa Visual</h6>
                            <div className="flex items-end space-x-4 h-12 sm:h-16">
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-6 sm:w-8 bg-[#AAB3CC] rounded-t"
                                  style={{ height: `${(simulationData.currentRoas / simulationData.projectedRoas) * 100}%` }}
                                />
                                <span className="text-[#AAB3CC] text-xs mt-1 hidden sm:block">Actual</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-6 sm:w-8 bg-[#22E4AC] rounded-t"
                                  style={{ height: '100%' }}
                                />
                                <span className="text-[#22E4AC] text-xs mt-1 hidden sm:block">Simulado</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="text-center text-[#AAB3CC] py-6 sm:py-8">
              <p className="text-sm">Selecciona una recomendación para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;