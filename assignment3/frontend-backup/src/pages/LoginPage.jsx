import React, { useContext } from "react";
import { Alert, App, Button, Checkbox, Form, Input, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";
import MyForm from "../components/MyForm";
import { styleCentered, styleMargin } from "../styles/styles";

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
                content: "Login successfully",
            });
            setTimeout(() => {
                navigate("/main");
            }, 100);
        } else {
            message.open({
                type: "error",
                content: "Login failed",
            });
        }
    };

    const rulesUsername = [{
        required: true,
        message: "Please input your username",
    }]

    const rulesPassword = [{
        required: true,
        message: "Please input your password",
    }]

    return (
        <MyForm onFinish={onFinish}>
            <Form.Item style={{...styleMargin}} label="Username" name="username" rules={rulesUsername} >
                <Input />
            </Form.Item>
            <Form.Item style={{...styleMargin}} label="Password" name="password" rules={rulesPassword} >
                <Input.Password />
            </Form.Item>
            <Form.Item style={{...styleMargin, ...styleCentered}} name="remember" valuePropName="checked" >
                <Checkbox>Remember Me</Checkbox>
            </Form.Item>
            <Form.Item style={{...styleMargin, ...styleCentered}}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    <Button onClick={() => { navigate("/register") }} >
                        Register
                    </Button>
                </Space>
            </Form.Item>
            <Alert style={{...styleMargin, marginTop: '40px'}} message="Tips: default user is admin/123456" type="info" />
        </MyForm>
    )
}

export default LoginPage