import './Settings.css';
import { Container, Button } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import DynamicTreeView from 'components/DynamicTreeView/DynamicTreeView';
import data from '../../../testdata/userData_01.json'


const treeConfig = {
  // Only show search field if there are at least this many elements shown
  visibleSearchThreshold: 8,
  maxHeight: 350,
  paths: [
    { key: '*', icon: 'website-logo' },
    { key: 'data.discordId', value: '163849518868201473', icon: 'steam-logo' },
    { key: 'data.discordId', icon: 'discord-logo' },
    { key: 'data.*', icon: 'epic-logo' },
    { value: 'Zekeonia', icon: 'microsoft-logo' },
  ]
}

const config3 = {
  visibleSearchThreshold: 8,
  maxHeight: 350,
  paths: [
    { key: '*', icon: 'website-logo' },
    { key: 'data.guilds', icon: 'user-avatar' },
    { key: 'data.guilds.*', icon: 'epic-logo' },
    { key: 'data.discordId', value: '163849518868201473', icon: 'steam-logo' },
    { key: 'data.discordId', icon: 'discord-logo' },
    { value: 'Zekeonia', icon: 'microsoft-logo' },
  ]
}

const config1 = {
  visibleSearchThreshold: 8,
  maxHeight: 350,
  paths: [
    { key: '*', icon: 'website-logo' },
    { key: 'data.guilds', icon: 'user-avatar' },
    { key: 'data.guilds.*', icon: 'epic-logo' },
    { value: 'Zekeonia', icon: 'microsoft-logo' },
  ]
}

const config2 = {
  visibleSearchThreshold: 8,
  maxHeight: 350,
  paths: [
    { key: '*', icon: 'website-logo' },
    { key: 'data.guilds.*', icon: 'epic-logo' },
    { key: 'data.guilds', icon: 'user-avatar' },
    { value: 'Zekeonia', icon: 'microsoft-logo' },
  ]
}

const currentConfig = config2;

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
            <DynamicTreeView jsonData={data} config={currentConfig}/>
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
