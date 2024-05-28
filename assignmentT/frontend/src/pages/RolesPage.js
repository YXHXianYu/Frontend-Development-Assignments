import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/context';

const RolesPage = () => {
    const navigate = useNavigate();
    const { data } = useContext(DataContext);
    useEffect(() => {
        if (data.cur_user_id === undefined) {
            navigate('/login');
        }
    });
    
    return (
        <div>
            <h1>Roles Page</h1>
        </div>
    );
};

export default RolesPage;
