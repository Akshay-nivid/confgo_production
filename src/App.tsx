import "@/styles/main.scss";

import { createBrowserRouter } from "react-router-dom";

import Layout from "./pages/dashboard-layout";
import Coupon from "./pages/coupon";
import routes from "@/router/routes";
import Login from "@/pages/login/Login";
import AuthenticatedRoute from "./router/AuthenticatedRoute";
import Dashboard from "@/pages/dashboard";
import Events from "@/pages/events";
import CalendarRoute from "@/pages/calendar";
import Register from "@/pages/register/Register";
import CreateAccount from "./pages/register/CreateAccount";
import AddOrganization from "./pages/register/AddOrganization";
import PaymentMethod from "./pages/register/PaymentMethod";
import Home from "@/pages/home/Home";
import Pricing from "@/pages/pricing/Pricing";
import HomeLayout from "@/pages/home-layout";

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
