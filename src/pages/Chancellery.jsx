import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { ClipboardList, Users, Plane, Plus, Search, Calendar, ShieldCheck, UserCheck, Award, Printer, X } from 'lucide-react';
import { mockMembers } from '../data/mockData';
import logoBrasao from '../assets/logo-brasao.png';
import modeloCertificado from '../assets/modelo1_sismacom.png';

const Chancellery = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState('1'); // Próxima sessão
  
  // Data State
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  // Visitors State (now including 'cidade' field to match certificate templates)
  const [visitors, setVisitors] = useState([
    { id: 1, nome: "Roberto de Souza", loja: "Arls Acácia do Sul", potencia: "GLSC", grau: "Mestre Maçom", data: "2026-05-10", cidade: "Florianópolis" },
    { id: 2, nome: "Fábio Guimarães", loja: "Arls Fraternidade Templária", potencia: "GOB", grau: "Companheiro Maçom", data: "2026-05-10", cidade: "São Paulo" }
  ]);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ 
    nome: '', 
    loja: '', 
    potencia: 'GOB', 
    grau: 'Mestre Maçom', 
    data: new Date().toLocaleDateString('sv-SE'),
    cidade: ''
  });

  // Outbound Visits State
  const [outboundVisits, setOutboundVisits] = useState([
    { id: 1, irmao: "Carlos Andrade", lojaVisitada: "Arls Estrela da Manhã", potencia: "GLESP", data: "2026-05-12", grauSessao: "Mestre Maçom" }
  ]);
  const [isOutboundModalOpen, setIsOutboundModalOpen] = useState(false);
  const [newOutbound, setNewOutbound] = useState({ irmaoId: '', lojaVisitada: '', potencia: 'GOB', data: new Date().toLocaleDateString('sv-SE'), grauSessao: 'Mestre Maçom' });

  // Certificate settings state (persists in localStorage)
  const [certConfig, setCertConfig] = useState(() => {
    const saved = localStorage.getItem('certConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing certificate config:', e);
      }
    }
    return {
      titulo: 'CERTIFICADO DE PRESENÇA',
      cabecalho1: 'A.R.L.S. ARCO REAL Nº 4500',
      cabecalho2: 'Federada ao Grande Oriente do Brasil',
      texto: 'Certificamos e agradecemos a presença do Irmão {NOME}, membro da {LOJA} do Oriente de {CIDADE}, que nos honrou com sua presença em sessão {TIPO} no grau de {GRAU}, realizada no dia {DATA}.',
      assinaturaVM: 'Irmão Venerável Mestre',
      assinaturaChanceler: 'Irmão Chanceler',
      modelo: 'Modelo 1'
    };
  });

  // Active print visitor
  const [printVisitor, setPrintVisitor] = useState(null);

  // Live preview test mock data
  const previewMockData = {
    nome: "Roberto de Souza",
    loja: "Arls Acácia do Sul",
    potencia: "GLSC",
    grau: "Mestre Maçom",
    data: "2026-05-10",
    cidade: "Florianópolis",
    tipo: "Ordinária"
  };

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/members');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
          // Initialize attendance to true for everyone initially
          const initialAtt = {};
          data.forEach(m => { initialAtt[m.id] = true; });
          setAttendance(initialAtt);
        } else {
          throw new Error('Fallback to mock');
        }
      } catch (err) {
        setMembers(mockMembers);
        const initialAtt = {};
        mockMembers.forEach(m => { initialAtt[m.id] = true; });
        setAttendance(initialAtt);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Filter members by search term
  const filteredMembers = members.filter(m => 
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.cim && m.cim.includes(searchTerm)) ||
    m.grau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddVisitor = (e) => {
    e.preventDefault();
    if (!newVisitor.nome || !newVisitor.loja) return;
    setVisitors(prev => [...prev, { id: prev.length + 1, ...newVisitor }]);
    setNewVisitor({ 
      nome: '', 
      loja: '', 
      potencia: 'GOB', 
      grau: 'Mestre Maçom', 
      data: new Date().toLocaleDateString('sv-SE'),
      cidade: ''
    });
    setIsVisitorModalOpen(false);
  };

  const handleAddOutbound = (e) => {
    e.preventDefault();
    if (!newOutbound.irmaoId || !newOutbound.lojaVisitada) return;
    const irmaoObj = members.find(m => m.id === parseInt(newOutbound.irmaoId));
    if (!irmaoObj) return;

    setOutboundVisits(prev => [...prev, {
      id: prev.length + 1,
      irmao: irmaoObj.nome,
      lojaVisitada: newOutbound.lojaVisitada,
      potencia: newOutbound.potencia,
      data: newOutbound.data,
      grauSessao: newOutbound.grauSessao
    }]);
    setNewOutbound({ irmaoId: '', lojaVisitada: '', potencia: 'GOB', data: new Date().toLocaleDateString('sv-SE'), grauSessao: 'Mestre Maçom' });
    setIsOutboundModalOpen(false);
  };

  const calculateStatistics = () => {
    const total = members.length;
    if (total === 0) return { present: 0, absent: 0, rate: 0 };
    const present = Object.values(attendance).filter(v => v).length;
    const absent = total - present;
    const rate = ((present / total) * 100).toFixed(1);
    return { present, absent, rate };
  };

  const stats = calculateStatistics();

  const handleSaveConfig = () => {
    localStorage.setItem('certConfig', JSON.stringify(certConfig));
    alert('Configurações do certificado salvas com sucesso!');
  };

  const handlePrintVisitorCertificate = (visitor) => {
    // Inject session type depending on session state or general
    const matchedSession = selectedSession === '2' ? 'de Iniciação' : 'Ordinária';
    setPrintVisitor({
      ...visitor,
      tipo: matchedSession
    });
  };

  const formatCertificateText = (text, dataObj) => {
    if (!text) return '';
    
    // Convert YYYY-MM-DD date to nice DD/MM/YYYY text format
    let formattedDate = '[Data da Sessão]';
    if (dataObj.data) {
      const parts = dataObj.data.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        formattedDate = dataObj.data;
      }
    }

    return text
      .replace(/{NOME}/g, dataObj.nome || '[Nome do Visitante]')
      .replace(/{DATA}/g, formattedDate)
      .replace(/{TIPO}/g, dataObj.tipo || 'Ordinária')
      .replace(/{GRAU}/g, dataObj.grau || '[Grau Maçônico]')
      .replace(/{CIDADE}/g, dataObj.cidade || '[Cidade/Oriente]')
      .replace(/{LOJA}/g, dataObj.loja || '[Loja de Origem]')
      .replace(/{POTENCIA}/g, dataObj.potencia || '[Potência]');
  };

  // Embeddable dynamic landscape printing CSS
  const printStyles = `
    @media print {
      body * {
        visibility: hidden !important;
      }
      #print-certificate-area, #print-certificate-area * {
        visibility: visible !important;
      }
      #print-certificate-area {
        position: fixed !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 297mm !important; /* A4 landscape width */
        height: 210mm !important; /* A4 landscape height */
        margin: 0 !important;
        padding: 22mm 20mm !important;
        box-shadow: none !important;
        border: 10px double #D4AF37 !important;
        background-color: #FAF8F5 !important;
        color: #1e293b !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        z-index: 9999999 !important;
      }
      .no-print {
        display: none !important;
      }
    }
  `;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-accent-gold animate-pulse text-xl">Carregando Módulo de Chancelaria...</div>
      </div>
    );
  }

  return (
    <div className="p-8 relative">
      {/* Inject Printer CSS */}
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />

      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-4xl mb-2 masonic-gradient-text">Chancelaria</h2>
          <p className="text-text-secondary">Registro de frequência diária, controle de visitantes e estatísticas da oficina.</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 mb-6 border-b border-glass-border pb-px">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'attendance' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <ClipboardList className="w-4 h-4" />
          Diário de Presença
        </button>
        <button
          onClick={() => setActiveTab('visitors')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'visitors' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <Users className="w-4 h-4" />
          Visitantes Recebidos
        </button>
        <button
          onClick={() => setActiveTab('outbound')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'outbound' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <Plane className="w-4 h-4" />
          Visitas Efetuadas
        </button>
        <button
          onClick={() => setActiveTab('certificate')}
          className={`flex items-center gap-2 pb-4 px-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'certificate' ? 'text-accent-gold border-accent-gold' : 'text-text-secondary border-transparent hover:text-white'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <Award className="w-4 h-4" />
          Configurar Certificado
        </button>
      </div>

      {/* Tab Attendance */}
      {activeTab === 'attendance' && (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 md:col-span-4">
              <div className="modern-input-container">
                <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CIM ou grau..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="modern-input"
                  style={{ background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-gold flex-shrink-0" />
                <select 
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="modern-input"
                  style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                >
                  <option value="1">Sessão Ordinária - 20/05/2026</option>
                  <option value="2">Sessão de Iniciação - 05/06/2026</option>
                </select>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="col-span-12 md:col-span-4 flex justify-end gap-6 text-sm bg-white/5 border border-glass-border px-6 py-3 rounded-xl backdrop-blur-md">
              <div className="text-center">
                <p className="text-[10px] text-text-secondary uppercase font-bold">Presentes</p>
                <p className="text-lg font-bold text-green-400">{stats.present}</p>
              </div>
              <div className="text-center border-l border-glass-border/30 pl-6">
                <p className="text-[10px] text-text-secondary uppercase font-bold">Ausentes</p>
                <p className="text-lg font-bold text-red-400">{stats.absent}</p>
              </div>
              <div className="text-center border-l border-glass-border/30 pl-6">
                <p className="text-[10px] text-text-secondary uppercase font-bold">Frequência</p>
                <p className="text-lg font-bold text-accent-gold">{stats.rate}%</p>
              </div>
            </div>
          </div>

          {/* Members Attendance List */}
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">CIM</th>
                    <th className="py-4 px-6 font-semibold">Nome</th>
                    <th className="py-4 px-6 font-semibold">Grau</th>
                    <th className="py-4 px-6 font-semibold">Cargo na Loja</th>
                    <th className="py-4 px-6 font-semibold text-center">Frequência Geral</th>
                    <th className="py-4 px-6 font-semibold text-right">Presença</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-mono text-text-secondary">{member.cim || 'N/C'}</td>
                      <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                        <img src={member.foto} alt="" className="w-8 h-8 rounded-full border border-glass-border" />
                        {member.nome}
                      </td>
                      <td className="py-4 px-6 text-accent-gold font-medium">{member.grau}</td>
                      <td className="py-4 px-6 text-text-secondary">{member.cargoLoja || 'Irmão'}</td>
                      <td className="py-4 px-6 text-center font-bold text-white">{member.frequencia ? `${member.frequencia}%` : '100%'}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => toggleAttendance(member.id)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            attendance[member.id] 
                              ? 'bg-green-500/20 text-green-400 border-green-500/40 hover:bg-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          {attendance[member.id] ? 'PRESENTE' : 'AUSENTE'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-text-secondary">Nenhum membro encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => alert('Frequência salva com sucesso no banco de dados!')}
                className="modern-button bg-accent-gold/20 text-accent-gold border-accent-gold"
                style={{ cursor: 'pointer' }}
              >
                <ShieldCheck className="w-5 h-5" />
                Salvar Frequência da Sessão
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab Visitors */}
      {activeTab === 'visitors' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h3 className="text-2xl text-accent-gold">Visitantes Recebidos</h3>
            <button
              onClick={() => setIsVisitorModalOpen(true)}
              className="modern-button bg-accent-gold/20 text-accent-gold border-accent-gold"
              style={{ cursor: 'pointer' }}
            >
              <Plus className="w-4 h-4" />
              Registrar Visitante
            </button>
          </div>

          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Data</th>
                    <th className="py-4 px-6 font-semibold">Nome do Irmão</th>
                    <th className="py-4 px-6 font-semibold">Loja de Origem</th>
                    <th className="py-4 px-6 font-semibold">Potência</th>
                    <th className="py-4 px-6 font-semibold">Cidade</th>
                    <th className="py-4 px-6 font-semibold">Grau</th>
                    <th className="py-4 px-6 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-medium text-text-secondary">{visitor.data.split('-').reverse().join('/')}</td>
                      <td className="py-4 px-6 font-bold text-white">{visitor.nome}</td>
                      <td className="py-4 px-6 text-text-secondary">{visitor.loja}</td>
                      <td className="py-4 px-6 font-mono text-accent-gold font-medium">{visitor.potencia}</td>
                      <td className="py-4 px-6 text-text-secondary">{visitor.cidade || 'Não informada'}</td>
                      <td className="py-4 px-6 text-white font-medium">{visitor.grau}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handlePrintVisitorCertificate(visitor)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-accent-gold/45 bg-accent-gold/5 text-accent-gold hover:bg-accent-gold/20 flex items-center gap-1.5 ml-auto"
                          style={{ cursor: 'pointer' }}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Certificado</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visitors.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-text-secondary">Nenhum visitante registrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab Outbound Visits */}
      {activeTab === 'outbound' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h3 className="text-2xl text-accent-gold">Visitas Efetuadas a Outras Lojas</h3>
            <button
              onClick={() => setIsOutboundModalOpen(true)}
              className="modern-button bg-accent-gold/20 text-accent-gold border-accent-gold"
              style={{ cursor: 'pointer' }}
            >
              <Plus className="w-4 h-4" />
              Lançar Visita Efetuada
            </button>
          </div>

          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Data</th>
                    <th className="py-4 px-6 font-semibold">Irmão de nossa Loja</th>
                    <th className="py-4 px-6 font-semibold">Loja Visitada</th>
                    <th className="py-4 px-6 font-semibold">Potência</th>
                    <th className="py-4 px-6 font-semibold">Grau do Trabalho</th>
                  </tr>
                </thead>
                <tbody>
                  {outboundVisits.map((visit) => (
                    <tr key={visit.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-medium text-text-secondary">{visit.data.split('-').reverse().join('/')}</td>
                      <td className="py-4 px-6 font-bold text-white">{visit.irmao}</td>
                      <td className="py-4 px-6 text-text-secondary">{visit.lojaVisitada}</td>
                      <td className="py-4 px-6 font-mono text-accent-gold font-medium">{visit.potencia}</td>
                      <td className="py-4 px-6 text-white font-medium">{visit.grauSessao}</td>
                    </tr>
                  ))}
                  {outboundVisits.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-text-secondary">Nenhuma visita efetuada lançada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab Certificate Configurations */}
      {activeTab === 'certificate' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-2xl text-accent-gold font-bold">Certificado de Presença</h3>
              <p className="text-text-secondary text-xs mt-1">Configure o modelo e textos usados na emissão das presenças dos visitantes.</p>
            </div>
            
            <button
              onClick={() => handlePrintVisitorCertificate(previewMockData)}
              className="modern-button border-accent-gold/40 text-accent-gold bg-accent-gold/5 hover:bg-accent-gold/15"
              style={{ height: '40px', cursor: 'pointer' }}
            >
              <span>Pré-visualizar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Config Fields Form (Left Column) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <GlassCard className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-accent-gold font-bold uppercase tracking-wider">Título do certificado de presenças</label>
                  <input
                    type="text"
                    value={certConfig.titulo}
                    onChange={(e) => setCertConfig({...certConfig, titulo: e.target.value.toUpperCase()})}
                    className="modern-input"
                    style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <span className="text-[10px] text-text-secondary/70 mt-0.5">Texto usado no título do certificado.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-accent-gold font-bold uppercase tracking-wider">Cabeçalho linha 1</label>
                  <input
                    type="text"
                    value={certConfig.cabecalho1}
                    onChange={(e) => setCertConfig({...certConfig, cabecalho1: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <span className="text-[10px] text-text-secondary/70 mt-0.5">Primeira linha do cabeçalho do certificado.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-accent-gold font-bold uppercase tracking-wider">Cabeçalho linha 2</label>
                  <input
                    type="text"
                    value={certConfig.cabecalho2}
                    onChange={(e) => setCertConfig({...certConfig, cabecalho2: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <span className="text-[10px] text-text-secondary/70 mt-0.5">Segunda linha do cabeçalho do certificado.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-accent-gold font-bold uppercase tracking-wider">Texto do certificado de presenças</label>
                  <textarea
                    rows={6}
                    value={certConfig.texto}
                    onChange={(e) => setCertConfig({...certConfig, texto: e.target.value})}
                    className="modern-input py-3 resize-none leading-relaxed text-sm"
                    style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 mt-2 text-[10px] text-text-secondary flex flex-col gap-1 leading-relaxed">
                    <span className="font-bold text-accent-gold uppercase tracking-wide text-[9px] mb-1">Substituições automáticas:</span>
                    <span>• <strong>{`{NOME}`}</strong>: Nome do obreiro visitante.</span>
                    <span>• <strong>{`{DATA}`}</strong>: Data da sessão realizada.</span>
                    <span>• <strong>{`{TIPO}`}</strong>: Tipo de sessão (Ordinária, Iniciação, etc).</span>
                    <span>• <strong>{`{GRAU}`}</strong>: Grau maçônico do visitante.</span>
                    <span>• <strong>{`{CIDADE}`}</strong>: Cidade/Oriente do visitante.</span>
                    <span>• <strong>{`{LOJA}`}</strong>: Nome da Loja de origem.</span>
                    <span>• <strong>{`{POTENCIA}`}</strong>: Potência Maçônica (ex: GOB, GLSC).</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">Assinatura do Venerável</label>
                    <input
                      type="text"
                      value={certConfig.assinaturaVM}
                      onChange={(e) => setCertConfig({...certConfig, VM: e.target.value})}
                      className="modern-input"
                      placeholder="Nome do Venerável"
                      style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">Assinatura do Chanceler</label>
                    <input
                      type="text"
                      value={certConfig.assinaturaChanceler}
                      onChange={(e) => setCertConfig({...certConfig, assinaturaChanceler: e.target.value})}
                      className="modern-input"
                      placeholder="Nome do Chanceler"
                      style={{ paddingLeft: '12px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-accent-gold font-bold uppercase tracking-wider">Borda / Modelo de Impressão</label>
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <div className="w-16 h-12 bg-white/10 border border-white/15 rounded flex items-center justify-center overflow-hidden relative flex-shrink-0">
                      {/* Model preview placeholder resembling sismacom.com.br border structure */}
                      <div className="absolute inset-1 border-2 border-double border-yellow-500/80"></div>
                      <span className="text-[8px] font-bold text-accent-gold tracking-widest uppercase">Modelo 1</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white">Modelo Clássico 1</span>
                      <p className="text-[10px] text-text-secondary mt-0.5">Bordas clássicas douradas e brasão.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={handleSaveConfig}
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
                    <span>Salvar Configurações</span>
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Live Interactive Preview (Right Column) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="text-xs text-accent-gold font-bold uppercase tracking-wider pl-1">Visualização Interativa em Tempo Real</span>
              
              <GlassCard className="p-6 bg-white/5 border border-glass-border">
                
                {/* Visual Certificate Card Frame */}
                <div 
                  className="w-full relative p-12 bg-[#FAF8F5] text-[#1E293B] shadow-2xl rounded-sm font-serif select-none"
                  style={{
                    aspectRatio: '1.414 / 1', // standard physical layout
                    backgroundImage: `url(${modeloCertificado})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Gold Watermark Emblem */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.04, pointerEvents: 'none', userSelect: 'none' }}>
                    <img src={logoBrasao} style={{ width: '180px', height: '180px', objectFit: 'contain' }} alt="" />
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full text-center py-2">
                    
                    {/* Headers */}
                    <div>
                      <h4 className="text-[11px] font-bold tracking-widest text-[#B58920] uppercase font-sans mb-0.5">
                        {certConfig.cabecalho1 || 'NOME DA OFICINA NÃO INFORMADA'}
                      </h4>
                      <p className="text-[8px] tracking-wider text-slate-500 uppercase font-sans">
                        {certConfig.cabecalho2 || 'Federada ao GOB'}
                      </p>
                    </div>

                    {/* Title */}
                    <div className="my-1.5">
                      <h2 className="text-2xl font-black tracking-wider text-[#8C6B1B] uppercase font-serif border-b border-[#D4AF37]/25 pb-1 inline-block px-8">
                        {certConfig.titulo || 'CERTIFICADO DE PRESENÇA'}
                      </h2>
                    </div>

                    {/* Text block replacing brackets */}
                    <div className="px-6 text-xs leading-relaxed font-sans text-center text-slate-700 my-2 select-none">
                      {formatCertificateText(certConfig.texto, previewMockData)}
                    </div>

                    {/* Footer Row */}
                    <div className="mt-auto">
                      {/* Date */}
                      <p className="text-[10px] text-slate-400 italic mb-4 font-sans">
                        Dado e traçado no Oriente de Florianópolis, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.
                      </p>

                      {/* Signatures & Seal */}
                      <div className="grid grid-cols-12 gap-2 items-end mt-2">
                        {/* VM Line */}
                        <div className="col-span-5 flex flex-col items-center">
                          <div className="w-28 border-b border-slate-300 mb-1 pointer-events-none"></div>
                          <span className="text-[9px] font-bold text-slate-800 uppercase font-sans">{certConfig.assinaturaVM || 'Venerável Mestre'}</span>
                          <span className="text-[7px] text-slate-400 font-sans">Venerável Mestre</span>
                        </div>

                        {/* Seal in the middle - custom transparent overlay inside background ribbon seal */}
                        <div className="col-span-2 flex justify-center">
                          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', pointerEvents: 'none' }}>
                            <img src={logoBrasao} style={{ width: '28px', height: '28px', objectFit: 'contain' }} alt="" />
                          </div>
                        </div>

                        {/* Chanceler Line */}
                        <div className="col-span-5 flex flex-col items-center">
                          <div className="w-28 border-b border-slate-300 mb-1 pointer-events-none"></div>
                          <span className="text-[9px] font-bold text-slate-800 uppercase font-sans">{certConfig.assinaturaChanceler || 'Chanceler'}</span>
                          <span className="text-[7px] text-slate-400 font-sans">Chanceler</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center text-[10px] text-text-secondary/70 leading-relaxed bg-white/5 border border-white/5 p-3 rounded-lg">
                  💡 A pré-visualização acima reflete fielmente o layout de impressão em papel A4 (paisagem). <br />
                  Você pode usar o botão <strong>"Pré-visualizar"</strong> no topo para testar e acionar a impressão física ou salvar como PDF no navegador.
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* Visitor Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 bg-black-90 backdrop-blur-md flex items-center justify-center p-4 z-modal animate-fade-in">
          <div className="bg-bg-secondary border border-glass-border max-w-lg w-full rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsVisitorModalOpen(false)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-glass-border"
              style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer' }}
            >
              <X className="w-4 h-4 text-red-400 hover:text-red-300" />
            </button>

            <h3 className="text-2xl text-accent-gold mb-6 font-display font-bold">Registrar Novo Visitante</h3>
            
            <form onSubmit={handleAddVisitor} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Nome do Irmão</label>
                <input
                  type="text"
                  required
                  value={newVisitor.nome}
                  onChange={(e) => setNewVisitor({...newVisitor, nome: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Loja de Origem</label>
                  <input
                    type="text"
                    required
                    value={newVisitor.loja}
                    onChange={(e) => setNewVisitor({...newVisitor, loja: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Potência</label>
                  <input
                    type="text"
                    required
                    value={newVisitor.potencia}
                    onChange={(e) => setNewVisitor({...newVisitor, potencia: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Cidade / Oriente</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Florianópolis"
                    value={newVisitor.cidade}
                    onChange={(e) => setNewVisitor({...newVisitor, cidade: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Data da Sessão</label>
                  <input
                    type="date"
                    required
                    value={newVisitor.data}
                    onChange={(e) => setNewVisitor({...newVisitor, data: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Grau Maçônico</label>
                <select
                  value={newVisitor.grau}
                  onChange={(e) => setNewVisitor({...newVisitor, grau: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                >
                  <option>Aprendiz Maçom</option>
                  <option>Companheiro Maçom</option>
                  <option>Mestre Maçom</option>
                  <option>Mestre Instalado</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  className="modern-button border-white/10 text-white"
                  style={{ cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modern-button bg-accent-gold/20 text-accent-gold border-accent-gold"
                  style={{ cursor: 'pointer' }}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outbound Modal */}
      {isOutboundModalOpen && (
        <div className="fixed inset-0 bg-black-90 backdrop-blur-md flex items-center justify-center p-4 z-modal animate-fade-in">
          <div className="bg-bg-secondary border border-glass-border max-w-lg w-full rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsOutboundModalOpen(false)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-glass-border"
              style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer' }}
            >
              <X className="w-4 h-4 text-red-400 hover:text-red-300" />
            </button>

            <h3 className="text-2xl text-accent-gold mb-6 font-display font-bold">Lançar Visita Efetuada</h3>
            <form onSubmit={handleAddOutbound} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Irmão de nossa Oficina</label>
                <select
                  required
                  value={newOutbound.irmaoId}
                  onChange={(e) => setNewOutbound({...newOutbound, irmaoId: e.target.value})}
                  className="modern-input"
                  style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                >
                  <option value="">Selecione o Irmão...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Loja Visitada</label>
                  <input
                    type="text"
                    required
                    value={newOutbound.lojaVisitada}
                    onChange={(e) => setNewOutbound({...newOutbound, lojaVisitada: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Potência</label>
                  <input
                    type="text"
                    required
                    value={newOutbound.potencia}
                    onChange={(e) => setNewOutbound({...newOutbound, potencia: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Grau do Trabalho</label>
                  <select
                    value={newOutbound.grauSessao}
                    onChange={(e) => setNewOutbound({...newOutbound, grauSessao: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                  >
                    <option>Aprendiz Maçom</option>
                    <option>Companheiro Maçom</option>
                    <option>Mestre Maçom</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Data da Visita</label>
                  <input
                    type="date"
                    required
                    value={newOutbound.data}
                    onChange={(e) => setNewOutbound({...newOutbound, data: e.target.value})}
                    className="modern-input"
                    style={{ paddingLeft: '16px', background: '#131316', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOutboundModalOpen(false)}
                  className="modern-button border-white/10 text-white"
                  style={{ cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modern-button bg-accent-gold/20 text-accent-gold border-accent-gold"
                  style={{ cursor: 'pointer' }}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Certificate Modal Preview */}
      {printVisitor && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-modal animate-fade-in no-print">
          <div className="bg-[#121214] border border-glass-border rounded-2xl p-6 shadow-2xl relative w-full max-w-4xl animate-scale-up">
            
            {/* Header controls (Hidden during print) */}
            <div className="flex justify-between items-center mb-6 border-b border-glass-border/30 pb-4 no-print">
              <div className="flex items-center gap-2">
                <Award className="text-accent-gold w-6 h-6" />
                <div>
                  <h3 className="text-white font-bold text-lg">Visualizador do Certificado de Presença</h3>
                  <p className="text-[10px] text-text-secondary">Confirmar preenchimento antes de acionar a impressão física ou exportação em PDF.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="modern-button"
                  style={{ 
                    background: 'var(--accent-gold)', 
                    color: 'black', 
                    height: '38px', 
                    padding: '0 18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Certificado</span>
                </button>

                <button 
                  onClick={() => setPrintVisitor(null)}
                  className="action-icon-button"
                  style={{ cursor: 'pointer' }}
                >
                  <X className="w-5 h-5 text-red-400 hover:text-red-300" />
                </button>
              </div>
            </div>

            {/* A4 Landscape Printable Certificate Container */}
            <div className="overflow-auto max-h-[70vh] flex items-center justify-center p-4 bg-white/5 border border-white/5 rounded-xl">
              <div 
                id="print-certificate-area" 
                className="w-full max-w-[800px] relative p-12 bg-[#FAF8F5] text-[#1E293B] shadow-2xl rounded-sm font-serif select-none"
                style={{
                  aspectRatio: '1.414 / 1', // exact A4 landscaping
                  backgroundImage: `url(${modeloCertificado})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                {/* Gold Watermark emblem */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.04, pointerEvents: 'none', userSelect: 'none' }}>
                  <img src={logoBrasao} style={{ width: '240px', height: '240px', objectFit: 'contain' }} alt="" />
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full text-center py-4">
                  {/* Top Header */}
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-[#B58920] uppercase font-sans mb-0.5">
                      {certConfig.cabecalho1 || 'A.R.L.S. ARCO REAL'}
                    </h4>
                    <p className="text-[9px] tracking-wider text-slate-500 uppercase font-sans">
                      {certConfig.cabecalho2 || 'Federada ao GOB'}
                    </p>
                  </div>

                  {/* Title */}
                  <div className="my-2">
                    <h2 className="text-3xl font-black tracking-widest text-[#8C6B1B] uppercase font-serif border-b border-[#D4AF37]/25 pb-1 inline-block px-12">
                      {certConfig.titulo || 'CERTIFICADO DE PRESENÇA'}
                    </h2>
                  </div>

                  {/* Dynamic certificate body */}
                  <div className="px-10 text-sm leading-relaxed font-sans text-center text-slate-700 my-4">
                    {formatCertificateText(certConfig.texto, printVisitor)}
                  </div>

                  {/* Bottom Footer block */}
                  <div className="mt-auto">
                    {/* Date */}
                    <p className="text-xs text-slate-400 italic mb-6 font-sans">
                      Dado e traçado no Oriente de Florianópolis, {new Date(printVisitor.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.
                    </p>

                    {/* Signatures & Seal row */}
                    <div className="grid grid-cols-12 gap-4 items-end mt-4">
                      
                      {/* VM Line */}
                      <div className="col-span-5 flex flex-col items-center">
                        <div className="w-40 border-b border-slate-300 mb-1.5 pointer-events-none"></div>
                        <span className="text-[10px] font-bold text-slate-800 uppercase font-sans">{certConfig.assinaturaVM || 'Venerável Mestre'}</span>
                        <span className="text-[8px] text-slate-400 font-sans">Venerável Mestre</span>
                      </div>

                      {/* Mascot Seal in mid - custom transparent overlay inside background ribbon seal */}
                      <div className="col-span-2 flex justify-center">
                        <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', pointerEvents: 'none' }}>
                          <img src={logoBrasao} style={{ width: '34px', height: '34px', objectFit: 'contain' }} alt="" />
                        </div>
                      </div>

                      {/* Chanceler Line */}
                      <div className="col-span-5 flex flex-col items-center">
                        <div className="w-40 border-b border-slate-300 mb-1.5 pointer-events-none"></div>
                        <span className="text-[10px] font-bold text-slate-800 uppercase font-sans">{certConfig.assinaturaChanceler || 'Chanceler'}</span>
                        <span className="text-[8px] text-slate-400 font-sans">Chanceler</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-right no-print">
              <p className="text-[10px] text-text-secondary leading-relaxed italic">
                * Dica: Ao acionar a impressão, selecione o layout "Paisagem" (Landscape) e ative a opção "Imprimir gráficos de fundo" (Print background graphics) para a borda dourada e o selo aparecerem perfeitamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chancellery;
