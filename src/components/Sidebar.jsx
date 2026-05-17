import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserPlus, 
  BookOpen, 
  MessageSquare, 
  Settings,
  X,
  User,
  ClipboardList,
  Landmark,
  Award,
  HardDrive,
  Key
} from 'lucide-react';
import logoBrasao from '../assets/logo-brasao.png';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-all duration-300 group
      ${active ? 'bg-white/5 border-r-2 border-accent-gold' : 'hover:bg-white/5'}`}
  >
    <Icon 
      strokeWidth={1.5}
      className={`w-5 h-5 transition-colors ${active ? 'text-accent-gold' : 'text-text-secondary group-hover:text-accent-gold'}`} 
    />
    <span 
      className={`font-medium text-sm transition-colors ${active ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}
    >
      {label}
    </span>
  </div>
);

const Sidebar = ({ activePage, setActivePage, isOpen, onClose }) => {
  const menuGroups = [
    {
      title: 'Administração',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'Meu Perfil', icon: User },
        { id: 'settings', label: 'Configurações', icon: Settings },
      ]
    },
    {
      title: 'Menu da Loja',
      items: [
        { id: 'agenda', label: 'Agenda da Loja', icon: Calendar },
        { id: 'messages', label: 'Mural de Avisos', icon: MessageSquare },
        { id: 'files', label: 'Arquivos (Nuvem)', icon: HardDrive },
      ]
    },
    {
      title: 'Secretaria',
      items: [
        { id: 'members', label: 'Irmãos', icon: Users },
        { id: 'candidates', label: 'Candidatos', icon: UserPlus },
        { id: 'sessions', label: 'Sessões', icon: Calendar },
        { id: 'users', label: 'Usuários', icon: Key },
      ]
    },
    {
      title: 'Chancelaria',
      items: [
        { id: 'chancelaria', label: 'Frequência & Visitas', icon: ClipboardList },
      ]
    },
    {
      title: 'Tesouraria',
      items: [
        { id: 'tesouraria', label: 'Finanças & Caixas', icon: Landmark },
      ]
    },
    {
      title: 'Presidência',
      items: [
        { id: 'presidencia', label: 'Gestão & Comissões', icon: Award },
      ]
    }
  ];

  return (
    <div className={`w-64 h-screen bg-bg-secondary border-r border-glass-border flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button 
        onClick={onClose}
        className="p-1.5 rounded-lg text-text-secondary hover:text-white transition-colors md:hidden focus:outline-none bg-white/5 hover:bg-white/10"
        style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer' }}
        title="Fechar Menu"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="p-6 flex flex-col items-center text-center border-b border-glass-border">
        <img src={logoBrasao} alt="Logo" className="logo-sidebar flex-shrink-0 mb-3" style={{ width: '64px', height: '64px' }} />
        <div>
          <h1 className="text-xl masonic-gradient-text font-bold" style={{ fontSize: '1.4rem', lineHeight: '1.1' }}>SisOriente</h1>
          <p className="text-[10px] text-[#99907C] uppercase tracking-wider mt-2 leading-relaxed" style={{ fontStyle: 'normal' }}>
            Sistema para Gestão<br />de Loja Maçônica
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-3">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-4">
            <div className="text-[9px] text-[#99907C]/60 font-bold uppercase tracking-widest px-6 pb-1.5 pt-2">
              {group.title}
            </div>
            {group.items.map((item) => (
              <SidebarItem 
                key={item.id}
                {...item}
                active={activePage === item.id}
                onClick={() => {
                  setActivePage(item.id);
                  onClose(); // Auto-close on mobile when item clicked
                }}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-glass-border flex flex-col gap-2">
        <div className="text-[10px] text-[#99907C] font-semibold tracking-wider text-center mt-1 border-t border-glass-border/10 pt-2">
          Desenvolvido por:<br />
          <a href="mailto:leandrobessa@hotmail.com" className="text-[#D4AF37] hover:underline font-bold transition-all block mt-1">Leandro Pimenttel</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


