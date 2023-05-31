import './MainContent.css';
import { Container } from 'react-bootstrap';
import Footer from "components/Footer/Footer";

export function MainContent({ children }) {
  return (
    <Container fluid
      className="main-content align-items-center justify-content-center">
        {children}
        <Footer />
    </Container>
  );
};

export default MainContent;