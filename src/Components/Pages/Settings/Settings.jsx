import './Settings.css';
import { Container, Button } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import DynamicTreeView from 'components/DynamicTreeView/DynamicTreeView';
import data from '../../../testdata/userData_02.json'

const treeConfig = {
  // Only show search field if there are at least this many elements shown
  visibleSearchThreshold: 10,
  // Array of unique keys in the form of 'root.parent.id' to associate an icon with.
  //  For example, if the data contains the root elements 'id' and 'provider', and
  //  'provider' contains the elements 'discord', 'steam' and 'microsoft', then you
  //  should be able to associate the 'discord' element with an icon using the key
  //  'provider.discord', and the 'steam' element's key would be 'provider.steam'
  //  and so forth. Wildcards are also acceptable, so if your only path is '*',
  //  then every element in the tree will have the associated icon. Or if you use
  //  'provider.*' then all three 'discord', 'steam' and 'microsoft' elements
  //  would have the associated icon.
  paths: [
    { key: 'data.guilds', icon: 'discord-logo' }
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
