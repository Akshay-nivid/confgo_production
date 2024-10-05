import "@/styles/main.scss";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Layout from "./pages/Layout";
import Coupon from "./pages/coupon";
import routes from "@/router/routes";
import Login from "@/pages/Login/Login";
import AuthenticatedRoute from "./router/AuthenticatedRoute";
import Dashboard from "@/pages/dashborad";
import Events from "@/pages/events";
import CalendarRoute from "./pages/calendar";
import Register from "./pages/Register/Register";
import CreateAccount from "./pages/Register/CreateAccount";
import AddOrganization from "./pages/Register/AddOrganization";
import PaymentMethod from "./pages/Register/PaymentMethod";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={routes.login()} element={<Login />} />
      <Route path={routes.register()} element={<Register />} />
      <Route path={routes.createAccount()} element={<CreateAccount/>}/>
      <Route path={routes.addOrganization()} element={<AddOrganization/>}/>
      <Route path={routes.paymentMehod()} element={<PaymentMethod/>}/>
      <Route element={<AuthenticatedRoute />}>
        <Route path={routes.home()} element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path={routes.events()} element={<Events />} />

          <Route path={routes.coupon()} element={<Coupon />} />

          <Route path={routes.calendar()} element={<CalendarRoute />} />
        </Route>
      </Route>
    </>
  )
);

export default router;
