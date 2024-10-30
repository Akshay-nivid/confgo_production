import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import ProgramCard from "./ProgramCard";

/**
 * User program selection page component
 *
 */
const ProgramSelection = () => {
  return (
    <Grid
      justifyContent={"center"}
      alignItems={"center"}
      container
      className="user-program-selection"
    >
      <Grid size={12} className="content-container">
        <Box className="header-container">
          <Typography textAlign={"center"} className="header-title">
            Program Selection
          </Typography>
        </Box>
        <Box className="programs-container space-y-12">
          <ProgramCard />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProgramSelection;
