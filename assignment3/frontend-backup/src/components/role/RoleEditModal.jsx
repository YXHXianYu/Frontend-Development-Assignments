import React, { useImperativeHandle } from 'react';

import { Form, Input, Modal, Switch } from 'antd';
import { forwardRef } from 'react';

const RoleEditForm = forwardRef(({ initialValues }, ref) => {
    const [form] = Form.useForm();

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useImperativeHandle(ref, () => form, []);

    return (
        <Form 
            layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 20}}
            form={form} initialValues={initialValues} preserve={false}
        >
            <Form.Item name="id" label="id">
                <Input disabled/>
            </Form.Item>
            <Form.Item name="name" label="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input name',
                    },
                ]}
            >
                <Input disabled={initialValues.id === 1}/>
            </Form.Item>
            <Form.Item name="desc" label="desc"
                rules={[
                    {
                        required: true,
                        message: 'Please input desc',
                    },
                ]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="enable" label="enable" valuePropName="checked">
                <Switch disabled={initialValues.id === 1} />
            </Form.Item>
        </Form>
    );
});

const RoleEditFormModal = ({ open, onCreate, onCancel, initialValues }) => {
    const formRef = React.createRef();

    return (
        <Modal
            open={open}
            title="Edit Role"
            okText="Confirm"
            cancelText="Cancel"
            okButtonProps={{
                autoFocus: true,
            }}
            onCancel={onCancel}
            destroyOnClose
            onOk={async () => {
                try {
                    const formInstance = formRef.current;
                    const values = await formInstance?.validateFields();
                    formInstance?.resetFields();
                    onCreate(values);
                } catch (error) {
                    console.log('Failed:', error);
                }
            }}
        >
            <RoleEditForm
                ref={formRef}
                initialValues={initialValues}
            />
        </Modal>
    );
};

export default RoleEditFormModal;