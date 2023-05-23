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
  const [selectedAccount, setSelectedAccount] = useState('');
  const [socialCircles, setSocialCircles] = useState([]);
  const [circleName, setCircleName] = useState('');

  useEffect(_ => {
    console.log('[SocialCircles] > useEffect(socialCircleContext.linkedAccounts)');
    if(socialCircleContext.linkedAccounts.length > 0) {
      console.log('[SocialCircles]: useEffect(socialCircleContext.linkedAccounts) (updating linked accounts)');
      // Update UI to reflect changes
      if(selectedAccount === '') {
        console.log('[SocialCircles]: useEffect(socialCircleContext.linkedAccounts) (updating UI)');
        setSelectedAccount(socialCircleContext.linkedAccounts[0]);
      }
    }
    console.log('[SocialCircles] < useEffect(socialCircleContext.linkedAccounts)');
  }, [socialCircleContext && socialCircleContext.linkedAccounts]);
  
  // Handler function for selecting an account from the dropdown
  const handleSelectAccount = (account) => {
    console.log('[SocialCircles] > handleSelectAccount');
    setSelectedAccount(account || '');
    socialCircleContext.updateSocials(account || 0); 
  };

  // Handler function for resetting the SocialCircle list
  const handleResetList = (e) => {
    e.preventDefault();
    socialCircleContext.requestSocialData();
  }

  // Handler function for saving a social circle
  const handleSaveSocialCircle = (name) => {
    console.log('[SocialCircles] > handleSaveSocialCircle');
    const newSocialCircle = { name, friends: [...socialCircleContext.friends] };
    setSocialCircles(prevSocialCircles => [...prevSocialCircles, newSocialCircle]);
    setCircleName(''); // Clear the circleName after saving
  };

  // Handler function for selecting a saved social circle
  const handleSelectSocialCircle = (socialCircle) => {
    console.log('[SocialCircles] > handleSelectSocialCircle');
    setSelectedAccount(socialCircle.name || '');
    socialCircleContext.setFriends(socialCircle.friends);
  };

  const handleRemoveSocialCircle = (socialCircle) => {
    console.log('[SocialCircles] > handleRemoveSocialCircle');
    setSocialCircles(prevSocialCircles =>
      prevSocialCircles.filter(circle => circle !== socialCircle)
    );
  };  

  return (
    <Container className="social-circle-container">
      <div className="social-accounts-container d-flex flex-wrap justify-content-center align-items-center">
        {/* Social account buttons */}
        {providers.map(account => {

          const accountIncluded = socialCircleContext && socialCircleContext.linkedAccounts.includes(account);
          let accountImage = account;
          if(accountImage.startsWith("Epic"))
            accountImage = 'epic';

          return (
            <Button
              className="social-account-links d-flex flex-wrap justify-content-center align-items-center"
              variant={`${accountIncluded ? 'info' : 'primary'}`}
              key={account}
              onClick={_ => socialCircleContext && socialCircleContext.requestAccountLink(account)}
              disabled={accountIncluded}
            >
              {/* Logo image */}
              <ImageAsset className={`asset-${accountImage.toLowerCase()}-logo img-social-account-logo`} />
              {/* Button text */}
              <div>{accountIncluded ? `${account} linked` : `Link with ${account}`}</div>
              {accountIncluded ?
                <div className="social-account-checkmark">✅</div> :
                <div className="social-account-checkmark">🔲</div>
              }
            </Button>
          )
        })}
      </div>
  
      {socialCircleContext && socialCircleContext.linkedAccounts.length > 0 && (
        <Container>
          {/* Dropdown of linked social accounts */}
          <Form.Select
            className="mt-3"
            value={selectedAccount || ''}
            onChange={event => handleSelectAccount(event.target.value)}>
            {socialCircleContext && socialCircleContext.linkedAccounts.map(account => (
              <option key={account} value={account}>{account}</option>
            ))}
          </Form.Select>

          <Button
            className="mt-3"
            variant="success"
            disabled={socialCircleContext && socialCircleContext.requestingSocialData}
            onClick={handleResetList}>
              Reset List
          </Button>

          {/* SocialCircle component */}
          <SocialCircle selectedAccount={selectedAccount} />
  
          {/* Save social circle */}
          <Form.Control
            className="mt-3"
            type="text"
            placeholder="Enter a name for this social circle preset"
            value={circleName}
            onChange={event => setCircleName(event.target.value)} />

          <Button
            className="mt-3"
            variant="light"
            disabled={circleName.length < 1}
            onClick={_ => handleSaveSocialCircle(circleName)}>
              Add to Social Circles
          </Button>

          {/* List of saved social circles */}
          {socialCircles.length > 0 && (
            <ListGroup className="mt-3">
              {socialCircles.map(circle => (
                <ListGroup.Item key={circle.name}>
                  <Button variant="link" onClick={_ => handleSelectSocialCircle(circle)}>
                    {circle.name}
                  </Button>
                  <span
                    className="remove-social-circle"
                    onClick={_ => handleRemoveSocialCircle(circle)}>
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