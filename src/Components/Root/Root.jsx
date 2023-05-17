import { Outlet } from "react-router-dom";
import Navbar from "components/Navbar/Navbar";

export default function Root({verification}) {
    return (
      <>
        <div className="d-flex flex-column min-vh-100 min-vw-100 border-bottom border-primary">
          <Navbar verification={verification} />
          <Outlet />
        </div>
      </>
    )
}
