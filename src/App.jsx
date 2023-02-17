import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import VideoBg from "reactjs-videobg";
import FilterBgPoster from "/images/filtering.png";
import FilterBgVideo from "/videos/filtering.webm";
import { Container } from 'react-bootstrap';
import SearchForm from './SearchForm';

// NOTE:
//  All icons can be found via https://react-icons.github.io/react-icons

// TODO: Setup SASS and research theme colors
//  from https://getbootstrap.com/docs/5.0/customize/color/#theme-colors

function App() {
  return (
    <div className="App">
      <main>
        <VideoBg poster={FilterBgPoster}>
          <VideoBg.Source src={FilterBgVideo} type="video/webm" />
        </VideoBg>

        <Container className='shadow-lg d-flex flex-column rounded me-4 p-4 pb-0 searchform'>
          <SearchForm />
        </Container>
      </main>
    </div>
  )
}

export default App;