export const mockMembers = [
  {
    id: 1,
    codigo: "001",
    cim: "123456",
    nome: "Leandro Bessa",
    nascimento: "1980-05-15",
    estadoCivil: "Casado",
    naturalidade: "São Paulo - SP",
    grauInstrucao: "Superior Completo",
    cpf: "111.222.333-44",
    rg: "12.345.678-9",
    orgaoExpedidorRg: "SSP/SP",
    tituloEleitoral: "1234567890",
    zonaEleitoral: "123",
    secaoEleitoral: "456",
    cidadeEleitoral: "São Paulo",
    ufEleitoral: "SP",
    carteiraEstrangeiro: "",
    orgaoExpedidorEstrangeiro: "",
    sangue: "O",
    rh: "Positivo",
    nomePai: "João Bessa",
    nomeMae: "Maria Bessa",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leandro",
    
    // Contato
    endereco: "Rua das Acácias, 123",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01000-000",
    telefoneResidencial: "(11) 3333-4444",
    celular: "(11) 99999-8888",
    
    // Trabalho
    empresa: "Tech Solutions",
    profissao: "Eng. de Software",
    cargoTrabalho: "Senior",
    funcaoTrabalho: "Desenvolvimento",
    telefoneComercial: "(11) 4444-5555",
    enderecoTrabalho: "Av. Paulista",
    bairroTrabalho: "Bela Vista",
    cidadeTrabalho: "São Paulo",
    estadoTrabalho: "SP",
    cepTrabalho: "01310-100",

    // Família
    conjugeNome: "Ana Bessa",
    conjugeNascimento: "1982-03-20",
    conjugeProfissao: "Arquiteta",
    conjugeEmpresa: "Studio A",
    conjugeCargo: "Sócia",
    conjugeFuncao: "Projetos",
    conjugeTelefone: "(11) 98888-7777",
    dataCasamento: "2010-10-10",
    filhos: [
      { id: 1, nome: "Pedro Bessa", dataNascimento: "2012-05-01" },
      { id: 2, nome: "Julia Bessa", dataNascimento: "2015-08-15" }
    ],

    // Vida Maçônica
    grau: "Mestre Maçom",
    cargoLoja: "Venerável Mestre",
    cargoPotencia: "",
    direitoVoto: true,
    peculio: "Ativo",
    lojaAnterior: "",
    iniciacaoData: "2000-04-10",
    iniciacaoPlacet: "1234",
    iniciacaoLoja: "Arls Major",
    iniciacaoOriente: "São Paulo",
    elevacaoData: "2001-05-15",
    elevacaoPlacet: "1235",
    elevacaoLoja: "Arls Major",
    elevacaoOriente: "São Paulo",
    exaltacaoData: "2002-06-20",
    exaltacaoPlacet: "1236",
    exaltacaoLoja: "Arls Major",
    exaltacaoOriente: "São Paulo",
    instalacaoData: "2020-07-01",
    regularizacaoData: "",
    filiacaoData: "",

    // Histórico
    status: "Ativo",
    loja: "Arls Major Manoel dos Santos Portugal",
    cargosExercidos: [
      { id: 1, cargo: "1º Vigilante", loja: "Arls Major", oriente: "São Paulo", gestao: "2018-2019", inicio: "2018-06-24", termino: "2019-06-24" }
    ],
    numeroSessoes: 150,
    faltas: 5,
    presencas: 145,
    frequencia: 96.6,
    observacoes: "Membro fundador."
  },
  {
    id: 2,
    codigo: "002",
    cim: "654321",
    nome: "Carlos Andrade",
    grau: "Companheiro Maçom",
    status: "Ativo",
    loja: "Arls Major Manoel dos Santos Portugal",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    filhos: [],
    cargosExercidos: []
  }
];

export const mockSessions = [
  {
    id: 1,
    tipo: "Sessão Ordinária",
    data: "2026-05-20",
    horario: "20:00",
    local: "Templo Principal",
    status: "Agendada"
  },
  {
    id: 2,
    tipo: "Sessão de Iniciação",
    data: "2026-06-05",
    horario: "19:00",
    local: "Templo Principal",
    status: "Agendada"
  }
];

export const mockCandidates = [
  {
    id: 1,
    nome: "Marcus Vinícius",
    fase: "Sindicância",
    dataSolicitacao: "2026-04-10"
  },
  {
    id: 2,
    nome: "João Pedro",
    fase: "Entrevista",
    dataSolicitacao: "2026-04-28"
  }
];
