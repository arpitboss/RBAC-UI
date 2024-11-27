import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons'; // Optional: use AntD icon for Logout

const { Header } = Layout;

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login', { replace: true });
        window.location.reload();
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
                Admin Dashboard
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ flexGrow: 1 }}>
                <Menu.Item key="1">
                    <Link to="/dashboard">Users</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/roles">Roles</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/permissions">Permissions</Link>
                </Menu.Item>
                <Menu.Item key="logout" style={{ marginLeft: 'auto' }}>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />} // Optional: add an icon for logout
                        onClick={handleLogout}
                        style={{
                            color: '#ff4d4f',
                            fontWeight: 'bold',
                            transition: 'color 0.3s ease, transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#ff7875'; // Change to a lighter red
                            e.target.style.transform = 'scale(1.1)'; // Slightly scale up the button
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '#ff4d4f'; // Reset to original color
                            e.target.style.transform = 'scale(1)'; // Reset scale
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
