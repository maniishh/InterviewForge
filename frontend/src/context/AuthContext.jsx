import { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from './authContext.internal'; 

const initialState = {
  user:            null,
  token:           null,
  isLoading:       true,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_INIT':
      return { ...state, isLoading: false };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate          = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token     = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token) {
        dispatch({ type: 'AUTH_INIT' });
        return;
      }

      try {
        if (savedUser) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: JSON.parse(savedUser), token },
          });
        }
        const { data } = await api.get('/auth/me');
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: data.data.user, token },
        });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'AUTH_INIT' });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { user, token } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    navigate('/setup');
  }, [navigate]);

  const register = useCallback(async (name, email, password, confirmPassword) => {
    const { data } = await api.post('/auth/register', { name, email, password, confirmPassword });
    const { user, token } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    navigate('/setup');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};