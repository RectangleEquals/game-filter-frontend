import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import resolveUrl from "utils/resolveUrl";
import getExternalIP from "utils/getExternalIP";

const apiUrlBase = import.meta.env.VITE_API_BASEPATH || "http://localhost/api";
const apiUrlAuth = resolveUrl(apiUrlBase, 'auth');

const LoginModal = ({ show, onHide }) =>
{
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (provider) => {
    setIsLoading(true);

    const externalIP = await getExternalIP();
    if(externalIP === '') {
      console.error('Failed to get external IP!');
      return;
    }

    // Make an API call to your backend server to initiate the social login flow
    const queryParams = {
      provider: provider,
      from: externalIP
    };
    const queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
    const authUrl = `${apiUrlAuth}?${queryString}`;
    const response = await fetch(authUrl);
    const { url } = await response.json();

    // Redirect the user to the social login page
    window.location.href = url;
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button
          variant="primary"
          block
          disabled={isLoading}
          onClick={() => handleLogin("discord")}
        >
          {isLoading ? "Loading..." : "Login with Discord"}
        </Button>
        <Button
          variant="primary"
          block
          disabled={isLoading}
          onClick={() => handleLogin("google")}
        >
          {isLoading ? "Loading..." : "Login with Google"}
        </Button>
        <Button
          variant="primary"
          block
          disabled={isLoading}
          onClick={() => handleLogin("steam")}
        >
          {isLoading ? "Loading..." : "Login with Steam"}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;