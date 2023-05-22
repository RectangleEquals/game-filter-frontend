import './SocialCircle.css';
import { useEffect, useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import useSocialCircleContext from './SocialCircleContext';

export default function SocialCircle()
{
  const socialCircleContext = useSocialCircleContext();
  const [searchText, setSearchText] = useState('');

  useEffect(_ => {
    console.log('[SocialCircle] > useEffect(searchText, socialCircleContext.friends)');
    socialCircleContext.setFilteredFriends(
      searchText && searchText.length > 0
        ? socialCircleContext.friends.filter(friend =>
            friend.toLowerCase().includes(searchText.toLowerCase())
          )
        : socialCircleContext.friends
    );
  }, [searchText, socialCircleContext.friends]);

  const handleRemoveFriend = (friend) => {
    console.log('[SocialCircle] > handleRemoveFriend');
    socialCircleContext.setFriends(prevFriends =>
      prevFriends.filter(f => f !== friend)
    );
  };

  const handleSearch = (event) => {
    console.log('[SocialCircle] > handleSearch');
    const { value } = event.target;
    setSearchText(value);
  };

  const clearSearch = () => {
    console.log('[SocialCircle] > clearSearch');
    setSearchText('');
  };

  return (
    <>
      <div className="search-container">
        <Form.Control
          className="mt-3"
          type="text"
          placeholder="Search friends..."
          value={searchText}
          onChange={handleSearch}
        />
        {searchText && (
          <span className="clear-search" onClick={clearSearch}>
            &#10006;
          </span>
        )}
      </div>
      <div className="friend-list-container">
        <ListGroup className="mt-3">
          {socialCircleContext.filteredFriends.map(friend => (
            <ListGroup.Item key={friend}>
              {friend}
              <span
                className="remove-friend"
                onClick={() => handleRemoveFriend(friend)} >
                &#10006;
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
}
