import './Settings.css';
import { Container, Button } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import DynamicTreeView from 'components/DynamicTreeView/DynamicTreeView';
import data from '../../../testdata/userData_01.json'

const treeConfig = {
  // Only show search field if there are at least this many elements shown
  visibleSearchThreshold: 10,
  paths: [
    { key: '*', icon: 'default' },
    { key: 'provider', value: 'discord', icon: 'discord-logo' },
    { key: 'provider', value: 'steam', icon: 'steam-logo' },
    { key: 'provider', value: 'microsoft', icon: 'microsoft-logo' },
    { key: 'provider', value: 'epic', icon: 'epic-logo' },
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
