import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sider from './Sider';
import Footer from './Footer';

const { Content } = Layout;

const theme = { token: {
    colorPrimary: '#00b96b',
    colorBgContainer: '#f6ffed',
    
    borderRadius: 0,
    fontFamily: '"Pixelify Sans", "JetBrains Mono", monospace',
    fontSize: '18px',
}}

const MainLayout = () => {
    return (
        <ConfigProvider theme={theme}>
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
        </ConfigProvider>
    );
};

export default MainLayout;
