import "./Root.css";
import { useParams, Outlet } from "react-router-dom";
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
        <div className="root d-flex flex-column min-vh-100 min-vw-100 border-bottom border-primary">
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
        </div>
      </>
    )
}
