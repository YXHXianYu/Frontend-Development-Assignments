import React, { useContext } from "react";
import { Alert, App, Button, Checkbox, Form, Input, Space, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";

const LoginPage = () => {
  const { message } = App.useApp();
  const { user: userService } = useContext(ServiceContext);
  const navigate = useNavigate();

  const onFinish = (values) => {
    const user = userService.login(
      values.username,
      values.password,
      values.remember
    );
    if (user) {
      message.open({
        type: "success",
        content: "登录成功",
      });
      setTimeout(() => {
        navigate("/main");
      }, 1000);
    } else {
      message.open({
        type: "error",
        content: "登录失败",
      });
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{
        maxWidth: 600,
        margin: "40px auto",
        borderRadius: borderRadiusLG,
        padding: 20,
        boxShadow: "0 0 10px #ccc",
        background: colorBgContainer,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Alert message="初始化账号为admin/123456" type="info" style={{marginBottom: 12}}/>
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: "请输入用户名",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: "请输入密码",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>记住我</Checkbox>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
          <Button
            onClick={() => {
              navigate("/register");
            }}
          >
            注册
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
