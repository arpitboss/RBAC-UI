import React, { useState, useEffect } from 'react';
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
} from 'antd';
import axios from 'axios';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    useEffect(() => {
        // Fetch roles and permissions
        const fetchRolesAndPermissions = async () => {
            try {
                const [rolesResponse, permissionsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/roles'),
                    axios.get('http://localhost:5000/permissions'),
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

    // Get permission names from their IDs
    const getPermissionNames = (permissionIds) =>
        permissionIds
            .map((id) => permissions.find((perm) => perm.id === id)?.name || null)
            .filter(Boolean)
            .join(', ');

    // Handle Add or Edit Role Modal
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
                // Update role
                const response = await axios.put(`http://localhost:5000/roles/${editingRole.id}`, values);
                setRoles((prevRoles) =>
                    prevRoles.map((role) => (role.id === editingRole.id ? response.data : role))
                );
                message.success('Role updated successfully');
            } else {
                // Add new role
                const response = await axios.post('http://localhost:5000/roles', values);
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
            await axios.delete(`http://localhost:5000/roles/${id}`);
            setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
            message.success('Role deleted successfully');

            // Dispatch rolesUpdated event
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
                    : 'No Permissions',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, role) => (
                <Space>
                    <Button type="link" onClick={() => showModal(role)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this role?"
                        onConfirm={() => handleDeleteRole(role.id)}
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
        <div>
            <Typography.Title level={2}>Role Management</Typography.Title>
            <Button type="primary" onClick={() => showModal()}>
                Add Role
            </Button>
            <Table
                style={{ marginTop: '20px' }}
                columns={columns}
                dataSource={roles}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title={editingRole ? 'Edit Role' : 'Add New Role'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleAddOrUpdateRole}
            >
                <Form form={form} layout="vertical">
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
