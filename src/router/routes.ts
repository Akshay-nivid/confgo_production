const routes = {
  home: () => "/",
  dashboard: () => "/dashboard",
  login: () => "/login",
  register: () => "/register",
  createAccount: () => "/register/account",
  addOrganization: () => "/register/account/organization",
  paymentMehod: () => "register/account/organization/payment",
  events: () => "/events",
  createEvent: () => "/event/create",
  coupon: () => "/coupon",
  createCoupon: ()=> "/coupon/create",
  form1: () => "/pages/form1",
  form2: () => "/pages/form2",
  calendar: () => "/calendar",
  pricing: () => "/pricing",
  feature: () => "/feature",
  contact: () => "/contact",
  demo: () => "/demo",
};

export default routes;
