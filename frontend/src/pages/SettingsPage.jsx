import { io } from 'socket.io-client';
import fetchData from '../services/python_api.js'
import styles from '../styles/SettingsPage.module.css';
import { useState, useEffect } from 'react'
import { fetchHistoricalData } from '../services/bonus_api';
import InfiniteScroll from 'react-infinite-scroll-component';

const SettingsPage = () => {
    // State management for data and UI controls
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [historicalData, setHistoricalData] = useState(null);

    // Handler for infinite scroll in historical mode
    const fetchMoreData = async () => {
        if (isLiveMode) return;
        
        try {
            const result = await fetchHistoricalData(page);
            setHistoricalData(prevData => [...(prevData || []), ...result.data]);
            setData(prevData => {
                const combinedData = [...(prevData || []), ...result.data];
                return combinedData;
            });
            setFilteredData(prevData => {
                const combinedData = [...(prevData || []), ...result.data];
                return combinedData;
            });
            setHasMore(result.has_more);
            setPage(p => p + 1);
        } catch (err) {
            setError(err.message);
        }
    };

    // Initial data fetch handler
    const fetchDataFromApi = async () => {
        try {
            const result = await fetchData();
            setData(prevData => {
                if (prevData) {
                    return [...prevData, ...result.data];
                }
                return result.data;
            });
            setFilteredData(prevData => {
                if (prevData) {
                    return [...prevData, ...result.data];
                }
                return result.data;
            });
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    // Initial data load
    useEffect(() => {
        setIsLoading(true);
        fetchDataFromApi();
    }, []);

    // WebSocket connection management for live mode
    useEffect(() => {
        if (isLiveMode) {
            const socket = io('http://localhost:8000', {
                transports: ['polling', 'websocket'],
                reconnectionDelayMax: 10000,
                reconnectionAttempts: 10,
                withCredentials: false
            });
            
            socket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });
    
            socket.on('new_data', (newData) => {
                console.log('Received new data:', newData);
                setData(prevData => {
                    const newDataArray = Array.isArray(prevData) ? [newData, ...prevData] : [newData];
                    const updatedData = newDataArray.slice(0, 10);
                    setFilteredData(updatedData);
                    return updatedData;
                });
            });
    
            return () => {
                socket.disconnect();
                console.log('Disconnected from WebSocket server');
                // When switching back to historical, combine live data with historical
                setData(prevData => {
                    if (historicalData) {
                        return [...prevData, ...historicalData];
                    }
                    return prevData;
                });
                setFilteredData(prevData => {
                    if (historicalData) {
                        return [...prevData, ...historicalData];
                    }
                    return prevData;
                });
            };
        } else {
            // Load initial historical data if none exists
            if (!historicalData) {
                setPage(1);
                fetchMoreData();
            } else {
                // Restore historical data when switching back
                setData(prevData => {
                    if (prevData && prevData.length <= 10) { // If coming from live mode
                        return [...prevData, ...historicalData];
                    }
                    return historicalData;
                });
                setFilteredData(prevData => {
                    if (prevData && prevData.length <= 10) {
                        return [...prevData, ...historicalData];
                    }
                    return historicalData;
                });
            }
        }
    }, [isLiveMode]);

    // Filter functionality
    const handleFilterChange = (value) => {
        setFilterValue(value);
        if (!selectedColumn) return;

        if (value === '') {
            setFilteredData(data);
            return;
        }

        const filtered = data?.filter(row => 
            String(row[selectedColumn]).toLowerCase()
                .includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Reset filter controls
    const clearFilter = () => {
        setSelectedColumn('');
        setFilterValue('');
        setFilteredData(data);
        setShowFilter(false);
    };

    // Component render
    return (
        <div className={styles.tableContainer}>
            {/* Header section with mode toggle and filter controls */}
            <div className={styles.header}>
                <h1>Settings Page</h1>
                <div className={styles.controls}>
                    <button 
                        className={`${styles.modeButton} ${isLiveMode ? styles.active : ''}`}
                        onClick={() => setIsLiveMode(!isLiveMode)}
                    >
                        {isLiveMode ? 'Switch to Historical' : 'Switch to Live'}
                    </button>
                    <div className={styles.filterControls}>
                        <button 
                            className={styles.filterButton}
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            {showFilter ? 'Hide Filter' : 'Show Filter'}
                        </button>
                        {showFilter && 
                            <button 
                                className={styles.clearButton}
                                onClick={clearFilter}
                            >
                                Clear Filter
                            </button>
                        }
                    </div>
                </div>
            </div>
    
            {/* Filter section */}
            {showFilter && (
                <div className={styles.filterSection}>
                    <select 
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                        className={styles.columnSelect}
                    >
                        <option value="">Select Column</option>
                        <option value="fridge_id">Fridge ID</option>
                        <option value="instrument_name">Instrument Name</option>
                        <option value="parameter_name">Parameter Name</option>
                        <option value="applied_value">Applied Value</option>
                        <option value="timestamp">Timestamp</option>
                    </select>
                    {selectedColumn && (
                        <input
                            className={styles.filterInput}
                            placeholder={`Filter by ${selectedColumn}`}
                            value={filterValue}
                            onChange={(e) => handleFilterChange(e.target.value)}
                        />
                    )}
                </div>
            )}
    
            {/* Loading and error states */}
            {isLoading && <p className={styles.loading}>Loading Data...</p>}
            {error && <p className={styles.error}>Error: {error}</p>}
            
            {/* Data display section */}
            {data && (
                <>
                    {isLiveMode ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Fridge ID</th>
                                    <th>Instrument Name</th>
                                    <th>Parameter Name</th>
                                    <th>Applied Value</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(filteredData || data).map((val, key) => (
                                    <tr key={key}>
                                        <td>{val.fridge_id}</td>
                                        <td>{val.instrument_name}</td>
                                        <td>{val.parameter_name}</td>
                                        <td>{val.applied_value}</td>
                                        <td>{val.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <InfiniteScroll
                            dataLength={data.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            loader={<h4 className={styles.loading}>Loading more...</h4>}
                            endMessage={
                                <p className={styles.endMessage}>No more data to load.</p>
                            }
                        >
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Fridge ID</th>
                                        <th>Instrument Name</th>
                                        <th>Parameter Name</th>
                                        <th>Applied Value</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(filteredData || data).map((val, key) => (
                                        <tr key={key}>
                                            <td>{val.fridge_id}</td>
                                            <td>{val.instrument_name}</td>
                                            <td>{val.parameter_name}</td>
                                            <td>{val.applied_value}</td>
                                            <td>{val.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </InfiniteScroll>
                    )}
                </>
            )}
        </div>
    );
};

export default SettingsPage;