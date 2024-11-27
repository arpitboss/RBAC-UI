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
                    axios.get(' https://850c-103-71-76-242.ngrok-free.app/users'),
                    axios.get(' https://850c-103-71-76-242.ngrok-free.app/roles'),
                    axios.get(' https://850c-103-71-76-242.ngrok-free.app/permissions'),
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
            const response = await axios.get(' https://850c-103-71-76-242.ngrok-free.app/roles');
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
