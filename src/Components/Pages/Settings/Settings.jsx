import './Settings.css';
import { Container, Button } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import DynamicTreeView from 'components/DynamicTreeView/DynamicTreeView';
import data from '../../../testdata/userData_01.json'

const treeConfig = {
  // Only show search field if there are at least this many elements shown
  visibleSearchThreshold: 8,
  paths: [
    { key: '*', icon: 'default' },
    { value: 'discord', icon: 'discord-logo' },
    { value: 'steam', icon: 'steam-logo' },
    { value: 'microsoft', icon: 'microsoft-logo' },
    { value: 'epic', icon: 'epic-logo' },
    { key: 'data.guilds', icon: 'user-avatar' },
    { key: 'data.guilds.0.*', icon: 'steam-logo' },
    { key: '*', value: 'Zekeonia', icon: 'microsoft-logo' },
    { key: '*', value: 'VIP_REGIONS', icon: null },
  ]
}

export default function Settings()
{
  const authContext = useAuthContext();

  return (authContext.isLoggedIn && (
    <Container className="settings-overlay">
        <Container className="settings-header" style={{fontFamily: "'Bruno Ace SC', cursive"}}>
          <h2>Settings</h2>
        </Container>

        <Container className="social-container">
          <div className="social-circles">
            <DynamicTreeView jsonData={data} maxHeight={600} config={treeConfig}/>
          </div>
        </Container>

        <Container className="action-buttons">
          <Button variant="secondary" className="action-button">
            Cancel
          </Button>
          <Button variant="success" className="action-button">
            Save Changes
          </Button>
        </Container>
      </Container>
  ));
}
