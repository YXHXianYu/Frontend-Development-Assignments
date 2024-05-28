import React, { useContext } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { usernameRules, passwordRules } from '../tools/rules';
import { Alert, message } from 'antd';
import { DataContext } from '../context/context';
import { encode } from '../tools/userTools';

const LoginPage = () => {
    const navigate = useNavigate();
    const { data, setData } = useContext(DataContext);

    const onFinish = (values) => {
        console.log('Received values from form: ', values);
        console.log('Data: ', data)

        if (data.user === null) {
            message.error('Backend server is not running or not connected to the Internet')
        } else if (data.user === undefined) {
            message.error('Logical error: data.user is undefined')
        } else if (data.cur_user_id !== undefined && data.cur_user_id !== 'undefined') {
            message.error('You have already logged in')
        } else {
            let flag = false
            for (let i = 0; i < data.user.length; i++) {
                if (data.user[i].username === values.username && data.user[i].password === encode(values.password)) {
                    flag = true
                    setData({
                        ...data,
                        cur_user_id: data.user[i].id,
                    })
                    localStorage.setItem('cur_user_id', data.user[i].id)
                    message.success('Login successfully')
                    break
                }
            }
            if (!flag) {
                message.error('Username or password is incorrect')
            }
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', padding: '50px 0' }}>
            <h1>Login Page</h1>
            <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} >
                <Form.Item name="username" rules={usernameRules} >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item name="password" rules={passwordRules} >
                    <Input type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Login
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="default" onClick={handleRegister} style={{ width: '100%' }}>
                        Register
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Alert message={<span>Username: admin<br />Password: 123456Aa</span>} type="info" />
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;