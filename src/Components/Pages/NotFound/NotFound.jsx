import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import backgroundImage from '../../../assets/404.png';
import ImageAsset from 'components/ImageAsset';
import './NotFound.css'

const calculateBrightness = () => {
  const date = new Date((new Date()).getTime() + hoursToAddOrSubtract * 60 * 60 * 1000);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const totalSeconds = (hour * 3600) + (minute * 60) + second;
  const maxSeconds = 24 * 3600; // 24 hours in seconds

  // Calculate the brightness multiplier based on the time of day
  let brightnessMultiplier = (hour >= 21 && hour < 3) ? 0.5 : 1;

  // Calculate the brightness value based on the time of day and brightness multiplier
  const brightness = Math.abs(totalSeconds - (maxSeconds / 2)) / (maxSeconds / 2) * brightnessMultiplier;
  return Math.min(Math.max(brightness, minBrightness), maxBrightness);
}

const hoursToAddOrSubtract = 0;
const minBrightness = 0.0
const maxBrightness = 1.0
const initialBrightness = calculateBrightness();

export default function NotFound() {
  const [brightness, setBrightness] = useState(initialBrightness);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBrightness(calculateBrightness());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const rootContainerStyle = {
    minWidth: '100vw',
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    fontFamily: "'Bruno Ace SC', cursive",
    textShadow: "1px 3px 4px #0e92c2, 0 0 1em #5865F2, 0 0 0.2em rgba(88, 101, 242, 0.588)",
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };

  const gradientColor = `radial-gradient(ellipse at center, rgba(${brightness * 255}, ${brightness * 255}, ${brightness * 255}, 0) 0%, rgba(${(1 - brightness) * 255}, ${(1 - brightness) * 255}, ${(1 - brightness) * 255}, ${brightness}) 95%)`;

  const innerContainerStyle = {
    minWidth: '100vw',
    background: gradientColor,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0
  };

  const innermostContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000
  };

  return (
    <Container className="d-flex align-items-center justify-content-center m-0 p-0" style={rootContainerStyle}>
      <Container className='m-0 p-0' style={innerContainerStyle}>
        <Container className="text-center p-0" style={innermostContainerStyle}>
          <h1 className="display-1" style={{color: 'red', textShadow: "2px 3px 4px #0e92c2, 0 0 1em #FF65F2, 0 0 0.2em rgba(88, 60, 60, 0.588)"}}>404</h1>
          <hr/>
          <h2 className="display-4">Oops! Page not found</h2>
          <hr/>
          <p className="lead">The page you are looking for might have been removed or is<br/>temporarily unavailable or was probably eaten by a dog.</p>
          <div style={{fontFamily: 'Times New Roman', fontSize: "8pt"}}><p>All your page are belong to us: {((1.0 - brightness) * 100).toFixed(2)}%</p></div>
        </Container>
        <div className='tumbleweed' style={{
          position: 'absolute',
          bottom: '5%',
        }}>
          <ImageAsset className="asset-tumbleweed" />
        </div>
      </Container>
    </Container>
  );
};