import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";
import AppLogo from "@/assets/appLogo.svg";
import routes from "@/router/routes";

/**
 * footer component
 *
 */
const Footer = () => {
  return (
    <Grid container className="footer">
      <Grid size={1}></Grid>
      <Grid size={10}>
        <Box className="footer-content">
          <Grid container>
            <Grid size={12}>
              <Typography className="footer-title">
                Do you have <br /> any questions?
              </Typography>
              <Grid container size={12}>
                <Grid container size={6}>
                  <Typography className="footer-subtitle">
                    Feel free to send us your questions or request a free <br />
                    consultation.
                  </Typography>
                </Grid>
                <Grid container size={6} justifyContent={'flex-end'}>
                  <Typography className="footer-subtitle">
                    Complete Conference Management at Your  <br />Fingertips
                  </Typography>
                </Grid>
              </Grid>
              <Button variant="contained" className="footer-button">
                Send A Message
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid size={1}></Grid>
      <Grid size={12}>
        <Box className="footer-links-section">
          <Grid container>
            <Grid size={1}></Grid>
            <Grid size={10}>
              <Box className="footer-links-content">
                <Grid container>
                  <Grid size={8}>
                    <Box className="footer-nav-links">
                      <ul>
                        <li className="footer-nav-list">
                          <Link className="footer-nav-item" to={routes.home()}>
                            Home
                          </Link>
                          <Link
                            className="footer-nav-item"
                            to={routes.pricing()}
                          >
                            Pricing
                          </Link>
                          <Link
                            className="footer-nav-item"
                            to={routes.contact()}
                          >
                            Contacts
                          </Link>
                        </li>
                      </ul>
                    </Box>
                    <Box className="footer-contact-info">
                      <Grid container>
                        <Grid size={4}>
                          <Box className="footer-contact-block">
                            <Typography className="footer-contact-label">
                              CALL US
                            </Typography>
                            <Typography className="footer-contact-value">
                              0497 2701371
                            </Typography>
                          </Box>
                          <Box className="footer-contact-block">
                            <Typography className="footer-contact-label">
                              EMAIL US
                            </Typography>
                            <Typography className="footer-contact-value">
                              support@confgo.co
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={8}>
                          <Box className="footer-contact-block">
                            <Typography className="footer-contact-label">
                              VISIT US
                            </Typography>
                            <Typography className="footer-contact-value">
                              Torch Club 18 Waverly Pl, <br /> New York, NY
                              10003, USA
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid size={4} className="footer-logo-section">
                    <AppLogo className="footer-logo"/>
                    <Typography className="footer-description">
                      Don't know where to get your car tinted? <br /> Logoipsum
                      — practical, safe, and affordable.
                    </Typography>
                    <Typography className="footer-copyright">
                      © 2024 — Copyright
                    </Typography>
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
