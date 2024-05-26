import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { App, Layout, ConfigProvider } from "antd"

import MyHeader from './components/MyHeader'
import './App.css'
import { useEffect } from 'react'
import backgroundImage from './assets/background.png'

const theme = { token: {
    colorPrimary: '#00b96b',
    colorBgContainer: '#f6ffed',
    
    borderRadius: 0,
    fontFamily: '"Pixelify Sans", "JetBrains Mono", monospace',
    fontSize: '18px',
}}

function MyApp() {
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/main/home')
        }
    }, [ /* eslint-disable-line react-hooks/exhaustive-deps */])

    const styleLayout = {
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    }

    return (
        <ConfigProvider theme={theme}>
            <App>
                <Layout style={{...styleLayout}}>
                    <MyHeader />
                    <Outlet />
                </Layout>
            </App>
        </ConfigProvider>
    )
}

export default MyApp
