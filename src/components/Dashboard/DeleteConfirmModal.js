import styles from '../../app/dashboard/dashboard.module.css';

export default function DeleteConfirmModal({ 
  isOpen, 
  deletingKey, 
  onCancel, 
  onConfirm 
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
        <h2>Confirmar Exclusão</h2>
        <p>
          Tem certeza que deseja excluir a chave de API <strong>"{deletingKey?.name}"</strong>?
        </p>
        <p className={styles.warning}>
          ⚠️ Esta ação não pode ser desfeita. Todas as requisições usando esta chave serão rejeitadas.
        </p>
        
        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={styles.deleteConfirmButton}>
            Excluir Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
} 