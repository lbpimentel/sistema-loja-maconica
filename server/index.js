const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middlewares
// Aumentar o limite do body para permitir envio de fotos em base64 (ex: 10mb)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// --- ROTAS (API) ---

// 1. Listar todos os membros
app.get('/api/members', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        filhos: true,
        cargos: true
      }
    });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar membros' });
  }
});

// 2. Criar novo membro
app.post('/api/members', async (req, res) => {
  try {
    const { filhos, cargos, id, createdAt, updatedAt, ...memberData } = req.body;

    const newMember = await prisma.member.create({
      data: {
        ...memberData,
        // Criação aninhada para filhos (se houver)
        filhos: filhos && filhos.length > 0 ? {
          create: filhos.map(f => ({
            nome: f.nome,
            nascimento: f.nascimento,
            sexo: f.sexo
          }))
        } : undefined,
        // Criação aninhada para cargos (se houver)
        cargos: cargos && cargos.length > 0 ? {
          create: cargos.map(c => ({
            cargo: c.cargo,
            periodo: c.periodo,
            loja: c.loja
          }))
        } : undefined
      },
      include: {
        filhos: true,
        cargos: true
      }
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar membro' });
  }
});

// 3. Atualizar membro existente
app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { filhos, cargos, id: _id, createdAt, updatedAt, ...memberData } = req.body;

    // Para simplificar a atualização das relações, deletamos os antigos e recriamos (ou fazemos update/upsert)
    // Uma abordagem simples com Prisma para 1:N é usar "deleteMany" para remover as relações antigas 
    // e "create" para adicionar as novas.
    
    const updatedMember = await prisma.member.update({
      where: { id: Number(id) },
      data: {
        ...memberData,
        filhos: {
          deleteMany: {}, // apaga os filhos atuais
          create: filhos ? filhos.map(f => ({
            nome: f.nome,
            nascimento: f.nascimento,
            sexo: f.sexo
          })) : []
        },
        cargos: {
          deleteMany: {}, // apaga os cargos atuais
          create: cargos ? cargos.map(c => ({
            cargo: c.cargo,
            periodo: c.periodo,
            loja: c.loja
          })) : []
        }
      },
      include: {
        filhos: true,
        cargos: true
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
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir membro' });
  }
});

// Inicializar Servidor
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
