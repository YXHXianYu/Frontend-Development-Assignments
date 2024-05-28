import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const MainHeader = () => {
    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div style={{ color: 'white' }}>Header</div>
        </Header>
    );
};

export default MainHeader;
