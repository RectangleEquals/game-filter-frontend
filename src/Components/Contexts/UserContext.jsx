import { createContext, useContext, useState } from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import formDataBody from 'form-data-body';

const userDataUrl = process.env.USER_DATA_URL;

export const UserContext = createContext();

export function UserProvider({ children })
{
  const authContext = useAuthContext();
  const [data, setData] = useState({});
  const [requestingData, setRequestingData] = useState(false);

  const requestData = async() =>
  {
    if(requestingData) {
      authContext.log('[UserProvider]: requestData (Already in progress)');
      return;
    }
    setRequestingData(true);

    authContext.log('[UserProvider] > requestData');
    const boundary = formDataBody.generateBoundary();
    const token = authContext.updateToken();
    if(token === null) {
      authContext.logWarning("Failed to update token");
      return;
    }
    const body = formDataBody({ accessToken: authContext.accessToken }, boundary);

    fetch(userDataUrl, {
      method: 'POST',
      body: body,
      mode: 'cors',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
    })
    .then(response => handleDataResponse(response))
    .catch(err => authContext.logError(err));
  }

  const handleDataResponse = async(response) => {
    authContext.log('[UserProvider] > handleUserResponse');

    try {
      if (response.ok) {
        const userData = await response.json();
        if (!isDataEqual(userData)) {
          setData(userData);
          authContext.log('[UserProvider]: handleDataResponse: User data updated');
        } else {
          authContext.log('[UserProvider]: handleDataResponse: User data already up to date');
        }
      }
    } catch (err) {
      authContext.logError(err.message);
    }

    setRequestingData(false);
  }
  
  const isDataEqual = (userData) => {
    // Compare the new data with the current data
    return JSON.stringify(data) === JSON.stringify(userData);
  };

  return (
    <UserContext.Provider
      value={{
        requestData,
        requestingData,
        data
      }} >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
export default useUserContext;