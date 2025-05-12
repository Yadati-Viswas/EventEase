import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const login = (userData) => {
    //console.log(userData);
    setIsAuthenticated(true);
    setUser(userData);
  };
  useEffect(() => {
    const checkSession = async () => {
      try{
        const response = await axios.get('http://localhost:3000/users/check-session', {
          withCredentials: true,
        });
        if (response.status === 200 || response.status === 304) {
          setIsAuthenticated(true);
          setUser(response.data.data);
        }
        else {
          console.log('Unexpected response status:', response.status);
        }
      }
      catch (error) {
        console.error('User is not logged in:', error.message);
      }
    };
    checkSession();
}, []);
  const logout = (navigate) => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useAuthNavigate = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return { logout: () => logout(navigate) };
};