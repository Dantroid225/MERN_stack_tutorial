import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {

    const [token, setToken] = useState(false);
    const [stateTokenExpirationDate, setStateTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
  
  
    const login =useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60) //1000 * 60 * 60 one hour
      setStateTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem
      (
        'userData', 
        JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() })
      );
    }, []);
  
    const logout =useCallback(() => {
      setToken(null);
      setStateTokenExpirationDate(null);
      setUserId(null);
      localStorage.removeItem('userData');
    }, []);
  
    useEffect(() => {
      if (token && stateTokenExpirationDate) {
        const remainingTime = stateTokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, stateTokenExpirationDate]);
  
    //login on refresh using local storage
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (
        storedData && 
        storedData.token && 
        new Date(storedData.expiration) > new Date()
        ) 
      {
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
      }
    }, [login]);

    return { token, login, logout, userId };
  
};

