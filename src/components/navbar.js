import React from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
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
    };

    return (
        <Header style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#001529' }}>
            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', float: 'left', marginRight: '20px' }}>
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
                <Menu.Item key="logout" style={{ marginLeft: 'auto' }}>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ color: '#ff4d4f', fontWeight: 'bold' }}
                    >
                        Logout
                    </Button>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default Navbar;
