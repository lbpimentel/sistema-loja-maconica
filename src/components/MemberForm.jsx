import React, { useState, useEffect, useRef } from 'react';
import { X, Save, User, Home, Heart, Award, FileText, Plus, Trash2 } from 'lucide-react';

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

const FormField = ({ label, name, value, onChange, type = "text", placeholder = "", width = "w-full" }) => (
  <div className={`flex flex-col gap-1 mb-4 ${width}`}>
    <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="modern-input"
      style={{ paddingLeft: '12px' }}
    />
  </div>
);

const CheckboxField = ({ label, name, checked, onChange }) => (
  <div className="flex items-center gap-2 mb-4 mt-2">
    <input
      type="checkbox"
      name={name}
      checked={checked || false}
      onChange={onChange}
      className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
    />
    <label className="text-sm text-white cursor-pointer" onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked }})}>
      {label}
    </label>
  </div>
);

const SectionTitle = ({ title }) => (
  <h3 className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest border-b border-[rgba(212,175,55,0.2)] pb-2 mb-4 mt-6">
    {title}
  </h3>
);

const MemberForm = ({ member, onClose }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    // Basics
    codigo: '', cim: '', ime: '', nome: '', nascimento: '', estadoCivil: '', nacionalidade: '', ufNascimento: '', naturalidade: '', naturalizacao: '', religiao: '', grauInstrucao: '',
    cpf: '', rg: '', orgaoExpedidorRg: '', tituloEleitoral: '', zonaEleitoral: '', secaoEleitoral: '', 
    cidadeEleitoral: '', ufEleitoral: '', carteiraEstrangeiro: '', orgaoExpedidorEstrangeiro: '',
    sangue: '', rh: '', doadorOrgaos: false, reservista: '', nomePai: '', nomeMae: '', foto: '', idiomas: '', qrCode: '',
    // Residence
    endereco: '', numeroRes: '', complementoRes: '', bairro: '', cidade: '', estado: '', cep: '', 
    telefoneResidencial: '', celular: '', email: '', instagram: '', facebook: '', linkedin: '', correspondencia: '', caixaPostal: '', receberEmailsLoja: false,
    // Work
    empresa: '', enderecoTrabalho: '', numeroTrab: '', bairroTrabalho: '', cidadeTrabalho: '', estadoTrabalho: '', 
    telefoneComercial: '', profissao: '', cepTrabalho: '', cargoTrabalho: '', funcaoTrabalho: '',
    // Family
    conjugeNome: '', conjugeNascimento: '', dataCasamento: '', conjugeProfissao: '', conjugeCargo: '', 
    conjugeFuncao: '', conjugeEmpresa: '', conjugeTelefone: '', sangueConjuge: '', rhConjuge: '', doadorConjuge: false,
    filhos: [], lowtons: [], apjs: [],
    // Masonic
    grau: 'Mestre Maçom', rito: '', potencia: '', cargoLoja: '', cargoPotencia: '', direitoVoto: false, peculio: '', lojaAnterior: '',
    iniciacaoData: '', iniciacaoPlacet: '', iniciacaoLoja: '', iniciacaoOriente: '', iniciacaoUf: '', iniciacaoPotencia: '',
    elevacaoData: '', elevacaoPlacet: '', elevacaoLoja: '', elevacaoOriente: '', elevacaoUf: '', elevacaoPotencia: '',
    exaltacaoData: '', exaltacaoPlacet: '', exaltacaoLoja: '', exaltacaoOriente: '', exaltacaoUf: '', exaltacaoPotencia: '',
    regularizacaoData: '', regularizacaoPlacet: '', filiacaoData: '', filiacaoPlacet: '',
    instalacaoData: '', instalacaoPlacet: '', instalacaoLoja: '', instalacaoOriente: '', instalacaoUf: '', instalacaoPotencia: '',
    dataDireitoVoto: '',
    // Titles
    tituloEmerito: '', atoEmerito: '', tituloRemido: '', atoRemido: '', tituloBenemerito: '', atoBenemerito: '', tituloGrandeBenemerito: '', atoGrandeBenemerito: '',
    tituloEstrelaDistincao: '', atoEstrelaDistincao: '', tituloCruzPerfeicao: '', atoCruzPerfeicao: '', tituloComendaPedro: '', atoComendaPedro: '', tituloGrandeMerito: '', atoGrandeMerito: '',
    // History
    status: 'Ativo', loja: 'Arls Major Manoel dos Santos Portugal', categoria: '',
    cargosExercidos: [],
    numeroSessoes: 0, faltas: 0, presencas: 0, abstencoes: 0, frequencia: 0, frequenciaVoto: 0, 
    irregular: false, dataIrregularidade: '', licenca: false, dataLicencaDe: '', dataLicencaAte: '',
    observacoes: '',
    ...member
  });

  const [ritoOptions, setRitoOptions] = useState(['Adonhiramita', 'Brasileiro', 'Escocês Antigo e Aceito', 'Moderno', 'Schröder', 'York']);
  const [potenciaOptions, setPotenciaOptions] = useState(['GOB', 'GLESP', 'GOP', 'COMAB', 'GLMEM']);
  const [cargoLojaOptions, setCargoLojaOptions] = useState([
    'Venerável Mestre', '1º Vigilante', '2º Vigilante', 'Orador', 
    'Secretário', 'Tesoureiro', 'Chanceler', 'Mestre de Cerimônias', 
    'Hospitaleiro', '1º Diácono', '2º Diácono', 'Guarda do Templo', 
    'Cobridor', 'Porta Bandeira', 'Porta Estandarte', 'Porta Espada',
    'Mestre de Banquetes', 'Mestre de Harmonia', 'Experto', 'Bibliotecário', 
    'Arquiteto'
  ]);
  const [cargoPotenciaOptions, setCargoPotenciaOptions] = useState([
    'Grão-Mestre Geral', 'Grão-Mestre Adjunto', 'Grão-Mestre Estadual', 
    'Grão-Mestre Estadual Adjunto', 'Grande Secretário', 'Grande Tesoureiro', 
    'Grande Chanceler', 'Grande Orador', 'Grande Hospitaleiro', 
    'Assessor do Grão-Mestre', 'Membro do Tribunal', 'Deputado Federal', 
    'Deputado Estadual'
  ]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const fetchExistingOptions = async () => {
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          const members = await response.json();
          
          const getUniqueValues = (field, defaultList) => {
            const dbValues = members
              .map(m => m[field])
              .filter(val => val && typeof val === 'string' && val.trim() !== '');
            const combined = [...new Set([...defaultList, ...dbValues])];
            return combined.sort((a, b) => a.localeCompare(b));
          };

          setRitoOptions(getUniqueValues('rito', ['Adonhiramita', 'Brasileiro', 'Escocês Antigo e Aceito', 'Moderno', 'Schröder', 'York']));
          setPotenciaOptions(getUniqueValues('potencia', ['GOB', 'GLESP', 'GOP', 'COMAB', 'GLMEM']));
          setCargoLojaOptions(getUniqueValues('cargoLoja', [
            'Venerável Mestre', '1º Vigilante', '2º Vigilante', 'Orador', 
            'Secretário', 'Tesoureiro', 'Chanceler', 'Mestre de Cerimônias', 
            'Hospitaleiro', '1º Diácono', '2º Diácono', 'Guarda do Templo', 
            'Cobridor', 'Porta Bandeira', 'Porta Estandarte', 'Porta Espada',
            'Mestre de Banquetes', 'Mestre de Harmonia', 'Experto', 'Bibliotecário', 
            'Arquiteto'
          ]));
          setCargoPotenciaOptions(getUniqueValues('cargoPotencia', [
            'Grão-Mestre Geral', 'Grão-Mestre Adjunto', 'Grão-Mestre Estadual', 
            'Grão-Mestre Estadual Adjunto', 'Grande Secretário', 'Grande Tesoureiro', 
            'Grande Chanceler', 'Grande Orador', 'Grande Hospitaleiro', 
            'Assessor do Grão-Mestre', 'Membro do Tribunal', 'Deputado Federal', 
            'Deputado Estadual'
          ]));
        }
      } catch (err) {
        console.error('Erro ao buscar cargos e potências existentes:', err);
      }
    };

    fetchExistingOptions();

    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const url = member ? `/api/members/${member.id}` : '/api/members';
      const method = member ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar no servidor');
      }
      
      alert('Cadastro salvo com sucesso no banco de dados!');
      onClose(); // Fechar o modal após salvar
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
              enderecoTrabalho: data.logradouro || prev.enderecoTrabalho,
              bairroTrabalho: data.bairro || prev.bairroTrabalho,
              cidadeTrabalho: data.localidade || prev.cidadeTrabalho,
              estadoTrabalho: data.uf || prev.estadoTrabalho
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
    } else if (name === 'cepTrabalho' && value.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(value, 'trabalho');
    }
  };

  const handleFilhoChange = (index, field, value) => {
    const newFilhos = [...formData.filhos];
    newFilhos[index][field] = value;
    setFormData({ ...formData, filhos: newFilhos });
  };

  const addFilho = () => {
    setFormData({ ...formData, filhos: [...formData.filhos, { id: Date.now(), nome: '', dataNascimento: '' }] });
  };

  const removeFilho = (index) => {
    const newFilhos = formData.filhos.filter((_, i) => i !== index);
    setFormData({ ...formData, filhos: newFilhos });
  };

  const handleLowtonChange = (index, field, value) => {
    const newLowtons = [...formData.lowtons];
    newLowtons[index][field] = value;
    setFormData({ ...formData, lowtons: newLowtons });
  };

  const addLowton = () => {
    setFormData({ ...formData, lowtons: [...formData.lowtons, { id: Date.now(), nome: '', dataNascimento: '' }] });
  };

  const removeLowton = (index) => {
    const newLowtons = formData.lowtons.filter((_, i) => i !== index);
    setFormData({ ...formData, lowtons: newLowtons });
  };

  const handleApjChange = (index, field, value) => {
    const newApjs = [...formData.apjs];
    newApjs[index][field] = value;
    setFormData({ ...formData, apjs: newApjs });
  };

  const addApj = () => {
    setFormData({ ...formData, apjs: [...formData.apjs, { id: Date.now(), nome: '', dataNascimento: '' }] });
  };

  const removeApj = (index) => {
    const newApjs = formData.apjs.filter((_, i) => i !== index);
    setFormData({ ...formData, apjs: newApjs });
  };

  const handleCargoChange = (index, field, value) => {
    const newCargos = [...formData.cargosExercidos];
    newCargos[index][field] = value;
    setFormData({ ...formData, cargosExercidos: newCargos });
  };

  const addCargo = () => {
    setFormData({ ...formData, cargosExercidos: [...formData.cargosExercidos, { id: Date.now(), cargo: '', loja: '', oriente: '', gestao: '', inicio: '', termino: '' }] });
  };

  const removeCargo = (index) => {
    const newCargos = formData.cargosExercidos.filter((_, i) => i !== index);
    setFormData({ ...formData, cargosExercidos: newCargos });
  };

  return (
    <div className="fixed inset-0 bg-black-90 backdrop-blur-md z-modal flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0" style={{ padding: 0 }}>
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-[rgba(212,175,55,0.15)] flex justify-between items-center bg-[#131316]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
              <User className="text-[#D4AF37] w-6 h-6" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl text-[#D4AF37]">
                {member ? 'Editar Irmão' : 'Cadastro de Irmãos - Ordem: Nome'}
              </h2>
              <p className="text-[10px] text-[#99907C] uppercase tracking-widest">SisOriente - Sistema para Gestão de Loja Maçônica</p>
            </div>
          </div>
          <button onClick={onClose} className="action-icon-button">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex pt-4 pb-0.5 items-end px-6 bg-[#131316]/50 border-b border-[rgba(212,175,55,0.15)] overflow-x-auto hide-scrollbar">
          <TabButton id="personal" label="Identificação" icon={User} active={activeTab === 'personal'} onClick={setActiveTab} />
          <TabButton id="contact" label="Residência / Trabalho" icon={Home} active={activeTab === 'contact'} onClick={setActiveTab} />
          <TabButton id="family" label="Cônjuge / Filhos" icon={Heart} active={activeTab === 'family'} onClick={setActiveTab} />
          <TabButton id="masonic" label="Graus / Vida Maçônica" icon={Award} active={activeTab === 'masonic'} onClick={setActiveTab} />
          <TabButton id="history" label="Cargos / Histórico" icon={FileText} active={activeTab === 'history'} onClick={setActiveTab} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'personal' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4 w-40">
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl bg-[#131316] border-2 border-dashed border-[rgba(212,175,55,0.2)] flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-[#D4AF37] transition-colors"
                    style={{ width: '160px', height: '192px', minWidth: '160px', minHeight: '192px' }}
                  >
                    {formData.foto ? (
                      <img src={formData.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="text-[#99907C] text-sm uppercase font-bold tracking-wider">FOTO</span>
                    )}
                  </div>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] text-[#D4AF37] font-bold uppercase hover:underline">Alterar Foto</button>
                </div>
                
                <div className="flex-1">
                  <SectionTitle title="Dados Básicos" />
                  <div className="grid grid-cols-12 gap-x-4">
                    <FormField label="Código" name="codigo" value={formData.codigo} onChange={handleChange} width="col-span-2" />
                    <FormField label="Cadastro (CIM)" name="cim" value={formData.cim} onChange={handleChange} width="col-span-3" />
                    <FormField label="IME" name="ime" value={formData.ime} onChange={handleChange} width="col-span-2" />
                    <FormField label="Nome" name="nome" value={formData.nome} onChange={handleChange} width="col-span-5" />
                    
                    <FormField label="Nascimento" name="nascimento" value={formData.nascimento} onChange={handleChange} type="date" width="col-span-3" />
                    <FormField label="Est. Civil" name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} width="col-span-3" />
                    <FormField label="Natural de" name="naturalidade" value={formData.naturalidade} onChange={handleChange} width="col-span-4" />
                    <FormField label="UF Nasc." name="ufNascimento" value={formData.ufNascimento} onChange={handleChange} width="col-span-2" />
                    
                    <FormField label="Nacionalidade" name="nacionalidade" value={formData.nacionalidade} onChange={handleChange} width="col-span-4" />
                    <FormField label="Naturalização" name="naturalizacao" value={formData.naturalizacao} onChange={handleChange} width="col-span-4" />
                    <FormField label="Religião" name="religiao" value={formData.religiao} onChange={handleChange} width="col-span-4" />
                    
                    <FormField label="Nome do Pai" name="nomePai" value={formData.nomePai} onChange={handleChange} width="col-span-6" />
                    <FormField label="Nome da Mãe" name="nomeMae" value={formData.nomeMae} onChange={handleChange} width="col-span-6" />
                  </div>
                </div>
              </div>

              <SectionTitle title="Documentação Civil e Eleitoral" />
              <div className="grid grid-cols-12 gap-x-4">
                <FormField label="RG" name="rg" value={formData.rg} onChange={handleChange} width="col-span-4" />
                <FormField label="Órgão Exp." name="orgaoExpedidorRg" value={formData.orgaoExpedidorRg} onChange={handleChange} width="col-span-2" />
                <FormField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} width="col-span-6" />
                
                <FormField label="Título Eleitoral" name="tituloEleitoral" value={formData.tituloEleitoral} onChange={handleChange} width="col-span-4" />
                <FormField label="Zona" name="zonaEleitoral" value={formData.zonaEleitoral} onChange={handleChange} width="col-span-2" />
                <FormField label="Seção" name="secaoEleitoral" value={formData.secaoEleitoral} onChange={handleChange} width="col-span-2" />
                <FormField label="Cidade (Eleitoral)" name="cidadeEleitoral" value={formData.cidadeEleitoral} onChange={handleChange} width="col-span-3" />
                <FormField label="UF" name="ufEleitoral" value={formData.ufEleitoral} onChange={handleChange} width="col-span-1" />
                
                <FormField label="Cart. Estrangeiro" name="carteiraEstrangeiro" value={formData.carteiraEstrangeiro} onChange={handleChange} width="col-span-4" />
                <FormField label="Órgão Exp." name="orgaoExpedidorEstrangeiro" value={formData.orgaoExpedidorEstrangeiro} onChange={handleChange} width="col-span-2" />
                <FormField label="Reservista" name="reservista" value={formData.reservista} onChange={handleChange} width="col-span-6" />
                
                <FormField label="Grau de Instrução" name="grauInstrucao" value={formData.grauInstrucao} onChange={handleChange} width="col-span-6" />
                <FormField label="Idiomas (Ex: Inglês, Francês)" name="idiomas" value={formData.idiomas} onChange={handleChange} width="col-span-6" />
              </div>

              <SectionTitle title="Informações Médicas e Adicionais" />
              <div className="grid grid-cols-12 gap-x-4">
                <FormField label="Sangue" name="sangue" value={formData.sangue} onChange={handleChange} width="col-span-2" />
                <FormField label="RH" name="rh" value={formData.rh} onChange={handleChange} width="col-span-2" />
                <div className="col-span-4 flex items-center">
                  <CheckboxField label="Doador de Órgãos" name="doadorOrgaos" checked={formData.doadorOrgaos} onChange={handleChange} />
                </div>
                <FormField label="QR Code (URL/Identificador)" name="qrCode" value={formData.qrCode} onChange={handleChange} width="col-span-4" />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="flex flex-col gap-6">
              <SectionTitle title="Residência" />
              <div className="grid grid-cols-12 gap-x-4">
                <FormField label="Endereço" name="endereco" value={formData.endereco} onChange={handleChange} width="col-span-12" />
                <FormField label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} width="col-span-6" />
                <FormField label="Nº" name="numeroRes" value={formData.numeroRes} onChange={handleChange} width="col-span-2" />
                <FormField label="Complemento" name="complementoRes" value={formData.complementoRes} onChange={handleChange} width="col-span-4" />
                
                <FormField label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} width="col-span-6" />
                <FormField label="Estado" name="estado" value={formData.estado} onChange={handleChange} width="col-span-2" />
                <FormField label="CEP" name="cep" value={formData.cep} onChange={handleChange} width="col-span-4" />
                
                <FormField label="Fone" name="telefoneResidencial" value={formData.telefoneResidencial} onChange={handleChange} width="col-span-6" />
                <FormField label="Celular" name="celular" value={formData.celular} onChange={handleChange} width="col-span-6" />
                
                <FormField label="E-mail" name="email" value={formData.email} onChange={handleChange} width="col-span-12" />
                
                <FormField label="Instagram" name="instagram" value={formData.instagram} onChange={handleChange} width="col-span-4" />
                <FormField label="Facebook" name="facebook" value={formData.facebook} onChange={handleChange} width="col-span-4" />
                <FormField label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} width="col-span-4" />
                
                <FormField label="Caixa Postal" name="caixaPostal" value={formData.caixaPostal} onChange={handleChange} width="col-span-2" />
                <FormField label="Endereço de Correspondência (Se diferente)" name="correspondencia" value={formData.correspondencia} onChange={handleChange} width="col-span-10" />
                
                <div className="col-span-12">
                  <CheckboxField label="Receber somente os E-Mails relativos a Loja" name="receberEmailsLoja" checked={formData.receberEmailsLoja} onChange={handleChange} />
                </div>
              </div>

              <SectionTitle title="Trabalho" />
              <div className="grid grid-cols-12 gap-x-4">
                <FormField label="Empresa" name="empresa" value={formData.empresa} onChange={handleChange} width="col-span-12" />
                <FormField label="Endereço" name="enderecoTrabalho" value={formData.enderecoTrabalho} onChange={handleChange} width="col-span-12" />
                <FormField label="Bairro" name="bairroTrabalho" value={formData.bairroTrabalho} onChange={handleChange} width="col-span-6" />
                <FormField label="Número" name="numeroTrab" value={formData.numeroTrab} onChange={handleChange} width="col-span-2" />
                <div className="col-span-4"></div>
                
                <FormField label="Cidade" name="cidadeTrabalho" value={formData.cidadeTrabalho} onChange={handleChange} width="col-span-6" />
                <FormField label="Estado" name="estadoTrabalho" value={formData.estadoTrabalho} onChange={handleChange} width="col-span-2" />
                <FormField label="Fone" name="telefoneComercial" value={formData.telefoneComercial} onChange={handleChange} width="col-span-4" />
                
                <FormField label="Profissão" name="profissao" value={formData.profissao} onChange={handleChange} width="col-span-8" />
                <FormField label="CEP" name="cepTrabalho" value={formData.cepTrabalho} onChange={handleChange} width="col-span-4" />
                
                <FormField label="Cargo" name="cargoTrabalho" value={formData.cargoTrabalho} onChange={handleChange} width="col-span-6" />
                <FormField label="Função" name="funcaoTrabalho" value={formData.funcaoTrabalho} onChange={handleChange} width="col-span-6" />
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="flex flex-col gap-6">
              <SectionTitle title="Cônjuge" />
              <div className="grid grid-cols-12 gap-x-4">
                <FormField label="Cônjuge" name="conjugeNome" value={formData.conjugeNome} onChange={handleChange} width="col-span-12" />
                <FormField label="Data Nasc." name="conjugeNascimento" value={formData.conjugeNascimento} onChange={handleChange} type="date" width="col-span-4" />
                <FormField label="Casamento" name="dataCasamento" value={formData.dataCasamento} onChange={handleChange} type="date" width="col-span-4" />
                <div className="col-span-4"></div>
                
                <FormField label="Profissão" name="conjugeProfissao" value={formData.conjugeProfissao} onChange={handleChange} width="col-span-6" />
                <FormField label="Cargo" name="conjugeCargo" value={formData.conjugeCargo} onChange={handleChange} width="col-span-6" />
                <FormField label="Função" name="conjugeFuncao" value={formData.conjugeFuncao} onChange={handleChange} width="col-span-6" />
                <FormField label="Empresa" name="conjugeEmpresa" value={formData.conjugeEmpresa} onChange={handleChange} width="col-span-6" />
                <FormField label="Fone" name="conjugeTelefone" value={formData.conjugeTelefone} onChange={handleChange} width="col-span-6" />
                
                <FormField label="Sangue" name="sangueConjuge" value={formData.sangueConjuge} onChange={handleChange} width="col-span-2" />
                <FormField label="RH" name="rhConjuge" value={formData.rhConjuge} onChange={handleChange} width="col-span-2" />
                <div className="col-span-4 flex items-center mt-2">
                  <CheckboxField label="Doador de Órgãos" name="doadorConjuge" checked={formData.doadorConjuge} onChange={handleChange} />
                </div>
              </div>

              <div className="flex justify-between items-end mb-2 mt-4">
                <SectionTitle title="Filhos" />
                <button type="button" onClick={addFilho} className="flex items-center gap-1 text-[#D4AF37] hover:text-white text-xs font-bold uppercase transition-colors mb-4">
                  <Plus className="w-4 h-4" strokeWidth={1.5} /> Adicionar Filho
                </button>
              </div>
              
              {formData.filhos.length === 0 ? (
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/5 text-[#99907C] text-sm">
                  Nenhum filho cadastrado.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-12 gap-x-4 px-4 pb-2 border-b border-[rgba(212,175,55,0.2)]">
                    <div className="col-span-8 text-[10px] text-[#99907C] uppercase font-bold">Filhos: (Nome)</div>
                    <div className="col-span-3 text-[10px] text-[#99907C] uppercase font-bold">Data Nasc.:</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formData.filhos.map((filho, index) => (
                    <div key={filho.id} className="grid grid-cols-12 gap-x-4 items-center">
                      <div className="col-span-8">
                        <input type="text" className="modern-input" value={filho.nome} onChange={(e) => handleFilhoChange(index, 'nome', e.target.value)} />
                      </div>
                      <div className="col-span-3">
                        <input type="date" className="modern-input" value={filho.dataNascimento} onChange={(e) => handleFilhoChange(index, 'dataNascimento', e.target.value)} />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button type="button" onClick={() => removeFilho(index)} className="p-2 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-end mb-2 mt-4">
                <SectionTitle title="Lowtons (Filhos Registrados)" />
                <button type="button" onClick={addLowton} className="flex items-center gap-1 text-[#D4AF37] hover:text-white text-xs font-bold uppercase transition-colors mb-4">
                  <Plus className="w-4 h-4" strokeWidth={1.5} /> Adicionar Lowton
                </button>
              </div>
              
              {formData.lowtons.length === 0 ? (
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/5 text-[#99907C] text-sm">
                  Nenhum Lowton cadastrado.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-12 gap-x-4 px-4 pb-2 border-b border-[rgba(212,175,55,0.2)]">
                    <div className="col-span-8 text-[10px] text-[#99907C] uppercase font-bold">Lowton: (Nome)</div>
                    <div className="col-span-3 text-[10px] text-[#99907C] uppercase font-bold">Data Nasc.:</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formData.lowtons.map((filho, index) => (
                    <div key={filho.id} className="grid grid-cols-12 gap-x-4 items-center">
                      <div className="col-span-8">
                        <input type="text" className="modern-input" value={filho.nome} onChange={(e) => handleLowtonChange(index, 'nome', e.target.value)} />
                      </div>
                      <div className="col-span-3">
                        <input type="date" className="modern-input" value={filho.dataNascimento} onChange={(e) => handleLowtonChange(index, 'dataNascimento', e.target.value)} />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button type="button" onClick={() => removeLowton(index)} className="p-2 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-end mb-2 mt-4">
                <SectionTitle title="APJ (Ação Paramaçônica Juvenil)" />
                <button type="button" onClick={addApj} className="flex items-center gap-1 text-[#D4AF37] hover:text-white text-xs font-bold uppercase transition-colors mb-4">
                  <Plus className="w-4 h-4" strokeWidth={1.5} /> Adicionar APJ
                </button>
              </div>
              
              {formData.apjs.length === 0 ? (
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/5 text-[#99907C] text-sm">
                  Nenhum sobrinho(a) APJ cadastrado.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-12 gap-x-4 px-4 pb-2 border-b border-[rgba(212,175,55,0.2)]">
                    <div className="col-span-8 text-[10px] text-[#99907C] uppercase font-bold">APJ: (Nome)</div>
                    <div className="col-span-3 text-[10px] text-[#99907C] uppercase font-bold">Data Nasc.:</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formData.apjs.map((filho, index) => (
                    <div key={filho.id} className="grid grid-cols-12 gap-x-4 items-center">
                      <div className="col-span-8">
                        <input type="text" className="modern-input" value={filho.nome} onChange={(e) => handleApjChange(index, 'nome', e.target.value)} />
                      </div>
                      <div className="col-span-3">
                        <input type="date" className="modern-input" value={filho.dataNascimento} onChange={(e) => handleApjChange(index, 'dataNascimento', e.target.value)} />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button type="button" onClick={() => removeApj(index)} className="p-2 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'masonic' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <SectionTitle title="Dados Maçônicos Básicos" />
              <div className="grid grid-cols-12 gap-x-4 items-center">
                <div className="col-span-4 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Rito</label>
                  <select name="rito" value={formData.rito} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="">[Sem Rito / Nenhum]</option>
                    {ritoOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-4 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Potência</label>
                  <select name="potencia" value={formData.potencia} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="">[Sem Potência / Nenhuma]</option>
                    {potenciaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-4 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Grau Atual</label>
                  <select name="grau" value={formData.grau} onChange={handleChange} className="modern-input animate-fadeIn" style={{ paddingLeft: '12px' }}>
                    <option value="Aprendiz">Aprendiz</option>
                    <option value="Companheiro">Companheiro</option>
                    <option value="Mestre Maçom">Mestre Maçom</option>
                  </select>
                </div>
              </div>

              <SectionTitle title="Graus e Iniciações" />
              <div className="grid grid-cols-12 gap-x-4 items-center">
                <div className="col-span-12 md:col-span-2 text-[#D4AF37] text-sm font-bold">Grau 1 em (Iniciação):</div>
                <FormField name="iniciacaoData" value={formData.iniciacaoData} onChange={handleChange} type="date" width="col-span-6 md:col-span-2" />
                <FormField label="Placet nº:" name="iniciacaoPlacet" value={formData.iniciacaoPlacet} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="Loja:" name="iniciacaoLoja" value={formData.iniciacaoLoja} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="Oriente:" name="iniciacaoOriente" value={formData.iniciacaoOriente} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="UF:" name="iniciacaoUf" value={formData.iniciacaoUf} onChange={handleChange} width="col-span-6 md:col-span-1" />
                <div className="col-span-6 md:col-span-1 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Potência:</label>
                  <select name="iniciacaoPotencia" value={formData.iniciacaoPotencia} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="">[Nenhuma]</option>
                    {potenciaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-12 md:col-span-2 text-[#D4AF37] text-sm font-bold">Grau 2 em (Elevação):</div>
                <FormField name="elevacaoData" value={formData.elevacaoData} onChange={handleChange} type="date" width="col-span-6 md:col-span-2" />
                <FormField label="Placet nº:" name="elevacaoPlacet" value={formData.elevacaoPlacet} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="Loja:" name="elevacaoLoja" value={formData.elevacaoLoja} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="Oriente:" name="elevacaoOriente" value={formData.elevacaoOriente} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="UF:" name="elevacaoUf" value={formData.elevacaoUf} onChange={handleChange} width="col-span-6 md:col-span-1" />
                <div className="col-span-6 md:col-span-1 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Potência:</label>
                  <select name="elevacaoPotencia" value={formData.elevacaoPotencia} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="">[Nenhuma]</option>
                    {potenciaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-12 md:col-span-2 text-[#D4AF37] text-sm font-bold">Grau 3 em (Exaltação):</div>
                <FormField name="exaltacaoData" value={formData.exaltacaoData} onChange={handleChange} type="date" width="col-span-6 md:col-span-2" />
                <FormField label="Placet nº:" name="exaltacaoPlacet" value={formData.exaltacaoPlacet} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="Loja:" name="exaltacaoLoja" value={formData.exaltacaoLoja} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="Oriente:" name="exaltacaoOriente" value={formData.exaltacaoOriente} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="UF:" name="exaltacaoUf" value={formData.exaltacaoUf} onChange={handleChange} width="col-span-6 md:col-span-1" />
                <div className="col-span-6 md:col-span-1 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Potência:</label>
                  <select name="exaltacaoPotencia" value={formData.exaltacaoPotencia} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="">[Nenhuma]</option>
                    {potenciaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <SectionTitle title="Outros Movimentos" />
              <div className="grid grid-cols-12 gap-x-4 items-center">
                <div className="col-span-12 md:col-span-2 text-white text-sm font-bold">Regularização em:</div>
                <FormField name="regularizacaoData" value={formData.regularizacaoData} onChange={handleChange} type="date" width="col-span-6 md:col-span-2" />
                <FormField label="Placet nº:" name="regularizacaoPlacet" value={formData.regularizacaoPlacet} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <div className="col-span-12 md:col-span-6 flex flex-col justify-center">
                  <label className="text-xs text-[#99907C] mb-1">Considerar p/ o irmão ter direito a voto as sessões incluídas após a data:</label>
                  <input type="date" name="dataDireitoVoto" value={formData.dataDireitoVoto} onChange={handleChange} className="modern-input w-1/2" />
                </div>

                <div className="col-span-12 md:col-span-2 text-[#D4AF37] text-sm font-bold">Filiação em:</div>
                <FormField name="filiacaoData" value={formData.filiacaoData} onChange={handleChange} type="date" width="col-span-6 md:col-span-2" />
                <FormField label="Placet nº:" name="filiacaoPlacet" value={formData.filiacaoPlacet} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <div className="col-span-6"></div>

                <div className="col-span-12 md:col-span-2 text-white text-sm font-bold">Instalação em:</div>
                <FormField name="instalacaoData" value={formData.instalacaoData} onChange={handleChange} type="date" width="col-span-6 md:col-span-2" />
                <FormField label="Placet nº:" name="instalacaoPlacet" value={formData.instalacaoPlacet} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="Loja:" name="instalacaoLoja" value={formData.instalacaoLoja} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="Oriente:" name="instalacaoOriente" value={formData.instalacaoOriente} onChange={handleChange} width="col-span-6 md:col-span-2" />
                <FormField label="UF:" name="instalacaoUf" value={formData.instalacaoUf} onChange={handleChange} width="col-span-6 md:col-span-1" />
                <div className="col-span-6 md:col-span-1 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Potência:</label>
                  <select name="instalacaoPotencia" value={formData.instalacaoPotencia} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="">[Nenhuma]</option>
                    {potenciaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <SectionTitle title="Títulos e Condecorações (Datas e Atos)" />
              <div className="grid grid-cols-12 gap-x-4 gap-y-2">
                <div className="col-span-6 grid grid-cols-12 gap-x-2 border border-white/10 p-2 rounded bg-white/5">
                  <FormField label="Emérito" name="tituloEmerito" value={formData.tituloEmerito} onChange={handleChange} type="date" width="col-span-6" />
                  <FormField label="Ato/Decreto" name="atoEmerito" value={formData.atoEmerito} onChange={handleChange} width="col-span-6" />
                </div>
                <div className="col-span-6 grid grid-cols-12 gap-x-2 border border-white/10 p-2 rounded bg-white/5">
                  <FormField label="Remido" name="tituloRemido" value={formData.tituloRemido} onChange={handleChange} type="date" width="col-span-6" />
                  <FormField label="Ato/Decreto" name="atoRemido" value={formData.atoRemido} onChange={handleChange} width="col-span-6" />
                </div>
                
                <div className="col-span-6 grid grid-cols-12 gap-x-2 border border-white/10 p-2 rounded bg-white/5">
                  <FormField label="Benemérito" name="tituloBenemerito" value={formData.tituloBenemerito} onChange={handleChange} type="date" width="col-span-6" />
                  <FormField label="Ato/Decreto" name="atoBenemerito" value={formData.atoBenemerito} onChange={handleChange} width="col-span-6" />
                </div>
                <div className="col-span-6 grid grid-cols-12 gap-x-2 border border-white/10 p-2 rounded bg-white/5">
                  <FormField label="Grande Benemérito" name="tituloGrandeBenemerito" value={formData.tituloGrandeBenemerito} onChange={handleChange} type="date" width="col-span-6" />
                  <FormField label="Ato/Decreto" name="atoGrandeBenemerito" value={formData.atoGrandeBenemerito} onChange={handleChange} width="col-span-6" />
                </div>
                
                <div className="col-span-6 grid grid-cols-12 gap-x-2 border border-white/10 p-2 rounded bg-white/5">
                  <FormField label="Estrela Distinção" name="tituloEstrelaDistincao" value={formData.tituloEstrelaDistincao} onChange={handleChange} type="date" width="col-span-6" />
                  <FormField label="Ato/Decreto" name="atoEstrelaDistincao" value={formData.atoEstrelaDistincao} onChange={handleChange} width="col-span-6" />
                </div>
                <div className="col-span-6 grid grid-cols-12 gap-x-2 border border-white/10 p-2 rounded bg-white/5">
                  <FormField label="Cruz Perfeição" name="tituloCruzPerfeicao" value={formData.tituloCruzPerfeicao} onChange={handleChange} type="date" width="col-span-6" />
                  <FormField label="Ato/Decreto" name="atoCruzPerfeicao" value={formData.atoCruzPerfeicao} onChange={handleChange} width="col-span-6" />
                </div>

                <div className="col-span-6 grid grid-cols-12 gap-x-2 border border-white/10 p-2 rounded bg-white/5">
                  <FormField label="Comenda D. Pedro I" name="tituloComendaPedro" value={formData.tituloComendaPedro} onChange={handleChange} type="date" width="col-span-6" />
                  <FormField label="Ato/Decreto" name="atoComendaPedro" value={formData.atoComendaPedro} onChange={handleChange} width="col-span-6" />
                </div>
                <div className="col-span-6 grid grid-cols-12 gap-x-2 border border-white/10 p-2 rounded bg-white/5">
                  <FormField label="Grande Mérito" name="tituloGrandeMerito" value={formData.tituloGrandeMerito} onChange={handleChange} type="date" width="col-span-6" />
                  <FormField label="Ato/Decreto" name="atoGrandeMerito" value={formData.atoGrandeMerito} onChange={handleChange} width="col-span-6" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="flex flex-col gap-6">
              <SectionTitle title="Gestão e Status" />
              <div className="grid grid-cols-12 gap-x-4">
                <div className="col-span-3 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Status Atual</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="Ativo">Ativo</option>
                    <option value="Afastado">Afastado</option>
                    <option value="Irregular">Irregular</option>
                    <option value="Desligado">Desligado</option>
                  </select>
                </div>
                <FormField label="Categoria" name="categoria" value={formData.categoria} onChange={handleChange} width="col-span-3" />
                <div className="col-span-3 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Cargo em Loja</label>
                  <select name="cargoLoja" value={formData.cargoLoja} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="">[Sem Cargo / Nenhum]</option>
                    {cargoLojaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3 flex flex-col gap-1 mb-4">
                  <label className="text-[10px] text-[#99907C] uppercase tracking-wider font-bold">Cargo Potência</label>
                  <select name="cargoPotencia" value={formData.cargoPotencia} onChange={handleChange} className="modern-input" style={{ paddingLeft: '12px' }}>
                    <option value="">[Sem Cargo / Nenhum]</option>
                    {cargoPotenciaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-12 flex gap-4 mt-2 mb-2 p-2 bg-white/5 border border-white/10 rounded">
                  <CheckboxField label="Direito a Voto" name="direitoVoto" checked={formData.direitoVoto} onChange={handleChange} />
                  <div className="w-px bg-white/10 h-6"></div>
                  <CheckboxField label="Irregular" name="irregular" checked={formData.irregular} onChange={handleChange} />
                  {formData.irregular && (
                    <input type="date" name="dataIrregularidade" value={formData.dataIrregularidade} onChange={handleChange} className="modern-input h-6 text-xs px-2 w-32" />
                  )}
                  <div className="w-px bg-white/10 h-6"></div>
                  <CheckboxField label="Licença/Afastamento" name="licenca" checked={formData.licenca} onChange={handleChange} />
                  {formData.licenca && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary">De:</span>
                      <input type="date" name="dataLicencaDe" value={formData.dataLicencaDe} onChange={handleChange} className="modern-input h-6 text-xs px-2 w-32" />
                      <span className="text-xs text-text-secondary">Até:</span>
                      <input type="date" name="dataLicencaAte" value={formData.dataLicencaAte} onChange={handleChange} className="modern-input h-6 text-xs px-2 w-32" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-end mb-2 mt-4">
                <SectionTitle title="Cargos Exercidos" />
                <button type="button" onClick={addCargo} className="flex items-center gap-1 text-[#D4AF37] hover:text-white text-xs font-bold uppercase transition-colors mb-4">
                  <Plus className="w-4 h-4" strokeWidth={1.5} /> Adicionar Cargo
                </button>
              </div>
              
              {formData.cargosExercidos.length === 0 ? (
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/5 text-[#99907C] text-sm">
                  Nenhum cargo histórico registrado.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-12 gap-x-2 px-2 pb-2 border-b border-[rgba(212,175,55,0.2)]">
                    <div className="col-span-3 text-[10px] text-[#99907C] uppercase font-bold">Cargo</div>
                    <div className="col-span-2 text-[10px] text-[#99907C] uppercase font-bold">Loja</div>
                    <div className="col-span-2 text-[10px] text-[#99907C] uppercase font-bold">Oriente</div>
                    <div className="col-span-2 text-[10px] text-[#99907C] uppercase font-bold">Gestão</div>
                    <div className="col-span-1 text-[10px] text-[#99907C] uppercase font-bold">Início</div>
                    <div className="col-span-1 text-[10px] text-[#99907C] uppercase font-bold">Término</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formData.cargosExercidos.map((cargo, index) => (
                    <div key={cargo.id} className="grid grid-cols-12 gap-x-2 items-center">
                      <div className="col-span-3"><input type="text" className="modern-input text-xs" value={cargo.cargo} onChange={(e) => handleCargoChange(index, 'cargo', e.target.value)} /></div>
                      <div className="col-span-2"><input type="text" className="modern-input text-xs" value={cargo.loja} onChange={(e) => handleCargoChange(index, 'loja', e.target.value)} /></div>
                      <div className="col-span-2"><input type="text" className="modern-input text-xs" value={cargo.oriente} onChange={(e) => handleCargoChange(index, 'oriente', e.target.value)} /></div>
                      <div className="col-span-2"><input type="text" className="modern-input text-xs" value={cargo.gestao} onChange={(e) => handleCargoChange(index, 'gestao', e.target.value)} /></div>
                      <div className="col-span-1"><input type="text" placeholder="Ano" className="modern-input text-xs px-1" value={cargo.inicio} onChange={(e) => handleCargoChange(index, 'inicio', e.target.value)} /></div>
                      <div className="col-span-1"><input type="text" placeholder="Ano" className="modern-input text-xs px-1" value={cargo.termino} onChange={(e) => handleCargoChange(index, 'termino', e.target.value)} /></div>
                      <div className="col-span-1 flex justify-end">
                        <button type="button" onClick={() => removeCargo(index)} className="p-1 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <SectionTitle title="Frequência e Estatísticas (Leitura)" />
              <div className="grid grid-cols-6 gap-4 p-4 bg-white/5 rounded-xl border border-white/5 mb-4">
                <div className="text-center">
                  <p className="text-[10px] text-[#99907C] uppercase tracking-wider mb-1">Nº Sessões</p>
                  <p className="text-2xl text-white font-bold">{formData.numeroSessoes}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#99907C] uppercase tracking-wider mb-1">Presenças</p>
                  <p className="text-2xl text-green-400 font-bold">{formData.presencas}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#99907C] uppercase tracking-wider mb-1">Faltas</p>
                  <p className="text-2xl text-red-400 font-bold">{formData.faltas}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#99907C] uppercase tracking-wider mb-1">Abstenções</p>
                  <p className="text-2xl text-orange-400 font-bold">{formData.abstencoes}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#99907C] uppercase tracking-wider mb-1">Frequência</p>
                  <p className="text-2xl text-[#D4AF37] font-bold">{formData.frequencia}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#99907C] uppercase tracking-wider mb-1">Freq. p/ Voto</p>
                  <p className="text-2xl text-[#D4AF37] font-bold">{formData.frequenciaVoto}%</p>
                </div>
              </div>

              <FormField label="Observações e Histórico" name="observacoes" value={formData.observacoes} onChange={handleChange} width="col-span-12" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[rgba(212,175,55,0.15)] flex justify-end gap-4 bg-[#131316]">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg border border-[rgba(212,175,55,0.3)] text-[#99907C] hover:text-white hover:bg-white/5 font-medium transition-all">
            Cancelar
          </button>
          <button onClick={handleSave} className="modern-button flex items-center gap-2">
            <Save className="w-4 h-4" strokeWidth={1.5} />
            SALVAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
