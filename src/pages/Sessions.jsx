import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import SessionForm from '../components/SessionForm';
import { Search, Calendar, Plus, Edit2, FileText, CheckCircle2 } from 'lucide-react';

const formatDateBR = (dateStr) => {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  return dateStr;
};

const SessionCard = ({ session, delay, onEdit, onAta }) => (
  <GlassCard delay={delay} className="p-4 mb-4 border-l-4" style={{ borderLeftColor: 'var(--accent-gold)' }}>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => onEdit(session)}>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent-gold/30 flex items-center justify-center bg-white/5 flex-shrink-0">
          <Calendar className="text-accent-gold w-5 h-5" />
        </div>
        <div>
          <h4 className="text-text-primary font-medium text-lg">{session.nome}</h4>
          <p className="text-xs text-text-secondary">Data: {formatDateBR(session.data)} | Grau: {session.grau || 'N/A'}</p>
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
        <div className="text-left md:text-right">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-gold/20 text-accent-gold">
            {session.tipo || 'Sessão'}
          </span>
          <p className="text-xs text-text-secondary mt-1 flex items-center justify-start md:justify-end gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            {session.attendances?.length || 0} presenças
          </p>
        </div>
        <div className="flex gap-2">
          <button className="action-icon-button" onClick={() => onEdit(session)}>
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            className={`action-icon-button ${session.ataContent || session.ataFile ? 'bg-accent-gold/20 border-accent-gold text-accent-gold' : ''}`} 
            onClick={() => onAta(session)}
            title="Ver Ata"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </GlassCard>
);

const Sessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [formTab, setFormTab] = useState('dados');
  const [sessions, setSessions] = useState([]);
  const [members, setMembers] = useState([]); // Needed for attendances

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Erro ao buscar sessões', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data = await response.json();
        // Only active members for attendance
        setMembers(data.filter(m => m.status === 'Ativo'));
      }
    } catch (error) {
      console.error('Erro ao buscar membros', error);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchMembers();
  }, []);

  const handleCreate = () => {
    setSelectedSession(null);
    setFormTab('dados');
    setIsFormOpen(true);
  };

  const handleEdit = (session) => {
    setSelectedSession(session);
    setFormTab('dados');
    setIsFormOpen(true);
  };

  const handleViewAta = (session) => {
    if (session.ataFile && session.ataFile.startsWith('data:')) {
      // Se tiver arquivo físico, faz o download/abre
      const link = document.createElement('a');
      link.href = session.ataFile;
      link.download = session.ataFileName || 'ata.doc';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Se não tiver arquivo, abre o modal na aba de redação
      setSelectedSession(session);
      setFormTab('ata');
      setIsFormOpen(true);
    }
  };

  const handleSave = async (sessionData) => {
    try {
      if (selectedSession) {
        // Update
        await fetch(`/api/sessions/${selectedSession.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData)
        });
      } else {
        // Create
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData)
        });
      }
      setIsFormOpen(false);
      fetchSessions(); // Refresh list
    } catch (error) {
      console.error('Erro ao salvar sessão', error);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.data?.includes(searchTerm) ||
    String(s.id).includes(searchTerm)
  );

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-start md:items-end mb-12 flex-wrap gap-4 flex-col md:flex-row">
          <div>
            <h2 className="text-4xl mb-2 masonic-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>Sessões e Frequências</h2>
            <p className="text-text-secondary">Gestão de sessões, pautas e controle de presença.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            <button 
              className="modern-button" 
              style={{ 
                background: 'var(--accent-gold)', 
                color: 'black', 
                height: '42px', 
                padding: '0 24px',
                fontSize: '0.9rem',
                position: 'relative',
                zIndex: 50,
                cursor: 'pointer'
              }} 
              onClick={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Nova Sessão</span>
            </button>
            <div className="modern-input-container w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Buscar por nome ou data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input bg-glass-bg border-glass-border focus:border-accent-gold w-full md:w-[250px]"
                style={{ height: '42px', paddingLeft: '40px' }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-4">
          {filteredSessions.map((session, index) => (
            <SessionCard 
              key={session.id} 
              session={session} 
              delay={0.1 + (index * 0.05)} 
              onEdit={handleEdit}
              onAta={handleViewAta}
            />
          ))}
          {filteredSessions.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              Nenhuma sessão encontrada.
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <SessionForm 
          session={selectedSession} 
          members={members}
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSave} 
          defaultTab={formTab}
        />
      )}
    </>
  );
};

export default Sessions;
