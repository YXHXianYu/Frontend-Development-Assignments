import React, { useContext, useEffect } from 'react';
import { Layout, Button, Row, Col } from 'antd';
import { DataContext } from '../context/context';
import { load } from '../tools/userTools';
import { message } from 'antd';

const { Header } = Layout;

const MainHeader = () => {
    const { data, setData } = useContext(DataContext);

    // Initialize user data
    useEffect(() => {
        const func = async () => {
            const user = await load('user')
            const cur_user_id = localStorage.getItem('cur_user_id')
            if (user) {
                setData({
                    ...data,
                    user: user,
                    cur_user_id: cur_user_id,
                })
            } else {
                message.error('Backend server is not running or not connected to the Internet')
                setData({
                    ...data,
                    user: null, // Backend is down
                    cur_user_id: cur_user_id,
                })
            }
        }
        func()
        // eslint-disable-next-line
    }, [])

    // Update current username
    useEffect(() => {
        const func = async () => {
            console.log(data)
            let cur_username
            if (data.user === null || data.user === undefined) {
                cur_username = 'BACKEND SERVER IS DOWN!'
            } else if (data.cur_user_id === undefined || data.cur_user_id === 'undefined') {
                cur_username = 'Not Logged In'
            } else {
                for (let i = 0; i < data.user.length; i++) {
                    // eslint-disable-next-line
                    if (data.user[i].id == data.cur_user_id) {
                        cur_username = data.user[i].username
                        break
                    }
                }
            }
            setData({
                ...data,
                cur_username: '<' + cur_username + '>',
            })
        }
        func()
        // eslint-disable-next-line
    }, [data.user, data.cur_user_id])

    const handleLogout = () => {
        if (data.cur_user_id === undefined) {
            message.error('You have not logged in')
        } else {
            setData({
                ...data,
                cur_user_id: undefined,
            })
            localStorage.setItem('cur_user_id', undefined)
            message.success('Logout successfully')
        }
    }

    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Row justify="space-between" align="middle" style={{ width: '70%' }}>
                <Col>
                    <div style={{ color: 'white', fontSize: '20px' }}>Header</div>
                </Col>
                <Col>
                    <Row align="middle" gutter={[16, 0]}>
                        <Col>
                            <div style={{ color: 'white' }}>
                                Current User: &nbsp; {data.cur_username}
                            </div>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Header>
    );
};

export default MainHeader;
