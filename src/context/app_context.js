import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes, permissionsRes] = await Promise.all([
                    axios.get('http://localhost:5000/users'),
                    axios.get('http://localhost:5000/roles'),
                    axios.get('http://localhost:5000/permissions'),
                ]);
                setUsers(usersRes.data);
                setRoles(rolesRes.data);
                setPermissions(permissionsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const updateRoles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/roles');
            setRoles(response.data);
        } catch (error) {
            console.error('Error updating roles:', error);
        }
    };

    return (
        <AppContext.Provider value={{ users, setUsers, roles, updateRoles, permissions }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);