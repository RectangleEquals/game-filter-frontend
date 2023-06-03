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
  const [socialCircles, setSocialCircles] = useState([]);
  const [circleName, setCircleName] = useState('');
  const [userData, setUserData] = useState(null);
  const [treeConfig, setTreeConfig] = useState(initialTreeConfig);

  useEffect(_ => {
    authContext.log('[SocialCircles] > useEffect(socialCircleContext.linkedAccounts)');
    if(socialCircleContext.linkedAccounts.length > 0) {
      authContext.log('[SocialCircles]: useEffect(socialCircleContext.linkedAccounts) (updating linked accounts)');
      // TODO: Update tree data to reflect changes
    }
    authContext.log('[SocialCircles] < useEffect(socialCircleContext.linkedAccounts)');
  }, [socialCircleContext && socialCircleContext.linkedAccounts]);
  
  useEffect(_ => {
    if(
      userContext.data &&
      userContext.data.socials &&
      userContext.data.socials.length > 0 &&
      socialCircleContext.linkedAccounts.length > 0
    ) {
      const provider = socialCircleContext.linkedAccounts[0].toLowerCase();
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
    const treeData = [
      {
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
      }
    ];

    for(const linkedAccount of socialCircleContext.linkedAccounts)
    {
      // TODO: Create top-level tree data based on which providers are available
      let accountData = [
        {
          title: <h4>Drag your connections below</h4>,
          children: []
        }
      ];
      const account = linkedAccount.toLowerCase();
      
      const indexOfAccount = userContext.data.socials.findIndex(acc => {
        return Object.keys(acc).some(key => key === account);
      });
      
      const socialData = userContext.data.socials[indexOfAccount][account];
      for(const relationship of socialData.relationships) {
        accountData.push({
          icon: <ImageAsset className={`asset-{${relationship.user.avatar}} img-social-account-logo`} style={{pointerEvents: 'none', userSelect: 'none'}}/>,
          title: relationship.user.name
        });
      }

      treeData.push({
        icon: <ImageAsset className={`asset-${account}-logo img-social-account-logo`} style={{pointerEvents: 'none', userSelect: 'none'}}/>,
        title: linkedAccount,
        isDraggable: false,
        children: accountData
      });
    }

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