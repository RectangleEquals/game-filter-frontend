import { createContext, useContext, useState } from 'react';
import useAuthContext from 'components/AuthContext/AuthContext';
import generateNames from '../../utility/generateNames';
import formDataBody from 'form-data-body';

const discordAuthUrl = process.env.DISCORD_AUTHURL;
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";
const socialLinksName = process.env.SESSION_SOCIAL_LINK_NAME || "__gflink";
const initialFriends = generateNames(5);

export const SocialCircleContext = createContext();

export function SocialCircleProvider({ children })
{
  const authContext = useAuthContext();
  const [friends, setFriends] = useState(initialFriends);
  const [filteredFriends, setFilteredFriends] = useState(initialFriends);

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
    const body = formDataBody({
      accessToken: sessionStorage.getItem(sessionName)
    }, boundary);

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

  // TODO: Have this function fetch the user's social account friends
  const requestFriends = async(provider) =>
  {
    switch(provider) {
      case 'Discord':
        break;
      case 'Steam':
        break;
      case 'Microsoft':
        break;
      case 'Epic':
        break;
      default:
        setFriends([]);
    }
    return friends;
  }

  const handleAccountLinkResponse = async(provider, response) => {
    try {
      // Set the provider in session storage for AuthContext
      //  to see once we are redirected back to our website
      sessionStorage.setItem(socialLinksName, provider);

      if(response.ok) {
        const apiUrl = await response.text();
        location.href = apiUrl;
      }
    } catch (err) {
      err => console.error(err);  
    }
  }

  return (
    <SocialCircleContext.Provider
      value={{
        requestAccountLink,
        requestFriends,
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