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
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [friends, setFriends] = useState(initialFriends);
  const [filteredFriends, setFilteredFriends] = useState(initialFriends);
  const [guilds, setGuilds] = useState([]);
  const [socialData, setSocialData] = useState([]);
  const [requestingSocialData, setRequestingSocialData] = useState(false);

  useEffect(_ => {
    if(!socialData || socialData.length < 1)
      requestSocialData();
  }, []);

  useEffect(_ => {
    updateSocials();
  }, [socialData])

  const requestAccountLink = async(provider) =>
  {
    console.log('[SocialCircleProvider] > requestAccountLink');
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
    if(requestingSocialData) {
      console.log('[SocialCircleProvider]: requestSocialData (Already in progress)');
      return;
    }
    setRequestingSocialData(true);

    console.log('[SocialCircleProvider] > requestSocialData');
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
    console.log('[SocialCircleProvider] > handleAccountLinkResponse');
    try {
      if(response.ok) {
        const apiUrl = await response.text();
        location.href = apiUrl; // Initiates the OAuth flow
        addAccountLink(provider);
      }
    } catch (err) {
      console.error(err);  
    }
  }

  const handleSocialDataResponse = async(response) => {
    console.log('[SocialCircleProvider] > handleSocialDataResponse');

    try {
      if (response.ok) {
        const userData = await response.json();
        if (!isSocialDataEqual(userData)) {
          setSocialData(userData);
          console.log('[SocialCircleProvider]: handleSocialDataResponse: Social data updated');
        } else {
          console.log('[SocialCircleProvider]: handleSocialDataResponse: Social data already up to date');
          updateSocials();
        }
      }
    } catch (err) {
      console.error(err.message);
    }

    // Simulate a long server request or latency
    setTimeout(_ => {
      setRequestingSocialData(false);
    }, 3000);
  }

  const isSocialDataEqual = (userData) => {
    // Compare the new userData with the current socialData
    return JSON.stringify(userData) === JSON.stringify(socialData);
  };

  const addAccountLink = (account) => {
    console.log(`[SocialCircleProvider] > addAccountLink (${account})`);
    setLinkedAccounts(prevLinkedAccounts => [...new Set([...prevLinkedAccounts, account])]);
  };

  const updateSocials = (provider) =>
  {
    console.log('[SocialCircleProvider] > updateSocials');
  
    // If data is invalid, set default empty values
    if (!socialData || socialData.length === 0) {
      setGuilds([]);
      setFriends([]);
      setFilteredFriends([]);
      return;
    }
  
    // Find the index of the provider in socialData
    let indexOfProvider = 0;
    if (provider) {
      const lowercaseProvider = provider.toLowerCase();
      indexOfProvider = socialData.findIndex(account => account.provider === lowercaseProvider);
    }
  
    // Update guilds & friends
    let _guilds = [];
    for (const _guild of socialData[indexOfProvider].data.guilds || []) {
      _guilds.push(_guild.name);
    }
    _guilds.sort((a, b) => a.localeCompare(b));
    setGuilds(_guilds);
    setFriends(_guilds);
    setFilteredFriends(_guilds);
    updateLinkedAccounts();
  };

  const updateLinkedAccounts = () => {
    console.log('[SocialCircleProvider] > updateLinkedAccounts');

    // Update linked accounts
    for (const account of socialData) {
      switch (account.provider) {
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

  return (
    <SocialCircleContext.Provider
      value={{
        requestAccountLink,
        requestSocialData,
        setFriends,
        setFilteredFriends,
        addAccountLink,
        updateSocials,
        updateLinkedAccounts,
        friends,
        filteredFriends,
        guilds,
        linkedAccounts,
        socialData
      }} >
      {children}
    </SocialCircleContext.Provider>
  );
};

const useSocialCircleContext = () => useContext(SocialCircleContext);
export default useSocialCircleContext;