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
    Card,
    Divider,
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
            const response = await axios.get(`${BACKEND_URL}/roles`, {
                headers: new Headers({
                    'ngrok-skip-browser-warning': '69420',
                }),
            });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            message.error('Error fetching roles');
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/permissions`, {
                headers: new Headers({
                    'ngrok-skip-browser-warning': '69420',
                }),
            });
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
            await axios.put(
                `${BACKEND_URL}/roles/${selectedRole}`,
                {
                    ...updatedRole,
                    permissions: selectedPermissions,
                },
                {
                    headers: new Headers({
                        'ngrok-skip-browser-warning': '69420',
                    }),
                }
            );
            window.dispatchEvent(new Event('rolesUpdated'));
            message.success('Permissions updated successfully');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving permissions:', error);
            message.error('Error saving permissions');
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f9f9f9' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                <Col>
                    <Typography.Title level={2} style={{ fontWeight: 'bold' }}>
                        Permission Management
                        <LockOutlined style={{ marginLeft: '8px', color: '#1890ff' }} />
                    </Typography.Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<LockOutlined />}
                        onClick={() => setIsModalVisible(true)}
                        style={{
                            backgroundColor: '#1890ff',
                            borderColor: '#1890ff',
                            fontSize: '16px',
                            padding: '0 20px',
                        }}
                    >
                        Manage Permissions
                    </Button>
                </Col>
            </Row>

            <Card
                bordered={false}
                style={{
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    padding: '20px',
                }}
            >
                <Typography.Paragraph style={{ color: '#555' }}>
                    In this section, you can manage the permissions for various roles within the application.
                    Select a role and assign permissions accordingly.
                </Typography.Paragraph>
                <Divider />
                <Modal
                    title="Assign Permissions to Role"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={handleSavePermissions}
                    okText="Save Permissions"
                    cancelText="Cancel"
                    style={{
                        top: '20vh',
                    }}
                    styles={{
                        padding: '20px',
                    }}
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
            </Card>
        </div>
    );
};

export default PermissionManagement;
