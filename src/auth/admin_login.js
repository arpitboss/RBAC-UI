import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (values) => {
        setLoading(true);
        const { username, password } = values;

        // Simulate authentication with hardcoded credentials
        if (username === 'admin' && password === 'admin123') {
            message.success('Login successful!');
            setIsAuthenticated(true);
            navigate('/dashboard'); // Redirect to the dashboard
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
