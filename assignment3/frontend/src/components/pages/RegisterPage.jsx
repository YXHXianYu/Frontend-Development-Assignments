import React, { useContext } from "react"
import { App, Button, Form, Input, Space } from "antd"
import { useNavigate } from "react-router-dom"
import { ServiceContext } from "../../contexts/ServiceContext"
import MyForm from "../MyForm"
import { styleCentered, styleMargin } from "../../styles/styles"
import { usernameRules, passwordRules, emailRules } from "../../tools/rules"

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

    return (
        <MyForm onFinish={onFinish}>
            <Form.Item style={{...styleMargin}} name="username" label="Username" rules={usernameRules} >
                <Input />
            </Form.Item>
            <Form.Item style={{...styleMargin}} name="email" label="Email" rules={emailRules} >
                <Input />
            </Form.Item>
            <Form.Item style={{...styleMargin}} name="password" label="Password" rules={passwordRules} >
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
