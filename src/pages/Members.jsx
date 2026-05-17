import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import MemberForm from '../components/MemberForm';
import { Search, Filter, Mail, Plus, Edit2 } from 'lucide-react';
// import { mockMembers } from '../data/mockData';

const MemberCard = ({ member, delay, onEdit }) => (
  <GlassCard delay={delay} className="p-4 mb-4">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => onEdit(member)}>
        <div className="rounded-full overflow-hidden border-2 border-accent-gold/30 flex-shrink-0" style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px' }}>
          <img src={member.foto} alt={member.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h4 className="text-white font-medium">{member.nome}</h4>
          <p className="text-xs text-text-secondary mb-1">CIM: {member.cim} | {member.loja}</p>
          {(member.cargoLoja || member.cargoPotencia) && (
            <div className="flex flex-wrap gap-2 mt-1">
              {member.cargoLoja && (
                <span className="inline-flex items-center bg-accent-gold/10 text-accent-gold px-2 py-0.5 rounded border border-accent-gold/20 text-[10px] uppercase font-bold tracking-wider">
                  {member.cargoLoja}
                </span>
              )}
              {member.cargoPotencia && (
                <span className="inline-flex items-center bg-white/10 text-white/80 px-2 py-0.5 rounded border border-white/20 text-[10px] uppercase font-bold tracking-wider">
                  {member.cargoPotencia}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
        <div className="flex flex-col items-center md:items-end min-w-[120px]">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
            ${member.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {member.status}
          </span>
          <p className="text-xs text-accent-gold mt-1.5 font-medium">{member.grau}</p>
        </div>
        <div className="flex gap-2">
          <button className="action-icon-button" onClick={() => onEdit(member)}>
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="action-icon-button">
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </GlassCard>
);

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState('');
  const [filterCim, setFilterCim] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGrau, setFilterGrau] = useState('');
  const [filterCargo, setFilterCargo] = useState('');

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Erro ao buscar membros', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  // Get unique list of existing cargos for the selector
  const uniqueCargos = [...new Set(
    members
      .flatMap(m => [m.cargoLoja, m.cargoPotencia])
      .filter(cargo => cargo && typeof cargo === 'string' && cargo.trim() !== '')
  )].sort((a, b) => a.localeCompare(b));

  const filteredMembers = members.filter(m => {
    const matchesSearch = !searchTerm || 
      m.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.cim?.includes(searchTerm);
    const matchesNome = !filterNome || m.nome?.toLowerCase().includes(filterNome.toLowerCase());
    const matchesCim = !filterCim || m.cim?.includes(filterCim);
    const matchesStatus = !filterStatus || m.status === filterStatus;
    const matchesGrau = !filterGrau || m.grau === filterGrau;
    const matchesCargo = !filterCargo || m.cargoLoja === filterCargo || m.cargoPotencia === filterCargo;
    return matchesSearch && matchesNome && matchesCim && matchesStatus && matchesGrau && matchesCargo;
  });

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-start md:items-end mb-12 flex-wrap gap-4 flex-col md:flex-row">
          <div>
            <h2 className="text-4xl mb-2 masonic-gradient-text">Quadro de Obreiros</h2>
            <p className="text-text-secondary">Gestão e consulta de membros da oficina.</p>
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
              <span>Novo Irmão</span>
            </button>
            <div className="modern-input-container w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Buscar irmão..."
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

        {/* Expandable Filters Panel */}
        {showFilters && (
          <div className="flex gap-4 p-4 -mt-6 mb-8 bg-white/5 rounded-xl border border-white/10 animate-fadeIn flex-wrap items-center">
            <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
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

            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">CIM</label>
              <input 
                type="text"
                placeholder="Filtrar por CIM..."
                value={filterCim}
                onChange={(e) => setFilterCim(e.target.value)}
                className="modern-input h-10 text-sm"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5 min-w-[150px]">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="modern-input h-10 py-0"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                <option value="">Todos os Status</option>
                <option value="Ativo">Ativo</option>
                <option value="Afastado">Afastado</option>
                <option value="Irregular">Irregular</option>
                <option value="Desligado">Desligado</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[150px]">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Grau</label>
              <select 
                value={filterGrau} 
                onChange={(e) => setFilterGrau(e.target.value)}
                className="modern-input h-10 py-0"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                <option value="">Todos os Graus</option>
                <option value="Aprendiz">Aprendiz</option>
                <option value="Companheiro">Companheiro</option>
                <option value="Mestre Maçom">Mestre Maçom</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Cargo</label>
              <select 
                value={filterCargo} 
                onChange={(e) => setFilterCargo(e.target.value)}
                className="modern-input h-10 py-0"
                style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                <option value="">Todos os Cargos</option>
                {uniqueCargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(filterNome || filterCim || filterStatus || filterGrau || filterCargo) && (
              <button 
                onClick={() => {
                  setFilterNome('');
                  setFilterCim('');
                  setFilterStatus('');
                  setFilterGrau('');
                  setFilterCargo('');
                }}
                className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider mt-5 px-3 py-2 border border-red-500/20 bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col mt-4">
          {filteredMembers.map((member, index) => (
            <MemberCard key={member.id} member={member} delay={index * 0.05} onEdit={handleEdit} />
          ))}
        </div>
      </div>

      {isFormOpen && (
        <MemberForm 
          member={selectedMember} 
          onClose={() => {
            setIsFormOpen(false);
            fetchMembers(); // Atualiza a lista após salvar
          }} 
        />
      )}
    </>
  );
};

export default Members;
