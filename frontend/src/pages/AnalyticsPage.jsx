import { useState, useEffect } from 'react';
import { fetchAnalytics } from '../services/bonus_api';
import styles from '../styles/AnalyticsPage.module.css';

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const data = await fetchAnalytics();
                setAnalytics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) return <div className={styles.loading}>Loading analytics...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!analytics) return null;

    return (
        <div className={styles.container}>
            <h1>Analytics Dashboard</h1>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2>Instrument Statistics</h2>
                    {Object.entries(analytics.instrument_stats).map(([name, stats]) => (
                        <div key={name} className={styles.statBox}>
                            <h3>{name}</h3>
                            <div className={styles.statGrid}>
                                <div>Average: {stats.avg_value}</div>
                                <div>Max: {stats.max_value}</div>
                                <div>Min: {stats.min_value}</div>
                                <div>Total: {stats.total_readings}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.card}>
                    <h2>Fridge Statistics</h2>
                    {Object.entries(analytics.fridge_stats).map(([id, stats]) => (
                        <div key={id} className={styles.statBox}>
                            <h3>Fridge {id}</h3>
                            <div>Operations: {stats.total_operations}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;