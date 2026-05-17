import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Save, 
  FileText,
  Cake,
  Award,
  Users,
  Compass
} from 'lucide-react';

const Agenda = () => {
  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 17)); // Maio 2026, com dia 17 selecionado/hoje
  const [isRegistering, setIsRegistering] = useState(false);

  // Events list
  const [events, setEvents] = useState([
    {
      id: 1,
      titulo: "Sessão Ordinária - Grau de Aprendiz",
      data: "2026-05-20",
      horario: "20:00",
      local: "Templo Principal",
      categoria: "Sessão",
      tipoEvento: "Sessão Ordinária",
      descricao: "Instrução do Primeiro Grau. Presença obrigatória de todos."
    },
    {
      id: 2,
      titulo: "Ágape Fraternal das Esposas",
      data: "2026-05-23",
      horario: "21:30",
      local: "Salão de Banquetes",
      categoria: "Familiar",
      tipoEvento: "Ágape Fraternal",
      descricao: "Jantar especial de confraternização."
    },
    {
      id: 3,
      titulo: "Aniversário do Ir. Leandro Bessa",
      data: "2026-05-15",
      horario: "00:00",
      local: "Particular",
      categoria: "Irmão",
      tipoEvento: "Aniversário de Irmão",
      descricao: "Cumprimentos ao nosso Venerável Mestre por mais um ano de vida."
    },
    {
      id: 4,
      titulo: "Aniversário de Iniciação - Ir. Roberto Silva",
      data: "2026-05-08",
      horario: "20:00",
      local: "Templo",
      categoria: "Iniciação",
      tipoEvento: "Aniversário de Iniciação",
      descricao: "Data comemorativa da iniciação nas colunas do Ir. Roberto."
    },
    {
      id: 5,
      titulo: "Fundação da Loja ARLS Major Manoel dos Santos",
      data: "2026-05-02",
      horario: "00:00",
      local: "Templo Principal",
      categoria: "Loja",
      tipoEvento: "Aniversário da Loja",
      descricao: "Comemoração oficial do aniversário de fundação da oficina."
    },
    {
      id: 6,
      titulo: "Reunião Administrativa de Graus",
      data: "2026-06-01",
      horario: "19:00",
      local: "Sala da Administração",
      categoria: "Sessão",
      tipoEvento: "Reunião de Diretoria",
      descricao: "Instrução interna para companheiros."
    }
  ]);

  // Filter Checkbox States
  const [filters, setFilters] = useState({
    irmao: true,
    iniciacao: true,
    familiar: true,
    loja: true,
    sessoes: true
  });
  const [degreeFilter, setDegreeFilter] = useState('');

  // Form State
  const [newEvent, setNewEvent] = useState({
    tipoEvento: '',
    data: '',
    horario: '20:00',
    descricao: '',
    local: ''
  });

  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to generate dynamic days for the calendar grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCheckboxChange = (name) => {
    setFilters({ ...filters, [name]: !filters[name] });
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    const id = events.length ? Math.max(...events.map(ev => ev.id)) + 1 : 1;
    
    // Map selected event type to filter category
    let categoria = 'Sessão';
    if (newEvent.tipoEvento === 'Aniversário') categoria = 'Irmão';
    else if (newEvent.tipoEvento === 'Iniciação') categoria = 'Iniciação';
    else if (newEvent.tipoEvento === 'Confraternização' || newEvent.tipoEvento === 'Jantar') categoria = 'Familiar';
    else if (newEvent.tipoEvento === 'Eleição' || newEvent.tipoEvento === 'Cerimônia de Posse' || newEvent.tipoEvento === 'Outros' || newEvent.tipoEvento === 'Palestra' || newEvent.tipoEvento === 'Workshop') categoria = 'Loja';

    const eventToAdd = {
      id,
      titulo: newEvent.tipoEvento + (newEvent.descricao ? ` - ${newEvent.descricao}` : ''),
      data: newEvent.data,
      horario: newEvent.horario || "20:00",
      local: newEvent.local || "Templo Principal",
      categoria,
      tipoEvento: newEvent.tipoEvento,
      descricao: newEvent.descricao
    };

    setEvents([...events, eventToAdd]);
    setIsRegistering(false);
    setNewEvent({
      tipoEvento: '',
      data: '',
      horario: '20:00',
      descricao: '',
      local: ''
    });
  };

  // Filter events based on checkboxes and search degree query
  const filteredEvents = events.filter(ev => {
    if (ev.categoria === 'Irmão' && !filters.irmao) return false;
    if (ev.categoria === 'Iniciação' && !filters.iniciacao) return false;
    if (ev.categoria === 'Familiar' && !filters.familiar) return false;
    if (ev.categoria === 'Loja' && !filters.loja) return false;
    if (ev.categoria === 'Sessão' && !filters.sessoes) return false;
    
    if (degreeFilter) {
      const matchDegree = ev.titulo.toLowerCase().includes(degreeFilter.toLowerCase()) || 
                          ev.descricao.toLowerCase().includes(degreeFilter.toLowerCase());
      if (!matchDegree) return false;
    }
    return true;
  });

  // Render Calendar Grid Cells
  const calendarCells = [];
  
  // Fill leading empty cells
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="calendar-day empty border border-transparent bg-[#14263f]/30 min-h-[100px] rounded-lg" />);
  }

  // Fill calendar days
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : month + 1;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    
    // Find events on this specific day
    const dayEvents = filteredEvents.filter(ev => ev.data === dateStr);
    
    // Highlight if day is 17 (default today state in Mayo 2026)
    const isToday = day === 17 && month === 4 && year === 2026;

    calendarCells.push(
      <div 
        key={`day-${day}`} 
        className={`calendar-day border border-white/10 p-2 min-h-[100px] flex flex-col justify-between transition-all hover:bg-[#2b4c7e]/90 hover:border-white/25 relative rounded-lg ${
          isToday 
            ? 'bg-accent-gold/25 border-2 border-accent-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
            : 'bg-[#1d3557]/85 shadow-md'
        }`}
      >
        <span className={`text-xs font-semibold ${isToday ? 'text-accent-gold font-bold bg-accent-gold/20 px-1.5 py-0.5 rounded-full' : 'text-text-secondary'} self-start`}>
          {day}
        </span>
        
        {/* Render day events */}
        <div className="flex flex-col gap-1 mt-2 w-full overflow-y-auto max-h-[80px] hide-scrollbar">
          {dayEvents.map(ev => {
            let colorClass = "bg-accent-gold/20 text-accent-gold border-accent-gold/30";
            if (ev.categoria === 'Irmão') colorClass = "bg-blue-500/20 text-blue-400 border-blue-500/30";
            else if (ev.categoria === 'Iniciação') colorClass = "bg-purple-500/20 text-purple-400 border-purple-500/30";
            else if (ev.categoria === 'Familiar') colorClass = "bg-green-500/20 text-green-400 border-green-500/30";
            else if (ev.categoria === 'Loja') colorClass = "bg-pink-500/20 text-pink-400 border-pink-500/30";

            return (
              <div 
                key={ev.id} 
                className={`text-[9px] px-1 py-0.5 rounded border leading-none truncate max-w-full font-medium ${colorClass}`}
                title={ev.titulo}
              >
                {ev.categoria === 'Irmão' ? '🎂 ' : ev.categoria === 'Sessão' ? '🏛️ ' : '✨ '}
                {ev.tipoEvento}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Complete grid with trailing cells
  const totalCells = calendarCells.length;
  const remainingCells = 42 - totalCells; // 6 rows of 7 columns
  for (let i = 0; i < remainingCells; i++) {
    calendarCells.push(<div key={`empty-end-${i}`} className="calendar-day empty border border-transparent bg-[#14263f]/30 min-h-[100px] rounded-lg" />);
  }

  if (isRegistering) {
    return (
      <div className="p-8 animate-fade-in">
        {/* Form Header */}
        <div className="flex justify-between items-center mb-8 border-b border-glass-border/30 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl text-white font-bold" style={{ fontFamily: 'var(--font-display)' }}>Agenda</h2>
            <span className="text-text-secondary text-sm">/ Cadastrar</span>
          </div>
          <button
            onClick={() => setIsRegistering(false)}
            className="modern-button bg-white/5 border border-glass-border text-text-secondary hover:text-white px-4 py-2 font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* Form Body */}
        <GlassCard className="max-w-4xl mx-auto border border-accent-gold/20">
          <div className="border-b border-glass-border/30 pb-3 mb-6">
            <h3 className="text-xl text-accent-gold font-display font-semibold">Dados do Evento</h3>
          </div>

          <form onSubmit={handleSaveEvent} className="flex flex-col gap-6">
            {/* Event Input */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm text-text-secondary text-right font-medium">
                Evento <span className="text-red-400">*</span>
              </label>
              <div className="col-span-9">
                <select
                  required
                  value={newEvent.tipoEvento}
                  onChange={(e) => setNewEvent({ ...newEvent, tipoEvento: e.target.value })}
                  className="modern-input w-full cursor-pointer"
                  style={{ paddingLeft: '16px' }}
                >
                  <option value="">--- escolha ---</option>
                  <option value="Aniversário">Aniversário</option>
                  <option value="Cerimônia de Posse">Cerimônia de Posse</option>
                  <option value="Confraternização">Confraternização</option>
                  <option value="Eleição">Eleição</option>
                  <option value="Elevação">Elevação</option>
                  <option value="Escrutíneo Secreto">Escrutíneo Secreto</option>
                  <option value="Extaltação">Extaltação</option>
                  <option value="Iniciação">Iniciação</option>
                  <option value="Jantar">Jantar</option>
                  <option value="Outros">Outros</option>
                  <option value="Palestra">Palestra</option>
                  <option value="Sessão">Sessão</option>
                  <option value="Sessão Magna">Sessão Magna</option>
                  <option value="Tempo de Estudos">Tempo de Estudos</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
            </div>

            {/* Date Input */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm text-text-secondary text-right font-medium">
                Data <span className="text-red-400">*</span>
              </label>
              <div className="col-span-9 relative">
                <input
                  type="date"
                  required
                  value={newEvent.data}
                  onChange={(e) => setNewEvent({ ...newEvent, data: e.target.value })}
                  className="modern-input w-full"
                  style={{ paddingLeft: '48px' }}
                />
                <CalendarIcon className="w-5 h-5 text-accent-gold absolute left-4 top-3" />
              </div>
            </div>

            {/* Time Input */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm text-text-secondary text-right font-medium">
                Horário <span className="text-red-400">*</span>
              </label>
              <div className="col-span-9 relative">
                <input
                  type="time"
                  required
                  value={newEvent.horario}
                  onChange={(e) => setNewEvent({ ...newEvent, horario: e.target.value })}
                  className="modern-input w-full"
                  style={{ paddingLeft: '48px' }}
                />
                <Clock className="w-5 h-5 text-accent-gold absolute left-4 top-3" />
              </div>
            </div>

            {/* Description Input */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm text-text-secondary text-right font-medium">
                Descrição
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  placeholder="Ex: Instrução de Primeiro Grau pelas colunas..."
                  value={newEvent.descricao}
                  onChange={(e) => setNewEvent({ ...newEvent, descricao: e.target.value })}
                  className="modern-input w-full"
                  style={{ paddingLeft: '16px' }}
                />
              </div>
            </div>

            {/* Local Input */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm text-text-secondary text-right font-medium">
                Local
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  placeholder="Ex: Templo Principal"
                  value={newEvent.local}
                  onChange={(e) => setNewEvent({ ...newEvent, local: e.target.value })}
                  className="modern-input w-full"
                  style={{ paddingLeft: '16px' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-start gap-4 pt-4 border-t border-glass-border/30 mt-4 pl-[25%]">
              <button
                type="submit"
                className="modern-button bg-green-600 text-white border-green-600 hover:bg-green-700 px-6 py-2.5 font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-4xl mb-2 masonic-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>Agenda da Loja</h2>
          <p className="text-text-secondary">Calendário de sessões, reuniões e eventos oficiais da ARLS Major Manoel dos Santos Portugal.</p>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Side: Filter Card (Exactly like Screenshot) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <GlassCard className="border border-glass-border">
            <h3 className="text-lg text-accent-gold font-display font-semibold mb-4 border-b border-glass-border/30 pb-2">
              Filtro
            </h3>
            
            {/* Anniversary Filters */}
            <div className="flex flex-col gap-4">
              <p className="text-xs text-white uppercase tracking-wider font-bold text-left">
                Aniversário
              </p>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer text-xs text-text-secondary hover:text-white">
                  <input
                    type="checkbox"
                    checked={filters.irmao}
                    onChange={() => handleCheckboxChange('irmao')}
                    className="custom-checkbox"
                  />
                  <span>Aniversário de Irmão</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs text-text-secondary hover:text-white">
                  <input
                    type="checkbox"
                    checked={filters.iniciacao}
                    onChange={() => handleCheckboxChange('iniciacao')}
                    className="custom-checkbox"
                  />
                  <span>Aniversário de Iniciação</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs text-text-secondary hover:text-white">
                  <input
                    type="checkbox"
                    checked={filters.familiar}
                    onChange={() => handleCheckboxChange('familiar')}
                    className="custom-checkbox"
                  />
                  <span>Aniversário de Familiar</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs text-text-secondary hover:text-white">
                  <input
                    type="checkbox"
                    checked={filters.loja}
                    onChange={() => handleCheckboxChange('loja')}
                    className="custom-checkbox"
                  />
                  <span>Aniversário da Loja</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs text-text-secondary hover:text-white border-t border-glass-border/25 pt-3">
                  <input
                    type="checkbox"
                    checked={filters.sessoes}
                    onChange={() => handleCheckboxChange('sessoes')}
                    className="custom-checkbox"
                  />
                  <span>Exibir as sessões</span>
                </label>
              </div>
            </div>

            {/* Sessions / Degree Filter */}
            <div className="flex flex-col gap-2 mt-6">
              <label className="text-xs text-white uppercase tracking-wider font-bold">
                Sessões/Grau
              </label>
              <input
                type="text"
                placeholder="Filtrar por Grau..."
                value={degreeFilter}
                onChange={(e) => setDegreeFilter(e.target.value)}
                className="modern-input text-xs w-full"
                style={{ paddingLeft: '12px' }}
              />
            </div>

            {/* Filter Action Button */}
            <button
              onClick={() => {}} // State automatically applies filtering, but button satisfies visual layout
              className="modern-button w-full mt-6 bg-[#00B0FF] text-white border-[#00B0FF] hover:bg-[#00B0FF]/80 py-2.5 font-bold transition-all"
            >
              Filtrar
            </button>
          </GlassCard>
        </div>

        {/* Right Side: Calendar Grid (Exactly like Screenshot) */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
          <GlassCard className="border border-glass-border flex flex-col gap-6">
            
            {/* Calendar Controls and Month Header */}
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-glass-border/20 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded bg-white/5 border border-glass-border text-accent-gold hover:bg-white/10"
                  title="Mês Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded bg-white/5 border border-glass-border text-accent-gold hover:bg-white/10"
                  title="Próximo Mês"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Centered Month Year */}
              <h3 className="text-2xl text-white font-display font-medium capitalize">
                {months[month]} {year}
              </h3>

              {/* Right Side Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  className="p-2.5 rounded bg-white/5 border border-glass-border text-text-secondary hover:text-white"
                  title="Exportar Calendário"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsRegistering(true)}
                  className="modern-button bg-[#2E7D32] hover:bg-[#1B5E20] border-[#2E7D32] text-white px-4 py-2.5 font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo
                </button>
              </div>
            </div>

            {/* Weekdays row */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-accent-gold bg-white/5 py-3 rounded-lg border border-glass-border/20">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            {/* Month Day Cells */}
            <div className="grid grid-cols-7 gap-1.5 mt-2 bg-[#0f1d3a] p-3 rounded-xl border border-[#2b4c7e]/40 shadow-lg">
              {calendarCells}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Agenda;
