import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";
import AppLogoUrl from "@/assets/AppLogo.svg?url";
import routes from "@/router/routes";

const Navbar = () => {
  return (
    <Grid
      container
      position={"fixed"}
      top={"1.63rem"}
      left={"0"}
      right={"0"}
      maxHeight={"4.5rem"}
      overflow={"hidden"}
      zIndex={"1000"}
    >
      <Grid size={1}></Grid>
      <Grid size={10}>
        <Box width={"100%"}>
          <Grid container>
            <Grid size={2}>
              <img className="h-max w-max" src={AppLogoUrl} alt="AppLogo" />
            </Grid>
            <Grid
              size={10}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
              columnGap={"2.75rem"}
            >
              <Box display={"flex"} color={"white"} columnGap={"2.5rem"}>
                <Link to={routes.home()}>Home</Link>
                <Link to={routes.feature()}>Features</Link>
                <Link to={routes.pricing()}>Pricing</Link>
                <Link to={routes.demo()}>Demo </Link>
                <Link to={routes.contact()}>Contact us</Link>
              </Box>
              <div className="min-h-[50%] w-[1px] bg-white " />
              <Link className="text-white" to={routes.login()}>
                Login
              </Link>
              <Link className="text-white" to={routes.register()}>
                Signup
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid size={1}></Grid>
    </Grid>
  );
};

export default Navbar;
