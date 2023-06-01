import './Footer.css';
import { useEffect, useRef, useState } from "react";
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxDividerVertical } from "react-icons/rx";
import { useAuthContext } from "contexts/AuthContext";
import { useUserContext } from 'contexts/UserContext';

const buildId = process.env.VERCEL_GIT_COMMIT_SHA || "0.6.0";
const commitId = process.env.VERCEL_GIT_COMMIT_REF || "alpha";

export default function Footer()
{
  const navbarRef = useRef(null);
  const authContext = useAuthContext();
  const userContext = useUserContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [toggleButtonBottom, setToggleButtonBottom] = useState(0);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [debugModeClickCount, setDebugModeClickCount] = useState(0);

  useEffect(_ => {
    if(navbarRef.current) {
      setToggleButtonBottom(navbarRef.current.offsetHeight);
    }
  }, [isExpanded, navbarRef.current])

  const toggleVisible = () => {
    setIsExpanded(!isExpanded);
  };

  const handleVersionClick = (e) => {
    e.preventDefault();
    if(authContext && authContext.isLoggedIn && !authContext.isDebugMode &&
      userContext && userContext.data && userContext.data.roles && userContext.data.roles.includes("Developer")) {
      if(debugModeClickCount < 4) {
        setDebugModeClickCount(debugModeClickCount + 1);
      } else {
        authContext.setIsDebugMode(true);
        alert('Debug mode enabled');
      }
    }
  }

  return (
    <footer>
      <Button
        className="navbar-toggle-button"
        type="button"
        aria-expanded={isExpanded}
        onClick={toggleVisible}
        onMouseEnter={_ => setIsToggleHovered(true)}
        onMouseLeave={_ => setIsToggleHovered(false)}
        style={{
          bottom: isExpanded ? toggleButtonBottom : "0",
          opacity: isToggleHovered ? 0.85 : 0.3333
        }}
      >
        {isExpanded ? <IoIosArrowDown size="2em" /> : <IoIosArrowUp size="2em" />}
      </Button>
      <Navbar
        ref={navbarRef}
        className="navbar-footer"
        bg="light"
        expand="lg"
        variant="dark"
        fixed="bottom"
        style={{
          height: isExpanded ? "auto" : "0px",
          opacity: !isExpanded ? 0.1 : 0.80
        }}
      >
        <Container fluid className="">
          <Nav>
            <Nav.Link className="navbar-text" href='https://discord.gg/9Xdpd7w2' style={{opacity: !isExpanded ? 0.1 : 1}}>
              ©2023 Electric Ocean Games
            </Nav.Link>
          </Nav>
          <Nav style={{zIndex: 1000}}>
            <Nav.Link style={{pointerEvents: 'none'}}>
              <RxDividerVertical
                style={{
                  color: "#ffffff",
                  fontSize: "1.5em",
                  fontWeight: "bolder",
                  margin: "0px 0px 0px 0px",
                  alignSelf: "center",
                }}
              />
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className="navbar-text"  style={{opacity: !isExpanded ? 0.1 : 1}} onClick={handleVersionClick}>
              {`Version: ${buildId} ${commitId}`}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </footer>
  );
}