import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Typography,
    Space,
    Popconfirm,
} from 'antd';
import axios from 'axios';

const { Option } = Select;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const PERMISSIONS = {
        edit: '2',
        delete: '3',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    axios.get('http://localhost:5000/users'),
                    axios.get('http://localhost:5000/roles'),
                ]);
                setUsers(usersRes.data);
                setRoles(rolesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Listen for role updates
        const handleRolesUpdated = (event) => {
            const deletedRoleId = event.detail.roleId;

            // Update users if their role no longer exists
            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.role === deletedRoleId) {
                        return { ...user, role: null }; // Set role to null
                    }
                    return user;
                })
            );
        };

        window.addEventListener('rolesUpdated', handleRolesUpdated);

        return () => {
            window.removeEventListener('rolesUpdated', handleRolesUpdated);
        };
    }, []);

    const showModal = (user = null) => {
        setEditingUser(user);
        setIsModalVisible(true);
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
    };

    const handleAddOrUpdateUser = async () => {
        try {
            const values = await form.validateFields();
            if (editingUser) {
                // Update user
                const response = await axios.put(`http://localhost:5000/users/${editingUser.id}`, values);
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user.id === editingUser.id ? response.data : user))
                );
                setSnackbarMessage('User updated successfully');
            } else {
                // Add new user
                const { data: newUser } = await axios.post('http://localhost:5000/users', values);
                setUsers((prevUsers) => [...prevUsers, newUser]);
                setSnackbarMessage('User added successfully');
            }
            setIsModalVisible(false);
            message.success(snackbarMessage);
        } catch (error) {
            console.error('Error saving user:', error);
            message.error('Error saving user');
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
            message.success('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Error deleting user');
        }
    };

    const hasPermission = (roleId, permission) => {
        if (!roleId) return true; // Enable buttons if the role is null (role was deleted)

        const role = roles.find((role) => role.id === roleId);
        if (role && role.permissions) {
            return role.permissions.includes(PERMISSIONS[permission]); // Check by permission ID
        }
        return false;
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => roles.find((r) => r.id === role)?.name || 'Unknown Role',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, user) => (
                <Space>
                    <Button
                        type="link"
                        disabled={!hasPermission(user.role, 'edit')}
                        onClick={() => showModal(user)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => deleteUser(user.id)}
                        okText="Yes"
                        cancelText="No"
                        disabled={!hasPermission(user.role, 'delete')}
                    >
                        <Button type="link" danger disabled={!hasPermission(user.role, 'delete')}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Typography.Title level={2}>User Management</Typography.Title>
            <Button type="primary" onClick={() => showModal()}>
                Add User
            </Button>
            <Table
                style={{ marginTop: '20px' }}
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title={editingUser ? 'Edit User' : 'Add New User'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleAddOrUpdateUser}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the user name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select placeholder="Select a role">
                            {roles.map((role) => (
                                <Option key={role.id} value={role.id}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select a status' }]}
                    >
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
