import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Form,
    Select,
    Checkbox,
    Typography,
    message,
    Row,
    Col,
} from 'antd';
import { LockOutlined } from '@ant-design/icons';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_API_BACKEND_URL;
const { Option } = Select;
const PermissionManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/roles`, {headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
                }),});
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            message.error('Error fetching roles');
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/permissions`, {headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
                }),});
            setPermissions(response.data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
            message.error('Error fetching permissions');
        }
    };

    const handleSavePermissions = async () => {
        if (!selectedRole) return;

        const updatedRole = roles.find((role) => role.id === selectedRole);
        if (!updatedRole) return;

        try {
            await axios.put(`${BACKEND_URL}/roles/${selectedRole}`, {
                ...updatedRole,
                permissions: selectedPermissions,
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                    })
            },);
            // Emit an event to notify RoleManagement.js
            window.dispatchEvent(new Event('rolesUpdated'));
            message.success('Permissions updated successfully');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving permissions:', error);
            message.error('Error saving permissions');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                <Col>
                    <Typography.Title level={2}>
                        Permission Management
                        <LockOutlined style={{ marginLeft: '8px', color: '#1890ff' }} />
                    </Typography.Title>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        Manage Permissions
                    </Button>
                </Col>
            </Row>

            <Modal
                title="Assign Permissions to Role"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSavePermissions}
                okText="Save Permissions"
                cancelText="Cancel"
            >
                <Form layout="vertical" style={{ padding: '10px' }}>
                    <Form.Item label="Role" required>
                        <Select
                            placeholder="Select a role"
                            value={selectedRole}
                            onChange={(value) => setSelectedRole(value)}
                            style={{ width: '100%' }}
                        >
                            {roles.map((role) => (
                                <Option key={role.id} value={role.id}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Permissions" required>
                        <Checkbox.Group
                            options={permissions.map((perm) => ({
                                label: perm.name,
                                value: perm.id,
                            }))}
                            value={selectedPermissions}
                            onChange={(checkedValues) => setSelectedPermissions(checkedValues)}
                            style={{ display: 'block' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PermissionManagement;
