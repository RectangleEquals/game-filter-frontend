import './Home.css';
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Footer from "components/Footer/Footer";
import ImageAsset from "components/ImageAsset";
import useAuthContext from "components/AuthContext/AuthContext";
import Settings from "components/Pages/Settings/Settings";

export default function Home({page})
{
  const authContext = useAuthContext();
  const [showButton, setShowButton] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(_ => {
    if(page === "settings") {
      if(authContext.message) {
      }
      setShowSettings(true);
    }
  }, []);

  useEffect(() => {
    if (authContext.debugMode) {
      authContext.setMaintenanceMode(false);
      setShowButton(true);
    }
  }, [authContext.debugMode]);

  const handleButtonClick = () => {
    setShowButton(false);
    setShowSettings(true);
  };

  return (
    <>
      {/* Main Content */}
      <main id="main-content" name="main-content" className="main-content min-vw-100 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        {/* Background Logo */}
        <ImageAsset className="asset-main-logo img-main-logo img-vh-100 img-vw-100"/>

        {/* Main Body */}
        <h1 className="text-center main-content-large-text" style={{userSelect: 'none'}}>Welcome to Game Filter!</h1>

        {authContext && (authContext.debugMode || (authContext.isLoggedIn && !authContext.maintenanceMode)) ? (
          showButton &&
          <Button variant="success" onClick={handleButtonClick}>Let's get started!</Button>
        ) : (
          !showSettings &&
          <p className="text-center main-content-small-text" style={{userSelect: 'none'}}>
            Currently under maintenance. We are working hard to get things up and running, so stay tuned!
          </p>
        )}

        {authContext.debugMode && showSettings && <Settings />}
      </main>

      <Footer />
    </>
  );
}
