import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { App, Layout, ConfigProvider } from "antd";

import UserDropdown from './components/UserDropdown';
import './App.css';
import { useEffect } from 'react';

const { Header } = Layout;

const theme = { token: {
    // Seed Token，影响范围大
    colorPrimary: '#FF0000',
    borderRadius: 20,

    // 派生变量，影响范围小
    colorBgContainer: '#f6ffed',

    fontFamily: '"JetBrains Mono", monospace',
    
    // 边框样式
    borderColorBase: '#d9d9d9', // 灰色边框
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
      <App className="App">
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
