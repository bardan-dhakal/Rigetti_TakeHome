import React from 'react';
import { useNavigate } from 'react-router-dom';



const HomePage = () => {

    const navigate = useNavigate();

    const goToSettings = () => {
        navigate('/settings');
    }

    return (
        <>
        <h1>Rigetti Take Home Assesment</h1>
        <p> Submitted by - Bardan Dhakal</p>
        <p> Email - bardandhakal2@gmail.com </p>
        <button onClick = {goToSettings}>
        Settings
        </button>
        
        </>
    );

}

export default HomePage;