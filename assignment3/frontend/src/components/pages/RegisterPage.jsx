import React, { useContext } from "react"
import { App, Button, Form, Input, Space } from "antd"
import { useNavigate } from "react-router-dom"
import { ServiceContext } from "../../contexts/ServiceContext"
import MyForm from "../MyForm"
import { styleCentered, styleMargin } from "../../styles/styles"

const RegisterPage = () => {
    const { message } = App.useApp()
    const { user: userService } = useContext(ServiceContext)
    const navigate = useNavigate()

    const onFinish = (values) => {
        const user = userService.register(
            values.username,
            values.password,
            values.email
        )
        if (user) {
            message.open({
                type: "success",
                content: "Register successfully.",
            })
            setTimeout(() => {
                navigate("/login")
            }, 100)
        } else {
            message.open({
                type: "error",
                content: "Register failed.  Maybe the Backend is not available.",
            })
        }
    }

    const rulesUsername = [{
        required: true,
        message: "Please input your username",
    }]

    const rulesEmail = [{
        required: true,
        message: "Please input your email",
    }, {
        type: "email",
    }]

    const rulesPassword = [ {
        required: true,
        message: "Please input your password!",
    }, { /* 密码要求8-16位 */
        min: 8,
        max: 16,
        message: 'The password must be between 8 and 16 characters long',
    }, { /* 密码需要同时包含大小写字母与数字 */
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]*$/,
        message: 'The password must contain at least one uppercase letter, one lowercase letter, and one number',
    }]

    return (
        <MyForm onFinish={onFinish}>
            <Form.Item style={{...styleMargin}} name="username" label="Username" rules={rulesUsername} >
                <Input />
            </Form.Item>
            <Form.Item style={{...styleMargin}} name="email" label="Email" rules={rulesEmail} >
                <Input />
            </Form.Item>
            <Form.Item style={{...styleMargin}} name="password" label="Password" rules={rulesPassword} >
                <Input.Password />
            </Form.Item>
            <Form.Item style={{...styleMargin, ...styleCentered}} >
                <Space>
                    <Button onClick={() => { navigate("/login") }} >
                        Login
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Space>
            </Form.Item>
        </MyForm>
    )
}

export default RegisterPage
