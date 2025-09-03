import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Loader,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign
} from 'lucide-react';
import { Account } from '../../types';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  id: string;
  label: string;
  action: string;
}

interface AIChatProps {
  currentAccount: Account | null;
}

const AIChat: React.FC<AIChatProps> = ({ currentAccount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    // Mensaje de bienvenida cuando se abre por primera vez
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: `¡Hola! Soy tu asistente de marketing digital. ${currentAccount ? `Veo que estás trabajando con la cuenta de ${currentAccount.name}.` : ''} Puedo ayudarte con:\n\n• Análisis de rendimiento de campañas\n• Explicación de métricas (CPA, ROAS, CTR)\n• Recomendaciones de optimización\n• Comparativas entre plataformas\n• Próximos pasos estratégicos\n\n¿En qué puedo ayudarte hoy?`,
        timestamp: new Date('2025-07-15T' + new Date().toTimeString().split(' ')[0]),
        quickActions: [
          { id: '1', label: '¿Cómo está mi ROAS?', action: 'roas_analysis' },
          { id: '2', label: 'Revisar campañas', action: 'campaign_review' },
          { id: '3', label: 'Optimizaciones pendientes', action: 'pending_optimizations' }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentAccount]);

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let quickActions: QuickAction[] = [];

    // Análisis de ROAS
    if (lowerMessage.includes('roas') || lowerMessage.includes('retorno')) {
      response = `📊 **Análisis de ROAS para ${currentAccount?.name || 'tu cuenta'}:**\n\nActualmente tienes un ROAS promedio de **4.8x**, lo cual está **15.3% por encima** del mes anterior. Esto significa que por cada $1 invertido, estás generando $4.80 en ingresos.\n\n**Desglose por plataforma:**\n• Meta Ads: 6.2x (⬆️ Excelente)\n• Google Ads: 4.1x (➡️ Estable)\n• TikTok Ads: 3.2x (⬇️ Necesita atención)\n\n¿Te gustaría que analice alguna plataforma específica?`;
      quickActions = [
        { id: '1', label: 'Analizar Meta Ads', action: 'meta_analysis' },
        { id: '2', label: 'Optimizar TikTok', action: 'tiktok_optimization' },
        { id: '3', label: 'Ver recomendaciones', action: 'show_recommendations' }
      ];
    }
    // Análisis de CPA
    else if (lowerMessage.includes('cpa') || lowerMessage.includes('costo') || lowerMessage.includes('adquisición')) {
      response = `💰 **Análisis de CPA (Costo por Adquisición):**\n\nTu CPA promedio actual es de **$12.45**, lo cual representa una **mejora del 8.7%** respecto al mes anterior.\n\n**Comparativa por plataforma:**\n• Meta Ads: $10.20 (🎯 Objetivo: $12.50)\n• Google Ads: $14.80 (⚠️ Sobre objetivo)\n• TikTok Ads: $11.90 (✅ Dentro del rango)\n\nGoogle Ads está excediendo tu umbral objetivo. Te recomiendo revisar la segmentación y pausar las campañas menos eficientes.`;
      quickActions = [
        { id: '1', label: 'Pausar campañas ineficientes', action: 'pause_campaigns' },
        { id: '2', label: 'Ajustar segmentación', action: 'adjust_targeting' },
        { id: '3', label: 'Ver detalles Google Ads', action: 'google_details' }
      ];
    }
    // Análisis de campañas
    else if (lowerMessage.includes('campaña') || lowerMessage.includes('rendimiento') || lowerMessage.includes('resultados')) {
      response = `🚀 **Resumen de Rendimiento de Campañas:**\n\n**Campañas destacadas:**\n• "Oferta Navideña 2024" - ROAS: 6.2x (🔥 Alto rendimiento)\n• "Promoción Q4" - CPA: $23.50 (⚠️ Requiere atención)\n• "Retargeting Verano" - CTR: 3.8% (✅ Estable)\n\n**Recomendaciones inmediatas:**\n1. Aumentar presupuesto en "Oferta Navideña 2024" (+30%)\n2. Pausar "Promoción Q4" hasta optimizar creativos\n3. Probar nuevos públicos en campañas de prospección`;
      quickActions = [
        { id: '1', label: 'Aplicar recomendaciones', action: 'apply_recommendations' },
        { id: '2', label: 'Ver detalles por campaña', action: 'campaign_details' },
        { id: '3', label: 'Generar reporte completo', action: 'generate_report' }
      ];
    }
    // Explicación de métricas
    else if (lowerMessage.includes('qué es') || lowerMessage.includes('significa') || lowerMessage.includes('explica')) {
      if (lowerMessage.includes('roas')) {
        response = `📚 **¿Qué es el ROAS?**\n\nROAS significa "Return on Ad Spend" (Retorno de la Inversión Publicitaria). Es una métrica clave que mide cuántos ingresos generas por cada peso invertido en publicidad.\n\n**Fórmula:** Ingresos ÷ Gasto Publicitario\n\n**Ejemplo:** Si gastas $100 y generas $400 en ventas, tu ROAS es 4x.\n\n**Interpretación:**\n• ROAS < 1x: Pérdidas\n• ROAS 1x-3x: Punto de equilibrio\n• ROAS > 4x: Rentable\n• ROAS > 6x: Excelente rendimiento`;
      } else if (lowerMessage.includes('cpa')) {
        response = `📚 **¿Qué es el CPA?**\n\nCPA significa "Cost Per Acquisition" (Costo por Adquisición). Es el costo promedio que pagas por cada conversión o cliente nuevo.\n\n**Fórmula:** Gasto Total ÷ Número de Conversiones\n\n**Ejemplo:** Si gastas $500 y obtienes 25 conversiones, tu CPA es $20.\n\n**¿Por qué es importante?**\n• Te ayuda a controlar la rentabilidad\n• Permite comparar eficiencia entre campañas\n• Es clave para establecer presupuestos`;
      } else {
        response = `📚 **Métricas Principales del Marketing Digital:**\n\n• **ROAS:** Retorno de inversión publicitaria\n• **CPA:** Costo por adquisición/conversión\n• **CTR:** Porcentaje de clics (Click-Through Rate)\n• **CPM:** Costo por mil impresiones\n• **CVR:** Tasa de conversión\n• **LTV:** Valor de vida del cliente\n\n¿Te gustaría que explique alguna métrica específica?`;
      }
      quickActions = [
        { id: '1', label: 'Explicar CTR', action: 'explain_ctr' },
        { id: '2', label: 'Explicar CVR', action: 'explain_cvr' },
        { id: '3', label: 'Ver mis métricas actuales', action: 'show_metrics' }
      ];
    }
    // Optimizaciones
    else if (lowerMessage.includes('optimizar') || lowerMessage.includes('mejorar') || lowerMessage.includes('recomendación')) {
      response = `🎯 **Recomendaciones de Optimización Prioritarias:**\n\n**Alto Impacto:**\n1. **Aumentar presupuesto** en "Oferta Navideña 2025" - Potencial: +$15,000 en ingresos\n2. **Pausar campaña** "Promoción Q3 2025" - Ahorro: $4,200\n\n**Medio Impacto:**\n3. **Renovar creativos** en TikTok Ads - Mejora esperada: +18% CTR\n4. **Ajustar audiencias** en Google Ads - Reducción CPA: -15%\n\n**Próximos pasos automáticos:**\n• Análisis de fatiga creativa (cada 7 días)\n• Optimización de pujas (diario)\n• Reporte de rendimiento (semanal)`;
      quickActions = [
        { id: '1', label: 'Aplicar optimizaciones', action: 'apply_optimizations' },
        { id: '2', label: 'Programar análisis', action: 'schedule_analysis' },
        { id: '3', label: 'Ver todas las recomendaciones', action: 'all_recommendations' }
      ];
    }
    // Comparativas
    else if (lowerMessage.includes('comparar') || lowerMessage.includes('mejor') || lowerMessage.includes('plataforma')) {
      response = `📊 **Comparativa de Plataformas:**\n\n**Meta Ads** 🥇\n• ROAS: 6.2x | CPA: $10.20 | CTR: 2.8%\n• Fortaleza: Retargeting y lookalikes\n\n**Google Ads** 🥈\n• ROAS: 4.1x | CPA: $14.80 | CTR: 3.2%\n• Fortaleza: Intención de búsqueda\n\n**TikTok Ads** 🥉\n• ROAS: 3.2x | CPA: $11.90 | CTR: 4.1%\n• Fortaleza: Alcance y engagement\n\n**Recomendación:** Redistribuir 20% del presupuesto de Google Ads hacia Meta Ads para maximizar ROAS.`;
      quickActions = [
        { id: '1', label: 'Redistribuir presupuesto', action: 'redistribute_budget' },
        { id: '2', label: 'Análisis detallado', action: 'detailed_analysis' },
        { id: '3', label: 'Configurar alertas', action: 'setup_alerts' }
      ];
    }
    // Respuesta genérica
    else {
      response = `🤖 Entiendo tu consulta sobre "${userMessage}". \n\nPuedo ayudarte con análisis específicos de:\n\n• **Rendimiento:** ROAS, CPA, CTR de tus campañas\n• **Optimizaciones:** Recomendaciones basadas en IA\n• **Comparativas:** Entre plataformas y períodos\n• **Explicaciones:** Métricas y conceptos de marketing\n• **Acciones:** Qué hacer para mejorar resultados\n\n¿Podrías ser más específico sobre qué aspecto te interesa analizar?`;
      quickActions = [
        { id: '1', label: 'Analizar rendimiento', action: 'analyze_performance' },
        { id: '2', label: 'Ver recomendaciones', action: 'show_recommendations' },
        { id: '3', label: 'Explicar métricas', action: 'explain_metrics' }
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      quickActions
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular tiempo de respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'roas_analysis':
        message = '¿Cómo está mi ROAS?';
        break;
      case 'campaign_review':
        message = 'Revisar el rendimiento de mis campañas';
        break;
      case 'pending_optimizations':
        message = '¿Qué optimizaciones tengo pendientes?';
        break;
      case 'meta_analysis':
        message = 'Analizar el rendimiento de Meta Ads';
        break;
      case 'apply_recommendations':
        message = 'Aplicar las recomendaciones sugeridas';
        break;
      default:
        message = 'Más información sobre esta opción';
    }
    
    setInputValue(message);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group"
          style={{ backgroundColor: '#7F4EFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B42E6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF'}
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-coral-red rounded-full animate-pulse"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-purple text-light-ice text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
            Asistente IA
          </div>
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-80 sm:w-96 bg-slate-purple border border-violet-pulse/30 rounded-xl shadow-2xl z-50 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[500px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-violet-pulse/20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-violet-pulse to-teal-glow rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-light-ice font-semibold text-xs sm:text-sm">Asistente IA</h3>
                <p className="text-cloud-gray text-xs hidden sm:block">
                  {currentAccount ? `Cuenta: ${currentAccount.name}` : 'Marketing Digital'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="text-cloud-gray hover:text-light-ice transition-colors p-1 rounded"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleChat}
                className="text-cloud-gray hover:text-light-ice transition-colors p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto h-[360px]">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-violet-pulse to-teal-glow text-white' 
                        : 'bg-midnight text-light-ice border border-violet-pulse/20'
                    } rounded-lg p-2 sm:p-3`}>
                      <div className="flex items-start space-x-2">
                        {message.type === 'ai' && (
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-violet-pulse mt-0.5 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {message.content}
                          </div>
                          {message.quickActions && message.quickActions.length > 0 && (
                            <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                              {message.quickActions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={() => handleQuickAction(action.action)}
                                  className="block w-full text-left px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-colors text-xs sm:text-sm"
                                  style={{ backgroundColor: '#7F4EFF33', color: '#7F4EFF' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF4D'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7F4EFF33'}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-midnight border border-violet-pulse/20 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-violet-pulse" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-violet-pulse rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-violet-pulse rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-violet-pulse rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-violet-pulse/20">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pregúntame..."
                    className="flex-1 bg-midnight border border-violet-pulse/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-light-ice placeholder-cloud-gray focus:outline-none focus:border-violet-pulse transition-colors text-xs sm:text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all disabled:cursor-not-allowed"
                    style={(!inputValue.trim() || isTyping) ? { backgroundColor: '#2D2D3B', color: '#94A3B8' } : { backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
                    onMouseEnter={(e) => (!inputValue.trim() || isTyping) ? null : (e.currentTarget.style.backgroundColor = '#6B42E6')}
                    onMouseLeave={(e) => (!inputValue.trim() || isTyping) ? null : (e.currentTarget.style.backgroundColor = '#7F4EFF')}
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChat;