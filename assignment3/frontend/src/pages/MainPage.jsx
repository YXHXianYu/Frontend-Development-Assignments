import React, { useEffect, useContext } from "react"
import { App, Layout } from "antd"
import { Outlet, useNavigate } from "react-router-dom"
import MySider from "../components/MySider"
import { ServiceContext } from '../contexts/ServiceContext'

const { Content, Footer } = Layout

const MainPage = () => {
    const { user: userService } = useContext(ServiceContext)
    const { message } = App.useApp()
    const navigate = useNavigate()

    useEffect(() => {
        const user = userService.getCurrentUser()
        if (!user) {
            message.open(
                {
                    type: "warning",
                    content: "Please login first",
                }
            )
            navigate("/login")
        } else {
            navigate("/main/home")
        }
    }, [/* eslint-disable-line react-hooks/exhaustive-deps */])

    const styleLayout = {
        padding: '32px',
        backgroundColor: 'rgba(0,0,0,0)',
        
        // display: 'flex',
        direction: 'column',
        // alignItems: 'center',
        // height: '100%',
        // width: '100%',
        // justifyContent: 'space-between',
    }

    const styleContent = {
        padding: 24,
        margin: 0,
        marginTop: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    }

    const stylePlaceholder = {
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
    }

    const styleFooter = {
        textAlign: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    }

    return (
        <Layout style={{backgroundColor: 'rgba(0,0,0,0.25)'}}>
            <MySider />
            <Layout style={styleLayout}>
                <Content style={styleContent} >
                    <Outlet />
                </Content>
                <Footer style={stylePlaceholder} />
                <Footer style={styleFooter} >
                    Management Information System ©{new Date().getFullYear()} Created by YXHXianYu
                </Footer>
            </Layout>
        </Layout>
    )
}

export default MainPage
