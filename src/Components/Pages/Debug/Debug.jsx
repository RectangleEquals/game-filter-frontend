import { useEffect, useState } from 'react';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import useAuthContext from 'components/AuthContext/AuthContext';
import useSocialCircleContext from 'components/SocialCircles/SocialCircleContext';

export default function SocialLinkBypass() {
  const authContext = useAuthContext();
  const socialCircleContext = useSocialCircleContext();
  const [command, setCommand] = useState('');
  const [consoleComponent, setConsoleComponent] = useState(null);
  const [selectedUser, setSelectedUser] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
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

  useEffect(() => {
    const matchingLogs = logs.filter(log => {
      return (selectedUser === 'ALL' || log.user === selectedUser) &&
        (selectedCategory === 'ALL' || log.category === selectedCategory);
    });
    setFilteredLogs(matchingLogs);
  }, [logs, selectedUser, selectedCategory]);

  useEffect(() => {
    setConsoleComponent(
      <>
        {authContext.isLoggedIn && authContext.isDebugMode && (
          <ListGroup style={{borderRadius: filteredLogs.length > 0 ? '8px 8px 0px 0px' : '8px 8px 8px 8px'}}>
            <ListGroup.Item variant="dark">
              <Row>
                <Col xs="auto">
                  <Button
                    variant="success"
                    style={{ margin: '2px 12px 2px 0px' }}
                    onClick={handlePullLogs}
                  >
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
                      }}
                    >
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
                      }}
                    >
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
        )}
        
        <div>
          <ListGroup style={{ maxHeight: '300px', overflowY: 'auto', borderRadius: '0px 0px 8px 8px' }}>
          {
            filteredLogs && filteredLogs.length > 0 && filteredLogs.map((log, index) => {
              const variant = log.category === "ERROR" ? 'danger' :
                log.category === "WARNING" ? 'warning' :
                log.category === "INFO" ? 'info' : 'light';
              return (
                <ListGroup.Item key={index} variant={variant} style={{fontSize: '10pt'}}>
                  [{log.date.toLocaleString()}]: <strong>{log.message}</strong>
                </ListGroup.Item>
              );
            })
          }
          </ListGroup>
        </div>
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
    } else {
      authContext.logWarning(`Unknown command: '${command}'`);
    }
  };

  return (
    <main className="main-content min-vh-100 d-flex flex-column">
      {/* Navbar component */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {/* Navbar content */}
      </nav>

      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-column justify-space-between" style={{ width: '80%' }}>
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
          <ListGroup className="vw-100 text-center" style={{ maxWidth: '80%', maxHeight: '200px', overflowY: 'auto' }}>
            {<ListGroup.Item>Auth Context</ListGroup.Item>}
            {socialCircleContext && <ListGroup.Item>Social Context</ListGroup.Item>}
            {authContext.isLoggedIn && <ListGroup.Item>Logged in</ListGroup.Item>}
            {authContext.isDebugMode && <ListGroup.Item>Debug mode</ListGroup.Item>}
            {authContext.isMobile && <ListGroup.Item>Mobile</ListGroup.Item>}
            {authContext.isTablet && <ListGroup.Item>Tablet</ListGroup.Item>}
          </ListGroup>
        </div>
      </div>
    </main>
  );
}
