import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

// DEV MODE: Skip authentication, provide a mock Admin user
const MOCK_USER = { user_id: 1, role: 'Developer', name: 'Dev User', email: 'dev@local' };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);
  const [role, setRole] = useState('Developer');

  // Allow role switching for demo purposes
  const switchRole = (newRole) => {
    setRole(newRole);
    setUser({ ...MOCK_USER, role: newRole });
  };

  const login = () => { };
  const logout = () => { };

  return (
    <AuthContext.Provider value={{ user: { ...user, role }, token: null, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
