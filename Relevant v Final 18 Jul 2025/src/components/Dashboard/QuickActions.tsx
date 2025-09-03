import React from 'react';
import { Brain, FileText, Zap, Settings, Sparkles, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'ai_recommendation',
      name: 'Obtener Recomendación IA',
      description: 'Analizar rendimiento actual y obtener sugerencias de optimización',
      icon: Brain,
      color: '#845BFF',
      gradient: 'from-violet-pulse to-violet-pulse/80'
    },
    {
      id: 'generate_report',
      name: 'Generar Reporte',
      description: 'Crear reporte integral de rendimiento',
      icon: FileText,
      color: '#30E5C1',
      gradient: 'from-teal-glow to-emerald-green'
    },
    {
      id: 'configure_limits',
      name: 'Configurar Límites',
      description: 'Establecer umbrales de gasto y rendimiento',
      icon: Settings,
      color: '#845BFF',
      gradient: 'from-violet-pulse/80 to-violet-pulse'
    }
  ];

  return (
    <div className="bg-slate-purple border border-violet-pulse/20 rounded-xl p-6 shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-5 h-5 text-violet-pulse" />
        <h3 className="text-light-ice font-semibold text-lg">Acciones Rápidas</h3>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className="group flex-1 min-w-[200px] p-4 bg-midnight rounded-lg hover:bg-midnight/70 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left border border-transparent hover:border-violet-pulse/30"
            >
              <div className="flex items-start space-x-3">
                <div 
                  className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-light-ice font-medium mb-1 group-hover:text-white transition-colors">
                    {action.name}
                  </h4>
                  <p className="text-cloud-gray text-sm leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;