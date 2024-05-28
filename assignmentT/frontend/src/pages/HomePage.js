import React, { useContext, useEffect } from 'react';
import backgroundImage from '../assets/background.png';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/context';

const HomePage = () => {
    const navigate = useNavigate();
    const { data } = useContext(DataContext);
    useEffect(() => {
        if (data.cur_user_id === undefined) {
            navigate('/login');
        }
    });

    return (
        <div>
            <h1>Home Page</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={backgroundImage} alt="background" style={{ width: '70%' }} />
            </div>
        </div>
    );
};

export default HomePage;
