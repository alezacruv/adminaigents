import React, { useState, useEffect } from 'react';
import { X, Brain, Loader, CheckCircle, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

interface AIRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIRecommendationModal: React.FC<AIRecommendationModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [applyingRecommendation, setApplyingRecommendation] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateRecommendations = () => {
    setLoading(true);
    setRecommendations([]);
    
    // Simulate AI processing
    setTimeout(() => {
      setRecommendations([
        {
          id: '1',
          type: 'increase_budget',
          title: 'Aumentar Presupuesto para "Oferta Navideña 2025"',
          description: 'Esta campaña está rindiendo 45% por encima del ROAS objetivo (6.2x vs 4.0x)',
          impact: 'high',
          platform: 'Meta Ads',
          potentialRevenue: '$15,000',
          confidence: 92,
          applied: false
        },
        {
          id: '2',
          type: 'pause_campaign',
          title: 'Pausar Campaña "Promoción Q3 2025"',
          description: 'El CPA ha excedido el umbral en 85% ($23.50 vs $12.50 objetivo)',
          impact: 'high',
          platform: 'Google Ads',
          potentialSavings: '$4,200',
          confidence: 87,
          applied: false
        },
        {
          id: '3',
          type: 'change_creative',
          title: 'Renovar Creativos Publicitarios',
          description: 'Los anuncios de mejor rendimiento muestran fatiga creativa con CTR bajando 25%',
          impact: 'medium',
          platform: 'TikTok Ads',
          potentialImprovement: '18%',
          confidence: 79,
          applied: false
        }
      ]);
      setLoading(false);
    }, 2500);
  };

  const applyRecommendation = (recommendationId: string) => {
    setApplyingRecommendation(recommendationId);
    
    setTimeout(() => {
      setRecommendations(prev => prev.map(rec =>
        rec.id === recommendationId
          ? { ...rec, applied: true }
          : rec
      ));
      setApplyingRecommendation(null);
      
      const rec = recommendations.find(r => r.id === recommendationId);
      if (rec) {
        showNotification('success', `Recomendación "${rec.title}" aplicada exitosamente`);
      }
    }, 2000);
  };

  const applyAllHighImpact = () => {
    const highImpactRecs = recommendations.filter(r => r.impact === 'high' && !r.applied);
    if (highImpactRecs.length === 0) {
      showNotification('info', 'No hay recomendaciones de alto impacto pendientes');
      return;
    }

    showNotification('info', `Aplicando ${highImpactRecs.length} recomendaciones de alto impacto...`);
    
    setTimeout(() => {
      setRecommendations(prev => prev.map(rec =>
        rec.impact === 'high' && !rec.applied
          ? { ...rec, applied: true }
          : rec
      ));
      showNotification('success', `${highImpactRecs.length} recomendaciones aplicadas exitosamente`);
    }, 3000);
  };

  useEffect(() => {
    if (isOpen) {
      generateRecommendations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'increase_budget': return TrendingUp;
      case 'pause_campaign': return AlertTriangle;
      case 'change_creative': return Zap;
      default: return CheckCircle;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1E1F3F] border border-[#9B6BFF]/30 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
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

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7F4FFF] to-[#9B6BFF] rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[#F0F3FA] font-semibold text-xl">Recomendaciones IA</h2>
              <p className="text-[#AAB3CC] text-sm">Insights inteligentes para optimizar tus campañas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#AAB3CC] hover:text-[#F0F3FA] transition-colors p-2 hover:bg-[#0E0F2B]/30 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7F4FFF] to-[#22E4AC] rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <Loader className="w-6 h-6 text-[#7F4FFF] animate-spin absolute -top-1 -right-1" />
                </div>
                <div className="text-center">
                  <h3 className="text-[#F0F3FA] font-medium">Analizando Campañas</h3>
                  <p className="text-[#AAB3CC] text-sm">Procesando datos de rendimiento de todas las plataformas...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => {
                  const Icon = getRecommendationIcon(rec.type);
                  const impactColor = getImpactColor(rec.impact);
                  const isApplying = applyingRecommendation === rec.id;
                  
                  return (
                    <div key={rec.id} className="bg-[#0E0F2B] border border-[#9B6BFF]/20 rounded-lg p-4 hover:border-[#7F4FFF]/40 transition-all duration-300">
                      <div className="flex items-start space-x-3 mb-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${impactColor}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: impactColor }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[#F0F3FA] font-medium text-sm mb-1">{rec.title}</h4>
                          <p className="text-[#AAB3CC] text-xs leading-relaxed">{rec.description}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-xs">Plataforma:</span>
                          <span className="text-[#F0F3FA] text-xs">{rec.platform}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-xs">Impacto:</span>
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: `${impactColor}20`,
                              color: impactColor
                            }}
                          >
                            {rec.impact === 'high' ? 'ALTO' : rec.impact === 'medium' ? 'MEDIO' : 'BAJO'}
                          </span>
                        </div>

                        {rec.potentialRevenue && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#AAB3CC] text-xs">Ingresos Potenciales:</span>
                            <span className="text-[#28C76F] text-xs font-medium">{rec.potentialRevenue}</span>
                          </div>
                        )}

                        {rec.potentialSavings && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#AAB3CC] text-xs">Ahorro Potencial:</span>
                            <span className="text-[#28C76F] text-xs font-medium">{rec.potentialSavings}</span>
                          </div>
                        )}

                        {rec.potentialImprovement && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#AAB3CC] text-xs">Mejora:</span>
                            <span className="text-[#22E4AC] text-xs font-medium">+{rec.potentialImprovement}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-[#AAB3CC] text-xs">Confianza:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-1 bg-[#9B6BFF]/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#22E4AC] rounded-full transition-all duration-300"
                                style={{ width: `${rec.confidence}%` }}
                              />
                            </div>
                            <span className="text-[#F0F3FA] text-xs">{rec.confidence}%</span>
                          </div>
                        </div>
                      </div>

                      {rec.applied ? (
                        <div className="w-full mt-3 py-2 px-3 bg-[#28C76F]/20 text-[#28C76F] text-sm rounded-lg flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Aplicada</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => applyRecommendation(rec.id)}
                          disabled={isApplying}
                          className="w-full mt-3 py-2 px-3 text-sm rounded-lg transition-all disabled:cursor-not-allowed"
                          style={isApplying ? { backgroundColor: '#2D2D3B', color: '#94A3B8' } : { backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                          onMouseEnter={(e) => !isApplying && (e.currentTarget.style.backgroundColor = '#6B42E6')}
                          onMouseLeave={(e) => !isApplying && (e.currentTarget.style.backgroundColor = '#7F4EFF')}
                        >
                          {isApplying ? 'Aplicando...' : 'Aplicar Recomendación'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#9B6BFF]/20">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#22E4AC]" />
                    <span className="text-[#22E4AC] text-sm font-medium">Análisis Completo</span>
                  </div>
                  <span className="text-[#AAB3CC] text-sm">
                    Se generaron {recommendations.length} recomendaciones en 2.3 segundos
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={generateRecommendations}
                    className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:bg-[#0E0F2B]/70 hover:text-[#F0F3FA] transition-colors"
                  >
                    Regenerar
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#0E0F2B] border border-[#9B6BFF]/30 text-[#AAB3CC] rounded-lg hover:bg-[#0E0F2B]/70 hover:text-[#F0F3FA] transition-colors"
                  >
                    Cerrar
                  </button>
                  <button 
                    onClick={applyAllHighImpact}
                    className="px-4 py-2 rounded-lg transition-all"
                    style={{ backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
                  >
                    Aplicar Todas las de Alto Impacto
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationModal;