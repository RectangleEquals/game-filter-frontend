import './Navbar.css'
import { useState } from 'react';
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { useUtilityContext } from 'components/UtilityContext/UtilityContext';
import { useAuthContext } from 'components/AuthContext/AuthContext';
import { useNavbarContext } from 'components/NavbarContext/NavbarContext';
import LoginOrRegisterModal from "modals/LoginOrRegisterModal";
import VerifyAccountModal from "modals/VerifyAccountModal";
import ImageAsset from 'components/ImageAsset';

const clientUrlBase = process.env.VITE_CLIENT_BASEPATH || "http://localhost";

export function Navbar({verification})
{
  const { simulateResizeEvent } = useUtilityContext();
  const authContext = useAuthContext();
  const { ref, expanded, setExpanded } = useNavbarContext();
  const [showModal, setShowModal] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleCollapseEnter = () => {
    setExpanded(true);
    simulateResizeEvent();
  };

  const handleCollapseExit = () => {
    setExpanded(false);
    simulateResizeEvent();
  };

  const handleLoginRequest = () => {
    setShowModal(true);
  };
  
  const handleLogoutRequest = () => {
    authContext.log('handleLogout', false);
    if(authContext.isLoggedIn)
      authContext.handleLoginChange(false);
    setShowModal(false);
  };

  const handleVerification = () => {
    authContext.log("SUCCESS!", false);
    location.href = clientUrlBase;
  }

  return(
    <header>
      {/* Navigation Bar */}
      <BootstrapNavbar ref={ref}
        className="navbar-header"
        expand="lg" variant="dark"
        expanded={expanded}
        onToggle={handleToggle}>
        <Container fluid style={{userSelect: 'none'}}>

          {/* Website Logo and Title */}
          <BootstrapNavbar.Brand className="d-flex align-items-center" href={clientUrlBase}>
            <ImageAsset className="asset-main-logo img-website-logo img-show-border" />
            <span className="website-name flex-fill text-center">Game Filter</span>
          </BootstrapNavbar.Brand>

          {/* Login/Logout Button */}
          <BootstrapNavbar.Toggle onClick={handleToggle} aria-controls="navbar-nav" />
          <BootstrapNavbar.Collapse
            id="navbar-nav"
            className="justify-content-end align-items-center"
            onEntered={handleCollapseEnter}
            onExited={handleCollapseExit}>
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

export default Navbar;