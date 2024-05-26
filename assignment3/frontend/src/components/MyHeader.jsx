import React, { useContext, useCallback } from "react";
import { App, Button, Layout } from "antd";
import { useNavigate } from "react-router-dom";

import { ServiceContext } from "../contexts/ServiceContext";

const MyHeader = () => {
    const { user: userService } = useContext(ServiceContext);
    const { message } = App.useApp();
    const navigate = useNavigate();

    const onLogout = useCallback(
        () => {
            userService.logout();
            message.open({
                type: "info",
                content: "Logout successfully",
            });
            setTimeout(() => {
                navigate("/login");
            }, 100);
        },
        [ userService, message, navigate ]
    );

    const { username } = userService.getCurrentUser() || { username: 'Not Logged In' }

    const styleHeader = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        border: '5px solid #777777',
    }

    const styleOuter = {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
    }

    const styleInner = {
        backgroundColor: "#ffffff",
        height: '50%',
        padding: '0 15px',
        display: 'flex',
        alignItems: 'center',
    }

    return (
        <Layout.Header style={{...styleHeader}}>
            <div style={{...styleOuter}}>
                <div style={{...styleInner}}>
                    Login Status: &nbsp;{'<' + username + '>'}
                </div>
                <Button onClick={onLogout}>
                    Logout
                </Button>
            </div>
        </Layout.Header>
    );
}

export default MyHeader;
