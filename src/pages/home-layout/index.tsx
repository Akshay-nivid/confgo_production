import { useEffect } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./_style.scss";

/**
 * home layout component
 *
 */
const HomeLayout = () => {
  /**
   * scroll to top of the window on initial loading of the page
   */
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [location.pathname]);

  return (
    <>
      {/* <Navbar /> */}
      <Outlet />
      <Footer />
    </>
  );
};

export default HomeLayout;
