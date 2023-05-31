import './MainContent.css';
import { Container } from 'react-bootstrap';

export function MainContent({ children }) {
  return (
    <Container fluid
      className="main-content align-items-center justify-content-center">
        {children}
    </Container>
  );
};

export default MainContent;