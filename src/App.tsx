import "@/styles/main.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/router/routes";
import Dashboard from "@/pages/dashboard";
import Events from "@/pages/events";
import CalendarRoute from "@/pages/calendar";
import Home from "@/pages/home";
import Pricing from "@/pages/pricing";
import HomeLayout from "@/pages/home-layout";
import CreateCoupon from "@/pages/coupon/CreateCoupon";
import LoginOrg from "@/pages/LoginOrg/loginOrg";
import SetPassword from "@/pages/SetPassword/SetPassword";
import VerifyMailPage from "@/pages/register/VerifyMailPage";
import { SnackBarView } from "@/components/SnackBarView";
import Layout from "@/pages/dashboard-layout";
import Coupon from "@/pages/coupon";
import useStore from "@/Libs/store";
import CouponView from "@/pages/coupon/CouponView";
import Contact from "@/pages/contact/contact";

import UserLayout from "@/pages/User/User-Layout";
import UserLogin from "@/pages/User/User-Login";
import UserRegister from "@/pages/User/User-Register";
import UserOtp from "@/pages/User/User-Otp";
import UserSetPassword from "@/pages/User/User-Setpassword";
import UserSetpasswordSuccessful from "@/pages/User/User-Setpassword-Successful";
import Register from "@/pages/register/Register";
import ParticipantHome from "@/pages/participant/Participant-Home";
import ProgramSelection from "@/pages/User/Program-Selection";
import SelectedPrograms from "@/pages/User/Selected-Programs";
import PaymentMethod from "@/pages/User/Payment-Method";
import RegistrationCompleted from "@/pages/User/Registration-Completed";
import ViewEventDetail from "@/pages/events/view/ViewEventDetail";
import EventList from "@/pages/events/EventList";
import UserDashboardLayout from "@/pages/user-dashboard-layout";
import UserDashboard from "@/pages/user-dashboard-layout/UserDashboard";
import PaymentHistory from "@/pages/User/User-PaymentHistory/PaymentHistory";
import DynamicUserForm from "@/pages/User/DynamicUserForm";
import ForgotPassword from "@/pages/ForgotPassword/ForgotPassword";
import Thankyou from "@/pages/ThankYou/ThankYou";
import MyEventScreen from "@/pages/User/UserEvent";
import Account from "@/pages/User-Account-Settings/Account";
import UserEventRecap from "@/pages/User/UserEvent-Recap";
import ChangeVerification from "@/pages/SetPassword/ChangePasswordVerification";
import TemplateContainer from "@/pages/events/template/TemplateContainer";

import { PrivateRouteCompany, PrivateRouteUser } from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";

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
        element: <UserLogin  />,
      },
      {
        path: routes.userRegister(),
        element: <UserRegister/>,
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
        element: <UserSetpasswordSuccessful  />,
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
        element: <RegistrationCompleted  />,
      },
      {
        path: routes.dynamicUserForm(),
        element: <DynamicUserForm />,
      },
    ],
  },
  {
    element: (
      <PrivateRouteUser>
        <UserDashboardLayout />
      </PrivateRouteUser>
    ),
    children: [
      {
        path: routes.userHome(),
        element: <UserDashboard />,
      },
      {
        path: routes.paymentHistory(),
        element: <PaymentHistory />,
      },
      {
        path: routes.userMyEvents(),
        element: <MyEventScreen />,
      },
      {
        path: routes.userEventRecap(),
        element: <UserEventRecap  />,
      },
      {
        path: routes.accountsettings(),
        element: <Account/>,
      },
      {
        path: routes.userCalendar(),
        element: <CalendarRoute  />,
      },
    ],
  },
];

const router = createBrowserRouter([
  // Public routes
  {
    path: routes.register(),
    element: <Register />,
  },
  {
    path: routes.forgotPassword(),
    element: <ForgotPassword />,
  },
  {
    path: routes.thankyou(),
    element: <Thankyou  />,
  },
  {
    path: routes.verifyEmail(),
    element: <VerifyMailPage  />,
  },
  {
    path: routes.verfiyForgotEmail(),
    element: <ChangeVerification  />,
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
        element: <Pricing/>,
      },
      {
        path: routes.contact(),
        element: <Contact />,
      },
    ],
  },
  // Company private routes
  {
    element: (
      <PrivateRouteCompany>
        <Layout />
      </PrivateRouteCompany>
    ),
    children: [
      {
        path: routes.dashboard(),
        element: <Dashboard  />,
      },
      {
        path: routes.createEvent(),
        element: <Events  />,
      },
      {
        path: routes.events(),
        element: <EventList  />,
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
        element: <CreateCoupon  />,
      },
      {
        path: routes.CouponView(":id"),
        element: <CouponView/>,
      },
      {
        path: routes.calendar(),
        element: <CalendarRoute  />,
      },
    ],
  },
  {
    path: routes.loginOrg(),
    element: (
      <PublicRoute>
        <LoginOrg />
      </PublicRoute>
    ),
  },
  {
    path: routes.template(),
    element: <TemplateContainer  />,
  },
  {
    path: routes.SetPassword(),
    element: <SetPassword  />,
  },
  // User-specific routes
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
