import { useState, useEffect } from 'react';
import styles from '../../app/dashboard/dashboard.module.css';

const permissions = [
  { id: 'read', label: 'Leitura', color: '#e3f2fd' },
  { id: 'write', label: 'Escrita', color: '#f3e5f5' },
  { id: 'delete', label: 'Exclusão', color: '#ffebee' },
  { id: 'admin', label: 'Administrador', color: '#e8f5e8' }
];

export default function ApiKeyModal({ 
  isOpen, 
  editingKey, 
  onClose, 
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    if (editingKey) {
      setFormData({
        name: editingKey.name,
        description: editingKey.description,
        permissions: editingKey.permissions
      });
    } else {
      setFormData({ name: '', description: '', permissions: [] });
    }
  }, [editingKey, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
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
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              {editingKey ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 