import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { 
  HardDrive, 
  FileText, 
  File, 
  Download, 
  Upload, 
  Search, 
  Trash2, 
  Check, 
  Filter,
  AlertCircle
} from 'lucide-react';

const Files = () => {
  const [files, setFiles] = useState([
    { id: 1, nome: "Constituicao_e_Regulamento_Geral_2025.pdf", tamanho: "4.2 MB", tipo: "PDF", data: "2026-01-10", categoria: "Normas" },
    { id: 2, nome: "Balaustre_Sessao_Ordinaria_10_05_2026.docx", tamanho: "850 KB", tipo: "DOCX", data: "2026-05-11", categoria: "Atas" },
    { id: 3, nome: "Ritual_Primeiro_Grau_Aprendiz.pdf", tamanho: "3.1 MB", tipo: "PDF", data: "2026-02-15", categoria: "Rituais" },
    { id: 4, nome: "Boletim_Oficial_Grande_Oriente_Abril.pdf", tamanho: "1.8 MB", tipo: "PDF", data: "2026-04-20", categoria: "Boletins" },
    { id: 5, nome: "Decreto_Geral_Nomeacao_Comissao.pdf", tamanho: "620 KB", tipo: "PDF", data: "2026-03-01", categoria: "Decretos" },
    { id: 6, nome: "Balaustre_Sessao_Especial_03_05_2026.docx", tamanho: "920 KB", tipo: "DOCX", data: "2026-05-04", categoria: "Atas" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = ['Todos', 'Normas', 'Atas', 'Rituais', 'Boletins', 'Decretos'];

  const handleFileUpload = (e) => {
    e.preventDefault();
    const input = document.getElementById('file-upload-input');
    if (input && input.files.length > 0) {
      const fileObj = input.files[0];
      const newId = files.length ? Math.max(...files.map(f => f.id)) + 1 : 1;
      
      // Calculate human readable size
      let sizeStr = "120 KB";
      if (fileObj.size > 1024 * 1024) {
        sizeStr = `${(fileObj.size / (1024 * 1024)).toFixed(1)} MB`;
      } else {
        sizeStr = `${(fileObj.size / 1024).toFixed(0)} KB`;
      }

      const fileExtension = fileObj.name.split('.').pop().toUpperCase();

      const newFileEntry = {
        id: newId,
        nome: fileObj.name,
        tamanho: sizeStr,
        tipo: fileExtension,
        data: new Date().toISOString().split('T')[0],
        categoria: "Atas" // Default to Atas category
      };

      setFiles([newFileEntry, ...files]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      input.value = ''; // clear input
    }
  };

  const handleDeleteFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleDownloadFile = (file) => {
    // Gerar um belo documento explicativo correspondente ao arquivo solicitado
    const fileContent = `=====================================================
SISOriente - SISTEMA DE GESTÃO MAÇÔNICA SAAS
Loja: ARLS Major Manoel dos Santos Portugal, Nº 4424
=====================================================

-----------------------------------------------------
ARQUIVO DIGITALIZADO E INDEXADO NA NUVEM DO TEMPLO
-----------------------------------------------------
Nome do Documento: ${file.nome}
Categoria Interna: ${file.categoria}
Tamanho Nominal: ${file.tamanho}
Data de Envio: ${file.data.split('-').reverse().join('/')}
Tipo de Extensão: ${file.tipo}

[CONTEÚDO COMPILADO INTEGRADO NO DRIVE SUPABASE / SISOriente]

Este arquivo faz parte do patrimônio documental da oficina, digitalizado de forma segura sob criptografia ponta a ponta na nuvem.
Qualquer cópia ou distribuição deve seguir os regulamentos e a constituição oficial.

Gerado eletronicamente e extraído com segurança via SisOriente Cloud.`;
    
    // Criar o Blob de texto e simular o download real pelo navegador
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter and search
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || f.categoria === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-4xl mb-2 masonic-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>Arquivos na Nuvem</h2>
          <p className="text-text-secondary">Biblioteca virtual e repositório seguro de regulamentos, atas, rituais e comunicados capitulares.</p>
        </div>
        
        {/* Mock File Upload Form */}
        <form onSubmit={handleFileUpload} className="flex items-center gap-2">
          <input 
            type="file" 
            id="file-upload-input" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => document.getElementById('file-upload-input').click()}
            className="modern-button bg-accent-gold text-black border-accent-gold hover:bg-accent-gold/80 px-4 py-2.5 font-bold flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Enviar Arquivo
          </button>
        </form>
      </div>

      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" /> Arquivo enviado com sucesso e indexado no bucket do Supabase!
        </div>
      )}

      {/* Capacity gauge */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <GlassCard className="col-span-3 flex justify-between items-center p-4 bg-white/5 border border-glass-border rounded-xl">
          <div className="flex items-center gap-3">
            <HardDrive className="w-6 h-6 text-accent-gold animate-pulse" />
            <div>
              <p className="text-xs text-white font-bold">Consumo de Armazenamento do Drive</p>
              <p className="text-[10px] text-text-secondary">1.24 GB utilizados de 10.00 GB contratados (12.4% de ocupação)</p>
            </div>
          </div>
          <div className="w-48 bg-black/45 h-2 rounded-full overflow-hidden border border-glass-border">
            <div className="h-full bg-accent-gold rounded-full" style={{ width: '12.4%' }} />
          </div>
        </GlassCard>
      </div>

      {/* Filters and search inputs */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-accent-gold text-black border-accent-gold'
                  : 'bg-white/5 border-glass-border text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'Todos' ? 'Todos os Arquivos' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar arquivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="modern-input w-64 text-xs"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Files Table / List */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-glass-border text-text-secondary text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Nome do Arquivo</th>
                <th className="py-4 px-6 font-semibold">Categoria</th>
                <th className="py-4 px-6 font-semibold">Tamanho</th>
                <th className="py-4 px-6 font-semibold">Data de Envio</th>
                <th className="py-4 px-6 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-text-secondary">
                    <FileText className="w-10 h-10 text-glass-border mx-auto mb-3" />
                    Nenhum arquivo encontrado para a pesquisa.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-accent-gold flex-shrink-0" />
                        <span className="font-medium text-white truncate max-w-[320px]">{file.nome}</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/40 text-text-secondary text-[8px] font-bold uppercase tracking-wider border border-glass-border">
                          {file.tipo}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-secondary text-xs font-semibold">{file.categoria}</td>
                    <td className="py-4 px-6 text-text-secondary font-mono text-xs">{file.tamanho}</td>
                    <td className="py-4 px-6 text-text-secondary text-xs">{file.data.split('-').reverse().join('/')}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDownloadFile(file)}
                          className="p-1.5 rounded bg-white/5 border border-glass-border text-accent-gold hover:bg-accent-gold/10 transition-colors cursor-pointer"
                          title="Baixar Arquivo"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1.5 rounded bg-white/5 border border-glass-border text-text-secondary hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Excluir Arquivo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default Files;
