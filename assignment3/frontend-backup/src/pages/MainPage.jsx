import React from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import useLoginCheck from "../hooks/LoginCheck";
import SideMenu from "../components/SideMenu";
const { Content, Footer, Sider } = Layout;

const MainPage = () => {
    useLoginCheck();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const styleContent = {
        padding: 24,
        margin: 0,
        marginTop: 24,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
    }

    return (
        <Layout>
            <Sider>
                <SideMenu/>
            </Sider>
            <Layout style={{padding: '0 24px 24px'}}>
                <Content style={styleContent} >
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: "center" }} >
                    {'---'} Management Information System ©{new Date().getFullYear()} &nbsp;&nbsp; {'---'} &nbsp;&nbsp; Created by j3l11234 &nbsp;&nbsp; {'---'} &nbsp;&nbsp; Modified by YXHXianYu  {'---'}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MainPage;
