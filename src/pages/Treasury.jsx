import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { DollarSign, Landmark, Receipt, FileText, Plus, Search, Calendar, Filter, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { mockMembers } from '../data/mockData';

const Treasury = () => {
  const [activeTab, setActiveTab] = useState('cashflow');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  
  // Data State
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transactions State
  const [transactions, setTransactions] = useState([
    { id: 1, data: "2026-05-15", descricao: "Mensalidades - Lote Maio/2026", categoria: "Mensalidade", tipo: "Receita", valor: 3500.00, caixa: "Caixa Geral" },
    { id: 2, data: "2026-05-14", descricao: "Energia Elétrica Templo", categoria: "Manutenção", tipo: "Despesa", valor: 450.00, caixa: "Caixa Geral" },
    { id: 3, data: "2026-05-10", descricao: "Tronco de Solidariedade - Sessão Ordinária", categoria: "Beneficência", tipo: "Receita", valor: 380.00, caixa: "Tronco de Beneficência" },
    { id: 4, data: "2026-05-08", descricao: "Compra de Livros Ritualísticos", categoria: "Insumos", tipo: "Despesa", valor: 250.00, caixa: "Caixa Geral" },
    { id: 5, data: "2026-05-05", descricao: "Doação para Asilo local", categoria: "Beneficência", tipo: "Despesa", valor: 500.00, caixa: "Tronco de Beneficência" }
  ]);

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    data: new Date().toLocaleDateString('sv-SE'),
    descricao: '',
    categoria: 'Mensalidade',
    tipo: 'Receita',
    valor: '',
    caixa: 'Caixa Geral'
  });

  // Fetch members for Saldo por Pessoa
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/members');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        } else {
          throw new Error('Fallback');
        }
      } catch (err) {
        setMembers(mockMembers);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleAddTx = (e) => {
    e.preventDefault();
    if (!newTx.descricao || !newTx.valor) return;
    setTransactions(prev => [
      {
        id: prev.length + 1,
        ...newTx,
        valor: parseFloat(newTx.valor)
      },
      ...prev
    ]);
    setNewTx({
      data: new Date().toLocaleDateString('sv-SE'),
      descricao: '',
      categoria: 'Mensalidade',
      tipo: 'Receita',
      valor: '',
      caixa: 'Caixa Geral'
    });
    setIsTxModalOpen(false);
  };

  // Calculate Balances
  const calculateBalances = () => {
    let general = 15430.00;
    let charity = 3820.00;
    let events = 1200.00;

    transactions.forEach(tx => {
      const val = tx.tipo === 'Receita' ? tx.valor : -tx.valor;
      // Adjust standard starting mock values based on new items entered in-memory
      if (tx.id > 5) {
        if (tx.caixa === 'Caixa Geral') general += val;
        else if (tx.caixa === 'Tronco de Beneficência') charity += val;
        else if (tx.caixa === 'Caixa de Eventos') events += val;
      }
    });

    return { general, charity, events, total: general + charity + events };
  };

  const balances = calculateBalances();

  // Filter transactions
  const filteredTxs = transactions.filter(tx => {
    const matchesSearch = tx.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || tx.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Mock outstanding balances per person
  const getMemberTreasuryStatus = (id) => {
    // Return custom mock data for outstanding dues
    if (id === 1) return { status: 'Pago', valor: 0.00, vencimento: 'Maio/2026' };
    if (id === 2) return { status: 'Em Aberto', valor: 150.00, vencimento: '10/05/2026' };
    return { status: 'Em Atraso', valor: 450.00, vencimento: '10/03/2026' }; // 3 months behind
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-accent-gold animate-pulse text-xl">Carregando Módulo de Tesouraria...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-4xl mb-2 masonic-gradient-text">Tesouraria</h2>
        <p className="text-text-secondary">Gestão de receitas, despesas, caixas especiais e mensalidades dos Irmãos.</p>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-accent-gold/10 rounded-xl">
              <Landmark strokeWidth={1.5} className="text-accent-gold w-6 h-6" />
            </div>
            <span className="text-[10px] text-accent-gold border border-accent-gold/30 px-2 py-0.5 rounded">Consolidado</span>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">Saldo Total da Loja</h3>
          <p className="text-3xl font-bold text-text-primary">R$ {balances.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <DollarSign strokeWidth={1.5} className="text-blue-400 w-6 h-6" />
            </div>
            <span className="text-[10px] text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">Operacional</span>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">Caixa Geral</h3>
          <p className="text-3xl font-bold text-text-primary">R$ {balances.general.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Landmark strokeWidth={1.5} className="text-green-400 w-6 h-6" />
            </div>
            <span className="text-[10px] text-green-400 border border-green-500/30 px-2 py-0.5 rounded">Solidário</span>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">Caixa de Beneficência</h3>
          <p className="text-3xl font-bold text-text-primary">R$ {balances.charity.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <Receipt strokeWidth={1.5} className="text-red-400 w-6 h-6" />
            </div>
            <span className="text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5 rounded">A Receber</span>
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">Mensalidades em Aberto</h3>
          <p className="text-3xl font-bold text-text-primary">R$ 600,00</p>
        </GlassCard>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 mb-6 border-b border-glass-border pb-px">
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'cashflow' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Fluxo de Caixa (Lançamentos)
        </button>
        <button
          onClick={() => setActiveTab('specialboxes')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'specialboxes' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Caixas Especiais
        </button>
        <button
          onClick={() => setActiveTab('dues')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'dues' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Saldo por Pessoa
        </button>
      </div>

      {/* Tab Fluxo de Caixa */}
      {activeTab === 'cashflow' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5">
              <div className="modern-input-container">
                <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar lançamento por descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="modern-input"
                />
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-gold" />
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="modern-input"
                  style={{ paddingLeft: '16px' }}
                >
                  <option value="Todos">Todas Categorias</option>
                  <option value="Mensalidade">Mensalidade</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Beneficência">Beneficência</option>
                  <option value="Insumos">Insumos</option>
                </select>
              </div>
            </div>

            <div className="col-span-4 flex justify-end">
              <button
                onClick={() => setIsTxModalOpen(true)}
                className="modern-button bg-accent-gold/20 text-accent-gold border-accent-gold"
              >
                <Plus className="w-4 h-4" />
                Novo Lançamento
              </button>
            </div>
          </div>

          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Data</th>
                    <th className="py-4 px-6 font-semibold">Descrição</th>
                    <th className="py-4 px-6 font-semibold">Categoria</th>
                    <th className="py-4 px-6 font-semibold">Caixa/Destino</th>
                    <th className="py-4 px-6 font-semibold">Tipo</th>
                    <th className="py-4 px-6 font-semibold text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxs.map((tx) => (
                    <tr key={tx.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-medium text-text-secondary">{tx.data.split('-').reverse().join('/')}</td>
                      <td className="py-4 px-6 font-bold text-white">{tx.descricao}</td>
                      <td className="py-4 px-6 text-text-secondary">
                        <span className="bg-white/5 border border-glass-border px-2 py-0.5 rounded text-[10px]">
                          {tx.categoria}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-text-secondary font-medium">{tx.caixa}</td>
                      <td className="py-4 px-6">
                        <span className={`flex items-center gap-1 text-xs font-semibold ${
                          tx.tipo === 'Receita' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.tipo === 'Receita' ? (
                            <>
                              <ArrowUpCircle className="w-4 h-4" /> Receita
                            </>
                          ) : (
                            <>
                              <ArrowDownCircle className="w-4 h-4" /> Despesa
                            </>
                          )}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right font-bold ${
                        tx.tipo === 'Receita' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.tipo === 'Receita' ? '+' : '-'} R$ {tx.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {filteredTxs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-text-secondary">Nenhum lançamento financeiro encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab Caixas Especiais */}
      {activeTab === 'specialboxes' && (
        <div className="grid grid-cols-3 gap-6">
          <GlassCard style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(212, 175, 55, 0.05) 100%)' }}>
            <h3 className="text-xl text-accent-gold mb-2 font-display">Caixa Geral</h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Caixa principal da Loja. Gerencia o fluxo operacional e de manutenção regular da oficina (energia, aluguel, insumos e eventos).
            </p>
            <div className="border-t border-glass-border/30 pt-4 flex justify-between items-baseline">
              <span className="text-xs text-text-secondary uppercase">Saldo Disponível</span>
              <span className="text-2xl font-bold text-white">R$ {balances.general.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </GlassCard>

          <GlassCard style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(34, 197, 94, 0.05) 100%)' }}>
            <h3 className="text-xl text-green-400 mb-2 font-display">Tronco de Beneficência</h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Fundo sagrado alimentado em todas as sessões ordinárias. Destinado estritamente a auxílio mútuo, filantropia e apoio social a necessitados.
            </p>
            <div className="border-t border-glass-border/30 pt-4 flex justify-between items-baseline">
              <span className="text-xs text-text-secondary uppercase">Saldo Disponível</span>
              <span className="text-2xl font-bold text-white">R$ {balances.charity.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </GlassCard>

          <GlassCard style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
            <h3 className="text-xl text-blue-400 mb-2 font-display">Caixa de Eventos</h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Fundo gerido para banquetes rituais (Ágapes), festividades internas, comemorações da administração e recepção de delegações externas.
            </p>
            <div className="border-t border-glass-border/30 pt-4 flex justify-between items-baseline">
              <span className="text-xs text-text-secondary uppercase">Saldo Disponível</span>
              <span className="text-2xl font-bold text-white">R$ {balances.events.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab Saldo por Pessoa */}
      {activeTab === 'dues' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h3 className="text-2xl text-accent-gold">Situação das Mensalidades</h3>
            <span className="text-xs text-text-secondary">Exibindo débitos pendentes de metais (mensalidades) da oficina.</span>
          </div>

          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">CIM</th>
                    <th className="py-4 px-6 font-semibold">Nome</th>
                    <th className="py-4 px-6 font-semibold">Grau</th>
                    <th className="py-4 px-6 font-semibold">Último Vencimento / Ref</th>
                    <th className="py-4 px-6 font-semibold">Situação</th>
                    <th className="py-4 px-6 font-semibold text-right">Saldo Devedor</th>
                    <th className="py-4 px-6 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const finance = getMemberTreasuryStatus(member.id);
                    return (
                      <tr key={member.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-mono text-text-secondary">{member.cim || 'N/C'}</td>
                        <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                          <img src={member.foto} alt="" className="rounded-full border border-glass-border" style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', objectFit: 'cover' }} />
                          {member.nome}
                        </td>
                        <td className="py-4 px-6 text-accent-gold font-medium">{member.grau}</td>
                        <td className="py-4 px-6 text-text-secondary">{finance.vencimento}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            finance.status === 'Pago' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            finance.status === 'Em Aberto' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {finance.status}
                          </span>
                        </td>
                        <td className={`py-4 px-6 text-right font-bold ${
                          finance.valor === 0 ? 'text-text-secondary' : 'text-red-400'
                        }`}>
                          R$ {finance.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => alert(`Recibo emitido com sucesso para o irmão ${member.nome}!`)}
                            className="modern-button ml-auto px-3 py-1.5 text-xs text-accent-gold border-accent-gold/40 bg-accent-gold/5"
                          >
                            Recibo
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Transaction Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 bg-black-90 backdrop-blur-md flex items-center justify-center p-4 z-modal">
          <div className="bg-bg-secondary border border-glass-border max-w-lg w-full rounded-2xl p-6 shadow-2xl animate-fade-in relative">
            <h3 className="text-2xl text-accent-gold mb-6 font-display font-bold">Novo Lançamento Financeiro</h3>
            <form onSubmit={handleAddTx} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pagamento de energia do Templo"
                  value={newTx.descricao}
                  onChange={(e) => setNewTx({...newTx, descricao: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newTx.valor}
                    onChange={(e) => setNewTx({...newTx, valor: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Tipo de Lançamento</label>
                  <select
                    value={newTx.tipo}
                    onChange={(e) => setNewTx({...newTx, tipo: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  >
                    <option value="Receita">Receita (Entrada)</option>
                    <option value="Despesa">Despesa (Saída)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Categoria</label>
                  <select
                    value={newTx.categoria}
                    onChange={(e) => setNewTx({...newTx, categoria: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  >
                    <option value="Mensalidade">Mensalidade</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Beneficência">Beneficência</option>
                    <option value="Insumos">Insumos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Caixa Destinatário</label>
                  <select
                    value={newTx.caixa}
                    onChange={(e) => setNewTx({...newTx, caixa: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  >
                    <option value="Caixa Geral">Caixa Geral</option>
                    <option value="Tronco de Beneficência">Tronco de Beneficência</option>
                    <option value="Caixa de Eventos">Caixa de Eventos</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Data do Lançamento</label>
                <input
                  type="date"
                  required
                  value={newTx.data}
                  onChange={(e) => setNewTx({...newTx, data: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px' }}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="modern-button border-white/10 text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modern-button bg-accent-gold/20 text-accent-gold border-accent-gold"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Treasury;
