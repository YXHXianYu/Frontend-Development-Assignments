import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const MainSider = () => {
    return (
        <Sider>
            <Menu theme="dark" mode="inline">
                <Menu.Item key="1">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/login">Login</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/register">Register</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default MainSider;
