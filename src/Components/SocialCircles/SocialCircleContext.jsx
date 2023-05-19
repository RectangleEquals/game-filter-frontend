import { createContext, useContext, useState } from 'react';
import generateNames from '../../utility/generateNames';

export const SocialCircleContext = createContext();
const initialFriends = generateNames(5);

export function SocialCircleProvider({ children })
{
  const [friends, setFriends] = useState(initialFriends);
  const [filteredFriends, setFilteredFriends] = useState(initialFriends);

  // TODO: Have this function fetch the user's social account friends
  const requestFriends = async(provider) => {
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

  return (
    <SocialCircleContext.Provider
      value={{
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