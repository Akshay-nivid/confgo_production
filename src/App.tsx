import '@/styles/main.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState } from 'react';
 // Import your SnackBarView component
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
import VerifyMailPage from './pages/register/VerifyMailPage';
import { SnackBarView } from './components/SnackBarView';
import Layout from './pages/dashboard-layout';
import Coupon from './pages/coupon';
import useStore from './Libs/store';

// Define the SnackBarInfo type
type SnackBarInfo = {
  open: boolean;
  autoHideDuration: number;
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
};

// Create your router configuration
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
    path: routes.verifyEmail(),
    element: <VerifyMailPage />,
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

// Create an App component to wrap everything
function App() {
  const snackBarInfo = useStore((state: any) => state.compData?.["snackBarInfo"]);
console.log(snackBarInfo,'snackBarInfo')

  return (
    <>
      {snackBarInfo && (
        <SnackBarView
          open={snackBarInfo.open}
          autoHideDuration={snackBarInfo.autoHideDuration}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          severity={snackBarInfo.severity}
          text={snackBarInfo.message}
        />
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
