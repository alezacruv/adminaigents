export interface Account {
  id: string;
  name: string;
  logo?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  industry?: string;
}

export interface KPI {
  id: string;
  name: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
}

export interface Platform {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: string;
  icon: string;
  credentials?: {
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'extraction' | 'analysis' | 'reporting' | 'creativity' | 'cross-channel';
  active: boolean;
  lastExecution?: string;
  executions: AgentExecution[];
}

export interface AgentExecution {
  id: string;
  timestamp: string;
  status: 'success' | 'error' | 'running';
  duration?: number;
  result?: string;
}

export interface Recommendation {
  id: string;
  type: 'pause_campaign' | 'increase_budget' | 'change_creative' | 'adjust_targeting';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  platform: string;
  timestamp: string;
  applied: boolean;
  insight: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'performance' | 'creative' | 'audience' | 'custom';
  schedule?: 'daily' | 'weekly' | 'monthly';
  lastGenerated?: string;
  recipients: string[];
}