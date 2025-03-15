import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/index.jsx';
import styles from './styles/App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        <nav className={styles.navbar}>
          <div className={styles.navContent}>
            <a href="/settings" className={styles.navLink}>Settings</a>
            <a href="/analytics" className={styles.navLink}>Analytics</a>
          </div>
        </nav>
        <main className={styles.mainContent}>
          <AppRoute />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;