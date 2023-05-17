import './Navbar.css'
import { useState, useEffect, useRef } from 'react';
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import LoginOrRegisterModal from "modals/LoginOrRegisterModal";
import VerifyAccountModal from "modals/VerifyAccountModal";
import ImageAsset from 'components/ImageAsset';
import resolveUrl from "utils/resolveUrl";
import formDataBody from 'form-data-body';

const clientUrlBase = process.env.VITE_CLIENT_BASEPATH || "http://localhost";
const apiUrlBase = process.env.VITE_API_AUTHPATH || "http://localhost/api/auth";
const apiUrlLogout = resolveUrl(apiUrlBase, 'logout');
const sessionName = process.env.SESSION_COOKIE_NAME || "__gfsid";

export default function Navbar({verification})
{
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem(sessionName));
  const didMountRef = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log(`/${verification}`);
    updateToken();

    if (!didMountRef.current) {
      checkSession();
      didMountRef.current = true;
    }
  }, []);

  const updateToken = () => {
    // Check for the existence of a previous session
    const token = sessionStorage.getItem(sessionName);
  
    // Update the session
    if (token !== accessToken) {
      setAccessToken(token);
    }

    return token;
  }

  const checkSession = () => {
    if (accessToken) {
      // User is logged in
      if(!isLoggedIn)
        handleLoginChange(true);

      console.log('User is logged in');
    } else {
      // User is not logged in
      if(isLoggedIn)
        handleLoginChange(false);

      console.log('User is not logged in');
    }
  }

  const sendLogoutRequest = () =>
  {
    const boundary = formDataBody.generateBoundary();
    const header = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
    const body = formDataBody({ accessToken: updateToken() }, boundary);
  
    fetch(apiUrlLogout, {
      method: 'POST',
      body: body,
      mode: 'cors',
      headers: header
    })
    .then(response => {
      if (response.status === 200) {
        // Update the isLoggedIn state
        setIsLoggedIn(false);
        sessionStorage.removeItem(sessionName);
        updateToken();
        console.log('User logged out');
      }
    })
    .catch(error => console.error(error));
  }   

  const handleLoginRequest = () => {
    setShowModal(true);
  };
  
  const handleLogoutRequest = () => {
    console.log('handleLogout');
    if(isLoggedIn)
      handleLoginChange(false);
    setShowModal(false);
  };

  const handleLoginChange = (loginStatus) => {
    setIsLoggedIn(loginStatus);
    if(loginStatus != wasLoggedIn) {
      console.log('handleLoginChange: ' + loginStatus);
    }

    // Tell the server to end the session, then refresh the page
    if(loginStatus === false)
      sendLogoutRequest();

    setWasLoggedIn(loginStatus);
  }

  const handleRegister = (token) => {
    if(token)
      console.log(`[TOKEN]: ${token}`);
  }

  const handleVerification = () => {
    console.log("SUCCESS!");
    location.href = clientUrlBase;
  }

  return(
    <header>
      {/* Navigation Bar */}
      <BootstrapNavbar className="navbar-header" expand="lg" variant="dark">
        <Container fluid className="w-100">

          {/* Website Logo and Title */}
          <BootstrapNavbar.Brand className="d-flex align-items-center" href={clientUrlBase}>
            <a href={clientUrlBase}><ImageAsset className="asset-main-logo img-website-logo img-show-border" /></a>
            <span className="website-name flex-fill text-center">Game Filter</span>
          </BootstrapNavbar.Brand>

          {/* Login/Logout Button */}
          <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
          <BootstrapNavbar.Collapse id="navbar-nav" className="justify-content-end align-items-center">
            <Nav>
              {isLoggedIn ? (
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
      <LoginOrRegisterModal shown={showModal} onShowModal={setShowModal} onHandleLogin={handleLoginChange} onHandleRegister={handleRegister} />
      {verification && <VerifyAccountModal token={verification} onAccountVerified={handleVerification}/>}
    </header>
  )
}