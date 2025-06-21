import styles from '../../app/dashboard/dashboard.module.css';

export default function Filters({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  onAddNew 
}) {
  return (
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
          onClick={onAddNew}
          className={styles.addButton}
        >
          + Nova Chave de API
        </button>
      </div>
    </div>
  );
} 