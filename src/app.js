import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth/admin_login';
import UserManagement from './components/user_management';
import RoleManagement from './components/role_management';
import PermissionManagement from './components/permission_management';
import Navbar from './components/navbar';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const savedAuth = JSON.parse(localStorage.getItem('auth')) || {};
        setIsAuthenticated(savedAuth.isLoggedIn || false);
    }, []);

    return (
        <Router>
            {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
                />
                <Route
                    path="/login"
                    element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                {isAuthenticated && (
                    <>
                        <Route path="/dashboard" element={<UserManagement />} />
                        <Route path="/roles" element={<RoleManagement />} />
                        <Route path="/permissions" element={<PermissionManagement />} />
                    </>
                )}
                <Route
                    path="*"
                    element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
