import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/Login';

import Home from './components/Home';
import Profile from './components/Profile';
import MainLayout from './components/MainLayout';
import Notification from './components/Notification';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element:<Home/>
      },
      {
        path: '/profile/:id',
        element:<Profile  />
      }
    ]
  },
  {
    path: "/signup",
    element:<Signup/>
  },
  {
    path: '/login',
    element:<Login/>
  },
  {
    path: '/notification',
    element:<Notification/>
  }
])

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
      
    </>
  );
}



export default App
