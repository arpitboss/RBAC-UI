import React, { useState, useEffect } from 'react';
import { AiOutlineEdit,AiOutlineDelete } from "react-icons/ai";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    message,
    Typography,
    Popconfirm,
    Row,
    Col,
    Card,
    Tag
} from 'antd';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_API_BACKEND_URL;
const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    useEffect(() => {
        const fetchRolesAndPermissions = async () => {
            try {
                const [rolesResponse, permissionsResponse] = await Promise.all([
                    axios.get(`${BACKEND_URL}/roles`, {headers: new Headers({
                        "ngrok-skip-browser-warning": "69420",
                        }),}
                    ),
                    axios.get(`${BACKEND_URL}/permissions`, {headers: new Headers({
                        "ngrok-skip-browser-warning": "69420",
                        }),}),
                ]);
                setRoles(rolesResponse.data);
                setPermissions(permissionsResponse.data);
            } catch (error) {
                console.error('Error fetching roles or permissions:', error);
                message.error('Error fetching roles or permissions');
            }
        };

        fetchRolesAndPermissions();

        const handleRolesUpdated = () => fetchRolesAndPermissions();
        window.addEventListener('rolesUpdated', handleRolesUpdated);

        return () => {
            window.removeEventListener('rolesUpdated', handleRolesUpdated);
        };
    }, []);

    const getPermissionNames = (permissionIds) =>
        permissionIds
            .map((permId) => {
                const permission = permissions.find((perm) => perm.id === permId);
                const permissionName = permission?.name || null;
    
                let color = 'blue';
                if (permissionName === 'Read') {
                    color = 'green';
                } else if (permissionName === 'Write') {
                    color = 'blue';
                } else if (permissionName === 'Delete') {
                    color = 'red';
                }
    
                return (
                    <Tag key={permId} color={color}>
                        {permissionName}
                    </Tag>
                );
            });
    

    const showModal = (role = null) => {
        setEditingRole(role);
        setIsModalVisible(true);
        if (role) {
            form.setFieldsValue(role);
        } else {
            form.resetFields();
        }
    };

    const handleAddOrUpdateRole = async () => {
        try {
            const values = await form.validateFields();
            if (editingRole) {
                const response = await axios.put(`${BACKEND_URL}/roles/${editingRole.id}`, values, {headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                    }),});
                setRoles((prevRoles) =>
                    prevRoles.map((role) => (role.id === editingRole.id ? response.data : role))
                );
                message.success('Role updated successfully');
            } else {
                const response = await axios.post(`${BACKEND_URL}/roles`, values, {headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                    }),});
                setRoles((prevRoles) => [...prevRoles, response.data]);
                message.success('Role added successfully');
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Error saving role:', error);
            message.error('Error saving role');
        }
    };

    const handleDeleteRole = async (id) => {
        try {
            await axios.delete(`${BACKEND_URL}/roles/${id}`, {headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
                }),});
            setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
            message.success('Role deleted successfully');

            const event = new CustomEvent('rolesUpdated', { detail: { roleId: id } });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Error deleting role:', error);
            message.error('Error deleting role');
        }
    };

    const columns = [
        {
            title: 'Role',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions) =>
                permissions && permissions.length > 0
                    ? getPermissionNames(permissions)
                    : <span style={{ color: '#808080' }}>No Permissions</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, role) => (
                <Space>
                    <Button type="link" onClick={() => showModal(role)}>
                    <AiOutlineEdit  />
                    Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this role?"
                        onConfirm={() => handleDeleteRole(role.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                        <AiOutlineDelete />
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
                    <Typography.Title level={2}>Role Management</Typography.Title>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => showModal()}>
                        Add Role
                    </Button>
                </Col>
            </Row>

            <Card style={{ marginTop: '20px' }}>
                <Table
                    columns={columns}
                    dataSource={roles}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    style={{ marginBottom: '20px' }}
                />
            </Card>

            <Modal
                title={editingRole ? 'Edit Role' : 'Add New Role'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleAddOrUpdateRole}
                okText={editingRole ? 'Update Role' : 'Add Role'}
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical" style={{ padding: '10px' }}>
                    <Form.Item
                        name="name"
                        label="Role Name"
                        rules={[{ required: true, message: 'Please enter the role name' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoleManagement;
