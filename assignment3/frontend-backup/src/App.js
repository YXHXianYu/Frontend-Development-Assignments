import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { App, Layout, ConfigProvider } from "antd";

import UserDropdown from './components/UserDropdown';
import './App.css';
import { useEffect } from 'react';

const { Header } = Layout;

const theme = { token: {
    colorPrimary: '#FF0000',
    colorBgContainer: '#f6ffed',

    // Border
    borderRadius: 0,

    // Font
    fontFamily: '"Pixelify Sans", "JetBrains Mono", monospace',
    fontSize: '18px',
}};

function MyApp() {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/main/home');
        }
    }, [ /* eslint-disable-line react-hooks/exhaustive-deps */]);

    return (
        <ConfigProvider theme={theme}>
            <App>
                <Layout style={{minHeight: "100vh" }}>
                    <Header style={{ display: "flex", alignItems: "center" }}>
                        <UserDropdown />
                    </Header>
                    <Outlet />
                </Layout>
            </App>
        </ConfigProvider>
    );
}

export default MyApp;
