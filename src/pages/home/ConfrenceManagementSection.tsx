import { AttentionTracking, Brand, ExportPlanImg } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Grid from "@mui/material/Grid2";

/**
 * confrence management section ui component for home page
 *
 */
const ConfrenceManagementSection = () => {
  return (
    <Box className="confrence-management-section-main">
      <Grid container>
        <Grid size={1}></Grid>
        <Grid container size={10}>
          <Grid
            size={12}
            className="confrence-management-section-header-content"
          >
            <Typography
              textAlign={"center"}
              className="conference-management-title text-h2 font-700"
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
          </Grid>
          <Grid
            columnSpacing={2}
            container
            size={12}
            className="conference-management-grid-main"
          >
            <Grid
              size={6}
              className={"grid-left"}
              display={"flex"}
              flexDirection={"column"}
            >
              <Typography className="tracking-title text-h2">
                Seamless Attendance Tracking on Android and iOS
              </Typography>
              <Typography className="tracking-description text-p1">
                Simplify your event management with our built-in scanner app.
                Track attendee participation effortlessly by scanning QR codes
                for quick and accurate attendance registration—keeping you
                organized and on schedule.
              </Typography>
              <Box className="tracking-image-container">
                <AttentionTracking className=" attendance-tracking-image" />
              </Box>
            </Grid>
            <Grid
              size={6}
              className={"grid-right"}
              display={"flex"}
              flexDirection={"column"}
            >
              <Typography className="tracking-title text-h2">
              Your Conference, Your Brand
              </Typography>
              <Typography className="tracking-description text-p1">
              Get a fully functional website to engage attendees and promote your event. It includes schedules, speaker profiles, registration, payments, and real-time updates. Customizable to reflect your brand and deliver a seamless user experience.
              </Typography>
              <Box className="tracking-image-container">
                <Brand className=" attendance-tracking-image" />
              </Box>
            </Grid>
          </Grid>
          <Grid
            container
            size={12}
            className="confrence-management-content-wrapper"
          >
            <Grid size={6} className="confrence-management-effortless-content">
              <Typography className="planning-title text-h2">
                Effortless Planning & <br /> Execution
              </Typography>
              <Typography className="planning-description text-p1">
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
              ></CustomButton>
            </Grid>
            <Grid size={6} className="export-plan-grid-right">
              <Box className="export-plan-image-wrapper">
                <ExportPlanImg className="export-plan-image" />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={1}></Grid>
      </Grid>
    </Box>
  );
};

export default ConfrenceManagementSection;
