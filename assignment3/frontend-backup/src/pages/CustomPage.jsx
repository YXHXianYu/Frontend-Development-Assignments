import React from "react";
import { useLocation } from 'react-router-dom';
const CustomPage = () => {
    let location = useLocation();
    return (
        <div>
            <p>This is a customized page.</p>
            <p>path: {location.pathname}</p>
        </div>
    );
};

export default CustomPage;
