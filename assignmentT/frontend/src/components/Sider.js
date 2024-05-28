import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const MainSider = () => {
    const location = useLocation();
    const selectedKey = location.pathname;

    return (
        <Sider>
            <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
                <Menu.Item key="/"> <Link to="/">Home</Link> </Menu.Item>
                <Menu.Item key="/login"> <Link to="/login">Login</Link> </Menu.Item>
                <Menu.Item key="/register"> <Link to="/register">Register</Link> </Menu.Item>
                <Menu.Item key="/users"> <Link to="/users">Users</Link> </Menu.Item>
                <Menu.Item key="/goods"> <Link to="/goods">Goods</Link> </Menu.Item>
                <Menu.Item key="/orders"> <Link to="/orders">Orders</Link> </Menu.Item>
                <Menu.Item key="/roles"> <Link to="/roles">Roles</Link> </Menu.Item>
                <Menu.Item key="/games"> <Link to="/games">Games</Link> </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default MainSider;

