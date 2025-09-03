import React from 'react';
import { 
  Home, 
  BarChart3, 
  Zap, 
  Lightbulb, 
  FileText, 
  Settings, 
  Users,
  ChevronLeft,
  ChevronRight,
  Bot
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', name: 'Panel de Control', icon: Home },
  { id: 'integrations', name: 'Integraciones', icon: BarChart3 },
  { id: 'agents', name: 'Agentes IA', icon: Zap },
  { id: 'recommendations', name: 'Recomendaciones', icon: Lightbulb },
  { id: 'reports', name: 'Reportes', icon: FileText },
  { id: 'settings', name: 'Configuración', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onPageChange, 
  collapsed, 
  onToggleCollapse,
  isMobile,
  mobileMenuOpen,
  onMobileMenuToggle
}) => {
  // Close mobile menu when page changes
  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (isMobile) {
      onMobileMenuToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileMenuToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed h-screen bg-slate-purple border-violet-light/20 transition-all duration-300 flex flex-col shadow-card overflow-hidden ${
        isMobile 
          ? `top-0 right-0 w-80 border-l z-50 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`
          : `left-0 top-0 border-r z-30 ${collapsed ? 'w-16' : 'w-64'}`
      }`}>
      {/* Header */}
      <div className="p-4 border-b border-violet-light/20">
        <div className="flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-soft" style={{ backgroundColor: '#7F4EFF' }}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-light-ice font-semibold text-sm sm:text-base tracking-tight">
                Relevant AIgents
              </span>
            </div>
          )}
          {collapsed && !isMobile && (
            <div className="flex items-center justify-center w-full">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shadow-soft" style={{ backgroundColor: '#7F4EFF' }}>
                <Bot className="w-3 h-3 text-white" />
              </div>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              className="text-cloud-gray hover:text-light-ice transition-colors p-2 rounded-lg hover:bg-deep-slate/50"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
          {isMobile && (
            <button
              onClick={onMobileMenuToggle}
              className="text-cloud-gray hover:text-light-ice transition-colors p-2 rounded-lg hover:bg-deep-slate/50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handlePageChange(item.id)}
                  className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''} ${
                    collapsed && !isMobile ? 'justify-center space-x-0' : ''
                  }`}
                  title={collapsed && !isMobile ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-glow' : ''} flex-shrink-0`} />
                  {(!collapsed || isMobile) && (
                    <span className="truncate">{item.name}</span>
                  )}
                </button>
              </li>
            );
          })}
          
          {/* Cambiar Cliente - moved here after Settings */}
          <li>
            <button
              onClick={() => handlePageChange('accounts')}
              className={`sidebar-item ${
                collapsed && !isMobile ? 'justify-center space-x-0' : ''
              }`}
              title={collapsed && !isMobile ? 'Cambiar Cliente' : undefined}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              {(!collapsed || isMobile) && (
                <span className="truncate">Cambiar Cliente</span>
              )}
            </button>
          </li>
        </ul>
      </nav>

      </div>
    </>
  );
};

export default Sidebar;