import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import { useUserContext } from 'contexts/UserContext';
import generateNames from 'utils/generateNames';
import formDataBody from 'form-data-body';

const discordAuthUrl = process.env.DISCORD_AUTHURL;
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";
const initialFriends = generateNames(5);

export const SocialCircleContext = createContext();

export function SocialCircleProvider({ children })
{
  const authContext = useAuthContext();
  const userContext = useUserContext();
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [friends, setFriends] = useState(initialFriends);
  const [filteredFriends, setFilteredFriends] = useState(initialFriends);
  const [guilds, setGuilds] = useState([]);

  useEffect(_ => {
    if(!userContext.data || !userContext.data.socials || userContext.data.socials.length < 1)
      userContext.requestData();
    else
      updateData('discord');
  }, [userContext.data]);

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

  const addAccountLink = (account) => {
    authContext.log(`[SocialCircleProvider] > addAccountLink (${account})`);
    setLinkedAccounts(prevLinkedAccounts => [...new Set([...prevLinkedAccounts, account])]);
  };

  const updateData = (provider) =>
  {
    authContext.log(`[SocialCircleProvider] > updateData (${provider})`);
  
    // If data is invalid, set default empty values
    if (!userContext.data || !userContext.data.socials || userContext.data.socials.length === 0) {
      setGuilds([]);
      setFriends([]);
      setFilteredFriends([]);
      return;
    }
  
    if(!provider) {
      authContext.logWarning(`[SocialCircleProvider]: updateData - Invalid provider`);
      return;
    }

    // Find the index of the provider in userContext.data.socials
    const lowercaseProvider = provider.toLowerCase();
    const indexOfProvider = userContext.data.socials.findIndex(account => {
      return Object.keys(account).some(key => key === lowercaseProvider);
    });
    const socialData = userContext.data.socials[indexOfProvider][provider];
  
    // Update guilds & friends
    let _guilds = [];
    for (const _guild of socialData.guilds || []) {
      _guilds.push(_guild.name);
    }
    _guilds.sort((a, b) => a.localeCompare(b));
    setGuilds(_guilds);

    const names = socialData.relationships.map(({ user }) => user.name);
    setFriends(names);
    setFilteredFriends(names);
    updateLinkedAccounts();
  };

  const updateLinkedAccounts = () => {
    authContext.log('[SocialCircleProvider] > updateLinkedAccounts');

    // Update linked accounts
    for (const account of userContext.data.socials) {
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
        addAccountLink,
        requestAccountLink,
        setFriends,
        setFilteredFriends,
        updateLinkedAccounts,
        friends,
        filteredFriends,
        guilds,
        linkedAccounts
      }} >
      {children}
    </SocialCircleContext.Provider>
  );
};

export const useSocialCircleContext = () => useContext(SocialCircleContext);
export default useSocialCircleContext;