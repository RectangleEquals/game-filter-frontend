import './Settings.css';
import { Container, Button } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import SocialCircles from 'components/SocialCircles/SocialCircles';
import data from '../../../testdata/userData_01.json'

export default function Settings()
{
  const authContext = useAuthContext();

  return (authContext.isLoggedIn && (
    <Container className="settings-overlay">
        <Container className="settings-header">
          <h2>Settings</h2>
        </Container>

        <Container fluid className="social-container">
          <div className="social-circles">
            <SocialCircles />
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
