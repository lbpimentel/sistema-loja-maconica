import React from 'react';
// Force redeploy with real data fetch logic v2
import GlassCard from '../components/GlassCard';
import { Users, UserPlus, BookOpen, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';
import { mockMembers, mockSessions, mockCandidates } from '../data/mockData';

const formatDateBR = (dateStr) => {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  return dateStr;
};

const StatCard = ({ title, value, icon: Icon, trend, delay }) => (
  <GlassCard delay={delay}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-accent-gold/10 rounded-xl">
        <Icon strokeWidth={1.5} className="text-accent-gold w-6 h-6" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs text-green-600">
          {trend} <ArrowUpRight strokeWidth={1.5} className="w-3 h-3" />
        </span>
      )}
    </div>
    <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-text-primary">{value}</p>
  </GlassCard>
);

const Dashboard = () => {
  const [data, setData] = React.useState({
    membersCount: 0,
    candidatesCount: 0,
    recentCandidates: [],
    nextSession: null,
    isPastSession: false,
    loading: true,
    error: null
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, sessionsRes, candidatesRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/sessions'),
          fetch('/api/candidates')
        ]);

        if (!membersRes.ok || !sessionsRes.ok || !candidatesRes.ok) {
          throw new Error('Erro ao carregar dados do servidor');
        }

        const members = await membersRes.json();
        const sessions = await sessionsRes.json();
        const candidates = await candidatesRes.json();

        // Encontrar a próxima sessão cronológica (hoje ou no futuro)
        const todayStr = new Date().toLocaleDateString('sv-SE'); // "YYYY-MM-DD" local seguro
        
        const futureSessions = sessions
          .filter(s => s.data && s.data >= todayStr)
          .sort((a, b) => a.data.localeCompare(b.data));

        let nextSessionVal = null;
        let isPastSessionVal = false;

        if (futureSessions.length > 0) {
          nextSessionVal = futureSessions[0];
        } else if (sessions.length > 0) {
          // Se não houver sessões futuras, mostra a mais recente do passado
          const sortedPast = [...sessions].sort((a, b) => b.data.localeCompare(a.data));
          nextSessionVal = sortedPast[0];
          isPastSessionVal = true;
        }

        // Calcular estatísticas
        setData({
          membersCount: members.length,
          candidatesCount: candidates.length,
          recentCandidates: candidates.slice(0, 3),
          nextSession: nextSessionVal,
          isPastSession: isPastSessionVal,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Erro no Dashboard:', err);
        setData(prev => ({ ...prev, loading: false, error: err.message }));
      }
    };

    fetchData();
  }, []);

  if (data.loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-accent-gold animate-pulse text-xl">Carregando portal...</div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-8">
        <GlassCard>
          <div className="text-red-500 p-8 text-center bg-red-500/10 rounded-2xl border border-red-500/20">
            <h3 className="text-2xl font-bold mb-4">⚠️ Erro de Conexão com o Banco</h3>
            <p className="mb-4 text-text-primary">O sistema não conseguiu se comunicar com o banco de dados Supabase.</p>
            <div className="p-4 bg-black/20 rounded-xl text-left font-mono text-sm overflow-auto max-h-40">
              {data.error}
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-4xl mb-2 masonic-gradient-text">Bem-vindo, Irmão</h2>
        <p className="text-text-secondary">Aqui está o resumo da sua oficina hoje.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Total de Irmãos" 
          value={data.membersCount} 
          icon={Users} 
          trend="+2 este mês"
          delay={0.1}
        />
        <StatCard 
          title="Profanos em Pipeline" 
          value={data.candidatesCount} 
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
        <GlassCard delay={0.4}>
          <div className="flex items-center gap-3 mb-6">
            <CalendarIcon strokeWidth={1.5} className="text-accent-gold w-6 h-6" />
            <h3 className="text-xl">
              {data.isPastSession ? 'Última Sessão Realizada' : 'Próxima Sessão'}
            </h3>
          </div>
          {data.nextSession ? (
            <div className="p-6 bg-glass-bg rounded-2xl border border-glass-border">
              <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                <p className="text-accent-gold font-medium">{data.nextSession.tipo || 'Sessão'}</p>
                {data.isPastSession && (
                  <span className="text-[9px] bg-white/10 text-white/60 px-2 py-0.5 rounded border border-white/10 uppercase font-bold tracking-wider">
                    Histórico
                  </span>
                )}
              </div>
              <h4 className="text-2xl text-text-primary mb-4">
                {formatDateBR(data.nextSession.data)} {data.nextSession.horario ? `às ${data.nextSession.horario}` : ''}
              </h4>
              <div className="flex justify-between items-center flex-wrap gap-2 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <span>Local:</span>
                  <span className="text-text-primary">{data.nextSession.local || 'Templo Principal'}</span>
                </div>
                {data.nextSession.grau && (
                  <div className="flex items-center gap-2">
                    <span>Grau:</span>
                    <span className="text-accent-gold font-medium">{data.nextSession.grau}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-glass-bg rounded-2xl border border-glass-border text-center text-text-secondary">
              Nenhuma sessão agendada.
            </div>
          )}
        </GlassCard>

        <GlassCard delay={0.5}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <UserPlus strokeWidth={1.5} className="text-accent-gold w-6 h-6" />
              <h3 className="text-xl">Candidatos Recentes</h3>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {data.recentCandidates && data.recentCandidates.length > 0 ? (
              data.recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent-gold/20 transition-all text-sm">
                  <div className="flex flex-col items-start">
                    <span className="text-white font-bold">{candidate.nome}</span>
                    <span className="text-[10px] text-text-secondary">Indicado por: {candidate.filiacao || 'Não informado'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    candidate.status === 'Iniciado' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    candidate.status === 'Aprovado' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    candidate.status === 'Rejeitado' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {candidate.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-4 text-center text-text-secondary p-8">
                Nenhum candidato recente.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
