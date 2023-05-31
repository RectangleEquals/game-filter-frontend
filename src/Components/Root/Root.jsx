import "./Root.css";
import { useParams, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { UtilityProvider } from 'components/UtilityContext/UtilityContext';
import { AuthProvider } from 'components/AuthContext/AuthContext';
import { NavbarProvider } from 'components/NavbarContext/NavbarContext';
import { SocialCircleProvider } from "components/SocialCircles/SocialCircleContext";
import { Navbar } from 'components/Navbar/Navbar';
import { NavbarUnderlay } from 'components/Navbar/NavbarUnderlay';
import { MainContent } from 'components/MainContent/MainContent';
export default function Root()
{
  const { verification, message } = useParams();

  return (
    <>
      <Container fluid className="content-root">
        <UtilityProvider>
          <AuthProvider message={message} >
            <NavbarProvider>
              <SocialCircleProvider>
                <Navbar verification={verification} />
                <NavbarUnderlay />
                <MainContent>
                  <Outlet />
                </MainContent>
              </SocialCircleProvider>
            </NavbarProvider>
          </AuthProvider>
        </UtilityProvider>
      </Container>
    </>
  )
}
