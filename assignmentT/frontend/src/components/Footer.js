import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const MainFooter = () => {
    return (
        <Footer style={{ textAlign: 'center' }}>
            Management Information System ©{new Date().getFullYear()} Created by YXHXianYu
        </Footer>
    );
};

export default MainFooter;
