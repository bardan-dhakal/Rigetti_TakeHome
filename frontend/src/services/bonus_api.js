export const fetchHistoricalData = async (page = 1, perPage = 20) => {
    const response = await fetch(`http://localhost:8000/settings/history?page=${page}&per_page=${perPage}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const fetchAnalytics = async () => {
    const response = await fetch('http://localhost:8000/analytics');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};