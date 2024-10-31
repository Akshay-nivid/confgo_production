import "@/styles/main.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/router/routes";
import AuthenticatedRoute from "./router/AuthenticatedRoute";
import Dashboard from "@/pages/dashboard";
import Events from "@/pages/events";
import CalendarRoute from "@/pages/calendar";
import Home from "./pages/home";
import Pricing from "./pages/pricing";
import HomeLayout from "./pages/home-layout";
import Login from "./pages/Login/Login";
import CreateCoupon from "./pages/coupon/CreateCoupon";
import LoginOrg from "@/pages/LoginOrg/loginOrg";
import SetPassword from "@/pages/SetPassword/SetPassword";
import VerifyMailPage from "./pages/register/VerifyMailPage";
import { SnackBarView } from "./components/SnackBarView";
import Layout from "./pages/dashboard-layout";
import Coupon from "./pages/coupon";
import useStore from "./Libs/store";
import CouponView from "./pages/coupon/CouponView";
import Contact from "./pages/contact/contact";
import "@/styles/main.scss";

import UserLayout from "./pages/User/User-Layout";
import UserLogin from "./pages/User/User-Login";
import UserRegister from "./pages/User/User-Register";
import UserOtp from "./pages/User/User-Otp";
import UserSetPassword from "./pages/User/User-Setpassword";
import UserSetpasswordSuccessful from "./pages/User/User-Setpassword-Successful";
import Register from "./pages/register/Register";
import ParticipantHome from "./pages/participant/Participant-Home";
import ProgramSelection from "./pages/User/Program-Selection";
import SelectedPrograms from "./pages/User/Selected-Programs";
import PaymentMethod from "./pages/User/Payment-Method";
import RegistrationCompleted from "./pages/User/Registration-Completed";
import FormBuilder from "./components/FormBuilder/FormBuilder";
import ViewEventDetail from "./pages/events/view/ViewEventDetail";
import CreateEvent from "./pages/events/CreateEvent";
import EventList from "./pages/events/EventList";
import DynamicUserForm from "./pages/User/DynamicUserForm";

/**
 * Create your router configuration
 */
const userRoutes = [
  {
    element: <UserLayout />,
    children: [
      {
        path: routes.programSelection(),
        element: <ProgramSelection />,
      },
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
      {
        path: routes.selectedPrograms(),
        element: <SelectedPrograms />,
      },
      {
        path: routes.userPaymentMethod(),
        element: <PaymentMethod />,
      },
      {
        path: routes.userEventRegistrationCompleted(),
        element: <RegistrationCompleted />,
      },
      {
        path: routes.dynamicUserForm(),
        element: <DynamicUserForm />,
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
        path: routes.formBuilder(),
        element: <FormBuilder />,
      },
      {
        element: <Layout />,
        children: [
          {
            path: routes.dashboard(),
            element: <Dashboard />,
          },
          {
            path: routes.createEvent(),
            element: <Events />,
          },
          {
            path: routes.events(),
            element: <EventList />,
          },
          {
            path: routes.viewEvent(":id"),
            element: <ViewEventDetail />,
          },
          {
            path: routes.coupon(),
            element: <Coupon />,
          },
          {
            path: routes.createCoupon(),
            element: <CreateCoupon />,
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
  const snackBarInfo = useStore(
    (state: any) => state.compData?.["snackBarInfo"]
  );

  return (
    <>
      {snackBarInfo?.open && (
        <SnackBarView
          open={snackBarInfo.open}
          autoHideDuration={snackBarInfo.autoHideDuration}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          severity={snackBarInfo.severity}
          text={snackBarInfo.message}
        />
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
