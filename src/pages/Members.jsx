import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import MemberForm from '../components/MemberForm';
import { Search, Filter, Mail, Plus, Edit2 } from 'lucide-react';
// import { mockMembers } from '../data/mockData';

const MemberCard = ({ member, delay, onEdit }) => (
  <GlassCard delay={delay} className="p-4 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => onEdit(member)}>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent-gold/30">
          <img src={member.foto} alt={member.nome} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-white font-medium">{member.nome}</h4>
          <p className="text-xs text-text-secondary">CIM: {member.cim} | {member.loja}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
            ${member.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {member.status}
          </span>
          <p className="text-xs text-accent-gold mt-1">{member.grau}</p>
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

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/members');
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

  const filteredMembers = members.filter(m => 
    m.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl mb-2 masonic-gradient-text">Quadro de Obreiros</h2>
            <p className="text-text-secondary">Gestão e consulta de membros da oficina.</p>
          </div>
          <div className="flex gap-4">
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
            <div className="modern-input-container">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Buscar irmão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input"
                style={{ width: '280px' }}
              />
            </div>
            <button className="modern-button">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col">
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
