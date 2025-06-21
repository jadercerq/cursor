import { useState, useEffect } from 'react';
import { 
  fetchApiKeys, 
  createApiKey, 
  updateApiKey, 
  deleteApiKey, 
  toggleApiKeyStatus 
} from '../services/apiKeys';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [visibleKeys, setVisibleKeys] = useState(new Set());

  // Load API keys on mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  // Filter and search keys
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

  const handleCreateKey = async (formData) => {
    try {
      const newKey = await createApiKey(formData);
      setApiKeys(prev => [newKey, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Erro ao criar chave:', err);
      return { success: false, error: 'Erro ao criar chave de API' };
    }
  };

  const handleUpdateKey = async (id, formData) => {
    try {
      const updatedKey = await updateApiKey(id, formData);
      setApiKeys(prev => prev.map(key => 
        key.id === id ? updatedKey : key
      ));
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar chave:', err);
      return { success: false, error: 'Erro ao atualizar chave de API' };
    }
  };

  const handleDeleteKey = async (id) => {
    try {
      await deleteApiKey(id);
      setApiKeys(prev => prev.filter(key => key.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Erro ao excluir chave:', err);
      return { success: false, error: 'Erro ao excluir chave de API' };
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
      return { success: true, newStatus };
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      return { success: false, error: 'Erro ao alterar status' };
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentKeys = filteredKeys.slice(startIndex, endIndex);

  return {
    // State
    apiKeys,
    filteredKeys,
    currentKeys,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    totalPages,
    visibleKeys,
    
    // Actions
    loadApiKeys,
    handleCreateKey,
    handleUpdateKey,
    handleDeleteKey,
    handleToggleStatus,
    toggleKeyVisibility,
    copyToClipboard,
    
    // Setters
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
  };
} 