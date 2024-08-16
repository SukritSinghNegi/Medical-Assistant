// src/utils/cookies.ts
import Cookies from 'js-cookie';

// Function to set a cookie
export const setSessionIdCookie = (sessionId: string): void => {
  Cookies.set('sessionid', sessionId, { expires: 7 }); // Expires in 7 days
};

// Function to get a cookie
export const getSessionIdCookie = (): string | undefined => {
  return 
};

// Function to remove a cookie
export const removeSessionIdCookie = (): void => {
  Cookies.remove('sessionid');
};
