import React from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  BarChart3,
  Target,
  Clock,
  Zap
} from 'lucide-react';
import { KPI } from '../../types';

interface KPICardProps {
  kpi: KPI;
}

const IconMap = {
  DollarSign,
  Users,
  MousePointer,
  Eye,
  BarChart3,
  Target,
  Clock,
  Zap
};

const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const Icon = IconMap[kpi.icon as keyof typeof IconMap] || BarChart3;
  
  return (
    <div className="bg-slate-purple border border-violet-pulse/20 rounded-xl p-6 hover:border-violet-pulse/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-pulse/10 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${kpi.color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: kpi.color }} />
          </div>
          <h3 className="text-cloud-gray font-medium">{kpi.name}</h3>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          kpi.changeType === 'increase' 
            ? 'bg-emerald-green/20 text-emerald-green' 
            : 'bg-coral-red/20 text-coral-red'
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
        <span className="text-light-ice text-2xl font-bold">{kpi.value}</span>
      </div>

      <p className="text-cloud-gray text-sm">
        {kpi.changeType === 'increase' ? '+' : ''}
        {kpi.change}% desde el mes pasado
      </p>

      {/* Mini chart placeholder */}
      <div className="mt-4 h-12 bg-midnight rounded-lg flex items-end justify-between px-2 py-1">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="w-1 bg-gradient-to-t from-transparent rounded-full"
            style={{
              height: `${Math.random() * 100}%`,
              backgroundImage: `linear-gradient(to top, transparent, ${kpi.color})`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default KPICard;