import Coupon from "@/pages/coupon";

const routes = {
  home: () => "/",
  dashboard: () => "/dashboard",
  login: () => "/login",
  register: () => "/register",
  events: () => "/events",
  createEvent: () => "/event/create",
  coupon: () => "/coupon",
  createCoupon: ()=> "/coupon/create",
  CouponView:()=>"/coupon/view",
  form1: () => "/pages/form1",
  form2: () => "/pages/form2",
  calendar: () => "/calendar",
  pricing: () => "/pricing",
  feature: () => "/feature",
  contact: () => "/contact",
  demo: () => "/demo",
  LoginOrg: () => "/organization/login",
  SetPassword : () => "/setpassword",
};

export default routes;
