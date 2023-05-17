import Footer from "components/Footer/Footer";
import ImageAsset from 'components/ImageAsset';
import './Home.css';

function Home()
{
  return (
    <>
      {/* Main Content */}
      <main id="main-content" name="main-content" className="main-content min-vw-100 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        {/* Background Logo */}
        <ImageAsset className="asset-main-logo img-main-logo img-vh-100 img-vw-100"/>

        {/* Main Body */}
        <h1 className="text-center main-content-large-text">Welcome to Game Filter!</h1>
        <p className="text-center main-content-small-text">
          Currently under maintenance. We are working hard to get things up and running, so stay tuned!
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Home;