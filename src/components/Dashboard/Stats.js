import styles from '../../app/dashboard/dashboard.module.css';

export default function Stats({ apiKeys }) {
  const activeKeys = apiKeys.filter(k => k.status === 'active').length;
  const totalUsage = apiKeys.reduce((sum, k) => sum + (k.usage || 0), 0);

  return (
    <div className={styles.stats}>
      <div className={styles.statCard}>
        <h3>Total de Chaves</h3>
        <p>{apiKeys.length}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Chaves Ativas</h3>
        <p>{activeKeys}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Total de Requisições</h3>
        <p>{totalUsage.toLocaleString()}</p>
      </div>
    </div>
  );
} 