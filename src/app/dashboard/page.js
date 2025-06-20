'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { 
  fetchApiKeys, 
  createApiKey, 
  updateApiKey, 
  deleteApiKey, 
  toggleApiKeyStatus 
} from '../../services/apiKeys';
import { useNotificationContext } from '../../contexts/NotificationContext';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  // Use notification context
  const { showSuccess, showError, showWarning } = useNotificationContext();

  const permissions = [
    { id: 'read', label: 'Leitura', color: '#e3f2fd' },
    { id: 'write', label: 'Escrita', color: '#f3e5f5' },
    { id: 'delete', label: 'Exclusão', color: '#ffebee' },
    { id: 'admin', label: 'Administrador', color: '#e8f5e8' }
  ];

  // Carregar dados do Supabase
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApiKeys();
      setApiKeys(data);
      setFilteredKeys(data);
    } catch (err) {
      setError('Erro ao carregar chaves de API');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar e buscar chaves
  useEffect(() => {
    let filtered = apiKeys.filter(key => {
      const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           key.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           key.key.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredKeys(filtered);
    setCurrentPage(1);
  }, [apiKeys, searchTerm, statusFilter]);

  // Paginação
  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentKeys = filteredKeys.slice(startIndex, endIndex);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingKey) {
        // Atualizar chave existente
        const updatedKey = await updateApiKey(editingKey.id, formData);
        setApiKeys(prev => prev.map(key => 
          key.id === editingKey.id ? updatedKey : key
        ));
        
        // Mostrar notificação
        showSuccess('Chave de API atualizada com sucesso!');
      } else {
        // Criar nova chave
        const newKey = await createApiKey(formData);
        setApiKeys(prev => [newKey, ...prev]);
        
        // Mostrar notificação
        showSuccess('Chave de API criada com sucesso!');
      }
      
      handleCloseModal();
    } catch (err) {
      showError('Erro ao salvar chave de API');
      console.error('Erro ao salvar:', err);
    }
  };

  const handleEdit = (key) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      description: key.description,
      permissions: key.permissions
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const keyToDelete = apiKeys.find(key => key.id === id);
    setDeletingKey(keyToDelete);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingKey) {
      try {
        await deleteApiKey(deletingKey.id);
        setApiKeys(prev => prev.filter(key => key.id !== deletingKey.id));
        setIsDeleteModalOpen(false);
        setDeletingKey(null);
        
        showSuccess('Chave de API excluída com sucesso!');
      } catch (err) {
        showError('Erro ao excluir chave de API');
        console.error('Erro ao excluir:', err);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const key = apiKeys.find(k => k.id === id);
      const newStatus = key.status === 'active' ? 'inactive' : 'active';
      
      const updatedKey = await toggleApiKeyStatus(id, newStatus);
      setApiKeys(prev => prev.map(key => 
        key.id === id ? updatedKey : key
      ));
      
      showSuccess(`Status alterado para ${newStatus === 'active' ? 'ativo' : 'inativo'}`);
    } catch (err) {
      showError('Erro ao alterar status');
      console.error('Erro ao alterar status:', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKey(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess('Chave copiada para a área de transferência!');
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
        // Mostrar aviso de segurança
        showWarning('⚠️ Chave visível - Certifique-se de que ninguém está olhando sua tela');
      }
      return newSet;
    });
  };

  const obfuscateApiKey = (key) => {
    if (!key || key.length < 8) return key;
    
    // Mostrar os primeiros 4 caracteres e os últimos 4, obfuscar o meio
    const prefix = key.substring(0, 4);
    const suffix = key.substring(key.length - 4);
    const middle = '•'.repeat(Math.min(key.length - 8, 8)); // Máximo 8 pontos
    
    return `${prefix}${middle}${suffix}`;
  };

  const formatUsage = (usage) => {
    if (usage === 0) return '0';
    if (usage < 1000) return usage.toString();
    return `${(usage / 1000).toFixed(1)}k`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingKey(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Voltar
          </Link>
          <h1>Dashboard - Gerenciamento de Chaves de API</h1>
        </header>
        <main className={styles.main}>
          <div className={styles.loading}>
            <p>Carregando chaves de API...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Voltar
          </Link>
          <h1>Dashboard - Gerenciamento de Chaves de API</h1>
        </header>
        <main className={styles.main}>
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={loadApiKeys} className={styles.retryButton}>
              Tentar Novamente
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Voltar
        </Link>
        <h1>Dashboard - Gerenciamento de Chaves de API</h1>
      </header>

      <main className={styles.main}>
        {/* Estatísticas */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total de Chaves</h3>
            <p>{apiKeys.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Chaves Ativas</h3>
            <p>{apiKeys.filter(k => k.status === 'active').length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total de Requisições</h3>
            <p>{apiKeys.reduce((sum, k) => sum + (k.usage || 0), 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar por nome, descrição ou chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterControls}>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className={styles.addButton}
            >
              + Nova Chave de API
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Chave</th>
                <th>Descrição</th>
                <th>Permissões</th>
                <th>Criada em</th>
                <th>Último uso</th>
                <th>Requisições</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentKeys.map((key) => (
                <tr key={key.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <strong>{key.name}</strong>
                    </div>
                  </td>
                  <td>
                    <div className={styles.keyCell}>
                      <code className={`${styles.obfuscatedKey} ${visibleKeys.has(key.id) ? styles.keyVisible : ''}`}>
                        {visibleKeys.has(key.id) ? key.key : obfuscateApiKey(key.key)}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(key.key)}
                        className={styles.copyButton}
                        title="Copiar chave completa"
                      >
                        📋
                      </button>
                      <button 
                        onClick={() => toggleKeyVisibility(key.id)}
                        className={`${styles.visibilityButton} ${visibleKeys.has(key.id) ? styles.visible : ''}`}
                        title={visibleKeys.has(key.id) ? "Ocultar chave" : "Mostrar chave completa"}
                      >
                        {visibleKeys.has(key.id) ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </td>
                  <td>{key.description}</td>
                  <td>
                    <div className={styles.permissions}>
                      {key.permissions.map(perm => (
                        <span 
                          key={perm} 
                          className={styles.permission}
                          style={{ backgroundColor: permissions.find(p => p.id === perm)?.color }}
                        >
                          {permissions.find(p => p.id === perm)?.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{formatDate(key.created_at)}</td>
                  <td>{formatDate(key.last_used)}</td>
                  <td>
                    <span className={styles.usage}>
                      {formatUsage(key.usage || 0)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(key.id)}
                      className={`${styles.statusToggle} ${styles[key.status]}`}
                    >
                      {key.status === 'active' ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        onClick={() => handleEdit(key)}
                        className={styles.editButton}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(key.id)}
                        className={styles.deleteButton}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {currentKeys.length === 0 && (
            <div className={styles.emptyState}>
              <p>Nenhuma chave de API encontrada.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className={styles.addButton}
              >
                Criar primeira chave
              </button>
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              ← Anterior
            </button>
            
            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Próxima →
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingKey ? 'Editar Chave de API' : 'Nova Chave de API'}</h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nome:</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Ex: Chave de Produção"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Descrição:</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  placeholder="Descreva o propósito desta chave..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Permissões:</label>
                <div className={styles.permissionsList}>
                  {permissions.map(permission => (
                    <label key={permission.id} className={styles.permissionItem}>
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                      />
                      <span>{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingKey ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={cancelDelete}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Exclusão</h2>
            <p>
              Tem certeza que deseja excluir a chave de API <strong>"{deletingKey?.name}"</strong>?
            </p>
            <p className={styles.warning}>
              ⚠️ Esta ação não pode ser desfeita. Todas as requisições usando esta chave serão rejeitadas.
            </p>
            
            <div className={styles.modalActions}>
              <button onClick={cancelDelete} className={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={confirmDelete} className={styles.deleteConfirmButton}>
                Excluir Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 