import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        return {
            token,
            email: localStorage.getItem('userEmail') || '',
            role: localStorage.getItem('userRole') || '',
            name: localStorage.getItem('userName') || ''
        };
    });

    const login = useCallback((data) => {
        localStorage.setItem('authToken', data.authToken);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userName', data.name);
        setUser({ token: data.authToken, email: data.email, role: data.role, name: data.name });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        setUser(null);
    }, []);

    const isOwner = user?.role === 'owner';
    const isWorker = user?.role === 'worker';

    return (
        <AuthContext.Provider value={{ user, login, logout, isOwner, isWorker }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
