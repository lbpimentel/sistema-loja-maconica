import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Users as UsersIcon, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  Edit, 
  UserCheck, 
  UserX, 
  Plus, 
  Search, 
  Lock, 
  Shield, 
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Save
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Password visibility & form states
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    email: '',
    password: '',
    role: 'MEMBRO'
  });

  // Load users and members on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersRes = await fetch('/api/users');
      const usersData = usersRes.ok ? await usersRes.json() : [];
      
      // Fetch members (to link accounts to physical members)
      const membersRes = await fetch('/api/members');
      const membersData = membersRes.ok ? await membersRes.json() : [];
      
      setUsers(usersData);
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewModal = () => {
    setEditingUser(null);
    setShowPassword(false);
    setFormData({
      memberId: '',
      email: '',
      password: '',
      role: 'MEMBRO'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setShowPassword(false);
    // Find if user email matches any member to link them in form
    const matchedMember = members.find(m => m.email?.toLowerCase() === user.email.toLowerCase());
    setFormData({
      memberId: matchedMember ? matchedMember.id.toString() : '',
      email: user.email,
      password: '', // Keep blank unless changing
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleMemberChange = (e) => {
    const selectedMemberId = e.target.value;
    if (selectedMemberId) {
      const member = members.find(m => m.id.toString() === selectedMemberId);
      if (member) {
        setFormData({
          ...formData,
          memberId: selectedMemberId,
          email: member.email || ''
        });
        return;
      }
    }
    setFormData({
      ...formData,
      memberId: '',
      email: ''
    });
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let generated = "";
    for (let i = 0; i < 8; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      password: generated
    });
    setShowPassword(true); // Auto reveal generated password
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email,
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {})
      };

      let res;
      if (editingUser) {
        // Edit User
        res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create User
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json();
        alert(`Erro: ${errData.error || 'Não foi possível salvar o usuário'}`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erro de conexão ao salvar usuário');
    }
  };

  const handleDeleteUser = async (id, email) => {
    if (window.confirm(`Deseja realmente excluir o acesso do usuário "${email}"?`)) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchData();
        } else {
          alert('Erro ao excluir usuário');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleBlock = async (user) => {
    const isCurrentlyBlocked = user.role === 'BLOQUEADO';
    const newRole = isCurrentlyBlocked ? 'MEMBRO' : 'BLOQUEADO';
    const actionText = isCurrentlyBlocked ? 'desbloquear' : 'bloquear';
    
    if (window.confirm(`Tem certeza que deseja ${actionText} o acesso do usuário "${user.email}"?`)) {
      try {
        const res = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole })
        });
        if (res.ok) {
          fetchData();
        } else {
          alert('Erro ao alterar status do usuário');
        }
      } catch (error) {
        console.error('Error toggling block state:', error);
      }
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics calculation
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMINISTRADOR').length;
  const operatorsCount = users.filter(u => ['SECRETARIA', 'TESOURARIA', 'CHANCELARIA'].includes(u.role)).length;
  const blockedCount = users.filter(u => u.role === 'BLOQUEADO').length;

  // Filter out members who already have a linked user account to avoid duplication
  const unlinkedMembers = members.filter(m => 
    !users.some(u => u.email?.toLowerCase() === m.email?.toLowerCase()) ||
    (editingUser && editingUser.email?.toLowerCase() === m.email?.toLowerCase())
  );

  // Helper to translate roles into beautiful badges
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMINISTRADOR':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-accent-gold/20 text-accent-gold border border-accent-gold/30 flex items-center gap-1 w-max">
            <Shield className="w-3.5 h-3.5" /> Administrador
          </span>
        );
      case 'SECRETARIA':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1 w-max">
            <ShieldCheck className="w-3.5 h-3.5" /> Secretaria
          </span>
        );
      case 'TESOURARIA':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1 w-max">
            <ShieldCheck className="w-3.5 h-3.5" /> Tesouraria
          </span>
        );
      case 'CHANCELARIA':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-max">
            <ShieldCheck className="w-3.5 h-3.5" /> Chancelaria
          </span>
        );
      case 'BLOQUEADO':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 w-max">
            <Lock className="w-3.5 h-3.5" /> Bloqueado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/10 text-text-secondary border border-white/10 flex items-center gap-1 w-max">
            <UserCheck className="w-3.5 h-3.5" /> Irmão (Consulta)
          </span>
        );
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 flex-wrap gap-4">
        <div>
          <h2 className="text-4xl mb-2 masonic-gradient-text flex items-center gap-3">
            Controle de Acessos
          </h2>
          <p className="text-text-secondary">
            Gerenciamento de contas de usuários, perfis de privilégios e permissões do SisOriente.
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto items-stretch sm:items-center">
          <button 
            onClick={handleOpenNewModal}
            className="modern-button"
            style={{ 
              background: 'var(--accent-gold)', 
              color: 'black', 
              height: '42px', 
              padding: '0 24px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Novo Usuário</span>
          </button>

          <button 
            onClick={fetchData}
            className="action-icon-button"
            style={{ height: '42px', width: '42px', cursor: 'pointer' }}
            title="Atualizar dados"
          >
            <RefreshCw className={`w-4 h-4 text-accent-gold ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-5 flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-secondary">Total de Contas</span>
            <h2 className="text-3xl font-black text-white mt-1">{loading ? '...' : totalUsers}</h2>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <UsersIcon className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between border-l-4 border-l-accent-gold">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-secondary">Administradores</span>
            <h2 className="text-3xl font-black text-white mt-1">{loading ? '...' : adminCount}</h2>
          </div>
          <div className="p-3 rounded-lg bg-accent-gold/10 text-accent-gold">
            <Shield className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between border-l-4 border-l-purple-500">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-secondary">Operadores de Setor</span>
            <h2 className="text-3xl font-black text-white mt-1">{loading ? '...' : operatorsCount}</h2>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between border-l-4 border-l-red-500">
          <div>
            <span className="text-xs uppercase tracking-wider text-text-secondary">Acessos Bloqueados</span>
            <h2 className="text-3xl font-black text-white mt-1">{loading ? '...' : blockedCount}</h2>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: Search and List */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b border-glass-border/30 pb-5">
          {/* Search bar input container */}
          <div className="modern-input-container w-full md:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text"
              placeholder="Buscar por login ou perfil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input w-full"
              style={{ background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          
          <div className="text-xs text-text-secondary w-full md:w-auto text-right">
            Mostrando {filteredUsers.length} de {users.length} usuários cadastrados
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <RefreshCw className="w-10 h-10 animate-spin text-accent-gold" />
              <p className="text-sm text-text-secondary">Carregando contas de usuários...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <Key className="w-14 h-14 text-text-secondary/30" />
              <h3 className="text-lg font-bold text-white">Nenhum usuário encontrado</h3>
              <p className="text-sm text-text-secondary max-w-xs">Tente ajustar seus termos de pesquisa ou crie uma nova conta de acesso.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border/40 text-xs font-bold uppercase tracking-wider text-accent-gold/80 bg-white/5 rounded-t-lg">
                  <th className="p-4 rounded-tl-lg">E-mail / Usuário</th>
                  <th className="p-4">Irmão Associado</th>
                  <th className="p-4">Nível de Acesso</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Cadastrado Em</th>
                  <th className="p-4 text-center rounded-tr-lg w-32">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  // Find associated physical member name
                  const matchedMember = members.find(m => m.email?.toLowerCase() === user.email.toLowerCase());
                  
                  return (
                    <tr 
                      key={user.id} 
                      className="border-b border-glass-border/20 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="p-4 font-semibold text-white text-sm">
                        {user.email}
                      </td>
                      <td className="p-4 text-sm text-text-secondary">
                        {matchedMember ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-white/90">{matchedMember.nome}</span>
                            <span className="text-[10px] text-accent-gold font-medium uppercase">{matchedMember.grau || 'Irmão'}</span>
                          </div>
                        ) : (
                          <span className="text-text-secondary/40 italic">Sem vínculo físico</span>
                        )}
                      </td>
                      <td className="p-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-4 text-sm">
                        {user.role === 'BLOQUEADO' ? (
                          <span className="flex items-center gap-1.5 text-red-500 font-bold text-xs uppercase">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Bloqueado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-green-500 font-bold text-xs uppercase">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Ativo
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-text-secondary">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '15/05/2026'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleBlock(user)}
                            className={`action-icon-button ${
                              user.role === 'BLOQUEADO'
                                ? 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/40 text-green-400'
                                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 hover:border-red-500/40 text-red-400'
                            }`}
                            title={user.role === 'BLOQUEADO' ? "Desbloquear Usuário" : "Bloquear Usuário"}
                            style={{ cursor: 'pointer' }}
                          >
                            {user.role === 'BLOQUEADO' ? <UserCheck className="w-4 h-4 text-green-400" /> : <UserX className="w-4 h-4 text-red-400" />}
                          </button>
                          
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="action-icon-button"
                            title="Editar Permissões"
                            style={{ cursor: 'pointer' }}
                          >
                            <Edit className="w-4 h-4 text-accent-gold" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="action-icon-button bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400"
                            title="Excluir Usuário"
                            style={{ cursor: 'pointer' }}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      {/* Modal Form Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-modal flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 animate-scale-up" style={{ padding: 0 }}>
            
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-[rgba(212,175,55,0.15)] flex justify-between items-center bg-[#131316]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                  <Key className="text-[#D4AF37] w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-2xl text-[#D4AF37] font-bold">
                    {editingUser ? 'Editar Acesso do Usuário' : 'Criar Nova Credencial de Acesso'}
                  </h2>
                  <p className="text-[10px] text-[#99907C] uppercase tracking-widest">
                    SisOriente - Sistema para Gestão de Loja Maçônica
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="action-icon-button"
                style={{ cursor: 'pointer' }}
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden m-0">
              
              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                
                <h3 className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest border-b border-[rgba(212,175,55,0.2)] pb-2 mb-4 mt-2">
                  Dados de Acesso
                </h3>

                {/* Link account to physical Member */}
                {!editingUser && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold mb-1.5 block">
                      Vincular a um Irmão Cadastrado
                    </label>
                    <select
                      value={formData.memberId}
                      onChange={handleMemberChange}
                      className="modern-input w-full font-medium"
                      style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                    >
                      <option value="">-- Credencial Isolada (Apenas E-mail) --</option>
                      {unlinkedMembers.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.nome} ({m.cim ? `CIM: ${m.cim}` : 'Sem CIM'})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-[#99907C] mt-1 leading-relaxed">
                      Vincular a um Irmão preencherá automaticamente o campo de e-mail e atrelará a conta de acesso ao seu cadastro físico.
                    </p>
                  </div>
                )}

                {/* Grid for Email & Role */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {/* Login Email */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold mb-1.5 block">
                      E-mail de Login *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="exemplo@loja.com.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!!formData.memberId}
                      className={`modern-input w-full ${formData.memberId ? 'opacity-60 cursor-not-allowed border-dashed' : ''}`}
                      style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>

                  {/* Access Role */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold mb-1.5 block">
                      Perfil de Permissão *
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="modern-input w-full font-medium"
                      style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                    >
                      <option value="MEMBRO">Irmão (Acesso Padrão - Apenas Consulta)</option>
                      <option value="SECRETARIA">Secretaria (Membros, Candidatos, Sessões)</option>
                      <option value="TESOURARIA">Tesouraria (Gestão Financeira & Caixas)</option>
                      <option value="CHANCELARIA">Chancelaria (Presenças & Estatísticas)</option>
                      <option value="ADMINISTRADOR">Administrador Geral (Acesso Total)</option>
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold mb-1.5 block">
                    {editingUser ? 'Mudar Senha (deixe em branco para não alterar)' : 'Senha de Acesso *'}
                  </label>
                  <div className="relative" style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingUser}
                      placeholder={editingUser ? '••••••••' : 'Digite a senha inicial'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="modern-input w-full"
                      style={{ paddingLeft: '12px', paddingRight: '70px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-text-secondary hover:text-white transition-colors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        title={showPassword ? "Ocultar senha" : "Ver senha"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      
                      {!editingUser && (
                        <button
                          type="button"
                          onClick={generateRandomPassword}
                          className="p-1 text-text-secondary hover:text-[#D4AF37] transition-colors"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          title="Gerar senha aleatória"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[rgba(212,175,55,0.15)] flex justify-end gap-4 bg-[#131316]">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-2.5 rounded-lg border border-[rgba(212,175,55,0.3)] text-[#99907C] hover:text-white hover:bg-white/5 font-medium transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="modern-button flex items-center gap-2"
                  style={{ cursor: 'pointer' }}
                >
                  <Save className="w-4 h-4" strokeWidth={1.5} />
                  <span>{editingUser ? 'SALVAR ALTERAÇÕES' : 'CRIAR ACESSO'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
