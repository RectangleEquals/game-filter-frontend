import { createContext, useContext, useEffect, useRef, useState } from 'react';
import resolveUrl from "utils/resolveUrl";
import formDataBody from 'form-data-body';

const isMaintenanceMode = process.env.NODE_ENV !== "production";
const apiUrlBase = process.env.VITE_API_AUTHPATH || "http://localhost/api/auth";
const apiUrlUser = resolveUrl(apiUrlBase, 'user');
const apiUrlLogout = resolveUrl(apiUrlBase, 'logout');
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";

export const AuthContext = createContext();

export function AuthProvider({ children })
{
  const didMountRef = useRef(false);
  const [maintenanceMode, setMaintenanceMode] = useState(isMaintenanceMode);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem(sessionName));
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);
  //const [userInfo, setUserInfo] = useState({ displayName: 'User' });

  useEffect(() => {
    updateToken();

    if (!didMountRef.current) {
      checkSession();
      didMountRef.current = true;
    }
  }, []);

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

  // useEffect(_ => {
  //   updateUserStatus();
  // }, [isLoggedIn]);

  // useEffect(_ => {
  //   if(userInfo && userInfo.status !== 'active')
  //     setIsLoggedIn(false);
  // }, [userInfo])

  // // Checks if the current user is still valid
  // //  (logged in, still has a valid session, valid access token, etc)
  // const updateUserStatus = async() =>
  // {
  //   console.log("Checking user status...");
  //   const token = sessionStorage.getItem(sessionName);
  //   if(!token) {
  //     if(isLoggedIn)
  //       setIsLoggedIn(false);
  //     return;
  //   }

  //   const boundary = formDataBody.generateBoundary();
  //   const header = {
  //     'Content-Type': `multipart/form-data; boundary=${boundary}`
  //   }
  //   const body = formDataBody({ accessToken: token }, boundary);

  //   fetch(apiUrlUser, {
  //     method: 'POST',
  //     body: body,
  //     mode: 'cors',
  //     headers: header
  //   }).then(async response => {
  //     if(response.ok) {
  //       response.json().then(userData => {
  //         setUserInfo(userData);
  //       }).catch(err => {
  //         console.error(`[ERROR]: ${err}`);
  //       });
  //     } else {
  //       const status = response.status;
  //       const result = await response.text();
  //       console.log(`[User]: status(${status}), result(${result})`);
  //     }
  //   }).catch(err => {
  //     console.log(`[Error]: ${err}`);
  //   })
  // }

  return (
    <AuthContext.Provider
      value={{
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