import '@/styles/main.scss';

import { createBrowserRouter } from 'react-router-dom';

import Layout from './pages/dashboard-layout';
import Coupon from './pages/coupon';
import routes from '@/router/routes';
import AuthenticatedRoute from './router/AuthenticatedRoute';
import Dashboard from '@/pages/dashboard';
import Events from '@/pages/events';
import CalendarRoute from '@/pages/calendar';
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import HomeLayout from '@/pages/Home-Layout';
import Login from './pages/Login/Login';
import Register from './pages/register/Register';
import LoginOrg from '@/pages/LoginOrg/loginOrg';
import SetPassword from '@/pages/SetPassword/SetPassword';







const router = createBrowserRouter([
  {
    path: routes.login(),
    element: <Login />,
  },
  {
    path: routes.register(),
    element: <Register />,
  },
  {
    element: <HomeLayout />,
    children: [
      {
        path: routes.home(),
        element: <Home />,
      },
      {
        path: routes.pricing(),
        element: <Pricing />,
      },
    ],
  },
  {
    element: <AuthenticatedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: routes.dashboard(),
            element: <Dashboard />,
          },
          {
            path: routes.events(),
            element: <Events />,
          },
          {
            path: routes.coupon(),
            element: <Coupon />,
          },
          {
            path: routes.calendar(),
            element: <CalendarRoute />,
          },
        ],
      },
    ],
  },
  {
    path: routes.LoginOrg(),
    element: <LoginOrg />,
  },
  {
    path: routes.SetPassword(),
    element: <SetPassword />,
  },
]);

export default router;
