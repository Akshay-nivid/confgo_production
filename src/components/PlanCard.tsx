import { toCamelCase } from "@/Utils/CommonBaseClass";
import { FormControlLabel, Radio, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

type PlanCardProps = {
  value: string;
  header: string;
  price: string;
  discount?: string;
  isDicount: boolean;
  isActive: boolean;
  image: React.ReactNode;
};

/*
 *  component to display available purchase plans
 */

const PlanCard: React.FC<PlanCardProps> = ({
  value,
  header,
  price,
  isActive,
  image,
}) => {
  return (
    <Grid
      container
      alignItems={"center"}
      className={isActive ? "plan-card plan-card-active plan-card-active-radio-button" : "plan-card"}
      minWidth={"100%"}
    >
      <FormControlLabel
        value={value}
        control={<Radio className="plan-card" />}
        labelPlacement="start"
        label={
          <Grid
            container
            alignItems={"center"}
          >
            <Grid className="plan-card-icon">{image}</Grid>
            <Grid flexDirection={"column"} marginLeft={2}>
              <Typography className="plan-card-header">{toCamelCase(header)}</Typography>
              <Typography className="plan-card-price">
                {value != "ENTERPRISE_PLAN" ? "$" + parseInt(price) + "/Annually" : ""}
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
