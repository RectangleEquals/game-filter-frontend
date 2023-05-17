import { useParams, Outlet } from "react-router-dom";
import { AuthProvider } from 'components/AuthContext/AuthContext';
import Navbar from "components/Navbar/Navbar";

export default function Root()
{
  const { verification } = useParams();

  return (
      <>
        <div className="d-flex flex-column min-vh-100 min-vw-100 border-bottom border-primary">
          <AuthProvider>
            <Navbar verification={verification} />
            <Outlet />
          </AuthProvider>
        </div>
      </>
    )
}
