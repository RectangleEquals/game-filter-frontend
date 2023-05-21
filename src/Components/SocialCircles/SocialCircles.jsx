import './SocialCircles.css';
import { useEffect, useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import ImageAsset from 'components/ImageAsset';
import SocialCircle from './SocialCircle';
import useSocialCircleContext from './SocialCircleContext';

const providers = ["Discord", "Steam", "Microsoft", "Epic Games"];

export default function SocialCircles()
{
  const socialCircleContext = useSocialCircleContext();
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [socialCircles, setSocialCircles] = useState([]);
  const [circleName, setCircleName] = useState('');

  useEffect(_ => {
    for(const account of socialCircleContext.socialData) {
      if(account.provider === 'epic') {
        handleLinkAccount('Epic Games');
        handleSelectAccount('Epic Games');
      }
      if(account.provider === 'microsoft') {
        handleLinkAccount('Microsoft');
        handleSelectAccount('Microsoft');
      }
      if(account.provider === 'steam') {
        handleLinkAccount('Steam');
        handleSelectAccount('Steam');
      }
      if(account.provider === 'discord') {
        handleLinkAccount('Discord');
        handleSelectAccount('Discord');
      }
    }
  }, [socialCircleContext.socialData]);

  // Handler function for linking social accounts
  const handleLinkAccount = (account) => {
    setLinkedAccounts(prevLinkedAccounts =>
      prevLinkedAccounts.includes(account)
        ? prevLinkedAccounts.filter(a => a !== account)
        : [...prevLinkedAccounts, account]
    );
  };

  // Handler function for selecting an account from the dropdown
  const handleSelectAccount = (account) => {
    setSelectedAccount(account || '');
    if(account === 'Discord') {
      let data = socialCircleContext.socialData[0].data;
      let guilds = [];
      for(const guild of data.guilds) {
        guilds.push(guild.name);
      }
      guilds.sort((a, b) => a.localeCompare(b));
      socialCircleContext.setFriends(guilds);
    }
  };

  // Handler function for saving a social circle
  const handleSaveSocialCircle = (name) => {
    const newSocialCircle = { name, friends: [...socialCircleContext.friends] };
    setSocialCircles(prevSocialCircles => [...prevSocialCircles, newSocialCircle]);
    setCircleName(''); // Clear the circleName after saving
  };

  // Handler function for selecting a saved social circle
  const handleSelectSocialCircle = (socialCircle) => {
    setSelectedAccount(socialCircle.name || '');
    socialCircleContext.setFriends(socialCircle.friends);
  };

  const handleRemoveSocialCircle = (socialCircle) => {
    setSocialCircles(prevSocialCircles =>
      prevSocialCircles.filter(circle => circle !== socialCircle)
    );
  };  

  return (
    <Container className="social-circle-container">
      <div className="social-accounts-container d-flex flex-wrap justify-content-center align-items-center">
        {/* Social account buttons */}
        {providers.map(account => {

          let accountImage = account;
          if(accountImage.startsWith("Epic"))
            accountImage = 'epic';

          return (
            <Button
              className="social-account-links d-flex flex-wrap justify-content-center align-items-center"
              variant={`${linkedAccounts.includes(account) ? 'info' : 'primary'}`}
              key={account}
              onClick={_ => socialCircleContext.requestAccountLink(account)}
              disabled={linkedAccounts.includes(account)}
            >
              {/* Logo image */}
              <ImageAsset className={`asset-${accountImage.toLowerCase()}-logo img-social-account-logo`} />
              {/* Button text */}
              <div>{linkedAccounts.includes(account) ? `${account} linked` : `Link with ${account}`}</div>
              {linkedAccounts.includes(account) ?
                <div className="social-account-checkmark">✅</div> :
                <div className="social-account-checkmark">🔲</div>
              }
            </Button>
          )
        })}
      </div>
  
      {linkedAccounts.length > 0 && (
        <Container>
          {/* Dropdown of linked social accounts */}
          <Form.Select
            className="mt-3"
            value={selectedAccount || ''}
            onChange={event => handleSelectAccount(event.target.value)}
          >
            {linkedAccounts.map(account => (
              <option key={account} value={account}>{account}</option>
            ))}
          </Form.Select>
  
          {/* SocialCircle component */}
          <SocialCircle />
  
          {/* Save social circle */}
          <Form.Control
            className="mt-3"
            type="text"
            placeholder="Enter a name for this social circle preset"
            value={circleName}
            onChange={event => setCircleName(event.target.value)}
          />
          <Button
            className="mt-3"
            variant="light"
            disabled={circleName.length < 1}
            onClick={() => handleSaveSocialCircle(circleName)}>
              Add to Social Circles
          </Button>
  
          {/* List of saved social circles */}
          {socialCircles.length > 0 && (
            <ListGroup className="mt-3">
              {socialCircles.map(circle => (
                <ListGroup.Item key={circle.name}>
                  <Button variant="link" onClick={() => handleSelectSocialCircle(circle)}>
                    {circle.name}
                  </Button>
                  <span
                    className="remove-social-circle"
                    onClick={() => handleRemoveSocialCircle(circle)} >
                    &#10006;
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Container>
      )}
    </Container>
  );
}