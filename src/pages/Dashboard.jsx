import React from 'react';
import GlassCard from '../components/GlassCard';
import { Users, UserPlus, BookOpen, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';
import { mockMembers, mockSessions, mockCandidates } from '../data/mockData';

const StatCard = ({ title, value, icon: Icon, trend, delay }) => (
  <GlassCard delay={delay} className="flex-1">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-accent-gold/10 rounded-xl">
        <Icon strokeWidth={1.5} className="text-accent-gold w-6 h-6" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs text-green-400">
          {trend} <ArrowUpRight strokeWidth={1.5} className="w-3 h-3" />
        </span>
      )}
    </div>
    <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white">{value}</p>
  </GlassCard>
);

const Dashboard = () => {
  const nextSession = mockSessions[0];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-4xl mb-2">Bem-vindo, Irmão</h2>
        <p className="text-text-secondary">Aqui está o resumo da sua oficina hoje.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total de Irmãos" 
          value={mockMembers.length} 
          icon={Users} 
          trend="+2 este mês"
          delay={0.1}
        />
        <StatCard 
          title="Profanos em Pipeline" 
          value={mockCandidates.length} 
          icon={UserPlus} 
          delay={0.2}
        />
        <StatCard 
          title="Acervo da Biblioteca" 
          value="342" 
          icon={BookOpen} 
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <GlassCard delay={0.4} className="col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <CalendarIcon strokeWidth={1.5} className="text-accent-gold w-6 h-6" />
            <h3 className="text-xl">Próxima Sessão</h3>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-accent-gold font-medium mb-2">{nextSession.tipo}</p>
            <h4 className="text-2xl text-white mb-4">{nextSession.data} às {nextSession.horario}</h4>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <span>Local:</span>
              <span className="text-white">{nextSession.local}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.5} className="col-span-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <UserPlus strokeWidth={1.5} className="text-accent-gold w-6 h-6" />
              <h3 className="text-xl">Candidatos Recentes</h3>
            </div>
            <button className="modern-button" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Ver Tudo
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {mockCandidates.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="font-medium text-white">{c.nome}</p>
                  <p className="text-xs text-text-secondary">Solicitado em {c.dataSolicitacao}</p>
                </div>
                <span className="px-3 py-1 bg-accent-gold/20 text-accent-gold text-xs rounded-full">
                  {c.fase}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
