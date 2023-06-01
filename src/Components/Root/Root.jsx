import "./Root.css";
import { useParams, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { UtilityProvider } from 'contexts/UtilityContext';
import { AuthProvider } from 'contexts/AuthContext';
import { UserProvider } from 'contexts/UserContext';
import { NavbarProvider } from 'contexts/NavbarContext';
import { SocialCircleProvider } from "contexts/SocialCircleContext";
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
            <UserProvider>
              <NavbarProvider>
                <SocialCircleProvider>
                  <Navbar verification={verification} />
                  <NavbarUnderlay />
                  <MainContent>
                    <Outlet />
                  </MainContent>
                </SocialCircleProvider>
              </NavbarProvider>
            </UserProvider>
          </AuthProvider>
        </UtilityProvider>
      </Container>
    </>
  )
}
