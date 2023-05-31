import { createContext, useContext, useEffect, useRef, useState } from 'react';
import useAuthContext from 'components/AuthContext/AuthContext';
import generateNames from 'utils/generateNames';
import formDataBody from 'form-data-body';

const discordAuthUrl = process.env.DISCORD_AUTHURL;
const userDataUrl = process.env.SOCIAL_DATA_URL;
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";
const initialFriends = generateNames(5);

export const SocialCircleContext = createContext();

export function SocialCircleProvider({ children })
{
  const ref = useRef(null);
  const authContext = useAuthContext();
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [friends, setFriends] = useState(initialFriends);
  const [filteredFriends, setFilteredFriends] = useState(initialFriends);
  const [guilds, setGuilds] = useState([]);
  const [userData, setUserData] = useState({});
  const [requestingUserData, setRequestingUserData] = useState(false);

  useEffect(_ => {
    if(!userData || !userData.socials || userData.socials.length < 1)
      requestUserData();
  }, []);

  useEffect(_ => {
    updateUserData('discord');
  }, [userData])

  const requestAccountLink = async(provider) =>
  {
    authContext.log('[SocialCircleProvider] > requestAccountLink');
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
    .catch(err => authContext.logError(err));
  }

  const requestUserData = async() =>
  {
    if(requestingUserData) {
      authContext.log('[SocialCircleProvider]: requestUserData (Already in progress)');
      return;
    }
    setRequestingUserData(true);

    authContext.log('[SocialCircleProvider] > requestUserData');
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
    .then(response => handleUserDataResponse(response))
    .catch(err => authContext.logError(err));
  }

  const handleAccountLinkResponse = async(provider, response) => {
    authContext.log('[SocialCircleProvider] > handleAccountLinkResponse');
    try {
      if(response.ok) {
        const apiUrl = await response.text();
        location.href = apiUrl; // Initiates the OAuth flow
        addAccountLink(provider);
      }
    } catch (err) {
      authContext.logError(err);  
    }
  }

  const handleUserDataResponse = async(response) => {
    authContext.log('[SocialCircleProvider] > handleUserDataResponse');

    try {
      if (response.ok) {
        const data = await response.json();
        if (!isUserDataEqual(data)) {
          setUserData(data);
          authContext.log('[SocialCircleProvider]: handleUserDataResponse: User data updated');
          setRequestingUserData(false);
        } else {
          authContext.log('[SocialCircleProvider]: handleUserDataResponse: User data already up to date');
          updateUserData('discord');
          setRequestingUserData(false);
        }
      }
    } catch (err) {
      authContext.logError(err.message);
      setRequestingUserData(false);
    }

    // Simulate a long server request or latency
    // setTimeout(_ => {
    //   setRequestingUserData(false);
    // }, 3000);
  }

  const isUserDataEqual = (data) => {
    // Compare the new userData with the current userData
    return JSON.stringify(data) === JSON.stringify(userData);
  };

  const addAccountLink = (account) => {
    authContext.log(`[SocialCircleProvider] > addAccountLink (${account})`);
    setLinkedAccounts(prevLinkedAccounts => [...new Set([...prevLinkedAccounts, account])]);
  };

  const updateUserData = (provider) =>
  {
    authContext.log(`[SocialCircleProvider] > updateUserData (${provider})`);
  
    // If data is invalid, set default empty values
    if (!userData || !userData.socials || userData.socials.length === 0) {
      setGuilds([]);
      setFriends([]);
      setFilteredFriends([]);
      return;
    }
  
    if(!provider) {
      authContext.logWarning(`[SocialCircleProvider]: updateUserData - Invalid provider`);
      return;
    }

    // Find the index of the provider in userData.socials
    const lowercaseProvider = provider.toLowerCase();
    const indexOfProvider = userData.socials.findIndex(account => {
      return Object.keys(account).some(key => key === lowercaseProvider);
    });
    const socialData = userData.socials[indexOfProvider][provider];
  
    // Update guilds & friends
    let _guilds = [];
    for (const _guild of socialData.guilds || []) {
      _guilds.push(_guild.name);
    }
    _guilds.sort((a, b) => a.localeCompare(b));
    setGuilds(_guilds);

    const names = socialData.relationships.map(({ user }) => user.name);;
    setFriends(names);
    setFilteredFriends(names);
    updateLinkedAccounts();
  };

  const updateLinkedAccounts = () => {
    authContext.log('[SocialCircleProvider] > updateLinkedAccounts');

    // Update linked accounts
    for (const account of userData.socials) {
      for (const provider of Object.keys(account)) {
        switch (provider.toLowerCase()) {
          case 'epic':
            addAccountLink('Epic Games');
            break;
          case 'microsoft':
            addAccountLink('Microsoft');
            break;
          case 'steam':
            addAccountLink('Steam');
            break;
          case 'discord':
            addAccountLink('Discord');
            break;
        }
      }
    }
  }

  return (
    <SocialCircleContext.Provider
      value={{
        ref,
        addAccountLink,
        requestAccountLink,
        requestUserData,
        setFriends,
        setFilteredFriends,
        updateLinkedAccounts,
        friends,
        filteredFriends,
        guilds,
        linkedAccounts,
        userData
      }} >
      {children}
    </SocialCircleContext.Provider>
  );
};

const useSocialCircleContext = () => useContext(SocialCircleContext);
export default useSocialCircleContext;