import React from "react"
import { Menu, Layout } from "antd"
import { Link } from "react-router-dom"

const SideMenu = () => {
    
    const menuItems = [{
        key: "Home",
        label: <Link to="/main/home">Home</Link>,
    }, {
        key: "User List",
        label: <Link to="/main/user">User List</Link>,
    }, {
        key: "Role List",
        label: <Link to="/main/role">Role List</Link>,
    }, {
        key: "Goods List",
        label: <Link to="/main/goods">Goods List</Link>,
    }, {
        key: "Order List",
        label: <Link to="/main/order">Order List</Link>,
    }, {
        key: "Games",
        label: <Link to="/main/games">Games</Link>,
    }, {
        key: "Authorization",
        label: <Link to="/main/authorization">Authorization</Link>,
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

export default SideMenu