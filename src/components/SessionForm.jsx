import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, CheckSquare, Square, CheckCircle2, XCircle, AlertCircle, FolderOpen, FileText as FileIcon } from 'lucide-react';

const formatDateBR = (dateStr) => {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  return dateStr;
};

const SessionForm = ({ session, members, onClose, onSave, defaultTab = 'dados' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    grau: '',
    tipo: '',
    pauta: '',
    obs: '',
    ataContent: '',
    ataFile: '',
    ataFileName: '',
    direitoVoto: true,
    ataTransformacao: false,
  });

  // attendancesState maps memberId -> { status, motivo }
  // Status can be: 'Presente', 'Falta', 'Falta Justificada'
  const [attendancesState, setAttendancesState] = useState({});

  useEffect(() => {
    if (session) {
      setFormData({
        nome: session.nome || '',
        data: session.data || '',
        grau: session.grau || '',
        tipo: session.tipo || '',
        pauta: session.pauta || '',
        obs: session.obs || '',
        ataContent: session.ataContent || '',
        ataFile: session.ataFile || '',
        ataFileName: session.ataFileName || '',
        direitoVoto: session.direitoVoto ?? true,
        ataTransformacao: session.ataTransformacao || false,
      });

      if (session.attendances) {
        const attMap = {};
        session.attendances.forEach(a => {
          attMap[a.membroId] = { status: a.status, motivo: a.motivo || '' };
        });
        setAttendancesState(attMap);
      }
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAttendanceChange = (membroId, status) => {
    setAttendancesState(prev => ({
      ...prev,
      [membroId]: { ...prev[membroId], status }
    }));
  };

  const handleMotivoChange = (membroId, motivo) => {
    setAttendancesState(prev => ({
      ...prev,
      [membroId]: { ...prev[membroId], motivo }
    }));
  };

  const markAll = (status) => {
    const newAtt = { ...attendancesState };
    members.forEach(m => {
      newAtt[m.id] = { status, motivo: newAtt[m.id]?.motivo || '' };
    });
    setAttendancesState(newAtt);
  };

  const calculateDegreeAtDate = (member, sessionDate) => {
    if (!sessionDate) return member.grau;
    const sDate = new Date(sessionDate);
    const initDate = member.iniciacaoData ? new Date(member.iniciacaoData) : null;
    const elevDate = member.elevacaoData ? new Date(member.elevacaoData) : null;
    const exaltDate = member.exaltacaoData ? new Date(member.exaltacaoData) : null;
    const fillDate = member.filiacaoData ? new Date(member.filiacaoData) : null;

    if (initDate && sDate < initDate) return "N/A (Não iniciado)";
    if (fillDate && sDate < fillDate && (!initDate || sDate < initDate)) return "N/A (Não filiado)";

    if (exaltDate && sDate >= exaltDate) return "Mestre";
    if (elevDate && sDate >= elevDate) return "Companheiro";
    if (initDate && sDate >= initDate) return "Aprendiz";
    return member.grau;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          ataFile: event.target.result, // Base64 content
          ataFileName: file.name // We need a new field for the name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const attendancesArray = Object.keys(attendancesState).map(membroId => ({
      membroId: Number(membroId),
      status: attendancesState[membroId].status,
      motivo: attendancesState[membroId].motivo,
    }));

    onSave({
      ...formData,
      attendances: attendancesArray
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 shadow-2xl" style={{ padding: 0, background: 'var(--bg-secondary)' }}>
        
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-glass-border flex justify-between items-center bg-bg-secondary">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-accent-gold/10">
              <Calendar className="w-6 h-6 text-accent-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold masonic-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                Cadastro de Sessões
                {formData.data && ` - Data: ${formatDateBR(formData.data)}`}
              </h2>
              <p className="text-sm text-text-secondary uppercase tracking-widest mt-1">SisOriente</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-glass-bg rounded-full transition-colors text-text-secondary hover:text-text-primary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex px-8 border-b border-glass-border bg-glass-bg gap-6 overflow-x-auto custom-scrollbar">
          <button 
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap
              ${activeTab === 'dados' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
            onClick={() => setActiveTab('dados')}
          >
            Dados da Sessão
          </button>
          <button 
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap
              ${activeTab === 'ata' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
            onClick={() => setActiveTab('ata')}
          >
            Redigir Ata
          </button>
          <button 
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap
              ${activeTab === 'frequencias' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
            onClick={() => setActiveTab('frequencias')}
          >
            Frequências
            <span className="bg-accent-gold/20 text-accent-gold px-2 py-0.5 rounded-full text-xs">
              {Object.values(attendancesState).filter(a => a.status === 'Presente').length}/{members.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {activeTab === 'dados' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Código</label>
                  <input type="text" disabled value={session ? session.id : 'NOVO'} className="modern-input opacity-50 cursor-not-allowed" style={{ paddingLeft: '16px' }} />
                </div>
                <div className="col-span-10">
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Nome da Sessão</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="modern-input" style={{ paddingLeft: '16px' }} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4">
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Data</label>
                  <input type="date" name="data" value={formData.data} onChange={handleInputChange} className="modern-input" style={{ paddingLeft: '16px' }} />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Grau</label>
                  <select 
                    name="grau" 
                    value={formData.grau} 
                    onChange={handleInputChange} 
                    className="modern-input" 
                    style={{ paddingLeft: '12px', cursor: 'pointer' }}
                  >
                    <option value="">Selecione o Grau...</option>
                    <option value="1 - Aprendiz">1 - Aprendiz</option>
                    <option value="2 - Companheiro">2 - Companheiro</option>
                    <option value="3 - Mestre Maçom">3 - Mestre Maçom</option>
                    {formData.grau && !["1 - Aprendiz", "2 - Companheiro", "3 - Mestre Maçom"].includes(formData.grau) && (
                      <option value={formData.grau}>{formData.grau}</option>
                    )}
                  </select>
                </div>
                <div className="col-span-4 flex flex-col justify-center gap-2 pl-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="direitoVoto" checked={formData.direitoVoto} onChange={handleInputChange} className="w-4 h-4 rounded border-glass-border text-accent-gold focus:ring-accent-gold" />
                    <span className="text-sm font-medium text-text-secondary">Direito a voto</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="ataTransformacao" checked={formData.ataTransformacao} onChange={handleInputChange} className="w-4 h-4 rounded border-glass-border text-accent-gold focus:ring-accent-gold" />
                    <span className="text-sm font-medium text-text-secondary">Ata por Transformação</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Tipo</label>
                  <input type="text" name="tipo" value={formData.tipo} onChange={handleInputChange} className="modern-input" style={{ paddingLeft: '16px' }} />
                </div>
                <div className="col-span-6">
                  <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Pauta</label>
                  <input type="text" name="pauta" value={formData.pauta} onChange={handleInputChange} className="modern-input" style={{ paddingLeft: '16px' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Observações</label>
                <textarea 
                  name="obs" 
                  value={formData.obs} 
                  onChange={handleInputChange} 
                  className="modern-input custom-scrollbar" 
                  style={{ paddingLeft: '16px', minHeight: '120px', resize: 'vertical' }} 
                />
              </div>

            </div>
          )}

          {activeTab === 'ata' && (
            <div className="space-y-6 animate-fadeIn h-full flex flex-col">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-text-primary">Redação da Ata</h3>
                <div className="flex gap-4 items-center">
                  <label className="text-xs font-bold text-text-secondary uppercase">Arquivo .DOC:</label>
                  <div className="relative flex items-center">
                    <button 
                      type="button"
                      onClick={() => document.getElementById('ata-file-input').click()}
                      className="absolute left-2 p-1.5 hover:bg-accent-gold/10 rounded-lg text-accent-gold transition-colors z-10"
                      title="Procurar arquivo no computador"
                    >
                      <FolderOpen className="w-5 h-5" />
                    </button>
                    <input 
                      type="text" 
                      name="ataFileName" 
                      placeholder="Ex: ATA001.DOC"
                      value={formData.ataFileName} 
                      onChange={handleInputChange} 
                      className="modern-input" 
                      style={{ paddingLeft: '44px', paddingRight: '16px', height: '40px', width: '280px' }} 
                    />
                    <input 
                      id="ata-file-input"
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".doc,.docx,.pdf"
                    />
                  </div>
                </div>
              </div>
              <textarea 
                name="ataContent" 
                value={formData.ataContent} 
                onChange={handleInputChange} 
                placeholder="Escreva aqui os detalhes da sessão, pautas discutidas e resoluções..."
                className="modern-input flex-1 custom-scrollbar" 
                style={{ 
                  padding: '24px', 
                  minHeight: '400px', 
                  resize: 'none', 
                  background: 'white',
                  color: '#1a1a1a',
                  lineHeight: '1.8',
                  fontSize: '1.05rem',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)'
                }} 
              />
              <div className="bg-accent-gold/10 p-4 rounded-xl border border-accent-gold/20 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary">
                  <strong>Dica:</strong> Você pode redigir a ata diretamente aqui ou informar o nome do arquivo Word correspondente para manter a organização igual ao sistema anterior.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'frequencias' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-text-primary">Lista de Presença</h3>
                <div className="flex gap-2">
                  <button onClick={() => markAll('Presente')} className="px-3 py-1.5 bg-green-500/10 text-green-600 rounded-md text-xs font-medium hover:bg-green-500/20 transition-colors flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Todos Presentes
                  </button>
                  <button onClick={() => markAll('Falta')} className="px-3 py-1.5 bg-red-500/10 text-red-600 rounded-md text-xs font-medium hover:bg-red-500/20 transition-colors flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Todos Faltas
                  </button>
                </div>
              </div>

              <div className="bg-glass-bg border border-glass-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-text-secondary">
                  <thead className="bg-white/5 border-b border-glass-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Irmão</th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs text-center">Status</th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Justificativa (se houver)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {members.map(member => {
                      const currentStatus = attendancesState[member.id]?.status || '';
                      return (
                        <tr key={member.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-text-primary">{member.nome}</div>
                            <div className="text-[10px] uppercase font-bold text-accent-gold">
                              {calculateDegreeAtDate(member, formData.data)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleAttendanceChange(member.id, 'Presente')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentStatus === 'Presente' ? 'bg-green-500 text-white shadow-lg' : 'bg-glass-bg hover:bg-green-500/20 text-text-secondary hover:text-green-600'}`}
                                title="Presente"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleAttendanceChange(member.id, 'Falta')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentStatus === 'Falta' ? 'bg-red-500 text-white shadow-lg' : 'bg-glass-bg hover:bg-red-500/20 text-text-secondary hover:text-red-600'}`}
                                title="Falta"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleAttendanceChange(member.id, 'Falta Justificada')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentStatus === 'Falta Justificada' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-glass-bg hover:bg-yellow-500/20 text-text-secondary hover:text-yellow-600'}`}
                                title="Falta Justificada / Abstenção"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              value={attendancesState[member.id]?.motivo || ''}
                              onChange={(e) => handleMotivoChange(member.id, e.target.value)}
                              placeholder="Motivo da falta..."
                              className="w-full bg-transparent border-b border-transparent focus:border-accent-gold outline-none py-1 text-sm transition-colors placeholder:text-text-secondary/50"
                              disabled={currentStatus === 'Presente'}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-glass-border flex justify-end gap-4 bg-glass-bg">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="modern-button"
            style={{ padding: '10px 24px', background: 'var(--accent-gold)', color: 'black' }}
          >
            <Save className="w-4 h-4" />
            <span className="font-semibold">SALVAR</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default SessionForm;
