import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Shield, Users, Award, Calendar, Plus, Briefcase, Search, Star, Heart } from 'lucide-react';
import { mockMembers } from '../data/mockData';

const Presidency = () => {
  const [activeTab, setActiveTab] = useState('committees');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Committees State
  const [committees, setCommittees] = useState([
    {
      id: 1,
      nome: "Comissão de Finanças",
      descricao: "Responsável pelo exame das contas da tesouraria, elaboração do orçamento anual e fiscalização da arrecadação.",
      presidente: "Leandro Bessa",
      membros: ["Carlos Andrade", "Fábio Guimarães"],
      cor: "border-blue-500/30"
    },
    {
      id: 2,
      nome: "Comissão de Beneficência",
      descricao: "Hospitalaria. Promove o auxílio moral e financeiro a Irmãos necessitados, viúvas, órfãos e coordena campanhas solidárias.",
      presidente: "Fábio Guimarães",
      membros: ["Leandro Bessa", "Roberto de Souza"],
      cor: "border-green-500/30"
    },
    {
      id: 3,
      nome: "Comissão de Justiça e Redação",
      descricao: "Avalia a legalidade dos atos administrativos, propõe reformas no regimento interno e emite pareceres jurídicos.",
      presidente: "Carlos Andrade",
      membros: ["Roberto de Souza"],
      cor: "border-red-500/30"
    },
    {
      id: 4,
      nome: "Comissão de Admissão e Graus",
      descricao: "Analisa os processos de sindicância de candidatos (profanos) e avalia o aproveitamento dos Irmãos para elevação e exaltação.",
      presidente: "Roberto de Souza",
      membros: ["Carlos Andrade", "Fábio Guimarães"],
      cor: "border-yellow-500/30"
    }
  ]);

  // Administrations/Venerable Gallery State
  const [administrations, setAdministrations] = useState([
    {
      id: 1,
      gestao: "Gestão 2024 - 2026",
      veneravel: "Leandro Bessa",
      primeiroVigilante: "Carlos Andrade",
      segundoVigilante: "Fábio Guimarães",
      secretario: "Roberto de Souza",
      tesoureiro: "João da Silva",
      status: "Gestão Atual",
      fotoVeneravel: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leandro"
    },
    {
      id: 2,
      gestao: "Gestão 2022 - 2024",
      veneravel: "Carlos Andrade",
      primeiroVigilante: "Leandro Bessa",
      segundoVigilante: "Roberto de Souza",
      secretario: "Fábio Guimarães",
      tesoureiro: "Antônio Mendes",
      status: "Gestão Passada",
      fotoVeneravel: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
    },
    {
      id: 3,
      gestao: "Gestão 2020 - 2022",
      veneravel: "ARLS Major Manoel Portugal (Fundador)",
      primeiroVigilante: "Carlos Andrade",
      segundoVigilante: "Leandro Bessa",
      secretario: "Roberto de Souza",
      tesoureiro: "João da Silva",
      status: "Histórico",
      fotoVeneravel: "https://api.dicebear.com/7.x/avataaars/svg?seed=Major"
    }
  ]);

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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-accent-gold animate-pulse text-xl">Carregando Módulo da Presidência...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-4xl mb-2 masonic-gradient-text">Presidência</h2>
        <p className="text-text-secondary">Administração estratégica da oficina, gestão de comissões fundamentais e galeria histórica.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 mb-6 border-b border-glass-border pb-px">
        <button
          onClick={() => setActiveTab('committees')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'committees' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Comissões da Loja
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'gallery' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          Galeria de Veneráveis & Gestões
        </button>
      </div>

      {/* Tab Comissões */}
      {activeTab === 'committees' && (
        <div className="grid grid-cols-2 gap-6">
          {committees.map((committee) => (
            <GlassCard key={committee.id} className={`border-l-4 ${committee.cor} hover:-translate-y-1 transition-all`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl text-white font-display font-semibold">{committee.nome}</h3>
                <span className="text-[10px] bg-white/5 border border-glass-border/40 px-2 py-0.5 rounded uppercase tracking-wider text-text-secondary">
                  Oficial
                </span>
              </div>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed min-h-12">
                {committee.descricao}
              </p>
              
              <div className="border-t border-glass-border/30 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary uppercase tracking-wider font-semibold">Presidente:</span>
                  <span className="text-accent-gold font-bold">{committee.presidente}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Membros da Comissão:</span>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {committee.membros.map((m, idx) => (
                      <span key={idx} className="bg-white/5 border border-glass-border px-2 py-1 rounded text-xs text-white">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Tab Galeria de Veneráveis */}
      {activeTab === 'gallery' && (
        <div className="flex flex-col gap-8 relative pl-6 border-l border-glass-border/40 ml-4 py-4">
          {administrations.map((admin, idx) => (
            <div key={admin.id} className="relative">
              {/* Timeline Point */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-accent-gold border-4 border-bg-primary shadow-[0_0_8px_var(--accent-gold-glow)]"></div>

              <GlassCard delay={idx * 0.1} className="relative overflow-hidden">
                {admin.status === 'Gestão Atual' && (
                  <div className="absolute top-0 right-0 bg-accent-gold text-bg-primary font-bold text-[9px] uppercase px-3 py-1 rounded-bl-xl tracking-widest shadow-md">
                    Atual
                  </div>
                )}
                
                <div className="grid grid-cols-12 gap-6 items-center">
                  <div className="col-span-3 flex flex-col items-center border-r border-glass-border/30 pr-6 text-center">
                    <img 
                      src={admin.fotoVeneravel} 
                      alt="" 
                      className="rounded-full border-2 border-accent-gold p-1 mb-3 bg-bg-secondary" 
                      style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px', objectFit: 'cover' }}
                    />
                    <h4 className="text-sm font-bold text-accent-gold uppercase tracking-wider">Venerável Mestre</h4>
                    <p className="text-lg font-bold text-white leading-tight mt-1">{admin.veneravel}</p>
                  </div>
                  
                  <div className="col-span-9 pl-6">
                    <div className="mb-4">
                      <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Período de Gestão</span>
                      <h3 className="text-2xl text-white font-display font-semibold mt-0.5">{admin.gestao}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 text-sm border-t border-glass-border/20 pt-4">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-text-secondary uppercase font-semibold">1º Vigilante:</span>
                        <span className="text-white font-medium">{admin.primeiroVigilante}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-text-secondary uppercase font-semibold">2º Vigilante:</span>
                        <span className="text-white font-medium">{admin.segundoVigilante}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-text-secondary uppercase font-semibold">Orador:</span>
                        <span className="text-white font-medium">Irmão Fiscalizador</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-text-secondary uppercase font-semibold">Secretário:</span>
                        <span className="text-white font-medium">{admin.secretario}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-text-secondary uppercase font-semibold">Tesoureiro:</span>
                        <span className="text-white font-medium">{admin.tesoureiro}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-text-secondary uppercase font-semibold">Chanceler:</span>
                        <span className="text-white font-medium">Chanceler Oficial</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Presidency;
