import { useEffect, useState } from 'react';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import useNavbarContext from 'components/NavbarContext/NavbarContext';
import useSocialCircleContext from 'components/SocialCircles/SocialCircleContext';

export default function SocialLinkBypass() {
  const authContext = useAuthContext();
  const navbarContext = useNavbarContext();
  const socialCircleContext = useSocialCircleContext();
  const [command, setCommand] = useState('');
  const [consoleComponent, setConsoleComponent] = useState(null);
  const [selectedUser, setSelectedUser] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

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
    } else if (command === authContext.debugModeKeySequence) {
      authContext.setDebugMode(true);
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
        {navbarContext && <ListGroup.Item>Navbar Context</ListGroup.Item>}
        {socialCircleContext && <ListGroup.Item>Social Context</ListGroup.Item>}
        {authContext && authContext.isLoggedIn && <ListGroup.Item>Logged in</ListGroup.Item>}
        {authContext && authContext.isDebugMode && <ListGroup.Item>Debug mode</ListGroup.Item>}
        {authContext && authContext.isMobile && <ListGroup.Item>Mobile</ListGroup.Item>}
        {authContext && authContext.isTablet && <ListGroup.Item>Tablet</ListGroup.Item>}
        {navbarContext && navbarContext.navbarHeight !== undefined && <ListGroup.Item>{`Navbar Height: ${navbarContext.navbarHeight}`}</ListGroup.Item>}
      </>
    )
  }

  return (
    <>
      <div className="d-flex flex-column" style={{ width: '86%' }}>
        {authContext.isLoggedIn && (
          <>
            <Form.Control
              name="command"
              type="text"
              placeholder="command"
              value={command}
              onChange={e => setCommand(e.target.value)}
            />
            <Button className="mb-3" onClick={handleSubmit}>
              Submit
            </Button>
          </>
        )}
        {consoleComponent}
      </div>
      <div className="mt-3 mb-3 d-flex flex-column justify-content-end align-items-center" style={{ margin: '0px 0px 0px 0px', padding: '0px 0px 0px 0px' }}>
        <ListGroup className="vw-100 text-center" style={{ maxWidth: '86%', maxHeight: '200px', overflowY: 'auto' }}>
          {renderVariableStateComponent()}
        </ListGroup>
      </div>
    </>
  );
}