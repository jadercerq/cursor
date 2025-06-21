import styles from '../../app/dashboard/dashboard.module.css';

const permissions = [
  { id: 'read', label: 'Leitura', color: '#e3f2fd' },
  { id: 'write', label: 'Escrita', color: '#f3e5f5' },
  { id: 'delete', label: 'Exclusão', color: '#ffebee' },
  { id: 'admin', label: 'Administrador', color: '#e8f5e8' }
];

export default function ApiKeyTable({ 
  currentKeys, 
  visibleKeys, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onCopyToClipboard, 
  onToggleKeyVisibility,
  onAddNew 
}) {
  const obfuscateApiKey = (key) => {
    if (!key || key.length < 8) return key;
    
    const prefix = key.substring(0, 4);
    const suffix = key.substring(key.length - 4);
    const middle = '•'.repeat(Math.min(key.length - 8, 8));
    
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

  return (
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
                    onClick={() => onCopyToClipboard(key.key)}
                    className={styles.copyButton}
                    title="Copiar chave completa"
                  >
                    📋
                  </button>
                  <button 
                    onClick={() => onToggleKeyVisibility(key.id)}
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
                  onClick={() => onToggleStatus(key.id)}
                  className={`${styles.statusToggle} ${styles[key.status]}`}
                >
                  {key.status === 'active' ? 'Ativo' : 'Inativo'}
                </button>
              </td>
              <td>
                <div className={styles.actions}>
                  <button 
                    onClick={() => onEdit(key)}
                    className={styles.editButton}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(key.id)}
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
            onClick={onAddNew}
            className={styles.addButton}
          >
            Criar primeira chave
          </button>
        </div>
      )}
    </div>
  );
} 