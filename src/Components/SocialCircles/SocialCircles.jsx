import './SocialCircles.css';
import { useEffect, useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import ImageAsset from 'components/ImageAsset';
import SocialCircle from './SocialCircle';
import DynamicTreeView from 'components/DynamicTreeView/DynamicTreeView';
import useAuthContext from 'components/AuthContext/AuthContext';
import useSocialCircleContext from './SocialCircleContext';

const providers = ["Discord", "Steam", "Microsoft", "Epic Games"];
const initialTreeConfig = {
  visibleSearchThreshold: 8,
  maxHeight: 350,
  paths: [
    { key: '*', icon: 'default' },
  ]
}

export default function SocialCircles()
{
  const authContext = useAuthContext();
  const socialCircleContext = useSocialCircleContext();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [socialCircles, setSocialCircles] = useState([]);
  const [circleName, setCircleName] = useState('');
  const [socialData, setSocialData] = useState(null);
  const [treeConfig, setTreeConfig] = useState(initialTreeConfig);

  useEffect(_ => {
    authContext.log('[SocialCircles] > useEffect(socialCircleContext.linkedAccounts)');
    if(socialCircleContext.linkedAccounts.length > 0) {
      authContext.log('[SocialCircles]: useEffect(socialCircleContext.linkedAccounts) (updating linked accounts)');
      // Update UI to reflect changes
      if(selectedAccount === '') {
        authContext.log('[SocialCircles]: useEffect(socialCircleContext.linkedAccounts) (updating UI)');
        setSelectedAccount(socialCircleContext.linkedAccounts[0]);
      }
    }
    authContext.log('[SocialCircles] < useEffect(socialCircleContext.linkedAccounts)');
  }, [socialCircleContext && socialCircleContext.linkedAccounts]);
  
  useEffect(_ => {
    if(
      socialCircleContext.socialData &&
      socialCircleContext.socialData.length > 0 &&
      socialCircleContext.socialData[0].data &&
      socialCircleContext.socialData[0].data.relationships
    ) {
      const data = socialCircleContext.socialData[0].data.relationships[0];

      // Remove id and icon from the user field
      const { id, avatar, ...userWithoutIdAndIcon } = data.user;

      // Remove id and icon from each element in guilds field
      const guildsWithoutIdAndIcon = data.guilds.map(({ id, icon, ...guild }) => guild);

      // Create the new JSON object
      const result = { user: userWithoutIdAndIcon, guilds: guildsWithoutIdAndIcon };

      setTreeConfig(getTreeConfigForSocialData(result));
      setSocialData(result);
    }
  }, [socialCircleContext && socialCircleContext.socialData])

  // Handler function for selecting an account from the dropdown
  const handleSelectAccount = (account) => {
    authContext.log('[SocialCircles] > handleSelectAccount');
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
    authContext.log('[SocialCircles] > handleSaveSocialCircle');
    const newSocialCircle = { name, friends: [...socialCircleContext.friends] };
    setSocialCircles(prevSocialCircles => [...prevSocialCircles, newSocialCircle]);
    setCircleName(''); // Clear the circleName after saving
  };

  // Handler function for selecting a saved social circle
  const handleSelectSocialCircle = (socialCircle) => {
    authContext.log('[SocialCircles] > handleSelectSocialCircle');
    setSelectedAccount(socialCircle.name || '');
    socialCircleContext.setFriends(socialCircle.friends);
  };

  // Handler function for removing a saved social circle
  const handleRemoveSocialCircle = (socialCircle) => {
    authContext.log('[SocialCircles] > handleRemoveSocialCircle');
    setSocialCircles(prevSocialCircles =>
      prevSocialCircles.filter(circle => circle !== socialCircle)
    );
  };

  const getTreeConfigForSocialData = (data) => {
    let config = initialTreeConfig;

    if(data && data.user && data.guilds) {
      config = {
        visibleSearchThreshold: 8,
        maxHeight: 350,
        paths: [
          { key: 'name', value: data.user.name, icon: data.user.avatar },
          ...data.guilds.map(guild => ({ key: 'name', value: guild.name, icon: guild.icon }))
        ]
      };
    }

    return config;
  }

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
          {/* <SocialCircle selectedAccount={selectedAccount} /> */}
          { socialData && <DynamicTreeView jsonData={socialData} config={treeConfig} /> }
  
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