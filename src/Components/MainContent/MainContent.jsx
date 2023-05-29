import useNavbarContext from 'components/NavbarContext/NavbarContext';
import { Container } from 'react-bootstrap';
import { Transition } from 'react-transition-group';

const MainContent = ({ children }) => {
  const navbarContext = useNavbarContext();

  return (
    <>
      <Transition
        in={navbarContext.isCollapsed}
        timeout={0.1}
        appear>

        {state => (
          <>
            {/* Dummy header which sits behind navbar, copying it's height */}
            <Container fluid className="main-content-head" style={{
              top: '0px',
              height: state === 'entered' ? navbarContext.navbarOffsetHeight : navbarContext.navbarHeight,
              transition: state !== 'entered' ? "height 150ms ease-in-out" : "height 50ms ease-out"
            }}/>
            
            {/* Main content which sits directly below the dummy header, giving
            the illusion that it's "connected" to the bottom of the navbar */}
            <Container fluid className="main-content d-flex flex-grow-1 min-vw-100 max-vw-100 vw-100 w-100 h-100 flex-column justify-content-center align-items-center"
              style={{
                top: state === 'entered' ? navbarContext.navbarOffsetHeight : navbarContext.navbarHeight,
                transition: state !== 'entered' ? "top 150ms ease-in-out" : "top 50ms ease-out"
              }}>
              {children}
            </Container>
          </>
        )}
        
      </Transition>
    </>
  );
};

export default MainContent;