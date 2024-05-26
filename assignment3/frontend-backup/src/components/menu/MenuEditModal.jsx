import React, { useImperativeHandle } from 'react';

import { Form, Input, Modal, Switch, InputNumber } from 'antd';
import { forwardRef } from 'react';

const MenuEditForm = forwardRef(({ initialValues }, ref) => {
    const [form] = Form.useForm();

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useImperativeHandle(ref, () => form, []);

    return (
        <Form 
            layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 20}}
            form={form} initialValues={initialValues} preserve={false}
        >
            <Form.Item name="id" label="id">
                <Input type="number" disabled/>
            </Form.Item>
            <Form.Item name="name" label="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input name',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="parent" label="parent"
                rules={[
                    {
                        type: 'number',
                        required: true,
                        message: 'Please input parent. 0 for root',
                    },
                ]}
            >
                <InputNumber />
            </Form.Item>
            <Form.Item name="path" label="path"
                rules={[
                    {
                        required: true,
                        message: 'Please input path',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="enable" label="enable" valuePropName="checked">
                <Switch />
            </Form.Item>
        </Form>
    );
});

const MenuEditFormModal = ({ open, onCreate, onCancel, initialValues }) => {
    const formRef = React.createRef();

    return (
        <Modal
            open={open}
            title="Edit Menu"
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
            <MenuEditForm
                ref={formRef}
                initialValues={initialValues}
            />
        </Modal>
    );
};

export default MenuEditFormModal;