import 'bootstrap/dist/css/bootstrap.css';
//import './App.css';

import { useState } from "react";
import { Container } from 'react-bootstrap';
import VideoBg from "reactjs-videobg";
import FilterBgPoster from "/images/filtering.png";
import FilterBgVideo from "/videos/filtering.webm";

import SearchForm from 'components/SearchForm/SearchForm';
import DragDropList from 'components/DndContainer/DragDropList';
import ErrorBoundary from 'components/ErrorBoundary'

import Home from 'components/Pages/Home/Home';
//import Navbar from 'components/Pages/Navbar/Navbar';
import NotFound from 'components/Pages/NotFound/NotFound';
import About from 'components/Pages/About/About';
import GameDetails from 'components/Pages/GameDetails/GameDetails';
import AddGame from 'components/Pages/AddGame/AddGame';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// NOTE:
//  All icons can be found via https://react-icons.github.io/react-icons

// TODO: Setup SASS and research theme colors
//  from https://getbootstrap.com/docs/5.0/customize/color/#theme-colors

function App(props) {
  return (
    <div className='App'>
      {/* <VideoBg poster={FilterBgPoster}>
        <VideoBg.Source src={FilterBgVideo} type="video/webm" />
      </VideoBg> */}

      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Home/>
      </ErrorBoundary>

      {/* <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/game/add/:gameId" element={<AddGame />} />
          <Route exact path="/game/:gameId" element={<GameDetails />} />
          <Route exact path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router> */}


      {/* <Container className='shadow-lg d-flex flex-column rounded m-0 p-3 searchform'>
        <DragDropList rowCount="4"/>
      </Container> */}
    </div>
  )
}

export default App;
