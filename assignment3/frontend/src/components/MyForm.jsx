import React from "react"
import { Form, theme } from "antd"


const MyForm = ({ children, onFinish }) => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const formProps = {
        name: "basic",
        style: {
            maxWidth: 600,
            margin: "40px auto",
            border: "4px solid #777777",
            padding: 20,
            background: colorBgContainer,
        },
        initialValues: {
            remember: true,
        },
        onFinish: onFinish,
        autoComplete: "off",
    }

    return (
        <Form {...formProps}>
            {children}
        </Form>
    )
}

export default MyForm