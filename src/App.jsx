import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'members':
        return <Members />;
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
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <main className="flex-1 ml-64 min-h-screen relative">
        <div className="watermark-bg"></div>
        {/* Top Header Background Blur Effect */}
        <div className="fixed top-0 right-0 left-64 h-20 bg-bg-primary/40 backdrop-blur-md z-40 border-b border-glass-border"></div>
        
        <div className="pt-20">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
