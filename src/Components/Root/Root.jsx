import "./Root.css";
import { useParams, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthProvider } from 'components/AuthContext/AuthContext';
import { NavbarProvider } from 'components/NavbarContext/NavbarContext';
import { SocialCircleProvider } from "components/SocialCircles/SocialCircleContext";
import Navbar from "components/Navbar/Navbar";
import MainContent from "components/MainContent/MainContent";

export default function Root()
{
  const { verification, message } = useParams();

  return (
      <>
        <Container fluid className="root">
          <AuthProvider message={message} >
            <NavbarProvider>
              <SocialCircleProvider>
                <Navbar verification={verification} />
                <MainContent>
                  <Outlet />
                </MainContent>
              </SocialCircleProvider>
            </NavbarProvider>
          </AuthProvider>
        </Container>
      </>
    )
}
