import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const savedAuth = JSON.parse(localStorage.getItem('auth')) || {
            username: 'admin',
            password: 'admin123',
        };

        form.setFieldsValue({
            username: savedAuth.username,
            password: savedAuth.password,
        });

        if (savedAuth?.isLoggedIn) {
            setIsAuthenticated(true);
            navigate('/dashboard');
        }
    }, [form, navigate, setIsAuthenticated]);

    const handleLogin = (values) => {
        setLoading(true);
        const { username, password } = values;

        if (username === 'admin' && password === 'admin123') {
            message.success('Login successful!');
            setIsAuthenticated(true);
            localStorage.setItem(
                'auth',
                JSON.stringify({ isLoggedIn: true, username, password })
            );
            navigate('/dashboard');
        } else {
            message.error('Invalid username or password');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Space direction="vertical" style={{ width: 300, textAlign: 'center' }}>
                <Typography.Title level={2}>Admin Login</Typography.Title>
                <Form
                    name="login"
                    layout="vertical"
                    onFinish={handleLogin}
                    autoComplete="off"
                    form={form}
                    style={{ maxWidth: 300 }}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </div>
    );
};

export default Login;
