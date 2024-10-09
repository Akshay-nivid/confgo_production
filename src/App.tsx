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
import Register from './pages/Register/Register';
import CreateAccount from './pages/Register/CreateAccount';
import AddOrganization from './pages/Register/AddOrganization';
import PaymentMethod from './pages/Register/PaymentMethod';

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
    path: routes.createAccount(),
    element: <CreateAccount />,
  },
  {
    path: routes.addOrganization(),
    element: <AddOrganization />,
  },
  {
    path: routes.paymentMehod(),
    element: <PaymentMethod />,
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
]);

export default router;
