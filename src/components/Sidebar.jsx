import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserPlus, 
  BookOpen, 
  MessageSquare, 
  Settings
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-300 group
      ${active ? 'bg-white/5 border-r-2 border-accent-gold' : 'hover:bg-white/5'}`}
  >
    <Icon 
      strokeWidth={1.5}
      className={`w-5 h-5 transition-colors ${active ? 'text-accent-gold' : 'text-text-secondary group-hover:text-accent-gold'}`} 
    />
    <span 
      className={`font-medium transition-colors ${active ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}
    >
      {label}
    </span>
  </div>
);

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Irmãos', icon: Users },
    { id: 'sessions', label: 'Sessões', icon: Calendar },
    { id: 'candidates', label: 'Candidatos', icon: UserPlus },
    { id: 'library', label: 'Biblioteca', icon: BookOpen },
    { id: 'comm', label: 'Comunicação', icon: MessageSquare },
  ];

  return (
    <div className="w-64 h-screen bg-bg-secondary border-r border-glass-border flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-4 border-b border-glass-border">
        <img src="/src/assets/logo-brasao.png" alt="Logo" className="logo-sidebar" />
        <h1 className="text-xl masonic-gradient-text" style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>Arco Real</h1>
      </div>
      
      <div className="flex-1 mt-4">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.id}
            {...item}
            active={activePage === item.id}
            onClick={() => setActivePage(item.id)}
          />
        ))}
      </div>
      
      <div className="p-6 border-t border-glass-border">
        <SidebarItem icon={Settings} label="Configurações" />
      </div>
    </div>
  );
};

export default Sidebar;
