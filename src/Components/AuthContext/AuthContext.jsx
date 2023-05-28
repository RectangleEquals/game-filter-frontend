import { createContext, useContext, useEffect, useRef, useState } from 'react';
import resolveUrl from "utils/resolveUrl";
import formDataBody from 'form-data-body';
import { isMobile as _isMobile, isTablet as _isTablet, isMobile, isTablet } from 'react-device-detect';

const debugModeKeySequence = 'humbug';
const isMaintenanceMode = process.env.NODE_ENV !== "production";
const apiAuthUrlBase = process.env.VITE_API_AUTHPATH || "http://localhost/api/auth";
const apiDebugUrl = process.env.DEBUG_URL || "http://localhost/api/debug";
const apiUrlLogout = resolveUrl(apiAuthUrlBase, 'logout');
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";

export const AuthContext = createContext();

export function AuthProvider({ message, children })
{
  const didMountRef = useRef(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(isMaintenanceMode);
  const [keySequence, setKeySequence] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem(sessionName));
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);
  const [debugLogs, setDebugLogs] = useState({});
  const [isMobile] = useState(_isMobile);
  const [isTablet] = useState(_isTablet);

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
      setIsDebugMode(true);
  }, [keySequence]);

  const updateToken = () => {
    // Check for the existence of a previous session
    const token = sessionStorage.getItem(sessionName);
  
    // Update the session
    if (token && token !== accessToken) {
      setAccessToken(token);
    }

    return token;
  }

  function pushLog(category, message)
  {
    const boundary = formDataBody.generateBoundary();
    const header = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
    const token = updateToken();
    if(token === null) {
      logWarning("Failed to update token", false);
      return;
    }
    const body = formDataBody({
      accessToken: token,
      method: "PUSH",
      category: category,
      message: message
    }, boundary);
  
    fetch(apiDebugUrl, {
      method: 'POST',
      body: body,
      mode: 'cors',
      headers: header
    })
    .then(async response => {
      if (response.status !== 200) {
        const result = await response.text();
        logWarning(`Failed to push log - Reason: ${result}`, false);
      }
    })
    .catch(error => logError(error, false));
  }

  function pullLogs(emails = [''], categories = ['ALL'])
  {
    const boundary = formDataBody.generateBoundary();
    const header = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
    const token = updateToken();
    if(token === null) {
      logWarning("Failed to update token", false);
      return;
    }
    const body = formDataBody({
      accessToken: token,
      method: "PULL",
      email: emails,
      category: categories
    }, boundary);
  
    return fetch(apiDebugUrl, {
      method: 'POST',
      body: body,
      mode: 'cors',
      headers: header
    })
    .then(async response => {
      if (response.status !== 200) {
        const result = await response.text();
        logWarning(`Failed to push log - Reason: ${result}`, false);
        return null;
      } else {
        const result = await response.json();
        return setDebugLogs(result);
      }
    })
    .catch(error => {
      logError(error, false);
      return null;
    });
  }

  function log(message, push = true) {
    if(push)
      pushLog("INFO", message);
    if(!(isMobile || isTablet))
      console.log(message);
  }
  
  function logWarning(message, push = true) {
    if(push)
      pushLog("WARNING", message);
    if(!(isMobile || isTablet))
      console.warn(message);
  }
  
  function logError(message, push = true) {
    if(push)
      pushLog("ERROR", message);
    if(!(isMobile || isTablet))
      console.error(message);
  }

  const checkSession = () => {
    if (accessToken) {
      // User is logged in
      if(!isLoggedIn)
        handleLoginChange(true);

      log('User is logged in', false);
    } else {
      // User is not logged in
      if(isLoggedIn)
        handleLoginChange(false);

      log('User is not logged in', false);
    }
  }

  const sendLogoutRequest = () =>
  {
    const boundary = formDataBody.generateBoundary();
    const header = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
    const token = updateToken();
    if(token === null) {
      logWarning("Failed to update token");
      return;
    }
    const body = formDataBody({ accessToken: token }, boundary);
  
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
        log('User logged out', false);
      }
    })
    .catch(error => logError(error));
  }   

  const handleLoginChange = (loginStatus) => {
    setIsLoggedIn(loginStatus);
    if(loginStatus != wasLoggedIn) {
      log('handleLoginChange: ' + loginStatus, false);
    }

    // Tell the server to end the session, then refresh the page
    if(loginStatus === false)
      sendLogoutRequest();

    setWasLoggedIn(loginStatus);
  }

  const handleRegister = (token) => {
    if(token)
      log(`[TOKEN]: ${token}`);
  }

  return (
    <AuthContext.Provider
      value={{
        isMobile,
        isTablet,
        debugModeKeySequence,
        isDebugMode,
        setDebugMode: setIsDebugMode,
        log,
        logWarning,
        logError,
        pullLogs,
        debugLogs,
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