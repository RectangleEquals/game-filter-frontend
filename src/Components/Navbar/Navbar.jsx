import './Navbar.css'
import { useState } from 'react';
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import LoginOrRegisterModal from "modals/LoginOrRegisterModal";
import VerifyAccountModal from "modals/VerifyAccountModal";
import ImageAsset from 'components/ImageAsset';

const clientUrlBase = process.env.VITE_CLIENT_BASEPATH || "http://localhost";

// TODO: Remove the `Logout` text, and only display `Login / Register`
//  text when there is no valid session or valid, logged in user

// TODO: Create a drop-down menu for the avatar with the following contents:
// - Currently logged in user's DisplayName
// - A `Settings` entry, to display the `Settings` component
// - A `Logout` entry, to log the user out

export default function Navbar({verification})
{
  const authContext = useAuthContext();
  const [showModal, setShowModal] = useState(false);

  const handleLoginRequest = () => {
    setShowModal(true);
  };
  
  const handleLogoutRequest = () => {
    console.log('handleLogout');
    if(authContext.isLoggedIn)
      authContext.handleLoginChange(false);
    setShowModal(false);
  };

  const handleVerification = () => {
    console.log("SUCCESS!");
    location.href = clientUrlBase;
  }

  return(
    <header>
      {/* Navigation Bar */}
      <BootstrapNavbar className="navbar-header" expand="lg" variant="dark">
        <Container fluid className="w-100" style={{userSelect: 'none'}}>

          {/* Website Logo and Title */}
          <BootstrapNavbar.Brand className="d-flex align-items-center" href={clientUrlBase}>
            <ImageAsset className="asset-main-logo img-website-logo img-show-border" />
            <span className="website-name flex-fill text-center">Game Filter</span>
          </BootstrapNavbar.Brand>

          {/* Login/Logout Button */}
          <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
          <BootstrapNavbar.Collapse id="navbar-nav" className="justify-content-end align-items-center">
            <Nav>
              {authContext.isLoggedIn ? (
                <Nav.Link href="#" className='d-flex flex-row justify-content-center align-items-center' onClick={handleLogoutRequest}>
                  <span className="user-name">Logout</span>
                  <ImageAsset className="asset-user-avatar img-user-avatar img-show-border" />
                </Nav.Link>
              ) : (
                <Nav.Link href="#" className='d-flex flex-row justify-content-center align-items-center' onClick={handleLoginRequest}>
                  <span className="discord-name">Login / Register</span>
                  <ImageAsset className="asset-discord-logo img-discord-logo img-show-border" />
                </Nav.Link>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>

        </Container>
      </BootstrapNavbar>
      <LoginOrRegisterModal shown={showModal} onShowModal={setShowModal} onHandleLogin={authContext.handleLoginChange} onHandleRegister={authContext.handleRegister} />
      {verification && <VerifyAccountModal token={verification} onAccountVerified={handleVerification}/>}
    </header>
  )
}