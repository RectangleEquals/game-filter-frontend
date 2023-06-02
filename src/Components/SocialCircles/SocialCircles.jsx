import './SocialCircles.css';
import { useEffect, useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import { useAuthContext } from 'contexts/AuthContext';
import { useUserContext } from 'contexts/UserContext';
import { useSocialCircleContext } from 'contexts/SocialCircleContext';
import { TreeViewProvider } from 'contexts/TreeViewContext';
import ImageAsset from 'components/ImageAsset';
import DroppableTreeView from 'components/TreeView/DroppableTreeView';

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
  const userContext = useUserContext();
  const socialCircleContext = useSocialCircleContext();
  const [selectedAccount, setSelectedAccount] = useState('discord');
  const [socialCircles, setSocialCircles] = useState([]);
  const [circleName, setCircleName] = useState('');
  const [userData, setUserData] = useState(null);
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
      userContext.data &&
      userContext.data.socials &&
      userContext.data.socials.length > 0 &&
      selectedAccount.length > 0
    ) {
      const provider = selectedAccount.toLowerCase();
      const indexOfProvider = userContext.data.socials.findIndex(account => {
        return Object.keys(account).some(key => key === provider);
      });

      const socialData = userContext.data.socials[indexOfProvider][provider];      
      const data = socialData.relationships[0];

      // Remove id and icon from the user field
      const { id, avatar, ...userWithoutIdAndIcon } = data.user;

      // Remove id and icon from each element in guilds field
      const guildsWithoutIdAndIcon = data.guilds.map(({ id, icon, ...guild }) => guild);

      // Create the new JSON object
      const result = { user: userWithoutIdAndIcon, guilds: guildsWithoutIdAndIcon };

      setTreeConfig(getTreeConfigForSocialData(result));
      setUserData(result);
    }
  }, [userContext && userContext.data])

  // Handler function for selecting an account from the dropdown
  const handleSelectAccount = (account) => {
    authContext.log('[SocialCircles] > handleSelectAccount');
    setSelectedAccount(account || '');
    socialCircleContext.updateData(account || 0); 
  };

  // Handler function for refreshing the SocialCircle list
  const handleRefreshList = (e) => {
    e.preventDefault();

    userContext.requestData();
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

  const getTreeData = () =>
  {
    const discordData = [
      {
        id: '2',
        header: true,
        title: (
          <Container fluid className='d-flex flex-column m-0 p-0'>
            <h4>Drag your connections below</h4>
          </Container>
        ),
        children: []
      },
      {
        id: '3',
        icon: <span>🌴</span>,
        title: 'Rabenclam'
      },
      {
        id: '4',
        icon: <span>🌳</span>,
        title: 'Insomniaddict'
      }
    ];
    
    const treeData = [
      {
        id: '0',
        header: true,
        title: (
          <Container fluid className='d-flex flex-column m-0 p-0'>
            <h4>Choose a provider:</h4>
            <Button
              className="mt-3"
              variant={userContext.requestingData ? "secondary" : "dark"}
              disabled={userContext.requestingData}
              onClick={handleRefreshList}>
                Refresh List
            </Button>
          </Container>
        ),
        children: []
      },
      {
        id: '1',
        icon: <ImageAsset className='asset-discord-logo img-social-account-logo' style={{pointerEvents: 'none', userSelect: 'none'}}/>,
        title: 'Discord',
        children: discordData
      },
      {
        id: '5',
        icon: <ImageAsset className='asset-steam-logo img-social-account-logo' style={{pointerEvents: 'none', userSelect: 'none'}}/>,
        title: 'Steam',
        children: []
      },
      {
        id: '6',
        icon: <ImageAsset className='asset-microsoft-logo img-social-account-logo' style={{pointerEvents: 'none', userSelect: 'none'}}/>,
        title: 'Microsoft',
        children: []
      }
    ];

    return treeData;
  }

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
    <Container fluid ref={socialCircleContext.ref} className="social-circle-container" style={{overflowY: 'auto'}}>
      <div className="social-accounts-container">
        {/* Social account buttons */}
        {providers.map(account => {

          const accountLinked = socialCircleContext && socialCircleContext.linkedAccounts.includes(account);
          let accountImage = account;
          if(accountImage.startsWith("Epic"))
            accountImage = 'epic';

          return (
            <Button
              className="social-account-links"
              variant={`${accountLinked ? 'info' : 'primary'}`}
              key={account}
              onClick={_ => socialCircleContext && socialCircleContext.requestAccountLink(account)}
              disabled={accountLinked}
            >
              {/* Logo image */}
              <ImageAsset className={`asset-${accountImage.toLowerCase()}-logo img-social-account-logo`} />
              {/* Button text */}
              <div>{accountLinked ? `${account} linked` : `Link with ${account}`}</div>
              {accountLinked ?
                <div className="social-account-checkmark">✅</div> :
                <div className="social-account-checkmark">🔲</div>
              }
            </Button>
          )
        })}
      </div>
  
      {socialCircleContext && socialCircleContext.linkedAccounts.length > 0 && (
        <Container fluid>
          {/* Dropdown of linked social accounts */}
          <Form.Select
            className="mt-3"
            value={selectedAccount || ''}
            onChange={event => handleSelectAccount(event.target.value)}>
            {socialCircleContext && socialCircleContext.linkedAccounts.map(account => (
              <option key={account} value={account}>{account}</option>
            ))}
          </Form.Select>

          {/* SocialCircle component */}
          {/* userContext.data && !userContext.requestingData && <SocialCircle selectedAccount={selectedAccount} /> */}
          {userContext.data && !userContext.requestingData &&
            <TreeViewProvider treeData={getTreeData()}>
              <DroppableTreeView id="treeview" />
            </TreeViewProvider>
          }
          
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