import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  Mail, 
  HardDrive, 
  Check, 
  AlertCircle, 
  Clock, 
  FileText, 
  Building,
  Save
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('lodge');
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  
  // Tenant Database State
  const [tenant, setTenant] = useState({
    nome: '',
    numero: '',
    subdominio: '',
    cnpj: '',
    potencia: '',
    rito: '',
    oriente: '',
    uf: '',
    statusAssinatura: 'TRIAL',
    vencimentoAssinatura: '',
    maxMembros: 50,
    membersCount: 0
  });

  // Notificações / E-mail Local State
  const [emailSettings, setEmailSettings] = useState({
    notificarSessoes: true,
    lembreteMensalidades: true,
    notificarCandidatos: false,
    resumoChancelaria: true
  });

  // SaaS Mock Invoices
  const invoices = [
    { id: "INV-2026-004", data: "10/05/2026", valor: 149.90, metodo: "Pix", status: "Pago" },
    { id: "INV-2026-003", data: "10/04/2026", valor: 149.90, metodo: "Pix", status: "Pago" },
    { id: "INV-2026-002", data: "10/03/2026", valor: 149.90, metodo: "Cartão de Crédito", status: "Pago" },
    { id: "INV-2026-001", data: "10/02/2026", valor: 149.90, metodo: "Cartão de Crédito", status: "Pago" }
  ];

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await fetch('/api/tenant');
        if (res.ok) {
          const data = await res.json();
          setTenant({
            ...data,
            cnpj: data.cnpj || '',
            potencia: data.potencia || 'Grande Oriente do Brasil',
            rito: data.rito || 'REAA',
            oriente: data.oriente || 'Brasília',
            uf: data.uf || 'DF',
            vencimentoAssinatura: data.vencimentoAssinatura || '10/06/2026'
          });
        }
      } catch (err) {
        console.error('Erro ao buscar dados do tenant:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, []);

  const handleSaveLodge = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError(false);
    try {
      const res = await fetch('/api/tenant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenant)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(true);
      }
    } catch (err) {
      console.error(err);
      setSaveError(true);
    }
  };

  const handleToggleEmail = (key) => {
    setEmailSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-accent-gold animate-pulse text-xl">Carregando Configurações do SisOriente...</div>
      </div>
    );
  }

  // Member limit calculation
  const memberPercentage = Math.min((tenant.membersCount / tenant.maxMembros) * 100, 100);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-4xl mb-2 masonic-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>Configurações da Loja</h2>
        <p className="text-text-secondary">Gerencie o perfil da oficina, preferências do sistema, faturamento SaaS e armazenamento em nuvem.</p>
      </div>

      {/* Subscription Alert Card for Trials */}
      {tenant.statusAssinatura === 'TRIAL' && (
        <div className="mb-6 p-4 bg-accent-gold/10 border border-accent-gold/30 rounded-2xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-accent-gold w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-white font-bold text-sm">Período de Demonstração Ativo (Trial)</p>
              <p className="text-xs text-text-secondary">Sua oficina está rodando no modo de avaliação segura. Vence em: <span className="text-accent-gold font-bold">{tenant.vencimentoAssinatura}</span>.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('billing')}
            className="modern-button bg-accent-gold text-black border-accent-gold hover:bg-accent-gold/80 text-xs px-4 py-2 font-bold"
          >
            Assinar Plano Profissional
          </button>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex gap-4 mb-6 border-b border-glass-border pb-px">
        <button
          onClick={() => setActiveTab('lodge')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'lodge' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          Perfil da Oficina
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'billing' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Assinatura & Faturamento
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'notifications' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          Notificações e E-mail
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'cloud' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          Arquivos na Nuvem
        </button>
      </div>

      {/* Tab: Perfil da Oficina */}
      {activeTab === 'lodge' && (
        <form onSubmit={handleSaveLodge} className="flex flex-col gap-6 max-w-4xl">
          <GlassCard>
            <div className="flex items-center gap-2 mb-6 border-b border-glass-border/30 pb-3">
              <SettingsIcon className="w-5 h-5 text-accent-gold" />
              <h3 className="text-lg text-white font-semibold">Identificação Administrativa</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Nome Oficial da Loja</label>
                <input
                  type="text"
                  required
                  value={tenant.nome}
                  onChange={(e) => setTenant({...tenant, nome: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Número da Loja</label>
                  <input
                    type="text"
                    required
                    value={tenant.numero}
                    onChange={(e) => setTenant({...tenant, numero: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Subdomínio SaaS</label>
                  <input
                    type="text"
                    disabled
                    value={tenant.subdominio}
                    className="modern-input bg-white/5 opacity-60 cursor-not-allowed"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">CNPJ</label>
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={tenant.cnpj}
                  onChange={(e) => setTenant({...tenant, cnpj: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Rito Praticado</label>
                <select
                  value={tenant.rito}
                  onChange={(e) => setTenant({...tenant, rito: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px' }}
                >
                  <option value="REAA">Rito Escocês Antigo e Aceito (REAA)</option>
                  <option value="Rito de York">Rito de York</option>
                  <option value="Rito Adonhiramita">Rito Adonhiramita</option>
                  <option value="Rito Moderno">Rito Moderno</option>
                  <option value="Rito Brasileiro">Rito Brasileiro</option>
                  <option value="Rito Schröder">Rito Schröder</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs text-text-secondary">Potência Maçônica</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Grande Oriente do Brasil (GOB)"
                  value={tenant.potencia}
                  onChange={(e) => setTenant({...tenant, potencia: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Oriente (Cidade)</label>
                  <input
                    type="text"
                    required
                    value={tenant.oriente}
                    onChange={(e) => setTenant({...tenant, oriente: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">UF (Estado)</label>
                  <input
                    type="text"
                    required
                    maxLength="2"
                    value={tenant.uf}
                    onChange={(e) => setTenant({...tenant, uf: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px' }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-end gap-3 items-center">
            {saveSuccess && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <Check className="w-4 h-4" /> Configurações salvas com sucesso!
              </span>
            )}
            {saveError && (
              <span className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Erro ao salvar configurações.
              </span>
            )}
            <button
              type="submit"
              className="modern-button bg-accent-gold text-black border-accent-gold hover:bg-accent-gold/80 px-6 py-2.5 font-bold"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </form>
      )}

      {/* Tab: Assinatura e Faturamento */}
      {activeTab === 'billing' && (
        <div className="flex flex-col gap-6 max-w-5xl">
          <div className="grid grid-cols-3 gap-6">
            <GlassCard className="col-span-2">
              <div className="flex items-center gap-2 mb-6 border-b border-glass-border/30 pb-3">
                <ShieldCheck className="w-5 h-5 text-accent-gold" />
                <h3 className="text-lg text-white font-semibold">Plano de Assinatura Ativo</h3>
              </div>

              <div className="flex items-start justify-between flex-wrap gap-6 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-accent-gold tracking-wider border border-accent-gold/30 px-2.5 py-0.5 rounded bg-accent-gold/5">
                    Plano Standard - Anual
                  </span>
                  <h4 className="text-3xl text-white font-bold mt-2">R$ 149,90 / mês</h4>
                  <p className="text-xs text-text-secondary mt-1">Cobrado anualmente no valor total de R$ 1.798,80.</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-secondary block">Status de Faturamento</span>
                  <span className="text-xl font-bold text-green-400 uppercase flex items-center gap-1.5 justify-end mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    Ativo (Em Dia)
                  </span>
                </div>
              </div>

              {/* Members Limit Progress Gauge */}
              <div className="p-4 bg-white/5 border border-glass-border rounded-xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-secondary uppercase font-semibold flex items-center gap-1">
                    <Users className="w-4 h-4 text-accent-gold" /> Capacidade do Quadro de Irmãos
                  </span>
                  <span className="text-xs text-white font-bold">{tenant.membersCount} de {tenant.maxMembros} Membros ({memberPercentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-black/45 h-3 rounded-full overflow-hidden border border-glass-border">
                  <div 
                    className="h-full bg-accent-gold rounded-full transition-all duration-500" 
                    style={{ width: `${memberPercentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-text-secondary mt-2">Precisa de espaço para mais Irmãos? Faça o upgrade para o plano Master (Membros Ilimitados).</p>
              </div>

              <div className="flex justify-between items-center text-xs text-text-secondary pt-3 border-t border-glass-border/30">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-gold" />
                  Próxima Cobrança: <span className="text-white font-bold">{tenant.vencimentoAssinatura}</span>
                </div>
                <button className="text-accent-gold hover:underline font-bold">Alterar Forma de Pagamento</button>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg text-white mb-2 font-display">Benefícios do Plano</h3>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                Seu plano atual dá acesso completo a todas as ferramentas essenciais de secretaria, chancelaria e tesouraria.
              </p>
              <div className="flex flex-col gap-3.5 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-gold flex-shrink-0" />
                  <span>Isolamento Seguro Multi-Tenant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-gold flex-shrink-0" />
                  <span>Secretaria (Atas, Balaústres, Membros)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-gold flex-shrink-0" />
                  <span>Chancelaria (Frequências, Visitantes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-gold flex-shrink-0" />
                  <span>Tesouraria (Caixas Especiais, Dues)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-gold flex-shrink-0" />
                  <span>Backup de Banco no Supabase</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg text-white font-semibold">Histórico de Cobrança (Faturas SisOriente)</h3>
              <span className="text-xs text-text-secondary">Consulte e faça o download de comprovantes de pagamento do portal.</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">ID da Fatura</th>
                    <th className="py-4 px-6 font-semibold">Data do Pagamento</th>
                    <th className="py-4 px-6 font-semibold">Método</th>
                    <th className="py-4 px-6 font-semibold">Situação</th>
                    <th className="py-4 px-6 font-semibold text-right">Valor</th>
                    <th className="py-4 px-6 font-semibold text-right">Comprovante</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-mono text-text-secondary">{inv.id}</td>
                      <td className="py-4 px-6 font-medium text-white">{inv.data}</td>
                      <td className="py-4 px-6 text-text-secondary">{inv.metodo}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-wider">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-white">
                        R$ {inv.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-accent-gold hover:underline font-bold text-xs flex items-center gap-1 ml-auto">
                          <FileText className="w-3.5 h-3.5" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab: Notificações e E-mail */}
      {activeTab === 'notifications' && (
        <GlassCard className="max-w-4xl">
          <div className="flex items-center gap-2 mb-6 border-b border-glass-border/30 pb-3">
            <Mail className="w-5 h-5 text-accent-gold" />
            <h3 className="text-lg text-white font-semibold">Notificações por E-mail</h3>
          </div>
          <p className="text-xs text-text-secondary mb-6">Defina quais e-mails automáticos devem ser disparados pelo SisOriente para os Irmãos da oficina.</p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-glass-border/30 rounded-xl hover:border-accent-gold/20 transition-all">
              <div>
                <h4 className="text-white font-bold text-sm">Disparar Lembrete de Sessões</h4>
                <p className="text-xs text-text-secondary mt-0.5">Envia um e-mail com a pauta e horário de todas as novas sessões agendadas na secretaria.</p>
              </div>
              <button 
                onClick={() => handleToggleEmail('notificarSessoes')}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${emailSettings.notificarSessoes ? 'bg-accent-gold' : 'bg-black/40 border border-glass-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${emailSettings.notificarSessoes ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-glass-border/30 rounded-xl hover:border-accent-gold/20 transition-all">
              <div>
                <h4 className="text-white font-bold text-sm">Avisar Atraso de Metais (Mensalidades)</h4>
                <p className="text-xs text-text-secondary mt-0.5">Dispara alertas de cobrança e lembretes amigáveis de mensalidades pendentes para os Irmãos em débito.</p>
              </div>
              <button 
                onClick={() => handleToggleEmail('lembreteMensalidades')}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${emailSettings.lembreteMensalidades ? 'bg-accent-gold' : 'bg-black/40 border border-glass-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${emailSettings.lembreteMensalidades ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-glass-border/30 rounded-xl hover:border-accent-gold/20 transition-all">
              <div>
                <h4 className="text-white font-bold text-sm">Alertas de Sindicância de Candidatos</h4>
                <p className="text-xs text-text-secondary mt-0.5">Notifica a comissão de sindicância quando um novo profano avança no pipeline de escrutínio.</p>
              </div>
              <button 
                onClick={() => handleToggleEmail('notificarCandidatos')}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${emailSettings.notificarCandidatos ? 'bg-accent-gold' : 'bg-black/40 border border-glass-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${emailSettings.notificarCandidatos ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-glass-border/30 rounded-xl hover:border-accent-gold/20 transition-all">
              <div>
                <h4 className="text-white font-bold text-sm">Envio de Atas Resumidas</h4>
                <p className="text-xs text-text-secondary mt-0.5">Envia a cópia assinada do Balaústre (ata) para os Irmãos da Loja ao final de cada Sessão Ordinária.</p>
              </div>
              <button 
                onClick={() => handleToggleEmail('resumoChancelaria')}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${emailSettings.resumoChancelaria ? 'bg-accent-gold' : 'bg-black/40 border border-glass-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${emailSettings.resumoChancelaria ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Tab: Arquivos na Nuvem */}
      {activeTab === 'cloud' && (
        <div className="grid grid-cols-3 gap-6 max-w-5xl">
          <GlassCard className="col-span-2">
            <div className="flex items-center gap-2 mb-6 border-b border-glass-border/30 pb-3">
              <HardDrive className="w-5 h-5 text-accent-gold" />
              <h3 className="text-lg text-white font-semibold">Uso do Disco na Nuvem (Drive SisOriente)</h3>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-text-secondary font-semibold">Armazenamento Utilizado</span>
              <span className="text-xs text-white font-bold">1.24 GB de 10.00 GB (12.4%)</span>
            </div>
            <div className="w-full bg-black/45 h-3 rounded-full overflow-hidden border border-glass-border mb-6">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: '12.4%' }}
              />
            </div>

            <div className="border-t border-glass-border/30 pt-6">
              <h4 className="text-sm font-semibold text-white mb-4">Mapeamento de Arquivos por Tipo</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/5 border border-glass-border rounded-xl">
                  <FileText className="w-6 h-6 text-accent-gold mx-auto mb-2" />
                  <span className="text-xs text-text-secondary block">Atas e Balaústres</span>
                  <span className="text-lg font-bold text-white mt-1 block">420 MB</span>
                </div>
                <div className="p-4 bg-white/5 border border-glass-border rounded-xl">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <span className="text-xs text-text-secondary block">Fotos de Membros</span>
                  <span className="text-lg font-bold text-white mt-1 block">180 MB</span>
                </div>
                <div className="p-4 bg-white/5 border border-glass-border rounded-xl">
                  <Building className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <span className="text-xs text-text-secondary block">Ficheiro e Sindicâncias</span>
                  <span className="text-lg font-bold text-white mt-1 block">640 MB</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg text-white mb-2 font-display">Limpeza e Otimização</h3>
            <p className="text-xs text-text-secondary mb-6 leading-relaxed">
              Todos os seus anexos de atas e formulários de cadastro de profanos são otimizados de forma automática no bucket de armazenamento para economizar seu espaço.
            </p>
            <div className="border-t border-glass-border/30 pt-4 flex flex-col gap-3">
              <span className="text-[10px] text-text-secondary uppercase">Backup Automático</span>
              <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Diário Ativado (03:00)
              </span>
              <button className="modern-button text-xs py-2 mt-2 w-full text-accent-gold border-accent-gold/40 hover:bg-accent-gold/5">
                Executar Backup Manual
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Settings;
