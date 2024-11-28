import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
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
    Card,
    Tag
} from 'antd';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_API_BACKEND_URL;

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
                    axios.get(`${BACKEND_URL}/users`, {
                        headers: new Headers({
                            "ngrok-skip-browser-warning": "69420",
                        }),
                    }),
                    axios.get(`${BACKEND_URL}/roles`, {
                        headers: new Headers({
                            "ngrok-skip-browser-warning": "69420",
                        }),
                    }),
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
                const response = await axios.put(
                    `${BACKEND_URL}/users/${editingUser.id}`,
                    values,
                    {
                        headers: new Headers({
                            "ngrok-skip-browser-warning": "69420",
                        }),
                    }
                );
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === editingUser.id ? response.data : user
                    )
                );
                message.success('User updated successfully');
            } else {
                const { data: newUser } = await axios.post(
                    `${BACKEND_URL}/users`,
                    values,
                    {
                        headers: new Headers({
                            "ngrok-skip-browser-warning": "69420",
                        }),
                    }
                );
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
            await axios.delete(`${BACKEND_URL}/users/${id}`, {
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            });
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
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'volcano'}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, user) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => showModal(user)}
                        icon={<AiOutlineEdit />}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => deleteUser(user.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<AiOutlineDelete />}
                        >
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
                    <Button
                        type="primary"
                        onClick={() => showModal()}
                        style={{ marginBottom: 16 }}
                    >
                        Add User
                    </Button>
                </Col>
            </Row>

            <Card style={{ background: '#f9f9f9', borderRadius: '8px', padding: '20px' }}>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    bordered
                    style={{ background: 'white' }}
                />
            </Card>

            <Modal
                title={editingUser ? 'Edit User' : 'Add New User'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleAddOrUpdateUser}
                destroyOnClose
                width={600}
                styles={{ padding: '24px' }}
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
