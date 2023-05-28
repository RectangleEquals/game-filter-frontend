import useNavbarContext from 'components/NavbarContext/NavbarContext';
import { Container } from 'react-bootstrap';

const MainContent = ({ children }) => {
  const navbarContext = useNavbarContext();

  return (
    <>
      {/* Dummy header which sits behind navbar, copying it's height */}
      <Container fluid className="main-content-head" style={{
        height: navbarContext.navbarHeight,
        transition: "height 0.2s ease-in-out"
      }}/>
      {/* Main content which sits directly below the dummy header, giving
        the illusion that it's "connected" to the bottom of the navbar */}
      <Container fluid
        className="main-content flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        {children}
      </Container>
    </>
  );
};

export default MainContent;