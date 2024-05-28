import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sider from './Sider';
import Footer from './Footer';

const { Content } = Layout;

const MainLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider />
            <Layout>
                <Header />
                <Content style={{ padding: '0 50px', marginTop: '64px' }}>
                    <Outlet />
                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
};

export default MainLayout;
