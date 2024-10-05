const routes = {
  home: () => "/",
  login: () => "/login",
  register: () => "/register",
  createAccount:()=>"register/account",
  addOrganization:()=>"register/account/organization",
  paymentMehod:()=>"register/account/organization/payment",
  events: () => "/events",
  coupon: () => "/coupon",
  form1: () => "/pages/form1",
  form2: () => "/pages/form2",
  calendar: () => "/calendar",
};

export default routes;
