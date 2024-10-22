

const routes = {
  home: () => "/",
  dashboard: () => "/dashboard",
  login: () => "/login",
  register: () => "/register",
  events: () => "/events",
  createEvent: () => "/event/create",
  template: () => "/template",
  coupon: () => "/coupon",
  createCoupon: ()=> "/coupon/create",
  CouponView: (id:string|number) => `/coupon/${id}`,
  form1: () => "/pages/form1",
  form2: () => "/pages/form2",
  calendar: () => "/calendar",
  pricing: () => "/pricing",
  feature: () => "/feature",
  contact: () => "/contact",
  demo: () => "/demo",
  LoginOrg: () => "/organization/login",
  SetPassword : () => "/setpassword",
  verifyEmail : () => `/verify-email/:token/:id`,
  user: () => "/user",
  userLogin: () => "/user/login",
  userRegister: () => "/user/register",
  userOtp: () => "/user/otp",
  userSetPassword: () => "/user/setpassword",
  userSetPasswordSuccessful: () => "/user/setpassword-successful",
  programSelection: () => "/user/programs",
};

export default routes;
