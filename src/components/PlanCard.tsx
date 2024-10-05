import { Box, FormControlLabel, Radio, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

type PlanCardProps = {
  value: string;
  header: string;
  price: string;
  discount?: string;
  isDicount: boolean;
  isActive: boolean;
  image:React.ReactNode
};

/*
 *  component to display available purchase plans
 */

const PlanCard: React.FC<PlanCardProps> = ({
  value,
  header,
  price,
  discount,
  isDicount = false,
  isActive,
  image
}) => {
  return (
    <Grid
      container
      alignItems={"center"}
      className={isActive ? "plan-card plan-card-active" : "plan-card"}
      minWidth={"100%"}
    >
      
      <FormControlLabel
        value={value}
        control={<Radio className="plan-card-radio-button" />}
        labelPlacement="start" 
        label={
          <Grid
            container
            // justifyContent={"space-"}
            alignItems={"center"}
          >
            <Grid>{image}</Grid>
            <Grid flexDirection={"column"} marginLeft={2}>   
              <Typography className="plan-card-header">{header}</Typography>
              <Typography className="plan-card-price">
                ${price}/monthly
              </Typography>
            </Grid>
            {/* <Box>
              {isDicount ? (
                <Box className="plan-card-discount-percent flex-1">
                  Save {discount}
                </Box>
              ) : (
                <></>
              )}
            </Box> */}
          </Grid>
        }
      ></FormControlLabel>
    </Grid>
  );
};

export default PlanCard;
