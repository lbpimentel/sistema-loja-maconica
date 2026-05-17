import React, { useState, useEffect } from 'react';
import { X, Save, User, Home, Award, Calendar, HelpCircle } from 'lucide-react';

const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2.5 border-b-2 -mb-px transition-all cursor-pointer whitespace-nowrap
      ${active ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-[#99907C] hover:text-white'}`}
  >
    <Icon className="w-4 h-4" strokeWidth={1.5} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const FormField = ({ label, name, value, onChange, type = "text", placeholder = "", width = "w-full", disabled = false }) => (
  <div className={`flex flex-col gap-1 mb-4 ${width}`}>
    <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`modern-input ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ paddingLeft: '12px' }}
    />
  </div>
);

const SectionTitle = ({ title }) => (
  <h3 className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest border-b border-[rgba(212,175,55,0.2)] pb-2 mb-4 mt-6">
    {title}
  </h3>
);

const CandidateForm = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    pai: '',
    mae: '',
    nascimento: '',
    idade: '',
    cpf: '',
    rg: '',
    estadoCivil: '',
    esposa: '',
    profissao: '',
    celular: '',
    email: '',
    
    // Residence
    endereco: '',
    numero: '',
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    telefone: '',
    
    // Work
    empresa: '',
    telefoneEmpresa: '',
    enderecoEmpresa: '',
    cidadeEmpresa: '',
    estadoEmpresa: '',
    bairroEmpresa: '',
    numeroEmpresa: '',
    cepEmpresa: '',
    
    // Conjugal / Family
    nascimentoConjuge: '',
    profissaoConjuge: '',
    cargoConjuge: '',
    funcaoConjuge: '',
    empresaConjuge: '',
    telefoneConjuge: '',
    dataCasamento: '',
    
    // Process & Status
    status: 'Em Andamento',
    livroNegro: '',
    filiacao: '',
    naturalidade: '',
    sangue: '',
    rh: '',
    
    // Ballots
    brancas1: '',
    pretas1: '',
    brancas2: '',
    pretas2: '',
    brancas3: '',
    pretas3: '',
    
    // Dates & Balaustres
    dataProposta: '',
    dataSindicancia: '',
    dataEscrutinio: '',
    dataIniciacao: '',
    
    balaustreProposta: '',
    balaustreSindicancia: '',
    balaustreEscrutinio: '',
    balaustreIniciacao: '',
    
    observacoes: '',
    ...candidate
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSave = async () => {
    if (!formData.nome) {
      alert('O campo Nome é obrigatório!');
      return;
    }

    try {
      const url = candidate ? `/api/candidates/${candidate.id}` : '/api/candidates';
      const method = candidate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar no servidor');
      }
      
      alert('Cadastro do candidato salvo com sucesso!');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar: verifique se o backend está rodando.');
    }
  };

  const fetchAddressByCep = async (cep, type) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          if (type === 'residencia') {
            setFormData(prev => ({
              ...prev,
              endereco: data.logradouro || prev.endereco,
              bairro: data.bairro || prev.bairro,
              cidade: data.localidade || prev.cidade,
              estado: data.uf || prev.estado
            }));
          } else if (type === 'trabalho') {
            setFormData(prev => ({
              ...prev,
              enderecoEmpresa: data.logradouro || prev.enderecoEmpresa,
              bairroEmpresa: data.bairro || prev.bairroEmpresa,
              cidadeEmpresa: data.localidade || prev.cidadeEmpresa,
              estadoEmpresa: data.uf || prev.estadoEmpresa
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });

    if (name === 'cep' && value.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(value, 'residencia');
    } else if (name === 'cepEmpresa' && value.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(value, 'trabalho');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-modal flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0" style={{ padding: 0 }}>
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-[rgba(212,175,55,0.15)] flex justify-between items-center bg-[#131316]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
              <User className="text-[#D4AF37] w-6 h-6" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl text-white font-bold tracking-wide">
                {candidate ? 'Editar Candidato (Profano)' : 'Novo Candidato (Profano)'}
              </h2>
              <p className="text-xs text-[#99907C]">Preencha as informações detalhadas para a sindicância.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="action-icon-button"
            style={{ cursor: 'pointer' }}
          >
            <X className="w-5 h-5 text-red-400 hover:text-red-300" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-shrink-0 flex pt-4 pb-0.5 items-end px-6 bg-[#131316]/50 border-b border-[rgba(212,175,55,0.15)] overflow-x-auto hide-scrollbar">
          <TabButton id="personal" label="Dados Pessoais" icon={User} active={activeTab === 'personal'} onClick={setActiveTab} />
          <TabButton id="residence" label="Residência & Trabalho" icon={Home} active={activeTab === 'residence'} onClick={setActiveTab} />
          <TabButton id="ballot" label="Sindicância & Votos" icon={Award} active={activeTab === 'ballot'} onClick={setActiveTab} />
          <TabButton id="process" label="Datas & Status" icon={Calendar} active={activeTab === 'process'} onClick={setActiveTab} />
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#131316]/50">
          {activeTab === 'personal' && (
            <div className="animate-fadeIn">
              <SectionTitle title="Informações Pessoais Básicas" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="Nome Completo *" name="nome" value={formData.nome} onChange={handleChange} width="md:col-span-2" />
                <FormField label="Data de Nascimento" name="nascimento" value={formData.nascimento} onChange={handleChange} placeholder="DD/MM/AAAA" />
                <FormField label="Idade" name="idade" value={formData.idade} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} />
                <FormField label="RG" name="rg" value={formData.rg} onChange={handleChange} />
                <FormField label="Naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} />
                <FormField label="Estado Civil" name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Celular / WhatsApp" name="celular" value={formData.celular} onChange={handleChange} />
                <FormField label="E-mail" name="email" value={formData.email} onChange={handleChange} />
                <FormField label="Profissão" name="profissao" value={formData.profissao} onChange={handleChange} />
              </div>

              <SectionTitle title="Filiação & Casamento" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome do Pai" name="pai" value={formData.pai} onChange={handleChange} />
                <FormField label="Nome da Mãe" name="mae" value={formData.mae} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="Nome da Esposa (Conjuge)" name="esposa" value={formData.esposa} onChange={handleChange} width="md:col-span-2" />
                <FormField label="Nascimento Cônjuge" name="nascimentoConjuge" value={formData.nascimentoConjuge} onChange={handleChange} placeholder="DD/MM/AAAA" />
                <FormField label="Data de Casamento" name="dataCasamento" value={formData.dataCasamento} onChange={handleChange} placeholder="DD/MM/AAAA" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Profissão Cônjuge" name="profissaoConjuge" value={formData.profissaoConjuge} onChange={handleChange} />
                <FormField label="Telefone Cônjuge" name="telefoneConjuge" value={formData.telefoneConjuge} onChange={handleChange} />
                <FormField label="Empresa Cônjuge" name="empresaConjuge" value={formData.empresaConjuge} onChange={handleChange} />
              </div>

              <SectionTitle title="Ficha Médica" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="Tipo Sanguíneo" name="sangue" value={formData.sangue} onChange={handleChange} placeholder="A, B, AB, O" />
                <FormField label="Fator RH" name="rh" value={formData.rh} onChange={handleChange} placeholder="+, -" />
                <FormField label="Livro Negro" name="livroNegro" value={formData.livroNegro} onChange={handleChange} placeholder="Checado / Nada Consta" width="md:col-span-2" />
              </div>
            </div>
          )}

          {activeTab === 'residence' && (
            <div className="animate-fadeIn">
              <SectionTitle title="Endereço Residencial" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="CEP" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" />
                <FormField label="Endereço" name="endereco" value={formData.endereco} onChange={handleChange} width="md:col-span-2" />
                <FormField label="Número" name="numero" value={formData.numero} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
                <FormField label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} width="md:col-span-2" />
                <FormField label="Estado" name="estado" value={formData.estado} onChange={handleChange} placeholder="UF" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Telefone Fixo Residencial" name="telefone" value={formData.telefone} onChange={handleChange} />
              </div>

              <SectionTitle title="Endereço Profissional" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="Nome da Empresa" name="empresa" value={formData.empresa} onChange={handleChange} width="md:col-span-2" />
                <FormField label="Telefone Comercial" name="telefoneEmpresa" value={formData.telefoneEmpresa} onChange={handleChange} />
                <FormField label="CEP Comercial" name="cepEmpresa" value={formData.cepEmpresa} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="Endereço Comercial" name="enderecoEmpresa" value={formData.enderecoEmpresa} onChange={handleChange} width="md:col-span-2" />
                <FormField label="Número Comercial" name="numeroEmpresa" value={formData.numeroEmpresa} onChange={handleChange} />
                <FormField label="Bairro Comercial" name="bairroEmpresa" value={formData.bairroEmpresa} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Cidade Comercial" name="cidadeEmpresa" value={formData.cidadeEmpresa} onChange={handleChange} width="md:col-span-2" />
                <FormField label="Estado Comercial" name="estadoEmpresa" value={formData.estadoEmpresa} onChange={handleChange} />
              </div>
            </div>
          )}

          {activeTab === 'ballot' && (
            <div className="animate-fadeIn">
              <SectionTitle title="Padrinhos & Indicantes" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Padrinho / Indicante (Filiação Maçônica)" name="filiacao" value={formData.filiacao} onChange={handleChange} placeholder="Nome do Ir. que indicou" />
                <FormField label="Código de Registro Legado" name="codigo" value={formData.codigo} onChange={handleChange} placeholder="Ex: 00123" />
              </div>

              <SectionTitle title="Escrutínio e Resultados dos Escrutínios" />
              <div className="bg-[#1b1b22] border border-white/5 rounded-xl p-6 mb-6">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-[#D4AF37]">1º Escrutínio (Primeiro Turno)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Esferas Brancas" name="brancas1" value={formData.brancas1} onChange={handleChange} placeholder="Qtde" />
                  <FormField label="Esferas Pretas" name="pretas1" value={formData.pretas1} onChange={handleChange} placeholder="Qtde" />
                </div>
              </div>

              <div className="bg-[#1b1b22] border border-white/5 rounded-xl p-6 mb-6">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-[#D4AF37]">2º Escrutínio (Segundo Turno)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Esferas Brancas" name="brancas2" value={formData.brancas2} onChange={handleChange} placeholder="Qtde" />
                  <FormField label="Esferas Pretas" name="pretas2" value={formData.pretas2} onChange={handleChange} placeholder="Qtde" />
                </div>
              </div>

              <div className="bg-[#1b1b22] border border-white/5 rounded-xl p-6">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-[#D4AF37]">3º Escrutínio (Terceiro Turno)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Esferas Brancas" name="brancas3" value={formData.brancas3} onChange={handleChange} placeholder="Qtde" />
                  <FormField label="Esferas Pretas" name="pretas3" value={formData.pretas3} onChange={handleChange} placeholder="Qtde" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="animate-fadeIn">
              <SectionTitle title="Status do Processo" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Status Atual</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="modern-input h-[42px] py-0 cursor-pointer"
                    style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Rejeitado">Rejeitado</option>
                    <option value="Arquivado">Arquivado</option>
                    <option value="Iniciado">Iniciado (Membro Ativo)</option>
                  </select>
                </div>
              </div>

              <SectionTitle title="Datas Importantes e Balaustres" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1b1b22] border border-white/5 rounded-xl p-4">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 text-[#D4AF37]">Apresentação da Proposta</h4>
                  <FormField label="Data da Proposta" name="dataProposta" value={formData.dataProposta} onChange={handleChange} placeholder="DD/MM/AAAA" />
                  <FormField label="Balaustre da Proposta" name="balaustreProposta" value={formData.balaustreProposta} onChange={handleChange} placeholder="Ata nº" />
                </div>

                <div className="bg-[#1b1b22] border border-white/5 rounded-xl p-4">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 text-[#D4AF37]">Sindicância</h4>
                  <FormField label="Data da Sindicância" name="dataSindicancia" value={formData.dataSindicancia} onChange={handleChange} placeholder="DD/MM/AAAA" />
                  <FormField label="Balaustre da Sindicância" name="balaustreSindicancia" value={formData.balaustreSindicancia} onChange={handleChange} placeholder="Ata nº" />
                </div>

                <div className="bg-[#1b1b22] border border-white/5 rounded-xl p-4">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 text-[#D4AF37]">Escrutínio</h4>
                  <FormField label="Data do Escrutínio" name="dataEscrutinio" value={formData.dataEscrutinio} onChange={handleChange} placeholder="DD/MM/AAAA" />
                  <FormField label="Balaustre do Escrutínio" name="balaustreEscrutinio" value={formData.balaustreEscrutinio} onChange={handleChange} placeholder="Ata nº" />
                </div>

                <div className="bg-[#1b1b22] border border-white/5 rounded-xl p-4">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 text-[#D4AF37]">Iniciação</h4>
                  <FormField label="Data da Iniciação" name="dataIniciacao" value={formData.dataIniciacao} onChange={handleChange} placeholder="DD/MM/AAAA" />
                  <FormField label="Balaustre da Iniciação" name="balaustreIniciacao" value={formData.balaustreIniciacao} onChange={handleChange} placeholder="Ata nº" />
                </div>
              </div>

              <SectionTitle title="Observações Gerais" />
              <div className="flex flex-col gap-1 mb-4 w-full">
                <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Histórico e Observações</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes || ''}
                  onChange={handleChange}
                  placeholder="Informações adicionais obtidas nas sindicâncias..."
                  className="modern-input min-h-[120px] p-3"
                  style={{ background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-[rgba(212,175,55,0.15)] flex justify-end gap-3 bg-[#131316]">
          <button 
            type="button" 
            onClick={onClose} 
            className="modern-button border-white/10 hover:bg-white/5 text-white"
            style={{ height: '42px', cursor: 'pointer' }}
          >
            <span>Cancelar</span>
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="modern-button"
            style={{ 
              background: 'var(--accent-gold)', 
              color: 'black', 
              height: '42px', 
              padding: '0 24px',
              cursor: 'pointer'
            }}
          >
            <Save className="w-4 h-4" />
            <span>Salvar Candidato</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;
