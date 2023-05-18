import { createContext, useContext, useState, useEffect } from 'react';
import resolveUrl from "utils/resolveUrl";
import formDataBody from 'form-data-body';

const apiUrlBase = process.env.VITE_API_AUTHPATH || "http://localhost/api/auth";
const apiUrlUser = resolveUrl(apiUrlBase, 'user');
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";

export const AuthContext = createContext();

export function AuthProvider({ children })
{
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ displayName: 'User' });

  useEffect(_ => {
    updateUserStatus();
  }, [isLoggedIn]);

  useEffect(_ => {
    if(userInfo && userInfo.status !== 'active')
      setIsLoggedIn(false);
  }, [userInfo])

  // Checks if the current user is still valid
  //  (logged in, still has a valid session, valid access token, etc)
  const updateUserStatus = async() =>
  {
    console.log("Checking user status...");
    const token = sessionStorage.getItem(sessionName);
    if(!token) {
      if(isLoggedIn)
        setIsLoggedIn(false);
      return;
    }

    const boundary = formDataBody.generateBoundary();
    const header = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
    const body = formDataBody({ accessToken: token }, boundary);

    fetch(apiUrlUser, {
      method: 'POST',
      body: body,
      mode: 'cors',
      headers: header
    }).then(async response => {
      if(response.ok) {
        const userData = response.json().then(userData => {
          setUserInfo(userData);
        }).catch(err => {
          console.error(`[ERROR]: ${err}`);
        });
      } else {
        const status = response.status;
        const result = await response.text();
        console.log(`[User]: status(${status}), result(${result})`);
      }
    }).catch(err => {
      console.log(`[Error]: ${err}`);
    })
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);
export default useAuthContext;