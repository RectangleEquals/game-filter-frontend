import './SocialCircle.css';
import { useEffect, useState } from 'react';
import { Accordion, Button, Card, Form, ListGroup } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import useSocialCircleContext from './SocialCircleContext';

export default function SocialCircle(selectedAccount)
{
  const authContext = useAuthContext();
  const socialCircleContext = useSocialCircleContext();
  const [searchText, setSearchText] = useState('');

  useEffect(_ => {
    authContext.log('[SocialCircle] > useEffect(searchText, socialCircleContext.friends)');
    socialCircleContext.setFilteredFriends(
      searchText && searchText.length > 0
        ? socialCircleContext.friends.filter(friend =>
            friend.toLowerCase().includes(searchText.toLowerCase())
          )
        : socialCircleContext.friends
    );
  }, [searchText, socialCircleContext.friends]);

  const handleRemoveFriend = (friend) => {
    authContext.log('[SocialCircle] > handleRemoveFriend');
    socialCircleContext.setFriends(prevFriends =>
      prevFriends.filter(f => f !== friend)
    );
  };

  const handleSearch = (event) => {
    authContext.log('[SocialCircle] > handleSearch');
    const { value } = event.target;
    setSearchText(value);
  };

  const clearSearch = () => {
    authContext.log('[SocialCircle] > clearSearch');
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
        <Accordion className="mt-3" defaultActiveKey="0">
          {socialCircleContext.guilds.map((guild, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>{guild}</Accordion.Header>
              <Accordion.Collapse eventKey={index.toString()}>
                <Accordion.Body>
                  {/* Render the sublist of users for the selected guild */}
                  {selectedAccount === 'Discord' ? (
                    /* Render the sublist of users for the selected guild */
                    socialCircleContext.filteredFriends.map(friend => (
                      <ListGroup.Item key={friend}>{friend}</ListGroup.Item>
                    ))
                  ) : (
                    /* Render the list of friends */
                    socialCircleContext.friends.map(friend => (
                      <ListGroup.Item key={friend}>{friend}</ListGroup.Item>
                    ))
                  )}
                </Accordion.Body>
              </Accordion.Collapse>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </>
  );
}
