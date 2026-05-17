import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import CandidateForm from '../components/CandidateForm';
import { Search, Filter, Plus, Edit2, Trash2, Award, Calendar, CheckCircle2, UserCheck, Star, Clock, X } from 'lucide-react';

const CandidateCard = ({ candidate, delay, onEdit, onDelete, onInitiate }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Iniciado':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Aprovado':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Rejeitado':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'Arquivado':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    }
  };

  return (
    <GlassCard delay={delay} className="p-5 mb-4 border border-white/5 relative hover:border-accent-gold/25 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Profile info */}
        <div className="flex items-start gap-4 cursor-pointer flex-1" onClick={() => onEdit(candidate)}>
          <div className="w-12 h-12 rounded-full overflow-hidden border border-accent-gold/30 bg-accent-gold/5 flex items-center justify-center flex-shrink-0">
            <span className="text-accent-gold font-bold text-lg">{candidate.nome.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-white font-bold text-lg hover:text-accent-gold transition-colors">{candidate.nome}</h4>
              {candidate.codigo && (
                <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-text-secondary font-mono">
                  LEGADO: {candidate.codigo}
                </span>
              )}
            </div>
            
            <p className="text-xs text-text-secondary mt-1">
              Indicado por: <span className="text-white font-medium">{candidate.filiacao || 'Não informado'}</span>
            </p>

            {/* Balloting Results Summary */}
            {(candidate.brancas1 || candidate.pretas1) && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Escrutínio:</span>
                <span className="inline-flex items-center bg-white/5 px-2 py-0.5 rounded text-[10px] border border-white/10 text-white">
                  1º Turno: B({candidate.brancas1 || 0}) P({candidate.pretas1 || 0})
                </span>
                {candidate.brancas2 && (
                  <span className="inline-flex items-center bg-white/5 px-2 py-0.5 rounded text-[10px] border border-white/10 text-white">
                    2º Turno: B({candidate.brancas2 || 0}) P({candidate.pretas2 || 0})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Process Timeline & Dates */}
        <div className="flex flex-wrap gap-4 text-xs text-text-secondary md:border-l md:border-white/5 md:pl-6 min-w-[200px] w-full md:w-auto pt-2 md:pt-0">
          <div className="flex flex-col gap-1">
            {candidate.dataProposta && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent-gold/60" />
                Proposta: {candidate.dataProposta}
              </span>
            )}
            {candidate.dataSindicancia && (
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-accent-gold/60" />
                Sindicância: {candidate.dataSindicancia}
              </span>
            )}
            {candidate.dataEscrutinio && (
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-accent-gold/60" />
                Escrutínio: {candidate.dataEscrutinio}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Status */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto md:min-w-[180px] border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
          <div className="flex flex-col items-start md:items-end">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(candidate.status)}`}>
              {candidate.status}
            </span>
            {candidate.status === 'Iniciado' && candidate.dataIniciacao && (
              <span className="text-[10px] text-green-400 mt-1 font-mono">Iniciado em: {candidate.dataIniciacao}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              className="action-icon-button" 
              onClick={() => onEdit(candidate)}
              title="Editar candidato"
              style={{ cursor: 'pointer' }}
            >
              <Edit2 className="w-4 h-4 text-accent-gold" />
            </button>

            {candidate.status !== 'Iniciado' && (
              <button 
                className="action-icon-button bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40"
                onClick={() => onInitiate(candidate)}
                title="Iniciar Candidato (Tornar Membro)"
                style={{ cursor: 'pointer' }}
              >
                <UserCheck className="w-4 h-4 text-green-400" />
              </button>
            )}

            <button 
              className="action-icon-button bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40"
              onClick={() => onDelete(candidate.id, candidate.nome)}
              title="Excluir candidato"
              style={{ cursor: 'pointer' }}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  
  // Initiation modal states
  const [initiationCandidate, setInitiationCandidate] = useState(null);
  const [initiationDate, setInitiationDate] = useState('');
  
  // Filter States (Request 2: filter Nome must be the first input)
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState('');
  const [filterCodigo, setFilterCodigo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPadrinho, setFilterPadrinho] = useState('');

  const fetchCandidates = async () => {
    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (error) {
      console.error('Erro ao buscar candidatos', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCandidate(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Tem certeza que deseja excluir o candidato "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Candidato excluído com sucesso!');
        fetchCandidates();
      } else {
        alert('Erro ao excluir candidato no servidor.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao excluir.');
    }
  };

  const handleInitiateClick = (candidate) => {
    setInitiationCandidate(candidate);
    
    // Set default date to today in Brazilian format (DD/MM/AAAA) or candidate's suggested date
    if (candidate.dataIniciacao) {
      setInitiationDate(candidate.dataIniciacao);
    } else {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      setInitiationDate(`${day}/${month}/${year}`);
    }
  };

  const handleConfirmInitiation = async () => {
    if (!initiationDate) {
      alert('Por favor, informe a data da iniciação!');
      return;
    }

    try {
      const response = await fetch(`/api/candidates/${initiationCandidate.id}/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iniciacaoData: initiationDate })
      });

      if (response.ok) {
        alert(`O candidato "${initiationCandidate.nome}" foi iniciado com sucesso e já consta no Quadro de Obreiros como Aprendiz!`);
        setInitiationCandidate(null);
        fetchCandidates();
      } else {
        const errData = await response.json();
        alert(`Erro ao iniciar candidato: ${errData.error || 'Erro interno'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao iniciar candidato.');
    }
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = !searchTerm || 
      c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.filiacao?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Request 2: filter Nome must be first, Código second
    const matchesNome = !filterNome || c.nome?.toLowerCase().includes(filterNome.toLowerCase());
    const matchesCodigo = !filterCodigo || c.codigo?.includes(filterCodigo);
    const matchesStatus = !filterStatus || c.status === filterStatus;
    const matchesPadrinho = !filterPadrinho || c.filiacao?.toLowerCase().includes(filterPadrinho.toLowerCase());
    
    return matchesSearch && matchesNome && matchesCodigo && matchesStatus && matchesPadrinho;
  });

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-start md:items-end mb-12 flex-wrap gap-4 flex-col md:flex-row">
          <div>
            <h2 className="text-4xl mb-2 masonic-gradient-text">Cadastro de Candidatos</h2>
            <p className="text-text-secondary">Acompanhamento de profanos em processo de sindicância e escrutínio.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            <button 
              className="modern-button" 
              style={{ 
                background: 'var(--accent-gold)', 
                color: 'black', 
                height: '42px', 
                padding: '0 24px',
                position: 'relative',
                zIndex: 50,
                cursor: 'pointer'
              }} 
              onClick={handleCreate}
            >
              <Plus className="w-4 h-4" />
              <span>Novo Candidato</span>
            </button>
            <div className="modern-input-container w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Buscar candidato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input w-full md:w-[280px]"
              />
            </div>
            <button 
              className={`modern-button ${showFilters ? 'bg-accent-gold/20 border-accent-gold/45 text-accent-gold' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              style={{ height: '42px', cursor: 'pointer' }}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Expandable Filters Panel (Request 2) */}
        {showFilters && (
          <div className="flex gap-4 p-4 -mt-6 mb-8 bg-white/5 rounded-xl border border-white/10 animate-fadeIn flex-wrap items-center">
            {/* First Field: Nome */}
            <div className="flex flex-col gap-1.5 min-w-[220px] flex-1">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Nome</label>
              <input 
                type="text"
                placeholder="Filtrar por nome..."
                value={filterNome}
                onChange={(e) => setFilterNome(e.target.value)}
                className="modern-input h-10 text-sm"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Second Field: Código / CIM Legado */}
            <div className="flex flex-col gap-1.5 min-w-[150px]">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Código Legado</label>
              <input 
                type="text"
                placeholder="Filtrar por código..."
                value={filterCodigo}
                onChange={(e) => setFilterCodigo(e.target.value)}
                className="modern-input h-10 text-sm"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Third Field: Status */}
            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Status do Processo</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="modern-input h-10 py-0"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                <option value="">Todos os Status</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Rejeitado">Rejeitado</option>
                <option value="Arquivado">Arquivado</option>
                <option value="Iniciado">Iniciado (Membros)</option>
              </select>
            </div>

            {/* Fourth Field: Padrinho */}
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Padrinho / Indicante</label>
              <input 
                type="text"
                placeholder="Filtrar por padrinho..."
                value={filterPadrinho}
                onChange={(e) => setFilterPadrinho(e.target.value)}
                className="modern-input h-10 text-sm"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Clear Filters Button */}
            {(filterNome || filterCodigo || filterStatus || filterPadrinho) && (
              <button 
                onClick={() => {
                  setFilterNome('');
                  setFilterCodigo('');
                  setFilterStatus('');
                  setFilterPadrinho('');
                }}
                className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider mt-5 px-3 py-2 border border-red-500/20 bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        )}

        {/* Candidates List */}
        <div className="flex flex-col mt-4">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5">
              <p className="text-text-secondary">Nenhum candidato encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            filteredCandidates.map((candidate, index) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                delay={index * 0.05} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                onInitiate={handleInitiateClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Candidate form modal */}
      {isFormOpen && (
        <CandidateForm 
          candidate={selectedCandidate} 
          onClose={() => {
            setIsFormOpen(false);
            fetchCandidates();
          }} 
        />
      )}

      {/* Initiation confirmation dialog modal */}
      {initiationCandidate && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-modal flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full border border-[#D4AF37]/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <UserCheck className="text-green-400 w-5 h-5" />
                Iniciar Profano
              </h3>
              <button 
                className="action-icon-button" 
                onClick={() => setInitiationCandidate(null)}
                style={{ cursor: 'pointer' }}
              >
                <X className="w-5 h-5 text-red-400 hover:text-red-300" />
              </button>
            </div>

            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Você está prestes a registrar a iniciação do profano <strong className="text-white">{initiationCandidate.nome}</strong>.
              <br /><br />
              Esta ação irá migrar todos os dados pessoais, profissionais e conjugais para o Quadro de Obreiros e cadastrá-lo como <strong className="text-accent-gold">Aprendiz</strong> da oficina.
            </p>

            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Data da Iniciação (DD/MM/AAAA) *</label>
              <input 
                type="text"
                placeholder="DD/MM/AAAA"
                value={initiationDate}
                onChange={(e) => setInitiationDate(e.target.value)}
                className="modern-input"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setInitiationCandidate(null)}
                className="modern-button border-white/10 hover:bg-white/5 text-white"
                style={{ height: '42px', cursor: 'pointer' }}
              >
                <span>Cancelar</span>
              </button>
              <button 
                onClick={handleConfirmInitiation}
                className="modern-button"
                style={{ 
                  background: 'var(--accent-gold)', 
                  color: 'black', 
                  height: '42px', 
                  padding: '0 24px',
                  cursor: 'pointer'
                }}
              >
                <span>Confirmar Iniciação</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Candidates;
