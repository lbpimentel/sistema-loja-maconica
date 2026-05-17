import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Sessions from './pages/Sessions';
import Candidates from './pages/Candidates';
import Profile from './pages/Profile';
import Chancellery from './pages/Chancellery';
import Treasury from './pages/Treasury';
import Presidency from './pages/Presidency';
import Settings from './pages/Settings';
import Agenda from './pages/Agenda';
import Messages from './pages/Messages';
import Files from './pages/Files';
import Users from './pages/Users';
import { Menu } from 'lucide-react';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleTriggerPicker = (e) => {
      if (e.target && e.target.tagName === 'INPUT' && (e.target.type === 'date' || e.target.type === 'time')) {
        try {
          e.target.showPicker();
        } catch (err) {
          console.warn('showPicker not supported or restricted:', err);
        }
      }
    };

    document.addEventListener('click', handleTriggerPicker);
    document.addEventListener('focusin', handleTriggerPicker);

    return () => {
      document.removeEventListener('click', handleTriggerPicker);
      document.removeEventListener('focusin', handleTriggerPicker);
    };
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // Close sidebar automatically on mobile
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'agenda':
        return <Agenda />;
      case 'messages':
        return <Messages />;
      case 'files':
        return <Files />;
      case 'users':
        return <Users />;

      case 'members':
        return <Members />;
      case 'sessions':
        return <Sessions />;
      case 'candidates':
        return <Candidates />;
      case 'chancelaria':
        return <Chancellery />;
      case 'tesouraria':
        return <Treasury />;
      case 'presidencia':
        return <Presidency />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl text-text-secondary">Módulo em desenvolvimento...</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar 
        activePage={activePage} 
        setActivePage={handlePageChange} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300 md:hidden"
        />
      )}

      <main className="flex-1 ml-0 md:ml-64 min-h-screen relative flex flex-col justify-between">
        <div className="watermark-bg"></div>
        
        {/* Top Header Background Blur Effect & Mobile Navigation Controls */}
        <div className="fixed top-0 right-0 left-0 md:left-64 h-20 bg-bg-primary/40 backdrop-blur-md z-40 border-b border-glass-border flex items-center justify-between px-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-text-secondary hover:text-white transition-colors md:hidden focus:outline-none"
            title="Abrir Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="text-lg font-bold masonic-gradient-text md:hidden">
            SisOriente
          </div>
          
          <div className="w-8 md:hidden"></div> {/* Spacer for symmetry */}
        </div>
        
        <div className="pt-20 flex-1">
          {renderPage()}
        </div>

        <footer className="w-full py-4 text-center text-xs text-[#99907C] border-t border-glass-border/30 bg-[#0d0d0f]/20 relative z-30 flex items-center justify-center gap-1.5 flex-wrap">
          <span>Desenvolvido por:</span>
          <a href="mailto:leandrobessa@hotmail.com" className="text-[#D4AF37] hover:underline font-bold transition-all">Leandro Bessa</a>
        </footer>
      </main>
    </div>
  );
}

export default App;

