import './Footer.css';
import { useState } from "react";
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const buildId = process.env.VERCEL_GIT_COMMIT_SHA || "1.0.0";
const commitId = process.env.VERCEL_GIT_COMMIT_REF || "alpha";

export default function Footer()
{
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <footer>
      <Button
        className="navbar-toggle-button"
        type="button"
        aria-expanded={visible}
        onClick={toggleVisible}
        style={{
          bottom: visible ? "2vw" : "0",
          opacity: visible ? 0.3333 : 0.85
        }}
      >
        {visible ? <IoIosArrowDown size="2em" /> : <IoIosArrowUp size="2em" />}
      </Button>
      <Navbar
        className="navbar-footer"
        bg="light"
        expand="lg"
        variant="dark"
        fixed="bottom"
        style={{
          height: visible ? "2vw" : "0px",
          overflow: "hidden",
          transition: "opacity 0.2s ease-in-out, height 0.2s ease-in-out",
          opacity: !visible ? 0.1 : 0.85
        }}
      >
        <Container fluid className="w-100 d-flex justify-content-between">
          <Nav>
            <Nav.Link
              style={{
                color: "#ffffff",
                fontFamily: "'Bruno Ace SC', cursive",
                textShadow: "1px 3px 4px #0e92c2, 0 0 1em #5865F2, 0 0 0.2em rgba(88, 101, 242, 0.588)",
              }}
            >
              ©2023 Electric Ocean Games
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              style={{
                color: "#ffffff",
                fontFamily: "'Bruno Ace SC', cursive",
                textShadow: "1px 3px 4px #0e92c2, 0 0 1em #5865F2, 0 0 0.2em rgba(88, 101, 242, 0.588)",
              }}
            >
              {`Version: ${buildId} ${commitId}`}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </footer>
  );
}