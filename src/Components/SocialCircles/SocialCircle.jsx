import './SocialCircle.css';
import { useEffect, useState } from 'react';
import { Accordion, Button, Card, Form, ListGroup } from 'react-bootstrap';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import { useAuthContext } from 'contexts/AuthContext';
import { useUserContext } from 'contexts/UserContext';
import { useSocialCircleContext } from 'contexts/SocialCircleContext';

export default function SocialCircle({selectedAccount})
{
  const authContext = useAuthContext();
  const userContext = useUserContext();
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

  const getBodyComponent = () => {
    const body = [];

    const indexOfProvider = userContext.data.socials.findIndex(account => {
      return Object.keys(account).some(key => key === selectedAccount);
    });
    const socialData = userContext.data.socials[indexOfProvider][selectedAccount];

    function addBody(index) {
      const innerBody = [];
      for (const guild of socialData.relationships[index].guilds) {
        innerBody.push(
          <ListGroup.Item key={guild.name} className='mb-1 mt-1'>
            <MdSubdirectoryArrowRight/>
            <img style={{marginRight: '10px'}} src={guild.icon}/>
            {guild.name}
          </ListGroup.Item>
        );
      }
      return innerBody;
    }

    body.push(socialCircleContext.filteredFriends.map((friend, index) => (
      <Accordion.Item eventKey={index.toString()} key={index}>
        <Accordion.Header>
          <img style={{marginRight: '10px'}} src={socialData.relationships[index].user.avatar}/>
          {friend}
        </Accordion.Header>
        <Accordion.Collapse eventKey={index.toString()}>
          <Accordion.Body>
            {addBody(index)}
          </Accordion.Body>
        </Accordion.Collapse>
      </Accordion.Item>
    )));

    return body.length > 0 ? body : null;
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
        <Accordion className="mt-3" defaultActiveKey={null}>
          { /* Render the sublist of users for the selected guild */
            getBodyComponent()
          }
        </Accordion>
      </div>
    </>
  );
}
