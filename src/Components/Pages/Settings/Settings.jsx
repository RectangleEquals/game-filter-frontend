import './Settings.css';
import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import SocialCircles from 'components/SocialCircles/SocialCircles';
import {SocialCircleProvider} from '../../SocialCircles/SocialCircleContext';

export default function Settings()
{
  const authContext = useAuthContext();
  const [linkedSocials, setLinkedSocials] = useState([]);
  const [discordLinked, setDiscordLinked] = useState(false);

  useEffect(_ => {
    if (discordLinked) {
      setLinkedSocials(['Discord']);
    }
  }, [discordLinked]);

  return (authContext.isLoggedIn && (
    <Container className="settings-overlay">
        <Container className="settings-header" style={{fontFamily: "'Bruno Ace SC', cursive"}}>
          <h2>Settings</h2>
        </Container>
        <Container className="social-container">
          <div className="social-circles">
            <SocialCircleProvider>
              <SocialCircles linkedSocials={linkedSocials} />
            </SocialCircleProvider>
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
