import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Plus, 
  Trash2, 
  AlertCircle,
  Megaphone,
  Check
} from 'lucide-react';

const Messages = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      titulo: "Boletim Informativo - Regularização de Mensalidades",
      autor: "Ir. Roberto Silva (Tesoureiro)",
      data: "2026-05-16",
      prioridade: "Urgente",
      conteudo: "Lembramos a todos os Irmãos que a tesouraria está de plantão 30 minutos antes das sessões ordinárias para a regularização dos metais. A adimplência do quadro é fundamental para a manutenção de nossas obras de caridade e despesas capitulares."
    },
    {
      id: 2,
      titulo: "Convocação Especial - Sessão Magna de Elevação",
      autor: "Ir. Leandro Bessa (Venerável Mestre)",
      data: "2026-05-14",
      prioridade: "Importante",
      conteudo: "Convocamos todos os Mestres Maçons da oficina para a Sessão Magna de Elevação dos nossos Irmãos Aprendizes, a realizar-se no dia 28/05/2026 às 20h. Vossa presença abrilhantará nossos trabalhos rituais e fortalecerá as colunas."
    },
    {
      id: 3,
      titulo: "Mural de Solidariedade - Tronco de Beneficência",
      autor: "Ir. Carlos Souza (Hospitaleiro)",
      data: "2026-05-10",
      prioridade: "Geral",
      conteudo: "A hospitalaria está arrecadando cobertores e agasalhos para a nossa campanha de inverno da paróquia local. As contribuições físicas podem ser entregues no átrio da Loja durante toda a semana. Que a caridade seja sempre nossa guia."
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    titulo: '',
    autor: 'Ir. Leandro Bessa (Venerável Mestre)',
    data: new Date().toISOString().split('T')[0],
    prioridade: 'Geral',
    conteudo: ''
  });

  const handleAddNotice = (e) => {
    e.preventDefault();
    const id = announcements.length ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
    setAnnouncements([{ ...newNotice, id }, ...announcements]);
    setShowModal(false);
    setNewNotice({
      titulo: '',
      autor: 'Ir. Leandro Bessa (Venerável Mestre)',
      data: new Date().toISOString().split('T')[0],
      prioridade: 'Geral',
      conteudo: ''
    });
  };

  const handleDeleteNotice = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const getPriorityBadgeColor = (prio) => {
    switch (prio) {
      case 'Urgente': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Importante': return 'bg-accent-gold/20 text-accent-gold border-accent-gold/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-4xl mb-2 masonic-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>Mural de Comunicados</h2>
          <p className="text-text-secondary">Avisos da diretoria, mensagens administrativas e notas de hospitalaria para os obreiros.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="modern-button bg-accent-gold text-black border-accent-gold hover:bg-accent-gold/80 px-4 py-2.5 font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Comunicado
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">
        {announcements.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-glass-border rounded-2xl">
            <MessageSquare className="w-12 h-12 text-glass-border mx-auto mb-4" />
            <p className="text-text-secondary">Nenhum comunicado ativo no mural da Loja.</p>
          </div>
        ) : (
          announcements.map((notice) => (
            <GlassCard key={notice.id} className="relative group border border-glass-border hover:border-accent-gold/30 transition-all duration-300">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/5 border border-glass-border ${notice.prioridade === 'Urgente' ? 'text-red-400' : 'text-accent-gold'}`}>
                    <Megaphone className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg text-white font-bold font-display">{notice.titulo}</h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider border ${getPriorityBadgeColor(notice.prioridade)}`}>
                        {notice.prioridade}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1 flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-accent-gold" /> {notice.autor}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-accent-gold" /> {notice.data.split('-').reverse().join('/')}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNotice(notice.id)}
                  className="text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-glass-border/20 text-sm text-text-secondary leading-relaxed bg-black/20 p-4 rounded-xl border border-glass-border/30">
                {notice.conteudo}
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Dynamic Creation Modal Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black-90 backdrop-blur-md p-4">
          <div className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto border border-accent-gold/20 flex flex-col gap-5 p-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-glass-border/30 pb-3">
              <h3 className="text-lg text-white font-semibold">Publicar Novo Comunicado</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-text-secondary hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddNotice} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Título do Comunicado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Nota de Agradecimento - Tronco de Beneficência"
                  value={newNotice.titulo}
                  onChange={(e) => setNewNotice({...newNotice, titulo: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Autor / Cargo</label>
                  <input
                    type="text"
                    required
                    value={newNotice.autor}
                    onChange={(e) => setNewEvent({...newNotice, autor: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Prioridade</label>
                  <select
                    value={newNotice.prioridade}
                    onChange={(e) => setNewNotice({...newNotice, prioridade: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  >
                    <option value="Geral">Comum (Geral)</option>
                    <option value="Importante">Importante</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Conteúdo do Comunicado</label>
                <textarea
                  required
                  placeholder="Escreva a mensagem oficial para os Irmãos..."
                  rows="5"
                  value={newNotice.conteudo}
                  onChange={(e) => setNewNotice({...newNotice, conteudo: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px', paddingTop: '10px' }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-glass-border/30 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="modern-button text-text-secondary border-glass-border hover:bg-white/5 px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modern-button bg-accent-gold text-black border-accent-gold hover:bg-accent-gold/80 px-5 py-2 font-bold"
                >
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
