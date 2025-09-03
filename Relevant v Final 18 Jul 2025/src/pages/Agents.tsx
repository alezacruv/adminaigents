import React, { useState } from 'react';
import { 
  Bot,
  Download,
  BarChart3,
  FileText,
  Sparkles,
  Shuffle,
  Play,
  Loader
} from 'lucide-react';
import { mockAgents } from '../data/mockData';

const IconMap = {
  Download,
  BarChart3,
  FileText,
  Sparkles,
  Shuffle,
  Bot
};

const Agents: React.FC = () => {
  const [agents, setAgents] = useState(mockAgents);
  const [executingAll, setExecutingAll] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, active: !agent.active }
          : agent
      ));
      
      showNotification(
        'info', 
        `Estado del agente "${agent.name}" cambiado a ${!agent.active ? 'activo' : 'inactivo'}`
      );
    }
  };

  const executeAllAgents = () => {
    setExecutingAll(true);
    showNotification('info', 'Ejecutando los 7 agentes inteligentes...');
    
    // Simulate execution of all 7 agents regardless of their switch state
    setTimeout(() => {
      const duration = Math.floor(Math.random() * 45) + 30; // 30-75 seconds
      const successRate = 0.85; // 85% success rate
      
      setAgents(prev => prev.map(agent => {
        const success = Math.random() < successRate;
        return {
          ...agent,
          lastExecution: new Date('2025-07-15T' + new Date().toTimeString().split(' ')[0]).toISOString(),
          executions: [
            {
              id: Date.now().toString() + agent.id,
              timestamp: new Date('2025-07-15T' + new Date().toTimeString().split(' ')[0]).toISOString(),
              status: success ? 'success' : 'error',
              duration: Math.floor(Math.random() * 30) + 10,
              result: success ? 'Ejecución completada exitosamente' : 'Error durante la ejecución'
            },
            ...agent.executions
          ].slice(0, 5)
        };
      }));
      
      setExecutingAll(false);
      showNotification('success', `Ejecución completada. Los 7 agentes procesados en ${duration}s`);
    }, 5000);
  };

  const getAgentTypeColor = (type: string) => {
    switch (type) {
      case 'extraction': return '#22E4AC';
      case 'analysis': return '#7F4FFF';
      case 'reporting': return '#FFB547';
      case 'creativity': return '#FF8A4C';
      case 'cross-channel': return '#9B6BFF';
      default: return '#AAB3CC';
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'extraction': return Download;
      case 'analysis': return BarChart3;
      case 'reporting': return FileText;
      case 'creativity': return Sparkles;
      case 'cross-channel': return Shuffle;
      default: return Bot;
    }
  };

  const getAgentTypeLabel = (type: string) => {
    switch (type) {
      case 'extraction': return 'Extracción';
      case 'analysis': return 'Análisis';
      case 'reporting': return 'Reportes';
      case 'creativity': return 'Creatividad';
      case 'cross-channel': return 'Cross-Channel';
      default: return 'Agente';
    }
  };

  const activeAgentsCount = agents.filter(a => a.active).length;

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
    <h1 className="text-[#F0F3FA] text-2xl font-bold">Agentes IA</h1>
    <p className="text-[#AAB3CC] mt-1">Administra tus agentes de automatización inteligente</p>
  </div>
  
  {/* Global Execute Button - Top Right */}
  <button
    onClick={executeAllAgents}
    disabled={executingAll}
    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all disabled:cursor-not-allowed font-semibold shadow-lg w-full sm:w-auto"
    style={executingAll ? { backgroundColor: '#2D2D3B', color: '#94A3B8' } : { backgroundColor: '#7F4EFF', color: '#FFFFFF' }}
    onMouseEnter={(e) => !executingAll && (e.currentTarget.style.backgroundColor = '#6B42E6')}
    onMouseLeave={(e) => !executingAll && (e.currentTarget.style.backgroundColor = '#7F4EFF')}
  >
    {executingAll ? (
      <>
        <Loader className="w-5 h-5 animate-spin" />
        <span>Ejecutando...</span>
      </>
    ) : (
      <>
        <Play className="w-5 h-5" />
        <span>Ejecutar Todos</span>
      </>
    )}
  </button>
</div>

      {/* Status Summary */}
      <div className="flex items-center space-x-6 text-sm text-[#AAB3CC]">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#28C76F] rounded-full"></div>
          <span>{activeAgentsCount} Activos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#AAB3CC] rounded-full"></div>
          <span>{agents.length - activeAgentsCount} Inactivos</span>
        </div>
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-[#7F4FFF]" />
          <span>Total: {agents.length} agentes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const TypeIcon = getAgentTypeIcon(agent.type);
          const typeColor = getAgentTypeColor(agent.type);
          
          return (
            <div key={agent.id} className="bg-[#1E1F3F] border border-[#9B6BFF]/20 rounded-xl p-6 hover:border-[#7F4FFF]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#7F4FFF]/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${typeColor}20` }}
                  >
                    <TypeIcon className="w-6 h-6" style={{ color: typeColor }} />
                  </div>
                  <div>
                    <h3 className="text-[#F0F3FA] font-semibold">{agent.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: `${typeColor}20`,
                          color: typeColor
                        }}
                      >
                        {getAgentTypeLabel(agent.type)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Informational Switch - doesn't affect execution */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAgent(agent.id)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      agent.active 
                        ? 'bg-[#28C76F]' 
                        : 'bg-[#AAB3CC]/30'
                    } relative`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                      agent.active ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <p className="text-[#AAB3CC] text-sm leading-relaxed">
                {agent.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Agents;