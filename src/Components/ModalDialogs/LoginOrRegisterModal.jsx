import { useState } from 'react';
import { Modal, Form, Button, Tab, Tabs, Alert } from 'react-bootstrap';
import './LoginOrRegisterModal.css';

export default function LoginOrRegisterModal({ shown, setShowModal }) {
  const [title, setTitle] = useState('Login');
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerDisplayName, setRegisterDisplayName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if(isLoading)
      return;
    setShowModal(false);
    setTimeout(() => setAlertMessage({}), 200);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    // handle login logic here
    setIsLoading(true);
    setAlertMessage({variant: "info", message: "Logging in..."});
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlertMessage({variant: "danger", message: "Registration failed!"});
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAlertMessage({});
    if (tab === 'login') {
      setTitle('Login');
    } else if (tab === 'register') {
      setTitle('Register');
    }
  };

  return (
    <Modal className="login-register-modal" show={shown} onHide={handleClose} centered>
      <Modal.Header className='login-register-modal-header' closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={activeTab} onSelect={handleTabChange}>
          <Tab eventKey="login" title="Login" className="login-tab" disabled={isLoading}>
            <Tab.Content className="login-tab-content">
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="email"
                    placeholder="Enter email"
                    disabled={isLoading}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
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
          <Tab eventKey="register" title="Register" className="register-tab" disabled={isLoading}>
            <Tab.Content className="register-tab-content">
              <Form onSubmit={handleRegister}>
                <Form.Group controlId="formBasicDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="text"
                    placeholder="Enter display name"
                    disabled={isLoading}
                    value={registerDisplayName}
                    onChange={(e) => setRegisterDisplayName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="email"
                    placeholder="Enter email"
                    disabled={isLoading}
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="password"
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