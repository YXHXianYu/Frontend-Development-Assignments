import React, { useContext, useCallback } from "react";
import { App, Button, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";

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
        content: "注销成功",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    },
    [ /* eslint-disable-line react-hooks/exhaustive-deps */]
  );

  const currentUser = userService.getCurrentUser();
  const navItems = [
    {
      key: "currentUser",
      label: currentUser ? currentUser.username : "未登录",
      disabled: true,
    },
    !currentUser
      ? {
          key: "login",
          label: <Link to="/login">登录</Link>,
        }
      : {
          key: "logout",
          label: (
            <Button type="link" onClick={onLogout}>
              注销
            </Button>
          ),
        },
  ];

  return (
    <Dropdown menu={{ items: navItems }} style={{ marginLeft: "auto" }}>
      <Button>登录状态</Button>
    </Dropdown>
  );
}

export default UserDropdown;
