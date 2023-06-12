import { useEffect, useState, useRef } from 'react';
import { Button, Col, Container, Form, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useAuthContext } from 'contexts/AuthContext';
import { useAriaContext } from 'contexts/AriaContext';
import { useUserContext } from 'contexts/UserContext';
import { useNavbarContext } from 'contexts/NavbarContext';
import { useSocialCircleContext } from 'contexts/SocialCircleContext';

const refreshTimeout = 3000;

export default function Debug()
{
  const authContext = useAuthContext();
  const ariaContext = useAriaContext();
  const userContext = useUserContext();
  const navbarContext = useNavbarContext();
  const socialCircleContext = useSocialCircleContext();
  const refreshTimeoutRef = useRef(null);
  const [contextsLoaded, setContextsLoaded] = useState(false);
  const [command, setCommand] = useState('');
  const [consoleComponent, setConsoleComponent] = useState(null);
  const [selectedUser, setSelectedUser] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    if (authContext !== undefined &&
      ariaContext !== undefined &&
      userContext !== undefined &&
      navbarContext !== undefined &&
      socialCircleContext !== undefined) {
      setContextsLoaded(true);
    }
  }, [authContext, ariaContext, userContext, navbarContext, socialCircleContext]);

  useEffect(() => {
    if (!contextsLoaded) {
      refreshTimeoutRef.current = setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, refreshTimeout);
    } else {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    return () => {
      clearTimeout(refreshTimeoutRef.current);
    };
  }, [contextsLoaded]);

  useEffect(_ => {
    const formattedLogs = [];
    if (authContext.debugLogs && authContext.debugLogs.length > 0) {
      authContext.debugLogs.forEach(log => {
        const { user, logs } = log;
        logs.forEach(logEntry => {
          const formattedLog = {
            user,
            date: new Date(logEntry.date),
            category: logEntry.category,
            message: logEntry.message
          };
          formattedLogs.push(formattedLog);
        })
      });
    }
    setLogs(formattedLogs);
  }, [authContext.debugLogs]);

  useEffect(_ => {
    const matchingLogs = logs.filter(log => {
      return (selectedUser === 'ALL' || log.user === selectedUser) &&
        (selectedCategory === 'ALL' || log.category === selectedCategory);
    });
    setFilteredLogs(matchingLogs);
  }, [logs, selectedUser, selectedCategory]);

  useEffect(_ => {
    setConsoleComponent(
      <>
        {authContext.isLoggedIn && authContext.isDebugMode && (
          <>
            <ListGroup style={{borderRadius: filteredLogs.length > 0 ? '8px 8px 0px 0px' : '8px 8px 8px 8px'}}>
              <ListGroup.Item variant="dark">
                <Row>
                  <Col xs="auto">
                    <Button
                      variant="success"
                      style={{ margin: '2px 12px 2px 0px' }}
                      onClick={handlePullLogs} >
                      Pull Logs
                    </Button>
                    <p>{`Logs (Viewing ${filteredLogs.length} of ${logs.length} messages)`}</p>
                  </Col>

                  <Col xs="auto">
                    <Form.Group>
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={selectedCategory}
                        onChange={e => {
                          setSelectedCategory(e.target.value);
                        }} >
                        <option value="ALL">All</option>
                        <option value="INFO">Info</option>
                        <option value="WARNING">Warning</option>
                        <option value="ERROR">Error</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>User</Form.Label>
                      <Form.Select
                        value={selectedUser}
                        onChange={e => {
                          setSelectedUser(e.target.value);
                        }} >
                        <option value="ALL">Any</option>
                        {[...new Set(logs.map(log => log.user))].map(user => (
                          <option key={user} value={user}>
                            {user}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          
            <ListGroup style={{ maxHeight: '300px', overflowY: 'auto', borderRadius: '0px 0px 8px 8px' }}>
            {
              filteredLogs && filteredLogs.length > 0 && filteredLogs.map((log, index) => {
                const variant = log.category === "ERROR" ? 'danger' :
                  log.category === "WARNING" ? 'warning' :
                  log.category === "INFO" ? 'info' : 'light';
                return (
                  <ListGroup.Item key={index} variant={variant} style={{fontSize: '10pt'}}>
                    <span style={{color: "#7f7f7f", marginRight: "4px"}}>[{log.date.toLocaleString()}]:</span>
                    <strong>
                      {selectedUser === "ALL" &&
                        <span style={{color: "#1f1f1f", marginRight: "4px"}}>[{log.user}]</span>
                      }
                      {log.message}
                    </strong>
                  </ListGroup.Item>
                );
              })
            }
            </ListGroup>
          </>
        )}
      </>
    );
  }, [filteredLogs, authContext.isLoggedIn, authContext.isDebugMode, selectedUser, selectedCategory]);

  const handlePullLogs = (e) => {
    e.preventDefault();
    if(authContext.isLoggedIn && authContext.isDebugMode) {
      authContext.pullLogs();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(authContext.isDebugMode && command === 'linkdiscord') {
      authContext.log('Requesting Discord account link...')
      socialCircleContext.requestAccountLink('Discord');
    } else if (userContext.data && userContext.data.roles && userContext.data.roles.includes("Owner") && command.toLowerCase() === 'hunt') {
      ariaContext.setShown(true);
    } else if (command.startsWith('logError ')) {
      const message = command.substring(command.indexOf(" ") + 1);
      authContext.logError(message);
    } else if (command.startsWith('logWarning ')) {
      const message = command.substring(command.indexOf(" ") + 1);
      authContext.logWarning(message);
    } else if (command.startsWith('log')) {
      const message = command.substring(command.indexOf(" ") + 1);
      authContext.log(message);
    } else {
      authContext.logWarning(`Unknown command: '${command}'`);
    }
  };

  const renderVariableStateComponent = () => {
    return (
      <>
        {authContext && <ListGroup.Item>Auth Context</ListGroup.Item>}
        {userContext && <ListGroup.Item>User Context</ListGroup.Item>}
        {navbarContext && <ListGroup.Item>Navbar Context</ListGroup.Item>}
        {socialCircleContext && <ListGroup.Item>Social Context</ListGroup.Item>}
        {authContext && authContext.isLoggedIn && <ListGroup.Item>Logged in</ListGroup.Item>}
        {authContext && authContext.isDebugMode && <ListGroup.Item>Debug mode</ListGroup.Item>}
        {authContext && authContext.isMobile && <ListGroup.Item>Mobile</ListGroup.Item>}
        {authContext && authContext.isTablet && <ListGroup.Item>Tablet</ListGroup.Item>}
        {userContext && userContext.data &&
          userContext.data.roles && userContext.data.roles.length > 0 &&
          <ListGroup.Item>{`User Roles: ${userContext.data.roles}`}</ListGroup.Item>
        }
      </>
    )
  }

  if (!contextsLoaded) {
    return (
      <div
        className="d-flex flex-column"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}
      >
        <Spinner animation="border" variant="light" />
        <span style={{color: 'white', fontFamily: 'Bruno Ace SC', fontSize: '16pt'}}>Loading...</span>
      </div>
    )
  }

  return (
    <>
      <Container fluid className="d-flex flex-column" style={{ width: '86%', marginTop: '32px' }}>
        {authContext.isLoggedIn && (
          <>
            <Form.Control
              name="command"
              type="text"
              placeholder="command"
              value={command}
              onChange={e => setCommand(e.target.value)}
              onKeyDown={e => {
                if(e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
            <Button className="mb-3" onClick={handleSubmit}>
              Submit
            </Button>
          </>
        )}
        {consoleComponent}
      </Container>
      <Container fluid className="mt-3 mb-3 d-flex flex-column justify-content-end align-items-center" style={{ padding: '0px 0px 0px 0px' }}>
        <ListGroup className="vw-100 text-center" style={{ maxWidth: '86%', maxHeight: '200px', overflowY: 'auto' }}>
          {renderVariableStateComponent()}
        </ListGroup>
      </Container>
    </>
  );
}
