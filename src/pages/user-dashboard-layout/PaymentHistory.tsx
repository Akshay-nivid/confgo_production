import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
function PaymentHistory() {
  return (
  <Grid container size={12} className="payment-history-container">
     <Grid className="" justifyContent={"center"} container>
     <Typography padding={"3rem"} bgcolor={"red"}>
        payment History
     </Typography>
     </Grid>
  </Grid>
  )
}

export default PaymentHistory