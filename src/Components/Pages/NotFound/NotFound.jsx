import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import backgroundImage from '../../../assets/404.png';
import ImageAsset from 'components/ImageAsset';
import { useSpring, animated } from 'react-spring';
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
  return { date: date, brightness: Math.min(Math.max(brightness, minBrightness), maxBrightness) };
}

const hoursToAddOrSubtract = 0;
const minBrightness = 0.0
const maxBrightness = 1.0
const initialBrightness = calculateBrightness().brightness;
const ufoImageSize = 90

export default function NotFound() {
  const [brightness, setBrightness] = useState(initialBrightness);
  const [ufoSpeed, setUfoSpeed] = useState(8000);
  const [ufoPosition, setUfoPosition] = useState({ x: window.innerWidth + ufoImageSize, y: ufoImageSize });
  const [pageOpacity, setPageOpacity] = useState(100);
  const [beamWidth, setBeamWidth] = useState(10);
  const [beamHeight, setBeamHeight] = useState(0);

  const ufoProps = useSpring({
    position: 'absolute',
    top: ufoPosition.y,
    left: ufoPosition.x,
    zIndex: 100,
    config: {
      duration: ufoSpeed
    }
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      let cb = calculateBrightness();
      setBrightness(cb.brightness);
      if(cb.date === (new Date()).setHours(0, 0, 0, 0)) {
        beginUfoAnimation();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const beginUfoAnimation = () => {
    setBeamHeight(0);
    flyUfo();
    setTimeout(_ => {
      setBeamWidth(10);
      setBeamHeight(100);
      setTimeout(_ => {
        setPageOpacity(0);
      }, 3000);
    }, 10000);
  }
  
  const flyUfo = () => {
    setUfoPosition({ x: window.innerWidth / 2 - 50, y: ufoImageSize });
    setTimeout(_ => {
      setUfoSpeed(3500);
      setUfoPosition({ x: -ufoImageSize, y: ufoImageSize })
    }, 14500);
  };

  const rootContainerStyle = {
    minWidth: '100vw',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  
  const mainContainerStyle = {
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
    right: 0,
    opacity: `${pageOpacity}%`,
    transition: 'opacity 2.5s ease-in-out'
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
    zIndex: 0,
    opacity: `${pageOpacity}%`,
    transition: 'opacity 5s ease-in-out'
  };

  const innermostContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
    opacity: `${pageOpacity}%`,
    transition: 'opacity 1.5s ease-in-out'
  };

  const beamDivStyle = {
    position: 'absolute',
    top: 0,
    left: ufoPosition.x - ufoImageSize / 2,
    width: `${beamWidth}%`,
    height: `${beamHeight}%`,
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(0, 0, 0, 0) 100%)',
    zIndex: 99,
    opacity: `${pageOpacity}%`,
    transition: 'height 2s ease-in-out, width 1.5s ease-out, opacity 14s ease-out'
  }

  return (
    <Container className="d-flex align-items-center justify-content-center m-0 p-0" style={rootContainerStyle}>
      <animated.img
        src="/src/assets/ufo.gif"
        alt="UFO"
        style={ufoProps}/>
      <div className=""
        style={beamDivStyle}
      />

      <Container className="d-flex align-items-center justify-content-center m-0 p-0" style={mainContainerStyle}>
        <Container className="m-0 p-0" style={innerContainerStyle}>
          <Container className="text-center p-0" style={innermostContainerStyle}>
            <h1 className="display-1" style={{color: 'red', textShadow: "2px 3px 4px #0e92c2, 0 0 1em #FF65F2, 0 0 0.2em rgba(88, 60, 60, 0.588)"}}>404</h1>
            <hr/>
            <h2 className="display-4">Oops! Page not found</h2>
            <hr/>
            <p className="lead">The page you are looking for might have been removed or is<br/>temporarily unavailable or was probably eaten by a dog.</p>
            <div style={{fontFamily: 'Times New Roman', fontSize: "8pt"}}><p>All your page are belong to us: {(brightness * 100).toFixed(2)}%</p></div>
            <Button onClick={beginUfoAnimation}>Fly</Button>
          </Container>
          <div className="tumbleweed" style={{
            position: 'absolute',
            bottom: '5%',
          }}>
            <ImageAsset className="asset-tumbleweed" />
          </div>
        </Container>
      </Container>
    </Container>
  );
};