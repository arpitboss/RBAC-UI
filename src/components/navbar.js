import React, { useState } from 'react';
import { Layout, Menu, Button, message, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { confirm } = Modal;

const Navbar = ({ setIsAuthenticated }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const showLogoutConfirm = () => {
        confirm({
            title: 'Are you sure you want to logout?',
            icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            content: 'You will be redirected to the login page.',
            okText: 'Logout',
            cancelText: 'Cancel',
            okType: 'danger',
            onOk: async () => {
                setLoading(true);
                await handleLogout();
                setLoading(false);
            },
        });
    };

    const handleLogout = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({
                        username: 'admin',
                        password: 'admin123',
                        isLoggedIn: false,
                    })
                );
                setIsAuthenticated(false);
                message.info('Logged out successfully');
                navigate('/login');
                resolve();
            }, 1500);
        });
    };

    return (
        <Header style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#001529' }}>
            <div
                style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    float: 'left',
                    marginRight: '20px',
                }}
            >
                RBAC Dashboard
            </div>
            <Menu theme="dark" mode="horizontal" style={{ flexGrow: 1 }}>
                <Menu.Item key="dashboard">
                    <Link to="/dashboard">Users</Link>
                </Menu.Item>
                <Menu.Item key="roles">
                    <Link to="/roles">Roles</Link>
                </Menu.Item>
                <Menu.Item key="permissions">
                    <Link to="/permissions">Permissions</Link>
                </Menu.Item>
                <Menu.Item key="logout" style={{ marginLeft: 'auto', background: 'none' }}>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={showLogoutConfirm}
                        loading={loading}
                        style={{
                            color: '#ff4d4f',
                            fontWeight: 'bold',
                            background: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        Logout
                    </Button>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default Navbar;
