import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import ImageAsset from 'components/ImageAsset';
import LoginModal from 'components/ModalDialogs/LoginModal';
import './Home.css';

function Home()
{
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);
  const [showModal, setShowModal] = useState(false);

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
    setWasLoggedIn(loginStatus);
  }
 
  return (
    <div className="d-flex flex-column min-vh-100 min-vw-100 border-bottom border-primary">
      
      <header>
        {/* Navigation Bar */}
        <Navbar className="navbar" expand="lg" variant="dark">
          <Container fluid className="w-100">

            {/* Website Logo and Title */}
            <Navbar.Brand className="d-flex align-items-center" href="#">
              <ImageAsset className="asset-main-logo img-website-logo img-show-border" />
              <span className="website-name flex-fill text-center">Game Filter</span>
            </Navbar.Brand>

            {/* Login/Logout Button */}
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" className="justify-content-end align-items-center">
              <Nav>
                {isLoggedIn ? (
                  <Nav.Link href="#" className='d-flex flex-row justify-content-center align-items-center' onClick={handleLogoutRequest}>
                    <span className="user-name">Logout</span>
                    <ImageAsset className="asset-user-avatar img-user-avatar img-show-border" />
                  </Nav.Link>
                ) : (
                  <Nav.Link href="#" className='d-flex flex-row justify-content-center align-items-center' onClick={handleLoginRequest}>
                    <span className="discord-name">Login</span>
                    <ImageAsset className="asset-discord-logo img-discord-logo img-show-border" />
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>

          </Container>
        </Navbar>
        <LoginModal shown={showModal} setShowModal={setShowModal} setLoginStatus={handleLoginChange} />
      </header>

      {/* Main Content */}
      <main id="main-content" name="main-content" className="main-content min-vw-100 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        {/* Background Logo */}
        <ImageAsset className="asset-main-logo img-main-logo img-vh-100 img-vw-100"/>

        {/* Main Body */}
        <h1 className="text-center main-content-large-text">Welcome to Game Filter!</h1>
        <p className="text-center main-content-small-text">
          Currently under maintenance. We are working hard to get things up and running, so stay tuned!
        </p>
      </main>

    </div>
  );
}

export default Home;