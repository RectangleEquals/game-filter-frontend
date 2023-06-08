import './SocialCircles.css';
import { useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import { useAuthContext } from 'contexts/AuthContext';
import { useUserContext } from 'contexts/UserContext';
import { useSocialCircleContext } from 'contexts/SocialCircleContext';
import { TreeViewProvider } from 'contexts/TreeViewContext';
import ImageAsset from 'components/ImageAsset';
import DroppableTreeView from 'components/TreeView/DroppableTreeView';

const providers = ["Discord", "Steam", "Microsoft", "Epic Games"];
const targetTreeHeader = [{
  title: <h4>Drop your connections here</h4>,
  children: []
}];

export default function SocialCircles()
{
  const authContext = useAuthContext();
  const userContext = useUserContext();
  const socialCircleContext = useSocialCircleContext();
  const [socialCircles, setSocialCircles] = useState([]);
  const [circleName, setCircleName] = useState('');

  // Handler function for refreshing the SocialCircle list
  const handleRefreshLists = (e) => {
    e.preventDefault();
    userContext.requestData();
    // TODO: Also make sure that all nodes from the target tree have been removed
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

  const generateTreeData = () =>
  {
    const treeData = [
      {
        title: (
          <Container fluid className='d-flex flex-column m-0 p-0'>
            <h4>{socialCircleContext.linkedAccounts.length > 0 ? "Choose a provider:" : "Link a social account above"}</h4>
            <Button
              className="mt-3"
              variant={"dark"}
              disabled={userContext.requestingData}
              onClick={handleRefreshLists}>
                Refresh Lists
            </Button>
          </Container>
        ),
        children: []
      }
    ];

    for(const linkedAccount of socialCircleContext.linkedAccounts)
    {
      let accountData = [
        {
          title: <h4>Drag your connections from below</h4>,
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

  return (
    <Container fluid className="social-circle-container" style={{overflowY: 'auto'}}>
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
          { /* TODO: Allow for setting the max height of the tree view via tree data */
            userContext.data &&
            userContext.data.socials &&
            userContext.data.socials.length > 0 &&
            !userContext.requestingData &&
            <TreeViewProvider sourceData={generateTreeData()} targetData={targetTreeHeader}>
              {(sourceTree, targetTree, onClick) => {return (
                <>
                  <DroppableTreeView id="connections.0.source" tree={sourceTree} onClick={onClick} />
                  <DroppableTreeView id="connections.0.target" tree={targetTree} onClick={onClick}
                    style={{
                      height: '206px',
                      overflowY: 'auto',
                      margin: '12px 0px 0px 0px',
                      padding: '0px 0px 0px 0px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                    }}
                  />
                </>
              )}}
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