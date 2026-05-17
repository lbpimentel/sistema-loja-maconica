const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://jxtlxjhmyzoxfsibaqdg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket },
  global: { WebSocket: WebSocket }
}) : null;

// Helper function to upload base64 image
async function uploadBase64ToSupabase(base64String, fileName) {
  if (!supabase) throw new Error('Supabase client not configurado. Falta SUPABASE_KEY.');
  
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('String base64 inválida');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  const uniqueFileName = `${Date.now()}-${fileName}`;

  const { data, error } = await supabase.storage
    .from('fotos-membros')
    .upload(uniqueFileName, buffer, {
      contentType: mimeType,
      upsert: true
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('fotos-membros')
    .getPublicUrl(uniqueFileName);

  return publicUrlData.publicUrl;
}

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// --- MIDDLEWARE DE EXTRAÇÃO DE TENANT (SAAS ISOLATION) ---
app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const subdomainHeader = req.headers['x-tenant-subdomain'];
    let tenantId = 1; // Default para o case ARLS Major Manoel dos Santos Portugal (ID: 1)

    if (subdomainHeader && subdomainHeader !== 'localhost' && subdomainHeader !== '127.0.0.1') {
      const tenant = await prisma.tenant.findUnique({
        where: { subdominio: subdomainHeader }
      });
      if (tenant) {
        tenantId = tenant.id;
      }
    }
    
    req.tenantId = tenantId;
    next();
  } catch (error) {
    console.error('Erro no middleware de Tenant:', error);
    req.tenantId = 1; // Fallback seguro
    next();
  }
});

// --- ROTAS (API) ---

// ==========================================
// ROTAS: CANDIDATOS (PROFANOS)
// ==========================================

// 1. Listar candidatos
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      where: { tenantId: req.tenantId },
      orderBy: { id: 'desc' }
    });
    res.json(candidates);
  } catch (error) {
    console.error('ERROR GET /api/candidates:', error);
    res.status(500).json({ error: 'Erro ao buscar candidatos', message: error.message });
  }
});

// 2. Criar candidato
app.post('/api/candidates', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...candidateData } = req.body;
    const newCandidate = await prisma.candidate.create({
      data: {
        ...candidateData,
        tenantId: req.tenantId
      }
    });
    res.status(201).json(newCandidate);
  } catch (error) {
    console.error('ERROR POST /api/candidates:', error);
    res.status(500).json({ error: 'Erro ao criar candidato', message: error.message });
  }
});

// 3. Atualizar candidato
app.put('/api/candidates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { id: _id, createdAt, updatedAt, ...candidateData } = req.body;
    
    // Garantir que pertence ao tenant
    const updatedCandidate = await prisma.candidate.update({
      where: { 
        id: Number(id),
        tenantId: req.tenantId 
      },
      data: candidateData
    });
    res.json(updatedCandidate);
  } catch (error) {
    console.error('ERROR PUT /api/candidates:', error);
    res.status(500).json({ error: 'Erro ao atualizar candidato', message: error.message });
  }
});

// 4. Excluir candidato
app.delete('/api/candidates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Garantir escopo do tenant antes do delete
    await prisma.candidate.delete({
      where: { 
        id: Number(id),
        tenantId: req.tenantId
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error('ERROR DELETE /api/candidates:', error);
    res.status(500).json({ error: 'Erro ao excluir candidato', message: error.message });
  }
});

// 5. Iniciar candidato (Converte para Membro / Irmão)
app.post('/api/candidates/:id/initiate', async (req, res) => {
  const { id } = req.params;
  const { iniciacaoData } = req.body;
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { 
        id: Number(id),
        tenantId: req.tenantId
      }
    });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidato não encontrado para este tenant' });
    }

    // Criar membro associado ao tenant
    const newMember = await prisma.member.create({
      data: {
        codigo: candidate.codigo,
        nome: candidate.nome,
        nomePai: candidate.pai,
        nomeMae: candidate.mae,
        nascimento: candidate.nascimento,
        cpf: candidate.cpf,
        rg: candidate.rg,
        estadoCivil: candidate.estadoCivil,
        conjugeNome: candidate.esposa,
        profissao: candidate.profissao,
        celular: candidate.celular,
        email: candidate.email,
        tenantId: req.tenantId,
        
        // Residence
        endereco: candidate.endereco,
        numeroRes: candidate.numero,
        cep: candidate.cep,
        cidade: candidate.cidade,
        estado: candidate.estado,
        bairro: candidate.bairro,
        telefoneResidencial: candidate.telefone,
        
        // Work
        empresa: candidate.empresa,
        telefoneComercial: candidate.telefoneEmpresa,
        enderecoTrabalho: candidate.enderecoEmpresa,
        cidadeTrabalho: candidate.cidadeEmpresa,
        estadoTrabalho: candidate.estadoEmpresa,
        bairroTrabalho: candidate.bairroEmpresa,
        numeroTrab: candidate.numeroEmpresa,
        cepTrabalho: candidate.cepEmpresa,

        // Conjugal
        conjugeProfissao: candidate.profissaoConjuge,
        conjugeCargo: candidate.cargoConjuge,
        conjugeFuncao: candidate.funcaoConjuge,
        conjugeEmpresa: candidate.empresaConjuge,
        conjugeTelefone: candidate.telefoneConjuge,
        dataCasamento: candidate.dataCasamento,
        
        // Masonic setup
        grau: 'Aprendiz',
        iniciacaoData: iniciacaoData || candidate.dataIniciacao || null,
        status: 'Ativo',
        loja: 'Arls Major Manoel dos Santos Portugal'
      }
    });

    // Atualizar status do candidato
    await prisma.candidate.update({
      where: { id: Number(id) },
      data: {
        status: 'Iniciado',
        dataIniciacao: iniciacaoData || candidate.dataIniciacao || null
      }
    });

    res.json(newMember);
  } catch (error) {
    console.error('ERROR POST /api/candidates/initiate:', error);
    res.status(500).json({ error: 'Erro ao iniciar candidato', message: error.message });
  }
});

// ==========================================
// ROTAS: MEMBROS (IRMÃOS)
// ==========================================

// 1. Listar todos os membros
app.get('/api/members', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      where: { tenantId: req.tenantId },
      include: {
        filhos: true,
        lowtons: true,
        apjs: true,
        cargosExercidos: true
      }
    });
    res.json(members);
  } catch (error) {
    console.error('ERROR GET /api/members:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar membros',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// 2. Criar novo membro
app.post('/api/members', async (req, res) => {
  try {
    const { filhos, lowtons, apjs, cargosExercidos, id, createdAt, updatedAt, ...memberData } = req.body;

    if (memberData.foto && memberData.foto.startsWith('data:image')) {
      memberData.foto = await uploadBase64ToSupabase(memberData.foto, `novo-membro.jpg`);
    }

    const newMember = await prisma.member.create({
      data: {
        ...memberData,
        tenantId: req.tenantId,
        filhos: filhos && filhos.length > 0 ? {
          create: filhos.map(f => ({
            nome: f.nome,
            dataNascimento: f.dataNascimento,
            sexo: f.sexo
          }))
        } : undefined,
        lowtons: lowtons && lowtons.length > 0 ? {
          create: lowtons.map(f => ({
            nome: f.nome,
            dataNascimento: f.dataNascimento
          }))
        } : undefined,
        apjs: apjs && apjs.length > 0 ? {
          create: apjs.map(f => ({
            nome: f.nome,
            dataNascimento: f.dataNascimento
          }))
        } : undefined,
        cargosExercidos: cargosExercidos && cargosExercidos.length > 0 ? {
          create: cargosExercidos.map(c => ({
            cargo: c.cargo,
            loja: c.loja,
            oriente: c.oriente,
            gestao: c.gestao,
            inicio: c.inicio,
            termino: c.termino
          }))
        } : undefined
      },
      include: {
        filhos: true,
        lowtons: true,
        apjs: true,
        cargosExercidos: true
      }
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.error('ERROR POST /api/members:', error);
    res.status(500).json({ 
      error: 'Erro ao criar membro',
      message: error.message
    });
  }
});

// 3. Atualizar membro existente
app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { filhos, lowtons, apjs, cargosExercidos, id: _id, createdAt, updatedAt, ...memberData } = req.body;

    if (memberData.foto && memberData.foto.startsWith('data:image')) {
      memberData.foto = await uploadBase64ToSupabase(memberData.foto, `membro-${id}.jpg`);
    }

    const updatedMember = await prisma.member.update({
      where: { 
        id: Number(id),
        tenantId: req.tenantId
      },
      data: {
        ...memberData,
        filhos: {
          deleteMany: {},
          create: filhos ? filhos.map(f => ({
            nome: f.nome,
            dataNascimento: f.dataNascimento,
            sexo: f.sexo
          })) : []
        },
        lowtons: {
          deleteMany: {},
          create: lowtons ? lowtons.map(f => ({
            nome: f.nome,
            dataNascimento: f.dataNascimento
          })) : []
        },
        apjs: {
          deleteMany: {},
          create: apjs ? apjs.map(f => ({
            nome: f.nome,
            dataNascimento: f.dataNascimento
          })) : []
        },
        cargosExercidos: {
          deleteMany: {},
          create: cargosExercidos ? cargosExercidos.map(c => ({
            cargo: c.cargo,
            loja: c.loja,
            oriente: c.oriente,
            gestao: c.gestao,
            inicio: c.inicio,
            termino: c.termino
          })) : []
        }
      },
      include: {
        filhos: true,
        lowtons: true,
        apjs: true,
        cargosExercidos: true
      }
    });

    res.json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar membro' });
  }
});

// 4. Excluir membro
app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.member.delete({
      where: { 
        id: Number(id),
        tenantId: req.tenantId
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir membro' });
  }
});

// ==========================================
// ROTAS: SESSÕES E FREQUÊNCIAS
// ==========================================

// 5. Listar sessões
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { tenantId: req.tenantId },
      include: {
        attendances: true
      },
      orderBy: { id: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    console.error('ERROR GET /api/sessions:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar sessões',
      message: error.message
    });
  }
});

// 6. Criar nova sessão
app.post('/api/sessions', async (req, res) => {
  try {
    const { attendances, id, ...sessionData } = req.body;
    const newSession = await prisma.session.create({
      data: {
        ...sessionData,
        tenantId: req.tenantId,
        attendances: attendances && attendances.length > 0 ? {
          create: attendances.map(a => ({
            membroId: a.membroId,
            status: a.status,
            motivo: a.motivo,
            obs: a.obs
          }))
        } : undefined
      },
      include: {
        attendances: true
      }
    });
    res.json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar sessão' });
  }
});

// 7. Atualizar sessão
app.put('/api/sessions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { attendances, id: bodyId, ...sessionData } = req.body;
    
    // Garantir que a sessão pertence ao tenant antes de deletar frequências
    const session = await prisma.session.findFirst({
      where: { id: Number(id), tenantId: req.tenantId }
    });
    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada para este tenant' });
    }

    await prisma.attendance.deleteMany({
      where: { sessaoId: Number(id) }
    });

    const updatedSession = await prisma.session.update({
      where: { id: Number(id) },
      data: {
        ...sessionData,
        attendances: attendances && attendances.length > 0 ? {
          create: attendances.map(a => ({
            membroId: a.membroId,
            status: a.status,
            motivo: a.motivo,
            obs: a.obs
          }))
        } : undefined
      },
      include: {
        attendances: true
      }
    });

    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar sessão' });
  }
});

// 8. Excluir sessão
app.delete('/api/sessions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.session.delete({
      where: { 
        id: Number(id),
        tenantId: req.tenantId
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir sessão' });
  }
});

// ==========================================
// ROTAS: TENANT (ADMINISTRAÇÃO SAAS)
// ==========================================

// 1. Obter informações da Loja atual (Tenant)
app.get('/api/tenant', async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId }
    });
    if (!tenant) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }
    
    // Obter contagem de membros para limite de capacidade do plano
    const membersCount = await prisma.member.count({
      where: { tenantId: req.tenantId }
    });

    res.json({
      ...tenant,
      membersCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar informações da Loja' });
  }
});

// 2. Atualizar informações da Loja
app.put('/api/tenant', async (req, res) => {
  const { nome, numero, cnpj, potencia, rito, oriente, uf } = req.body;
  try {
    const updatedTenant = await prisma.tenant.update({
      where: { id: req.tenantId },
      data: {
        nome,
        numero,
        cnpj,
        potencia,
        rito,
        oriente,
        uf
      }
    });
    res.json(updatedTenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar informações da Loja' });
  }
});

// ==========================================
// ROTAS: USUÁRIOS E CONTROLE DE ACESSO
// ==========================================

// 1. Listar usuários da Loja (Tenant)
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { tenantId: req.tenantId },
      orderBy: { id: 'desc' }
    });
    // Omitir o hash da senha por segurança no envio para o client
    const safeUsers = users.map(({ passwordHash, ...u }) => u);
    res.json(safeUsers);
  } catch (error) {
    console.error('ERROR GET /api/users:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários', message: error.message });
  }
});

// 2. Criar novo usuário associado ao Tenant
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Hash simplificado para demonstração/desenvolvimento
    const passwordHash = password ? `hash:${password}` : 'hash:123456';
    
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || 'MEMBRO',
        tenantId: req.tenantId
      }
    });
    
    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('ERROR POST /api/users:', error);
    res.status(500).json({ error: 'Erro ao criar usuário', message: error.message });
  }
});

// 3. Atualizar dados do usuário
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, role, password } = req.body;
  try {
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (password) updateData.passwordHash = `hash:${password}`;

    // Atualizar apenas no escopo do tenant atual
    const updatedUser = await prisma.user.update({
      where: { 
        id: Number(id),
        tenantId: req.tenantId
      },
      data: updateData
    });
    
    const { passwordHash: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    console.error('ERROR PUT /api/users:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário', message: error.message });
  }
});

// 4. Excluir usuário
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Excluir garantindo que pertence ao tenant atual
    const user = await prisma.user.findFirst({
      where: { id: Number(id), tenantId: req.tenantId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado para esta Loja' });
    }

    await prisma.user.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('ERROR DELETE /api/users:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário', message: error.message });
  }
});

// Exportar para Vercel
module.exports = app;

