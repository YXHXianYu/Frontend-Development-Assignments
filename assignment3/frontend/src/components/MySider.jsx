import React from "react";
import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";

const SideMenu = () => {
    
    const menuItems = [{
        key: "Home",
        label: <Link to="/main/home">Home</Link>,
    }, {
        key: "User List",
        label: <Link to="/main/user">User List</Link>,
    }]

    const menuProps = {
        mode: "inline",
        defaultSelectedKeys: ["Home"],
        defaultOpenKeys: ["permission"],
        style: {
            borderRight: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
        },
        items: menuItems,
    }

    const styleSider = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: '5px solid #777777',
    }

    return (
        <Layout.Sider style={{...styleSider}}>
            <Menu {...menuProps} />
        </Layout.Sider>
    )
}

export default SideMenu;