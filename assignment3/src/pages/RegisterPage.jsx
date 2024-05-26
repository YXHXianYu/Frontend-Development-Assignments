import React, { useContext } from "react";
import { App, Button, Form, Input, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";

const RegisterPage = () => {
  const { message } = App.useApp();
  const { user: userService } = useContext(ServiceContext);
  const navigate = useNavigate();

  const onFinish = (values) => {
    const user = userService.register(
      values.username,
      values.password,
      values.email
    );
    if (user) {
      message.open({
        type: "success",
        content: "注册成功",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      message.open({
        type: "error",
        content: "注册失败",
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
        name="email"
        label="邮箱"
        rules={[
          {
            required: true,
            message: "请输入邮箱",
          },
          {
            type: "email",
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
          { /* 密码要求8-16位 */
            min: 8,
            max: 16,
            message: '密码要求8-16位',
          },
          { /* 密码需要同时包含大小写字母与数字 */
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]*$/,
            message: '密码需要同时包含大小写字母与数字',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;
