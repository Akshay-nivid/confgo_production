import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";
import AppLogo from "@/assets/AppLogo.svg?url";
import routes from "@/router/routes";

const Footer = () => {
  return (
    <Grid container bgcolor={"black"} paddingBlock={"3.33rem"}>
      <Grid size={1}></Grid>
      <Grid size={10}>
        <Box className="w-full">
          <Grid container>
            <Grid size={8}>
              <Typography
                color="white"
                marginBottom={"1rem"}
                className="text-h1 font-500"
              >
                Do you have <br /> any questions?
              </Typography>
              <Typography
                color="white"
                className="text-h6"
                marginBottom={"3.33rem"}
              >
                Feel free to send us your questions or request a free
                consultation.
              </Typography>
              <Button variant="contained"> Send a messaage</Button>
            </Grid>
            {/* <Grid size={4} display={"flex"} alignItems={"center"}>
              <Typography color="white" className="text-p1">
                Complete Conference Management at Your Fingertips
              </Typography>
            </Grid> */}
          </Grid>
        </Box>
      </Grid>
      <Grid size={1}></Grid>
      <Grid size={12}>
        <Box width={"100%"} marginTop={"8rem"}>
          <Grid container>
            <Grid size={1}></Grid>
            <Grid size={10}>
              <Box className={"w-full"}>
                <Grid container>
                  <Grid size={8}>
                    <Box marginBottom={"4rem"}>
                      <ul>
                        <li className="space-x-[2.66rem]">
                          <Link className="text-white" to={routes.home()}>
                            Home
                          </Link>
                          <Link className="text-white" to={routes.feature()}>
                            Feature
                          </Link>
                          <Link className="text-white" to={routes.pricing()}>
                            Pricing
                          </Link>
                          <Link className="text-white" to={routes.demo()}>
                            Demo
                          </Link>
                          <Link className="text-white" to={routes.contact()}>
                            Contacts
                          </Link>
                        </li>
                      </ul>
                    </Box>
                    <Box width={"100%"}>
                      <Grid container>
                        <Grid size={4}>
                          <Box marginBottom={"5.33rem"}>
                            <Typography variant="body2" color="white">
                              CALL US
                            </Typography>
                            <Typography color="white">0497 2701371</Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="white">
                              EMAIL US
                            </Typography>
                            <Typography color="white">
                              support@confgo.co
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={8}>
                          <Box>
                            <Typography variant="body2" color="white">
                              VISIT US
                            </Typography>
                            <Typography color="white">
                              Torch Club 18 Waverly Pl, <br /> New York, NY
                              10003, USA
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid
                    size={4}
                    display={"flex"}
                    alignItems={"flex-end"}
                    justifyContent={"flex-end"}
                    flexDirection={"column"}
                  >
                    <img
                      className="h-max w-max mb-[3.91rem]"
                      src={AppLogo}
                      alt=""
                    />

                    <Typography
                      color="white"
                      textAlign={"end"}
                      marginBottom={"0.66rem"}
                    >
                      Don't know where to get your car tinted? Logoipsum —
                      practical, safe, and affordable.
                    </Typography>
                    <Typography color="white">© 2024 — Copyright</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid size={1}></Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Footer;
