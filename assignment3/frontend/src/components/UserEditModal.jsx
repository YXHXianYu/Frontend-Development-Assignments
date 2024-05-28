import React, { useImperativeHandle } from 'react'

import { Form, Input, Modal } from 'antd'
import { forwardRef } from 'react'
import { usernameRules, passwordRules, nameRules, emailRules } from "../tools/rules"

const UserEditForm = forwardRef(({ initialValues }, ref) => {
    const [ form ] = Form.useForm()

    useImperativeHandle(ref, () => form, [ form ])

    const fromProps = {
        layout: "horizontal",
        labelCol: {span: 10},
        wrapperCol: {span: 30},
        form: form,
        initialValues: initialValues,
        preserve: false,
    }

    return (
        <Form {...fromProps} >
            <Form.Item name="id" label="ID">
                <Input type="number" disabled/>
            </Form.Item>
            <Form.Item name="username" label="Username" rules={usernameRules} >
                <Input />
            </Form.Item>
            <Form.Item name="password" label="Password" >
                <Input.Password disabled />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={nameRules} >
                <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={emailRules} >
                <Input />
            </Form.Item>
        </Form>
    )
})

const UserEditFormModal = ({ open, onCreate, onCancel, initialValues }) => {
    const formRef = React.createRef()

    const modalProps = {
        open: open,
        closable: false,
        title: "Edit User",
        okText: "Confirm",
        cancelText: "Cancel",
        okButtonProps: {
            autoFocus: true,
        },
        onCancel: onCancel,
        destroyOnClose: () => {},
        onOk: async () => {
            try {
                const formInstance = formRef.current
                const values = await formInstance?.validateFields()
                formInstance?.resetFields()
                onCreate(values)
            } catch (error) {
                console.log('Failed:', error)
            }
        },
    }

    return (
        <Modal {...modalProps} >
            <UserEditForm ref={formRef} initialValues={initialValues} />
        </Modal>
    )
}

export default UserEditFormModal
