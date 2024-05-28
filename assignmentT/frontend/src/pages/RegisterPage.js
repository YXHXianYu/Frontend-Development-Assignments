import React, { useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { usernameRules, passwordRules, emailRules } from '../tools/rules';
import { encode, save } from '../tools/userTools';
import { DataContext } from '../context/context';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { data, setData } = useContext(DataContext);

    const onFinish = (values) => {
        console.log('Received values from form: ', values);
        console.log('Data: ', data)

        if (data.user === null) {
            message.error('Backend server is not running or not connected to the Internet')
        } else if (data.user === undefined) {
            message.error('Logical error: data.user is undefined')
        } else {
            for (let i = 0; i < data.user.length; i++) {
                if (data.user[i].username === values.username) {
                    message.error('Username already exists')
                    return
                }
            }
            let user = data.user
            const user_id = Math.floor(Math.random() * Date.now())
            user.push({
                id: user_id,
                username: values.username,
                password: encode(values.password),
                email: values.email,
            })
            setData({
                ...data,
                user: user,
                cur_user_id: user_id,
            })
            localStorage.setItem('cur_user_id', user_id)
            save('user', user)
            navigate('/');
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', padding: '50px 0' }}>
            <h1>Register Page</h1>
            <Form name="register" initialValues={{ remember: true }} onFinish={onFinish} >
                <Form.Item name="username" rules={usernameRules} >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item name="email" rules={emailRules} >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={passwordRules} >
                    <Input type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Register
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="default" onClick={handleLogin} style={{ width: '100%' }}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterPage;

