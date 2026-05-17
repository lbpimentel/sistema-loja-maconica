import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { User, Award, Shield, FileText, Phone, Briefcase, Heart, Calendar } from 'lucide-react';
import { mockMembers } from '../data/mockData';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Individual Mock Dues Statement
  const mockPayments = [
    { id: 1, ref: "Maio/2026", valor: 150.00, dataPagto: "2026-05-10", status: "Pago", recibo: "REC-2026-981" },
    { id: 2, ref: "Abril/2026", valor: 150.00, dataPagto: "2026-04-09", status: "Pago", recibo: "REC-2026-802" },
    { id: 3, ref: "Março/2026", valor: 150.00, dataPagto: "2026-03-05", status: "Pago", recibo: "REC-2026-621" },
    { id: 4, ref: "Fevereiro/2026", valor: 150.00, dataPagto: "2026-02-08", status: "Pago", recibo: "REC-2026-403" }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/members');
        if (res.ok) {
          const data = await res.json();
          // Simulating that the logged-in user is Leandro Bessa (first member)
          setMember(data[0] || mockMembers[0]);
        } else {
          throw new Error('Fallback');
        }
      } catch (err) {
        setMember(mockMembers[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !member) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-accent-gold animate-pulse text-xl">Carregando Perfil do Irmão...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Banner / Card superior */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-6 flex-wrap md:flex-nowrap">
          <img 
            src={member.foto} 
            alt={member.nome} 
            className="rounded-full border-2 border-accent-gold p-1 bg-bg-secondary" 
            style={{ width: '112px', height: '112px', minWidth: '112px', minHeight: '112px', objectFit: 'cover' }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl text-white font-display font-bold leading-tight">{member.nome}</h2>
              <span className="bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {member.grau}
              </span>
            </div>
            <p className="text-text-secondary text-sm font-medium mt-1">
              Cargo na Oficina: <span className="text-white font-semibold">{member.cargoLoja || 'Irmão'}</span>
            </p>
            <div className="flex gap-6 mt-4 text-xs text-text-secondary flex-wrap">
              <div>CIM: <span className="text-white font-mono">{member.cim || '123456'}</span></div>
              <div>Situação: <span className="text-green-400 font-bold uppercase">Ativo</span></div>
              <div>Frequência: <span className="text-accent-gold font-bold">{member.frequencia || '96.6'}%</span></div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tabs Menu */}
      <div className="flex gap-4 mb-6 border-b border-glass-border pb-px">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'personal' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Dados Pessoais
        </button>
        <button
          onClick={() => setActiveTab('masonic')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'masonic' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          Histórico Maçônico
        </button>
        <button
          onClick={() => setActiveTab('statement')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'statement' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Meu Extrato (Mensalidades)
        </button>
      </div>

      {/* Tab Dados Pessoais */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-2 gap-6">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4 border-b border-glass-border/30 pb-3">
              <Phone className="w-5 h-5 text-accent-gold" />
              <h3 className="text-lg text-white font-semibold">Contato e Identificação</h3>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between py-1 border-b border-glass-border/10">
                <span className="text-text-secondary">Data de Nascimento:</span>
                <span className="text-white font-medium">{member.nascimento ? member.nascimento.split('-').reverse().join('/') : 'N/C'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-glass-border/10">
                <span className="text-text-secondary">CPF:</span>
                <span className="text-white font-mono">{member.cpf || 'N/C'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-glass-border/10">
                <span className="text-text-secondary">RG:</span>
                <span className="text-white font-mono">{member.rg || 'N/C'} ({member.orgaoExpedidorRg || 'SSP'})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-glass-border/10">
                <span className="text-text-secondary">Tipo Sanguíneo:</span>
                <span className="text-white font-medium">{member.sangue} {member.rh === 'Positivo' ? '+' : '-'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-glass-border/10">
                <span className="text-text-secondary">Celular:</span>
                <span className="text-white font-medium">{member.celular || 'N/C'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Endereço Residencial:</span>
                <span className="text-white text-right max-w-[240px] leading-snug">{member.endereco}, {member.bairro} - {member.cidade}/{member.estado}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 mb-4 border-b border-glass-border/30 pb-3">
              <Briefcase className="w-5 h-5 text-accent-gold" />
              <h3 className="text-lg text-white font-semibold">Informação Profissional</h3>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between py-1 border-b border-glass-border/10">
                <span className="text-text-secondary">Profissão:</span>
                <span className="text-white font-medium">{member.profissao || 'N/C'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-glass-border/10">
                <span className="text-text-secondary">Empresa:</span>
                <span className="text-white font-medium">{member.empresa || 'N/C'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-glass-border/10">
                <span className="text-text-secondary">Cargo:</span>
                <span className="text-white font-medium">{member.cargoTrabalho || 'N/C'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Endereço Comercial:</span>
                <span className="text-white text-right max-w-[240px] leading-snug">{member.enderecoTrabalho || 'N/C'}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab Histórico Maçônico */}
      {activeTab === 'masonic' && (
        <div className="grid grid-cols-1 gap-6">
          <GlassCard>
            <div className="flex items-center gap-2 mb-6 border-b border-glass-border/30 pb-3">
              <Shield className="w-5 h-5 text-accent-gold" />
              <h3 className="text-lg text-white font-semibold">Datas de Graus & Regularizações</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-white/5 border border-glass-border rounded-xl">
                <h4 className="text-accent-gold font-bold text-lg mb-1">Iniciação</h4>
                <p className="text-2xl text-white font-display font-semibold mt-1">
                  {member.iniciacaoData ? member.iniciacaoData.split('-').reverse().join('/') : 'N/C'}
                </p>
                <span className="text-[10px] text-text-secondary uppercase mt-2 block">Loja: {member.iniciacaoLoja || 'N/C'}</span>
              </div>

              <div className="p-4 bg-white/5 border border-glass-border rounded-xl">
                <h4 className="text-accent-gold font-bold text-lg mb-1">Elevação</h4>
                <p className="text-2xl text-white font-display font-semibold mt-1">
                  {member.elevacaoData ? member.elevacaoData.split('-').reverse().join('/') : 'N/C'}
                </p>
                <span className="text-[10px] text-text-secondary uppercase mt-2 block">Loja: {member.elevacaoLoja || 'N/C'}</span>
              </div>

              <div className="p-4 bg-white/5 border border-glass-border rounded-xl">
                <h4 className="text-accent-gold font-bold text-lg mb-1">Exaltação</h4>
                <p className="text-2xl text-white font-display font-semibold mt-1">
                  {member.exaltacaoData ? member.exaltacaoData.split('-').reverse().join('/') : 'N/C'}
                </p>
                <span className="text-[10px] text-text-secondary uppercase mt-2 block">Loja: {member.exaltacaoLoja || 'N/C'}</span>
              </div>
            </div>

            {member.cargosExercidos && member.cargosExercidos.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4 border-b border-glass-border/30 pb-3">
                  <Calendar className="w-5 h-5 text-accent-gold" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Cargos Já Exercidos</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {member.cargosExercidos.map((c, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-glass-border/20 rounded-lg text-sm">
                      <span className="text-white font-bold">{c.cargo}</span>
                      <div className="text-xs text-text-secondary">
                        Gestão: <span className="text-white font-semibold">{c.gestao}</span> | Oriente: {c.oriente}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Tab Extrato Financeiro */}
      {activeTab === 'statement' && (
        <div className="flex flex-col gap-6">
          <GlassCard>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h3 className="text-xl text-white font-display">Extrato de Contribuições</h3>
                <p className="text-xs text-text-secondary mt-1">Demonstrativo das últimas mensalidades e taxas quitadas perante a tesouraria.</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-text-secondary uppercase block">Situação Financeira</span>
                <span className="text-lg font-bold text-green-400">EM DIA</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Referência</th>
                    <th className="py-4 px-6 font-semibold">Data do Pagamento</th>
                    <th className="py-4 px-6 font-semibold">Nº Recibo</th>
                    <th className="py-4 px-6 font-semibold">Situação</th>
                    <th className="py-4 px-6 font-semibold text-right">Valor Quitado</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((p) => (
                    <tr key={p.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">{p.ref}</td>
                      <td className="py-4 px-6 font-medium text-text-secondary">{p.dataPagto.split('-').reverse().join('/')}</td>
                      <td className="py-4 px-6 font-mono text-accent-gold">{p.recibo}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-wider">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-green-400">
                        R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Profile;
