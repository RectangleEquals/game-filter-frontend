import { createContext, useContext, useEffect, useRef, useState } from 'react';
import resolveUrl from "utils/resolveUrl";
import formDataBody from 'form-data-body';

const debugModeKeySequence = 'humbug';
const isMaintenanceMode = process.env.NODE_ENV !== "production";
const apiUrlBase = process.env.VITE_API_AUTHPATH || "http://localhost/api/auth";
const apiUrlLogout = resolveUrl(apiUrlBase, 'logout');
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";

export const AuthContext = createContext();

export function AuthProvider({ message, children })
{
  const didMountRef = useRef(false);
  const [debugMode, setDebugMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(isMaintenanceMode);
  const [keySequence, setKeySequence] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem(sessionName));
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);

  useEffect(_ => {
    const handleKeyDown = (event) => {
      try {
        const keyPressed = event.key.toLowerCase();
        setKeySequence(prevSequence => prevSequence + keyPressed);        
      } catch { /* Do nothing */ }
    };
    window.addEventListener('keydown', handleKeyDown);

    // TODO: Fix the ability to receive and decode base64 `message`
    if(message)
      message = atob(message);
  
    updateToken();

    if (!didMountRef.current) {
      checkSession();
      didMountRef.current = true;
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (keySequence === debugModeKeySequence)
      setDebugMode(true);
  }, [keySequence]);

  const updateToken = () => {
    // Check for the existence of a previous session
    const token = sessionStorage.getItem(sessionName);
  
    // Update the session
    if (token !== accessToken) {
      setAccessToken(token);
    }

    return token;
  }

  const checkSession = () => {
    if (accessToken) {
      // User is logged in
      if(!isLoggedIn)
        handleLoginChange(true);

      console.log('User is logged in');
    } else {
      // User is not logged in
      if(isLoggedIn)
        handleLoginChange(false);

      console.log('User is not logged in');
    }
  }

  const sendLogoutRequest = () =>
  {
    const boundary = formDataBody.generateBoundary();
    const header = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
    const body = formDataBody({ accessToken: updateToken() }, boundary);
  
    fetch(apiUrlLogout, {
      method: 'POST',
      body: body,
      mode: 'cors',
      headers: header
    })
    .then(response => {
      if (response.status === 200) {
        // Update the isLoggedIn state
        setIsLoggedIn(false);
        sessionStorage.removeItem(sessionName);
        updateToken();
        console.log('User logged out');
      }
    })
    .catch(error => console.error(error));
  }   

  const handleLoginChange = (loginStatus) => {
    setIsLoggedIn(loginStatus);
    if(loginStatus != wasLoggedIn) {
      console.log('handleLoginChange: ' + loginStatus);
    }

    // Tell the server to end the session, then refresh the page
    if(loginStatus === false)
      sendLogoutRequest();

    setWasLoggedIn(loginStatus);
  }

  const handleRegister = (token) => {
    if(token)
      console.log(`[TOKEN]: ${token}`);
  }

  return (
    <AuthContext.Provider
      value={{
        debugMode,
        message,
        maintenanceMode,
        setMaintenanceMode,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
        wasLoggedIn,
        setWasLoggedIn,
        updateToken,
        checkSession,
        sendLogoutRequest,
        handleLoginChange,
        handleRegister
      }} >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);
export default useAuthContext;