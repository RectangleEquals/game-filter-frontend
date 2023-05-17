import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, useParams } from "react-router-dom";
import Root from 'components/Root/Root';
import Home from 'components/Pages/Home/Home';
import NotFound from 'components/Pages/NotFound/NotFound';

function App()
{
  const { verification } = useParams();

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={
      <>
        <Root verification={verification} />
      </>
    }>
      <Route index path="/" element={<Home />} errorElement={<p>Something went wrong</p>} />
      <Route path="verify/:verification" element={<Home />}/>
      <Route path="*" element={<NotFound />}/>
    </Route>
  ));

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;