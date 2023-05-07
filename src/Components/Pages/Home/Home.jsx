import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import resolveUrl from "utils/resolveUrl";
import ImageAsset from 'components/ImageAsset';
//import LoginModal from 'components/ModalDialogs/LoginModal';
import LoginOrRegisterModal from 'components/ModalDialogs/LoginOrRegisterModal';
import './Home.css';

const apiUrlBase = import.meta.env.VITE_API_AUTHPATH || "http://localhost/api/auth";
const apiUrlLogout = resolveUrl(apiUrlBase, 'logout');

function Home()
{
  const didMountRef = useRef(false);
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!didMountRef.current) {
      checkSession();
      didMountRef.current = true;
    }
  });

  const checkSession = () => {
    // Check for the existence of the 'user' cookie
    let cookie = document.cookie;
    let index = cookie.indexOf('user=');
    if (index !== -1) {
      // Validate the cookie
      let uid = cookie.substring(index + 5);
      setUserId(uid);
      
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

  const sendLogoutRequest = () => {
    let data = new FormData();
    data.append('id', userId);

    fetch(apiUrlLogout, {
      method: 'POST',
      body: data,
      mode: 'cors',
      credentials: 'include',
      withCredentials: true,
      sameSite: 'none',
      secure: true
    })
    .then(response => {
      if (response.status === 200) {
        // Update the isLoggedIn state
        setIsLoggedIn(false);
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
                    <span className="discord-name">Login / Register</span>
                    <ImageAsset className="asset-discord-logo img-discord-logo img-show-border" />
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>

          </Container>
        </Navbar>
        <LoginOrRegisterModal shown={showModal} onShowModal={setShowModal} onHandleLoginChange={handleLoginChange}/>
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