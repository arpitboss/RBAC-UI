import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_API_BACKEND_URL;
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes, permissionsRes] = await Promise.all([
                    axios.get(`${BACKEND_URL}/users`, {headers: new Headers({
                        "ngrok-skip-browser-warning": "69420",
                        })}),
                    axios.get(`${BACKEND_URL}/roles`, {headers: new Headers({
                        "ngrok-skip-browser-warning": "69420",
                        })}),
                    axios.get(`${BACKEND_URL}/permissions`, {headers: new Headers({
                        "ngrok-skip-browser-warning": "69420",
                        })}),
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
            const response = await axios.get(`${BACKEND_URL}/roles`, {headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
                })});
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
