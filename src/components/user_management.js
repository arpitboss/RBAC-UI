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
    Row,
    Col,
} from 'antd';
import axios from 'axios';

const { Option } = Select;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);

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
                const response = await axios.put(`http://localhost:5000/users/${editingUser.id}`, values);
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user.id === editingUser.id ? response.data : user))
                );
                message.success('User updated successfully');
            } else {
                const { data: newUser } = await axios.post('http://localhost:5000/users', values);
                setUsers((prevUsers) => [...prevUsers, newUser]);
                message.success('User added successfully');
            }
            setIsModalVisible(false);
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
                    <Button type="link" onClick={() => showModal(user)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => deleteUser(user.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                <Col>
                    <Typography.Title level={2}>User Management</Typography.Title>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => showModal()}>
                        Add User
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                style={{ background: 'white', borderRadius: '8px' }}
            />
            <Modal
                title={editingUser ? 'Edit User' : 'Add New User'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleAddOrUpdateUser}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the user name' }]}
                    >
                        <Input placeholder="Enter user name" />
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
