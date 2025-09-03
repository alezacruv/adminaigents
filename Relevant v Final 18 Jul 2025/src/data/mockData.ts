import { Account, KPI, Platform, Agent, Recommendation, Report } from '../types';

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'The Rocket Code',
    status: 'connected',
    lastSync: '2025-07-15T10:30:00Z',
    industry: 'Tecnología'
  },
  {
    id: '2',
    name: 'Suma Pay',
    status: 'connected',
    lastSync: '2025-07-15T09:45:00Z',
    industry: 'Fintech'
  },
  {
    id: '3',
    name: 'HealthCare Plus',
    status: 'error',
    lastSync: '2025-07-14T15:20:00Z',
    industry: 'Salud'
  },
  {
    id: '4',
    name: 'Vexi',
    status: 'connected',
    lastSync: '2025-07-15T08:30:00Z',
    industry: 'E-commerce'
  },
  {
    id: '5',
    name: 'Kener',
    status: 'connected',
    lastSync: '2025-07-15T07:45:00Z',
    industry: 'Servicios'
  },
  {
    id: '6',
    name: 'Sasha',
    status: 'disconnected',
    lastSync: '2025-07-13T16:20:00Z',
    industry: 'Moda'
  },
  {
    id: '7',
    name: 'Vazol',
    status: 'connected',
    lastSync: '2025-07-15T09:15:00Z',
    industry: 'Tecnología'
  },
  {
    id: '8',
    name: 'Coru',
    status: 'error',
    lastSync: '2025-07-14T12:30:00Z',
    industry: 'Retail'
  },
  {
    id: '9',
    name: 'Creze',
    status: 'connected',
    lastSync: '2025-07-15T10:00:00Z',
    industry: 'Fintech'
  }
];

export const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Impresiones',
    value: '2.4M',
    change: 12.5,
    changeType: 'increase',
    icon: 'Eye',
    color: '#22E4AC'
  },
  {
    id: '2',
    name: 'Clics',
    value: '48.2K',
    change: -3.2,
    changeType: 'decrease',
    icon: 'MousePointer',
    color: '#FFB547'
  },
  {
    id: '3',
    name: 'CPA',
    value: '$12.45',
    change: -8.7,
    changeType: 'decrease',
    icon: 'DollarSign',
    color: '#28C76F'
  },
  {
    id: '4',
    name: 'ROAS',
    value: '4.8x',
    change: 15.3,
    changeType: 'increase',
    icon: 'TrendingUp',
    color: '#7F4FFF'
  }
];

export const mockPlatforms: Platform[] = [
  {
    id: '1',
    name: 'Meta Ads',
    status: 'connected',
    lastSync: '2025-07-15T10:30:00Z',
    icon: 'Facebook'
  },
  {
    id: '2',
    name: 'Google Ads',
    status: 'connected',
    lastSync: '2025-07-15T10:25:00Z',
    icon: 'Globe'
  },
  {
    id: '3',
    name: 'TikTok Ads',
    status: 'error',
    lastSync: '2025-07-15T08:15:00Z',
    icon: 'Youtube'
  },
  {
    id: '4',
    name: 'LinkedIn Ads',
    status: 'disconnected',
    icon: 'Linkedin'
  },
  {
    id: '5',
    name: 'Pinterest',
    status: 'connected',
    lastSync: '2025-07-15T10:25:00Z',
    icon: 'Globe'
  }
];

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Extractor de Datos',
    description: 'Extrae automáticamente datos de rendimiento de todas las plataformas conectadas',
    type: 'extraction',
    active: true,
    lastExecution: '2025-07-15T10:30:00Z',
    executions: []
  },
  {
    id: '2',
    name: 'Analizador de Rendimiento',
    description: 'Analiza el rendimiento de campañas e identifica oportunidades de optimización',
    type: 'analysis',
    active: true,
    lastExecution: '2025-07-15T09:45:00Z',
    executions: []
  },
  {
    id: '3',
    name: 'Generador de Creativos',
    description: 'Genera nuevos creativos publicitarios basados en datos de rendimiento',
    type: 'creativity',
    active: false,
    executions: []
  },
  {
    id: '4',
    name: 'Optimizador Cross-Platform',
    description: 'Optimiza campañas en múltiples plataformas simultáneamente',
    type: 'cross-channel',
    active: true,
    lastExecution: '2025-07-15T08:20:00Z',
    executions: []
  },
  {
    id: '5',
    name: 'Generador de Informes Publicitarios',
    description: 'Genera automáticamente informes detallados de rendimiento publicitario con insights y recomendaciones',
    type: 'reporting',
    active: true,
    lastExecution: '2025-07-15T07:30:00Z',
    executions: []
  },
  {
    id: '6',
    name: 'Analizador de Palabras Clave',
    description: 'Analiza y optimiza palabras clave para mejorar la relevancia y el rendimiento de las campañas',
    type: 'analysis',
    active: false,
    executions: []
  },
  {
    id: '7',
    name: 'Generador de Ganchos Creativos',
    description: 'Crea ganchos publicitarios atractivos y persuasivos basados en datos de audiencia y tendencias',
    type: 'creativity',
    active: false,
    executions: []
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'increase_budget',
    title: 'Aumentar Presupuesto para Campaña de Alto Rendimiento',
    description: 'La campaña "Oferta Navideña 2025" está rindiendo 45% por encima del ROAS objetivo',
    impact: 'high',
    platform: 'Meta Ads',
    timestamp: '2025-07-15T10:30:00Z',
    applied: false,
    insight: 'Esta campaña ha mostrado consistentemente un rendimiento sólido con un ROAS de 6.2x, significativamente por encima del objetivo de 4.0x. Aumentar el presupuesto en 30% podría generar $15K adicionales en ingresos manteniendo la rentabilidad.'
  },
  {
    id: '2',
    type: 'pause_campaign',
    title: 'Pausar Campaña de Bajo Rendimiento',
    description: 'La campaña "Promoción Q3 2025" ha excedido el umbral de CPA en 85%',
    impact: 'high',
    platform: 'Google Ads',
    timestamp: '2025-07-15T09:15:00Z',
    applied: false,
    insight: 'Esta campaña está gastando presupuesto de manera ineficiente con un CPA de $23.50 contra un objetivo de $12.50. Pausarla evitará más desperdicio de presupuesto mientras optimizas la segmentación y creativos.'
  },
  {
    id: '3',
    type: 'change_creative',
    title: 'Actualizar Creativos Publicitarios',
    description: 'Se detectó fatiga creativa en anuncios de mejor rendimiento',
    impact: 'medium',
    platform: 'TikTok Ads',
    timestamp: '2025-07-15T08:45:00Z',
    applied: true,
    insight: 'El creativo actual ha estado ejecutándose por 14 días y muestra un CTR en declive (-25% en los últimos 3 días). Probar nuevos creativos con A/B testing podría restaurar el rendimiento.'
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    name: 'Resumen Semanal de Rendimiento',
    type: 'performance',
    schedule: 'weekly',
    lastGenerated: '2025-07-15T00:00:00Z',
    recipients: ['cliente@therocketcode.com', 'manager@agencia.com']
  },
  {
    id: '2',
    name: 'Análisis de Rendimiento Creativo',
    type: 'creative',
    schedule: 'monthly',
    lastGenerated: '2025-07-01T00:00:00Z',
    recipients: ['creativo@agencia.com']
  },
  {
    id: '3',
    name: 'Reporte de Insights de Audiencia',
    type: 'audience',
    recipients: ['estrategia@agencia.com']
  }
];