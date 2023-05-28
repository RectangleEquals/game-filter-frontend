import useAuthContext from 'components/AuthContext/AuthContext';
import useNavbarContext from 'components/NavbarContext/NavbarContext';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

const MainContent = ({ children, initialMarginTop }) => {
  const authContext = useAuthContext();
  const navbarContext = useNavbarContext();
  const [marginTop, setMarginTop] = useState(initialMarginTop || 65.5);

  useEffect(_ => {
    setMarginTop(navbarContext.navbarHeight);
  }, [navbarContext.navbarHeight]);

  useEffect(_ => {
    authContext.logWarning(`[MainContent] > marginTop: ${marginTop}`);
  }, [marginTop]);

  return (
    <Container fluid className="main-content flex-grow-1 d-flex flex-column justify-content-center align-items-center" style={{marginTop: marginTop}}>
      {children}
    </Container>
  );
};

export default MainContent;