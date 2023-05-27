import { useParams, Outlet } from "react-router-dom";
import { AuthProvider } from 'components/AuthContext/AuthContext';
import Navbar from "components/Navbar/Navbar";
import { SocialCircleProvider } from "components/SocialCircles/SocialCircleContext";

export default function Root()
{
  const { verification, message } = useParams();

  return (
      <>
        <div className="d-flex flex-column min-vh-100 min-vw-100 border-bottom border-primary">
          <AuthProvider message={message} >
            <SocialCircleProvider>
              <Navbar verification={verification} />
              <Outlet />
            </SocialCircleProvider>
          </AuthProvider>
        </div>
      </>
    )
}
