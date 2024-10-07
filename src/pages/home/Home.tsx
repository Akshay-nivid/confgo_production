import Box from "@mui/material/Box/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid2";
import { Typography, Button } from "@mui/material";
import ViewPricingBanner from "@/pages/home/ViewPricingBanner";
import { gridMiddleImg } from "@/assets/images";
import {
  GridEndOneImg,
  GridEndTwoImg,
  ExportPlanImg,
  AttentionTracking,
  SeamlessIntegration,
} from "@/assets/svg";
import FeatureCard from "./FeatureCard";

/**
 * home page component
 * @returns
 */
const HomePage = () => {
  return (
    <Box className="home-page-main">
      <HeroSection />
      <Grid container className="home-content-wrapper">
        <Grid size={1}></Grid>
        <Grid size={10} className="home-content">
          <Box
            width={"100%"}
            className="complete-conference-management-container"
          >
            <Typography
              textAlign={"center"}
              className="conference-management-title text-h6 font-700"
            >
              Complete Conference <br /> Management at Your Fingertips
            </Typography>
            <Typography
              textAlign={"center"}
              className="conference-management-description text-p1"
            >
              From a fully functional website to a powerful dashboard and mobile
              app, we offer everything <br /> you need to manage your event
              seamlessly—anytime, anywhere.{" "}
            </Typography>
          </Box>
          <Box width={"100%"} className="features-section">
            <Grid container>
              <Grid size={12}>
                <Box width={"100%"} className="effortless-planning-execution">
                  <Grid container>
                    <Grid size={6} className={"grid-left planning-content"}>
                      <Typography
                        // marginBottom="1.33rem"
                        className="planning-title text-h2"
                      >
                        Effortless Planning & <br /> Execution
                      </Typography>
                      <Typography className="planning-description text-p1">
                        Track every detail from a centralized dashboard that
                        puts all your event management tools in one place.
                        Manage attendee registraImport Costtions, coordinate
                        event logistics, and streamline communications with just
                        a few clicks. Monitor real-time data, including
                        attendance, session participation, and feedback, giving
                        you valuable insights to make quick, informed decisions.
                        Effortlessly schedule sessions, assign tasks to your
                        team, and oversee all operations with clear, organized
                        views. With powerful reporting features and customizable
                        dashboards, you’ll always have a pulse on your event’s
                        progress, ensuring nothing falls through the cracks.
                      </Typography>
                      <Button variant="outlined" className="get-started-btn">
                        Get Started
                      </Button>
                    </Grid>
                    <Grid
                      className="grid-right planning-image"
                      size={6}
                      container
                      alignItems={"end"}
                      justifyContent={"end"}
                    >
                      <ExportPlanImg className="export-plan-image" />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box width={"100%"} className="attendance-tracking-section">
            <Grid container>
              <Grid size={12}>
                <Box width={"100%"} className="seamless-attendance-tracking">
                  <Grid
                    container
                    className="attendance-tracking-content"
                    columnSpacing={1}
                  >
                    <Grid
                      size={6}
                      className={"grid-left tracking-content"}
                      display={"flex"}
                      flexDirection={"column"}
                    >
                      <Typography className="tracking-title text-h2">
                        Seamless Attendance Tracking on Android and iOS
                      </Typography>
                      <Typography className="tracking-description text-p1">
                        Simplify your event management with our built-in scanner
                        app. Track attendee participation effortlessly by
                        scanning QR codes for quick and accurate attendance
                        registration—keeping you organized and on schedule.
                      </Typography>
                      <Box
                        flex={1}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"end"}
                        className="tracking-image-container"
                      >
                        <AttentionTracking className=" attendance-tracking-image" />
                      </Box>
                    </Grid>
                    <Grid
                      className=" grid-right tracking-content-right"
                      size={6}
                      container
                      alignItems={"end"}
                      justifyContent={"end"}
                    >
                      <Typography className="tracking-title text-h2">
                        Seamless Attendance Tracking on Android and iOS
                      </Typography>
                      <Typography className="tracking-description text-p1">
                        Simplify your event management with our built-in scanner
                        app. Track attendee participation effortlessly by
                        scanning QR codes for quick and accurate attendance
                        registration—keeping you organized and on schedule.
                      </Typography>
                      <Box
                        flex={1}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"end"}
                        className="tracking-image-container"
                      >
                        <AttentionTracking className="attendance-tracking-image" />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box width={"100%"} className="features-cta-section">
            <Typography
              textAlign={"center"}
              className="features-cta-title text-h5 font-700"
            >
              Powerful Features for Seamless Conferences
            </Typography>
            <Typography
              className="features-cta-description text-p1"
              textAlign={"center"}
            >
              Discover the tools that enhance your meetings and elevate your
              events.
            </Typography>
            <Box className="features-cta-button-container">
              <Button
                className="mx-auto features-cta-button"
                variant="outlined"
              >
                See All Features
              </Button>
            </Box>
          </Box>
          <Box
            width={"100%"}
            className="features-container"
            display={"flex"}
            flexDirection={"column"}
            rowGap={"100px"}
            marginBottom={"64px"}
          >
            <FeatureCard />
            <FeatureCard flexDirection="row-reverse" />
            <FeatureCard />
          </Box>
          <Box width={"100%"} className="" marginBottom={"64px"}>
            <Typography
              className=""
              textAlign={"center"}
              variant="h5"
              fontWeight={700}
            >
              Frequently asked questions
            </Typography>
            <Typography textAlign={"center"} className="text-p1">
              Find solutions, clarifications, and insights to the most commonly
              asked questions <br /> about our products, services, and
              processes.
            </Typography>
          </Box>
          <Box marginBottom={"95px"}>
            <FAQ />
            <FAQ />
            <FAQ />
            <FAQ />
          </Box>
          <Box marginBottom={"90px"}>
            <Typography textAlign={"center"} variant="h5" fontWeight={700}>
              Why Choose Confgo?
            </Typography>
            <Typography textAlign={"center"} className="text-p1">
              Discover the tools that enhance your meetings and elevate your
              events.
            </Typography>
          </Box>
          <Box width={"100%"}>
            <Grid container columnSpacing={"20px"} marginBottom={"110px"}>
              {Array(4)
                .fill(null)
                .map(() => (
                  <Grid size={3}>
                    <ServiceCard />
                  </Grid>
                ))}
            </Grid>
          </Box>
          <Box width={"100%"} marginBottom={"58px"}>
            <ViewPricingBanner />
          </Box>
        </Grid>
        <Grid size={1}></Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;

const HeroSection = () => {
  return (
    <Grid container className="hero-section-main">
      <Grid size={1} className="hero-section-spacer"></Grid>
      <Grid paddingTop={"16.75rem"} size={10} className="hero-section-content">
        <Box
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          className="hero-section-container"
        >
          <Box className="hero-section-text-container">
            <Typography
              textAlign={"center"}
              className="hero-section-title text-h1 font-700"
            >
              Your Ultimate Conference Software.
            </Typography>
            <Typography
              className="hero-section-description text-p1"
              textAlign={"center"}
              fontWeight={400}
            >
              Are you tired of juggling multiple tools and platforms to organize
              your conferences and group meetings? Look no <br /> further!
              Summit Pro is here to revolutionize your event management
              experience.
            </Typography>

            <Box
              marginTop={"2.42rem"}
              display={"flex"}
              columnGap={"1.83rem"}
              alignItems={"center"}
              marginInline={"auto"}
              marginBottom={"5.17rem"}
              width={"max-content"}
              className="hero-section-buttons"
            >
              <Button
                variant="contained"
                color="primary"
                className="hero-section-button"
              >
                Get Started
              </Button>
              <Button
                color="primary"
                variant="outlined"
                className="hero-section-button"
              >
                Watch Our Videos
              </Button>
            </Box>
          </Box>
          <Grid size={12} className="hero-section-image-grid">
            <Box
              width={"100%"}
              height={"100%"}
              className="hero-section-image-container"
            >
              <Grid
                container
                columnSpacing={"20px"}
                className="hero-section-image-row"
              >
                <Grid size={2} className="hero-section-left-column">
                  <Box
                    height={"100%"}
                    width={"100%"}
                    className="hero-section-side-box"
                  >
                    <Grid
                      container
                      height={"100%"}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"flex-end"}
                      alignItems={"center"}
                      rowGap={"1.33rem"}
                      paddingBlock={"2rem"}
                      className="hero-section-side-grid"
                    >
                      <Grid
                        size={12}
                        className="hero-section-side-image-wrapper"
                      >
                        <GridEndOneImg className="hero-section-side-image-large w-[18.08rem] h-[25.5rem] rounded-[1.25rem]" />
                      </Grid>
                      <Grid
                        size={12}
                        className="hero-section-side-image-wrapper"
                      >
                        <GridEndTwoImg className="hero-section-side-image-small w-[18.0833rem] h-[7.8333rem] rounded-[1.25rem]" />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid
                  size={8}
                  borderRadius={"1.25rem 1.25rem 0 0"}
                  overflow={"hidden"}
                  className="hero-section-middle-column"
                >
                  <img
                    className="hero-section-middle-image h-full w-full"
                    src={gridMiddleImg}
                    alt=""
                  />
                </Grid>
                <Grid size={2} className="hero-section-right-column">
                  <Box height={"100%"} className="hero-section-side-box">
                    <Grid
                      container
                      height={"100%"}
                      flexDirection={"column"}
                      justifyContent={"flex-end"}
                      alignItems={"center"}
                      rowGap={"1.33rem"}
                      paddingBlock={"2rem"}
                      className="hero-section-side-grid"
                    >
                      <Grid
                        size={12}
                        className="hero-section-side-image-wrapper"
                      >
                        <GridEndOneImg className="hero-section-side-image-large w-[18.08rem] h-[25.5rem] rounded-[1.25rem]" />
                      </Grid>
                      <Grid
                        size={12}
                        className="hero-section-side-image-wrapper"
                      >
                        <GridEndTwoImg className="hero-section-side-image-small w-[18.0833rem] h-[7.8333rem] rounded-[1.25rem]" />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Box>
      </Grid>
      <Grid size={1} className="hero-section-spacer"></Grid>
    </Grid>
  );
};

export const FAQ = () => {
  return (
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          borderBottom: "1px solid #E0E0E0",
          "&.Mui-expanded": {
            borderBottom: "none",
          },
        }}
      >
        <Typography fontWeight={600}>
          Can Confgo handle both physical and virtual conferences?
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Answer to the question goes here...</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export const ServiceCard = () => {
  return (
    <Box
      width={"100%"}
      className="service-card-main flex justify-center items-center flex-col"
    >
      <SeamlessIntegration className="h-[7rem] w-[7rem] mb-[3.5rem]" />
      <Box>
        <Typography
          variant="h5"
          textAlign={"center"}
          marginBottom={"8px"}
          fontWeight={600}
        >
          24/7 Support*
        </Typography>
        <Typography textAlign={"center"} className="text-p1">
          Need help anytime? Our support team is available 24/7 to answer your
          queries and offer timely solutions.
        </Typography>
      </Box>
    </Box>
  );
};
