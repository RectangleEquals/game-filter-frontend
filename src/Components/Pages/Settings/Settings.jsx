import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import ImageAsset from 'components/ImageAsset';

export default function Settings() {
  const authContext = useAuthContext();
  const [discordLinked, setDiscordLinked] = useState(false);

  return authContext.isLoggedIn ? (
    <Container
      className="settings-overlay"
      style={{
        width: '80%',
        height: '80%',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Container className="social-account-links" style={{ width: '20%' }}>
        <Button disabled={discordLinked} className="social-account-button">
          <ImageAsset className="social-account-logo" src="/path/to/discord-logo.png" />
          Link your Discord Account
          {discordLinked && <span className="account-status">&#10004;</span>}
        </Button>
        {/* Repeat for other social accounts */}
      </Container>

      <Container className="social-circles" style={{ margin: '8px' }}>
        {/* Render your SocialCircles component here */}
      </Container>

      <hr />

      <Container className="action-buttons">
        <Button variant="secondary" className="action-button">Cancel</Button>
        <Button variant="success" className="action-button">Save Changes</Button>
      </Container>
    </Container>
  ) : (
    <Container>
      <p>Not logged in</p>
    </Container>
  );
}
