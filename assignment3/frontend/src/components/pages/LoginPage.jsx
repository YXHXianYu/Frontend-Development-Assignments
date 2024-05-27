import React, { useContext, useEffect } from "react"
import { Alert, App, Button, Checkbox, Form, Input, Space } from "antd"
import { useNavigate } from "react-router-dom"
import { ServiceContext } from "../../contexts/ServiceContext"
import MyForm from "../MyForm"
import { styleCentered, styleMargin } from "../../styles/styles"

import { usernameRules, passwordRules } from "../../tools/rules"

const LoginPage = () => {
    const { message } = App.useApp()
    const { user: userService } = useContext(ServiceContext)
    const navigate = useNavigate()

    useEffect(() => {
        const func = async () => {
            const user = await userService.getCurrentUser()
            if (!user) {
                message.open({
                    type: "warning",
                    content: "Please login first",
                })
                navigate("/login")
            } else {
                navigate("/main/home")
            }
        }
        func()
    }, [/* eslint-disable-line react-hooks/exhaustive-deps */])

    const onFinish = (values) => {
        const user = userService.login(
            values.username,
            values.password,
            values.remember,
        )
        if (user) {
            message.open({
                type: "success",
                content: "Login successfully",
            })
            setTimeout(() => {
                navigate("/main")
            }, 100)
        } else {
            message.open({
                type: "error",
                content: "Login failed. Maybe the Backend is not available.",
            })
        }
    }

    return (
        <MyForm onFinish={onFinish}>
            <Form.Item style={{...styleMargin}} label="Username" name="username" rules={usernameRules} >
                <Input />
            </Form.Item>
            <Form.Item style={{...styleMargin}} label="Password" name="password" rules={passwordRules} >
                <Input.Password />
            </Form.Item>
            <Form.Item style={{...styleMargin, ...styleCentered}} name="remember" valuePropName="checked" >
                <Checkbox>Remember Me</Checkbox>
            </Form.Item>
            <Form.Item style={{...styleMargin, ...styleCentered}}>
                <Space>
                    <Button type="primary" htmlType="submit"> Login </Button>
                    <Button onClick={() => { navigate("/register") }}> Register </Button>
                </Space>
            </Form.Item>
            <Alert style={{...styleMargin, marginTop: '40px'}} message="Tips: default user is admin/123456Aa" type="info" />
        </MyForm>
    )
}

export default LoginPage
