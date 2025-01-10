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

import UserLayout from "@/pages/Participant-User/User-Layout";
import UserLogin from "@/pages/Participant-User/User-Login";
import UserRegister from "@/pages/Participant-User/User-Register";
import UserOtp from "@/pages/Participant-User/User-Otp";
import UserSetPassword from "@/pages/Participant-User/User-Setpassword";
import UserSetpasswordSuccessful from "@/pages/Participant-User/User-Setpassword-Successful";
import ProgramSelection from "./pages/Participant-User/Program-Selection";
import SelectedPrograms from "@/pages/Participant-User/Selected-Programs";
import PaymentMethod from "@/pages/Participant-User/Payment-Method";
import RegistrationCompleted from "@/pages/Participant-User/Registration-Completed";
import PaymentHistory from "@/pages/Participant-User/User-PaymentHistory/PaymentHistory";
import DynamicUserForm from "./pages/Participant-User/Dynamic-form";
import UserEventRecap from "@/pages/Participant-User/UserEvent-Recap";
import MyEventScreen from "@/pages/Participant-User/UserEvent";
import GoogleAuthProvider from "./pages/Participant-User/GoogleAuthProvider";

import ParticipantHome from "@/pages/participant/Participant-Home";

import ViewEventDetail from "@/pages/events/view/ViewEventDetail";
import EventList from "@/pages/events/EventList";
import TemplateContainer from "@/pages/events/template";
import UserDetail from "./pages/events/view/UserDetail";

import Register from "@/pages/register/Register";
import AddPlan from "./pages/register/AddPlan";

import UserDashboardLayout from "@/pages/user-dashboard-layout";
import UserDashboard from "@/pages/user-dashboard-layout/UserDashboard";

import ProfileSettings from "./pages/dashboard/ProfileSettings";

import ForgotPassword from "@/pages/ForgotPassword/ForgotPassword";
import Thankyou from "@/pages/ThankYou/ThankYou";
import Account from "@/pages/User-Account-Settings/Account";
import PlanUpgrade from "./pages/planUpgrade/PlanUpgrade";

import ChangeVerification from "@/pages/SetPassword/ChangePasswordVerification";

import { PrivateRouteCompany, PrivateRouteReviewer, PrivateRouteSpeaker, PrivateRouteUser } from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";

import ReviewerHome from "@/pages/Reviewer/home"
import ReviewDetailsPage from "@/pages/Reviewer/details-page"


import AdminUsersList from "./pages/Admin-users";
import CreateNewUsers from "./pages/Admin-users/CreateUsers";
import VerifyUSerMailPage from "./pages/Admin-users/VerfiyUserEmail";
import SpeakerHome from "./pages/Speaker/Home";


const userRoutes = [
  {
    element: <GoogleAuthProvider />,
    children:[
      {
        path: routes.userLogin(),
        element: <UserLogin id="user-login" />,
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
    ]
  },
  {
   
    
    element: <UserLayout />,
    children: [
      {
        path: routes.programSelection(),
        element: <ProgramSelection />,
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
        <UserDashboardLayout role='USER' />
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
        element: <CalendarRoute  id="user-calendar"/>,
      },
    ],
  },
  {
    element: (
      <PrivateRouteSpeaker>
        <UserDashboardLayout role='SPEAKER' />
      </PrivateRouteSpeaker>
    ),
    children: [
      {
        path: routes.speakerHome(),
        element: <SpeakerHome />,
      },
    ]
  },
  {
    element: (
      <PrivateRouteReviewer>
        <UserDashboardLayout role='REVIEWER' />
      </PrivateRouteReviewer>
    ),
    children: [
      {
        path: routes.reviewerHome(),
        element: <ReviewerHome />,
      },
      {
        element: <ReviewDetailsPage />,
        path:routes.reviewDetails(":id"),
      },
    ]
  },
];

const router = createBrowserRouter([
  // Public routes

  {
    path: routes.register(),
    element: <Register />,
    
  },
  {
    path: routes.userForgotPassword(),
    element: <ForgotPassword />,
  },
  {
    path: routes.organisationForgotPassword(),
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
    path:routes.verifyUserEmail(),
    element:<VerifyUSerMailPage/>
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
        path:routes.users(),
        element:<AdminUsersList/>
      },
      {
        path:routes.createNewUsers(),
        element:<CreateNewUsers/>
      },
      {
        path: routes.calendar(),
        element: <CalendarRoute  id="company-calendar"/>,
      },
      {
        path: routes.userdetail(":id"),
        element: <UserDetail />,
      },
      {  
        path: routes.organizationUserProfile(),
        element: <ProfileSettings />,
      },
      {
        path: routes.planUpgradePricing(),
        element: <Pricing />,
      },
      {
        path: routes.planUpgrade(),
        element: <AddPlan />,
      },
      {
        path: routes.upgradePlanPayment(),
        element: <PlanUpgrade />,
      },
    ],
  },
  {
    path: routes.template(":id", ":entityId"),
    element: (
      <PrivateRouteCompany>
        <TemplateContainer />
      </PrivateRouteCompany>
    ),
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
    path: routes.eventExternalLink(":slug"),
    element: (
        <TemplateContainer/>
    ),
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
