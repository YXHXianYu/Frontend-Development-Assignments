import React, { useContext, useCallback } from "react";
import { App, Button } from "antd";
import { useNavigate } from "react-router-dom";

import { ServiceContext } from "../contexts/ServiceContext";

function UserDropdown() {
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
        [ /* eslint-disable-line react-hooks/exhaustive-deps */ ]
    );

    const { username } = userService.getCurrentUser() || { username: 'Not Logged In' }

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
        <div style={{...styleOuter}}>
            <div style={{...styleInner}}>
                Login Status: &nbsp;{'<' + username + '>'}
            </div>
            <Button onClick={onLogout}>
                Logout
            </Button>
        </div>
    );
}

export default UserDropdown;
