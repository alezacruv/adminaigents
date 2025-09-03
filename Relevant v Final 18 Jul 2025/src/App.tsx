import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useCurrentAccount } from './hooks/useCurrentAccount';
import AccountSelector from './components/AccountSelector';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import AIChat from './components/Chat/AIChat';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Integrations from './pages/Integrations';
import Agents from './pages/Agents';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { currentAccount, accounts, selectAccount, clearAccount } = useCurrentAccount();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleAddAccount = () => {
    console.log('Agregando nueva cuenta...');
    // This would typically open a modal or redirect to account creation
  };

  const handlePageChange = (page: string) => {
    if (page === 'accounts') {
      clearAccount();
      setCurrentPage('dashboard');
    } else if (page === 'profile') {
      setCurrentPage('profile');
    } else if (page === 'notifications') {
      setCurrentPage('notifications');
    } else {
      setCurrentPage(page);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'integrations':
        return <Integrations />;
      case 'agents':
        return <Agents />;
      case 'recommendations':
        return <Recommendations />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* All routes protected by authentication */}
        <Route path="/*" element={
          isAuthenticated ? (
            <AuthenticatedApp />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
      </Routes>
    </Router>
  );
}

// Separate component for authenticated app logic
function AuthenticatedApp() {
  const { currentAccount, accounts, selectAccount, clearAccount } = useCurrentAccount();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddAccount = () => {
    console.log('Agregando nueva cuenta...');
  };

  const handlePageChange = (page: string) => {
    if (page === 'accounts') {
      clearAccount();
      setCurrentPage('dashboard');
    } else if (page === 'profile') {
      setCurrentPage('profile');
    } else if (page === 'notifications') {
      setCurrentPage('notifications');
    } else {
      setCurrentPage(page);
    }
    // Close mobile menu when navigating
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Listen for navigation events from Header component
  React.useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { page } = event.detail;
      setCurrentPage(page);
    };

    const handleLogout = () => {
      // Reset to login state
      window.location.reload();
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'integrations':
        return <Integrations />;
      case 'agents':
        return <Agents />;
      case 'recommendations':
        return <Recommendations />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  // Show account selector if no account is selected
  if (!currentAccount) {
    return (
      <AccountSelector
        accounts={accounts}
        onSelectAccount={selectAccount}
        onAddAccount={handleAddAccount}
      />
    );
  }

  // Show main app interface once account is selected
  return (
    <div className="min-h-screen bg-midnight">
      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />
      
      <div className={`flex flex-col transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header 
          currentAccount={currentAccount} 
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobile={isMobile}
        />
        
        <main className="min-h-screen p-3 sm:p-4 lg:p-6">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Agente Conversacional IA */}
      <AIChat currentAccount={currentAccount} />
    </div>
  );
}

export default App;