import { useState, useRef } from 'react';
import { Modal, Form, Button, Tab, Tabs, Alert } from 'react-bootstrap';
import resolveUrl from "utils/resolveUrl";
import './LoginOrRegisterModal.css';

const apiUrlBase = import.meta.env.VITE_API_AUTHPATH || "http://localhost/api/auth";
const apiUrlLogin = resolveUrl(apiUrlBase, 'login');

export default function LoginOrRegisterModal({ shown, onShowModal, onHandleLoginChange }) {
  const [title, setTitle] = useState('Login');
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerDisplayName, setRegisterDisplayName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const formRef = useRef();
  
  const handleClose = () => {
    if(isLoading)
      return;
    onShowModal(false);
    setTimeout(() => setAlertMessage({}), 200);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if(isLoggingIn)
      return;
    
    setIsLoading(true);
    setIsLoggingIn(true);
    setAlertMessage({variant: "info", message: "Logging in..."});
    
    const data = new FormData(formRef.current);
    fetch(apiUrlLogin, {
      method: 'POST',
      body: data,
      mode: 'cors',
      credentials: 'include',
      withCredentials: true,
      sameSite: 'none',
      secure: true
    })
    .then(response => handleResponse(response))
    .catch(err => {
      setAlertMessage({variant: 'danger', title: `Error (${apiUrlLogin})`, message: err.message})
      setIsLoading(false);
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setAlertMessage({variant: "info", message: "Registering..."});
    setTimeout(() => {
      setAlertMessage({variant: "danger", message: "Registration failed!"});
      setIsLoading(false);
    }, 2000);
  };

  const handleResponse = (response) =>
  {
    setIsLoading(false);

    if (response.ok) {
      response.json().then((data) => {
        if (data.message === "Login successful") {
          onHandleLoginChange(true);
          setLoginEmail("");
          setLoginPassword("");
          onShowModal(false);
        } else {
          setAlertMessage({
            variant: "danger",
            title: "Error",
            message: "Unknown error occurred.",
          });
        }
      });
    } else {
      setAlertMessage({
        variant: "danger",
        title: "Error",
        message: `Error: ${response.status} ${response.statusText}`,
      });
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAlertMessage({});
    if (tab === 'login') {
      setTitle('Login');
    } else if (tab === 'register') {
      setTitle('Register');
    }
  };

  const tabStyle = {
    pointerEvents: isLoading ? "none" : "auto",
    opacity: isLoading ? "0.5" : "1"
  };

  return (
    <Modal className="login-register-modal" show={shown} onHide={handleClose} centered>
      <Modal.Header className="login-register-modal-header" closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="login-register-modal-body">
        <Tabs activeKey={activeTab} onSelect={handleTabChange} variant="tabs">
          <Tab
            eventKey="login"
            title="Login"
            disabled={isLoading}
            className="login-tab"
            style={tabStyle} >
            <Tab.Content className="login-tab-content">
              <Form ref={activeTab == "login" ? formRef : null} onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    className="mb-2"
                    placeholder="Enter email"
                    disabled={isLoading}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Password"
                    disabled={isLoading}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </Form.Group>

                {alertMessage && alertMessage.variant && alertMessage.message && alertMessage.message.length > 0 &&
                  <Alert className="pt-0 pb-2" variant={alertMessage.variant} style={{marginTop: '20px', marginBottom: '20px'}}>
                    <Alert.Heading>{alertMessage.title}</Alert.Heading>
                    {alertMessage.message}
                  </Alert>
                }
                
                <hr/>
                <Button className="flex-grow-1 w-100 mb-1" variant="light" type="submit" disabled={isLoading}>
                  Login
                </Button>
              </Form>
            </Tab.Content>
          </Tab>
          <Tab
            eventKey="register"
            title="Register"
            disabled={isLoading}
            className="register-tab"
            style={tabStyle} >
            <Tab.Content className="register-tab-content">
              <Form ref={activeTab == "register" ? formRef : null} onSubmit={handleRegister}>
                <Form.Group controlId="formBasicDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    name="displayname"
                    type="text"
                    className="mb-2"
                    placeholder="Enter display name"
                    disabled={isLoading}
                    value={registerDisplayName}
                    onChange={(e) => setRegisterDisplayName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    className="mb-2"
                    placeholder="Enter email"
                    disabled={isLoading}
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    className="mb-2"
                    placeholder="Password"
                    disabled={isLoading}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </Form.Group>

                {alertMessage && alertMessage.variant && alertMessage.message && alertMessage.message.length > 0 &&
                  <Alert className="pt-0 pb-2" variant={alertMessage.variant} style={{marginTop: '20px', marginBottom: '20px'}}>
                    <Alert.Heading>{alertMessage.title}</Alert.Heading>
                    {alertMessage.message}
                  </Alert>
                }

                <hr/>
                <Button className="flex-grow-1 w-100 mb-1" variant="light" type="submit" disabled={isLoading}>
                  Register
                </Button>
              </Form>
            </Tab.Content>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}