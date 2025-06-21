import styles from '../../app/dashboard/dashboard.module.css';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button 
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        ← Anterior
      </button>
      
      <span className={styles.pageInfo}>
        Página {currentPage} de {totalPages}
      </span>
      
      <button 
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        Próxima →
      </button>
    </div>
  );
} 