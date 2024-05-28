import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import { DataContext } from '../context/context';
import { save } from '../tools/userTools';
import { emailRules, usernameRules } from '../tools/rules';

const UsersPage = () => {
    const navigate = useNavigate();
    const { data, setData } = useContext(DataContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (data.cur_user_id === undefined) {
            navigate('/login');
        }
    }, [data.cur_user_id, navigate]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button type="danger" onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </span>
            ),
        },
    ];

    const handleEdit = (user) => {
        setEditingUser(user);
        form.setFieldsValue({
            username: user.username,
            email: user.email,
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        const newUserList = data.user.filter(user => user.id !== id);
        setData({
            ...data,
            user: newUserList,
        });
        save('user', newUserList);
        message.success('User deleted successfully');
    };

    const handleAddUser = () => {
        const id = Math.floor(Math.random() * Date.now()) % 1000000;
        const newUser = {
            id: id,
            username: 'new_user' + id % 10000,
            email: 'new_user@example.com',
            password: 'password',
        };
        const newUserList = [...data.user, newUser];
        setData({
            ...data,
            user: newUserList,
        });
        save('user', newUserList);
        message.success('User added successfully');
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newUserList = data.user.map(user => {
                if (user.id === editingUser.id) {
                    return { ...user, ...values };
                }
                return user;
            });
            setData({
                ...data,
                user: newUserList,
            });
            save('user', newUserList);
            message.success('User updated successfully');
            setIsModalVisible(false);
            setEditingUser(null);
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
    };

    return (
        <div>
            <h1>Users Page</h1>
            <Button type="primary" onClick={handleAddUser} style={{ marginBottom: 16 }}>
                Add User
            </Button>
            <Table dataSource={data.user} columns={columns} rowKey="id" />
            <Modal title="Edit User" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} >
                <Form form={form} layout="vertical" name="edit_user_form">
                    <Form.Item name="username" label="Username" rules={usernameRules} >
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={emailRules} >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UsersPage;
