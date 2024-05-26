import React from "react";
import { Breadcrumb, Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import useLoginCheck from "../hooks/LoginCheck";
import SideMenu from "../components/SideMenu";
const { Content, Footer, Sider } = Layout;

const MainPage = () => {
  useLoginCheck();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider>
        <SideMenu/>
       
      </Sider>
      <Layout style={{padding: '0 24px 24px'}}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            marginTop: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          后台管理demo ©{new Date().getFullYear()} Created by j3l11234
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainPage;
