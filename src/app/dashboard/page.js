'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { useApiKeys } from '../../hooks/useApiKeys';
import { useNotificationContext } from '../../contexts/NotificationContext';
import {
  Stats,
  Filters,
  ApiKeyTable,
  Pagination,
  ApiKeyModal,
  DeleteConfirmModal
} from '../../components/Dashboard';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

  const { showSuccess, showError, showWarning } = useNotificationContext();
  
  const {
    apiKeys,
    currentKeys,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    totalPages,
    visibleKeys,
    loadApiKeys,
    handleCreateKey,
    handleUpdateKey,
    handleDeleteKey,
    handleToggleStatus,
    toggleKeyVisibility,
    copyToClipboard,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
  } = useApiKeys();

  const handleSubmit = async (formData) => {
    try {
      if (editingKey) {
        const result = await handleUpdateKey(editingKey.id, formData);
        if (result.success) {
          showSuccess('Chave de API atualizada com sucesso!');
          handleCloseModal();
        } else {
          showError(result.error);
        }
      } else {
        const result = await handleCreateKey(formData);
        if (result.success) {
          showSuccess('Chave de API criada com sucesso!');
          handleCloseModal();
        } else {
          showError(result.error);
        }
      }
    } catch (err) {
      showError('Erro ao salvar chave de API');
    }
  };

  const handleEdit = (key) => {
    setEditingKey(key);
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
        const result = await handleDeleteKey(deletingKey.id);
        if (result.success) {
          setIsDeleteModalOpen(false);
          setDeletingKey(null);
          showSuccess('Chave de API excluída com sucesso!');
        } else {
          showError(result.error);
        }
      } catch (err) {
        showError('Erro ao excluir chave de API');
      }
    }
  };

  const handleStatusToggle = async (id) => {
    try {
      const result = await handleToggleStatus(id);
      if (result.success) {
        showSuccess(`Status alterado para ${result.newStatus === 'active' ? 'ativo' : 'inativo'}`);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Erro ao alterar status');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKey(null);
  };

  const handleCopyToClipboard = (text) => {
    copyToClipboard(text);
    showSuccess('Chave copiada para a área de transferência!');
  };

  const handleToggleKeyVisibility = (keyId) => {
    toggleKeyVisibility(keyId);
    if (!visibleKeys.has(keyId)) {
      showWarning('⚠️ Chave visível - Certifique-se de que ninguém está olhando sua tela');
    }
  };

  const handleAddNew = () => {
    setEditingKey(null);
    setIsModalOpen(true);
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
        <Stats apiKeys={apiKeys} />

        <Filters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onAddNew={handleAddNew}
        />

        <ApiKeyTable 
          currentKeys={currentKeys}
          visibleKeys={visibleKeys}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleStatusToggle}
          onCopyToClipboard={handleCopyToClipboard}
          onToggleKeyVisibility={handleToggleKeyVisibility}
          onAddNew={handleAddNew}
        />

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      <ApiKeyModal 
        isOpen={isModalOpen}
        editingKey={editingKey}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        deletingKey={deletingKey}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
} 