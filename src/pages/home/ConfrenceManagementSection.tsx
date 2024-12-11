import { useIsMobileScreen } from "@/Utils/CommonBaseClass";
import { ArrowIconSvg, AttentionTracking, Brand, ExportPlanImg } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import routes from "@/router/routes";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";

/**
 * confrence management section ui component for home page
 *
 */
const ConfrenceManagementSection = () => {
  const navigate = useNavigate();
  const isMobileScreen = useIsMobileScreen();

  return (
    <Box className="confrence-management-section-main">
      <Grid container justifyContent={'center'}>
        <Grid container size={{ xs: 12, sm: 10 }}>
          <Grid
            size={12}
            className="confrence-management-section-header-content"
          >
            <Typography
              textAlign={"center"}
              className="conference-management-title"
            >
              Complete Conference <br /> Management at Your Fingertips
            </Typography>
            <Typography
              textAlign={"center"}
              className="conference-management-description"
            >
              From a fully functional website to a powerful dashboard and mobile
              app, we offer everything <br /> you need to manage your event
              seamlessly—anytime, anywhere.{" "}
            </Typography>
          </Grid>
          <Grid
            container
            size={12}
            className="confrence-management-content-wrapper"
          >
            <Grid size={{ xs: 12, md: 6 }} className="confrence-management-effortless-content">
              <Typography className="planning-title">
                Effortless Planning & {!isMobileScreen && <br />} Execution
              </Typography>
              <Typography className="planning-description">
                Track every detail from a centralized dashboard that puts all
                your event management tools in one place. Manage attendee
                registraImport Costtions, coordinate event logistics, and
                streamline communications with just a few clicks. Monitor
                real-time data, including attendance, session participation, and
                feedback, giving you valuable insights to make quick, informed
                decisions. Effortlessly schedule sessions, assign tasks to your
                team, and oversee all operations with clear, organized views.
                With powerful reporting features and customizable dashboards,
                you’ll always have a pulse on your event’s progress, ensuring
                nothing falls through the cracks.
              </Typography>
              <CustomButton
                label="Get Started"
                variant="outlined"
                className="get-started-btn"
                onClick={() => navigate(routes.loginOrg())}
                endIcon={<ArrowIconSvg />}
              ></CustomButton>
            </Grid>
            {!isMobileScreen && <Grid size={{xs:12,md:6}} className="export-plan-grid-right">
              <Box className="export-plan-image-wrapper">
                <ExportPlanImg className="export-plan-image" />
              </Box>
            </Grid>}
          </Grid>
          <Grid
            columnSpacing={2}
            rowSpacing={{xs:4, md:0}}
            container
            size={12}
            className="conference-management-grid-main"
          >
            <Grid
              size={{ xs: 12, md: 6 }}
              className={"grid-left"}
              display={"flex"}
              flexDirection={"column"}
              
            >
              <Typography className="tracking-title">
                Seamless Attendance Tracking on Android and iOS
              </Typography>
              <Typography marginBottom={{xs:4, md:0}} className="tracking-description">
                Simplify your event management with our built-in scanner app.
                Track attendee participation effortlessly by scanning QR codes
                for quick and accurate attendance registration—keeping you
                organized and on schedule.
              </Typography>
              {!isMobileScreen && <Box className="tracking-image-container">
                <AttentionTracking className=" attendance-tracking-image" />
              </Box>}
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              className={"grid-right"}
              display={"flex"}
              flexDirection={"column"}
            >
              <Typography className="tracking-title">
                Your Conference, Your Brand
              </Typography>
              <Typography marginBottom={{xs:4, md:0}} className="tracking-description">
                Get a fully functional website to engage attendees and promote your event. It includes schedules, speaker profiles, registration, payments, and real-time updates. Customizable to reflect your brand and deliver a seamless user experience.
              </Typography>
              {!isMobileScreen && <Box className="tracking-image-container">
                <Brand className=" attendance-tracking-image" />
              </Box>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConfrenceManagementSection;
