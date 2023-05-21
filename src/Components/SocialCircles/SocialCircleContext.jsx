import { createContext, useContext, useEffect, useState } from 'react';
import useAuthContext from 'components/AuthContext/AuthContext';
import generateNames from 'utils/generateNames';
import formDataBody from 'form-data-body';

const discordAuthUrl = process.env.DISCORD_AUTHURL;
const socialDataUrl = process.env.SOCIAL_DATA_URL;
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";
const initialFriends = generateNames(5);

export const SocialCircleContext = createContext();

export function SocialCircleProvider({ children })
{
  const authContext = useAuthContext();
  const [friends, setFriends] = useState(initialFriends);
  const [filteredFriends, setFilteredFriends] = useState(initialFriends);
  const [socialData, setSocialData] = useState([]);

  useEffect(_ => {
    requestSocialData();
  }, []);

  const requestAccountLink = async(provider) =>
  {
    if(!authContext.isLoggedIn)
      return false;
    
    // Make the request to get the appropriate OAuth URL
    let apiUrl;
    switch(provider) {
      case 'Discord':
        apiUrl = discordAuthUrl
        break;
      default:
        apiUrl = '';
        break;
    }

    const boundary = formDataBody.generateBoundary();
    const body = formDataBody({ accessToken: authContext.accessToken }, boundary);

    fetch(apiUrl, {
      method: 'POST',
      body: body,
      mode: 'cors',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
    })
    .then(response => handleAccountLinkResponse(provider, response))
    .catch(err => console.error(err));
  }

  const requestSocialData = async() =>
  {
    const boundary = formDataBody.generateBoundary();
    const body = formDataBody({ accessToken: authContext.accessToken }, boundary);

    fetch(socialDataUrl, {
      method: 'POST',
      body: body,
      mode: 'cors',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
    })
    .then(response => handleSocialDataResponse(response))
    .catch(err => console.error(err));
  }

  const handleAccountLinkResponse = async(provider, response) => {
    try {
      if(response.ok) {
        const apiUrl = await response.text();
        location.href = apiUrl;
      }
    } catch (err) {
      console.error(err);  
    }
  }

  const handleSocialDataResponse = async(response) => {
    try {
      const userData = await response.json();
      setSocialData(userData);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <SocialCircleContext.Provider
      value={{
        socialData,
        requestAccountLink,
        friends,
        setFriends,
        filteredFriends,
        setFilteredFriends
      }} >
      {children}
    </SocialCircleContext.Provider>
  );
};

const useSocialCircleContext = () => useContext(SocialCircleContext);
export default useSocialCircleContext;