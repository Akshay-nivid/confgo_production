import '@/styles/main.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from '@/router/routes';
import AuthenticatedRoute from './router/AuthenticatedRoute';
import Dashboard from '@/pages/dashboard';
import Events from '@/pages/events';
import CalendarRoute from '@/pages/calendar';
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import HomeLayout from '@/pages/Home-Layout';
import Login from './pages/Login/Login';
import CreateCoupon from './pages/coupon/CreateCoupon';
import LoginOrg from '@/pages/LoginOrg/loginOrg';
import SetPassword from '@/pages/SetPassword/SetPassword';
import VerifyMailPage from './pages/register/VerifyMailPage';
import { SnackBarView } from './components/SnackBarView';
import Layout from './pages/dashboard-layout';
import Coupon from './pages/coupon';
import useStore from './Libs/store';
import CouponView from './pages/coupon/CouponView';
import Contact from './pages/contact/contact';






import UserLayout from './pages/User/User-Layout';
import UserLogin from './pages/User/User-Login';
import UserRegister from './pages/User/User-Register';
import UserOtp from './pages/User/User-Otp';
import UserSetPassword from './pages/User/User-Setpassword';
import UserSetpasswordSuccessful from './pages/User/User-Setpassword-Successful';
import Register from './pages/register/Register';
import ParticipantHome from './pages/participant/Participant-Home';


/**
 * Create your router configuration
 */ 
const userRoutes = [
  {
    element: <UserLayout />,
    children: [
      {
        path: routes.userLogin(),
        element: <UserLogin id="participant-userLogin" />,
      },
      {
        path: routes.userRegister(),
        element: <UserRegister />,
      },
      {
        path: routes.userOtp(),
        element: <UserOtp />,
      },
      {
        path: routes.userSetPassword(),
        element: <UserSetPassword />,
      },
      {
        path: routes.userSetPasswordSuccessful(),
        element: <UserSetpasswordSuccessful />,
      },
     
    ],
  },
];



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
      {
        path: routes.contact(),
        element: <Contact />,
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
            path: routes.createCoupon(),
            element: <CreateCoupon/>,
          },
          {
            path: routes.CouponView(":id"), // Add dynamic id parameter here
            element: <CouponView />,
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
  ...userRoutes,
  {
    path: routes.participantHome(),
    element: <ParticipantHome />,
  },
]);

function App() {
  const snackBarInfo = useStore((state: any) => state.compData?.["snackBarInfo"]);

  return (
    <>
      {snackBarInfo?.open && (
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
