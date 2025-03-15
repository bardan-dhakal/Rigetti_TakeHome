import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SettingsPage from '../pages/SettingsPage';
import AnalyticsPage from '../pages/AnalyticsPage';

const AppRoute = () => {

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path = "/settings" element={<SettingsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
    );
}

export default AppRoute;