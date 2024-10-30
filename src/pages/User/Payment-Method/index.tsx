import CustomButton from "@/components/CustomButton/CustomButton";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  ArrowLeftIcon,
  DebitCardIcon,
  GpayIcon,
  PhonePayIcon,
  RaziorPayIcon,
  StripeIcon,
  UpiIcon,
} from "@/assets/svg";
import { useState } from "react";
import { ArrowDropDown } from "@mui/icons-material";
const PaymentMethod = () => {
  const [expanded, setExpanded] = useState<string | false>("");
  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <Grid container className="payment-method">
      <Grid size={12}>
        <Typography className="payment-method-header">
          Payment Method
        </Typography>
      </Grid>
      <Grid size={12}>
        <Box className="payment-bill-details-container">
          <Box className="payment-bill-details">
            <Box className="payment-bill-item">
              <Typography className="info-text">Programs Total</Typography>
              <Typography className="info-text">$720</Typography>
            </Box>
            <Box className="payment-bill-item">
              <Typography className="info-text">Food Total</Typography>
              <Typography className="info-text">$100</Typography>
            </Box>
          </Box>
          <Box className="divider"></Box>
          <Box className="payment-bill-details">
            <Box className="payment-bill-item">
              <Typography className="info-text">Subtotal</Typography>
              <Typography className="info-text">$720</Typography>
            </Box>
            <Box className="payment-bill-item">
              <Typography className="info-text">Coupon Code Applied</Typography>
              <Typography className="info-text">$100</Typography>
            </Box>
          </Box>
          <Box className="divider"></Box>
          <Box className="payment-grand-total-container">
            <Typography className="grand-total-info-text">
              Grand Total
            </Typography>
            <Typography className="grand-total-info-text">$100</Typography>
          </Box>
        </Box>
      </Grid>
      {/* <Grid size={12}>
        <Typography>Apply Coupon</Typography>
      </Grid> */}
      <Grid className="payment-method-options-container" size={12}>
        <Typography className="payment-method-options-header">
          Choose Payment Method
        </Typography>
        <Box className="payment-method-list">
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            className="payment-method-list-item"
          >
            <AccordionSummary
              className="item-accordio-summary"
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <GpayIcon className="gpay-icon payment-method-icon" />
              <Typography>Google Pay</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                feugiat. Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* 2 */}
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
            className="payment-method-list-item"
          >
            <AccordionSummary
              className="item-accordio-summary"
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <PhonePayIcon className="gpay-icon payment-method-icon" />
              <Typography>Phone Pay</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                feugiat. Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* 3 */}
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
            className="payment-method-list-item"
          >
            <AccordionSummary
              className="item-accordio-summary"
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <RaziorPayIcon className="gpay-icon payment-method-icon" />
              <Typography>Razor Pay</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                feugiat. Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* 4 */}
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
            className="payment-method-list-item"
          >
            <AccordionSummary
              className="item-accordio-summary"
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <StripeIcon className="gpay-icon payment-method-icon" />
              <Typography>Stripe</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                feugiat. Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* 5 */}
          <Accordion
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
            className="payment-method-list-item"
          >
            <AccordionSummary
              className="item-accordio-summary"
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <UpiIcon className="gpay-icon payment-method-icon" />
              <Typography>Pay by any UPI app</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                feugiat. Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* 6 */}
          <Accordion
            expanded={expanded === "panel6"}
            onChange={handleChange("panel6")}
            className="payment-method-list-item"
          >
            <AccordionSummary
              className="item-accordio-summary"
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <DebitCardIcon className="gpay-icon payment-method-icon" />
              <Typography>Debit/Credit Card</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                feugiat. Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* 7 */}
          <Accordion
            expanded={expanded === "panel7"}
            onChange={handleChange("panel7")}
            className="payment-method-list-item"
          >
            <AccordionSummary
              className="item-accordio-summary"
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>More Payment Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                feugiat. Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Grid>
      <Grid className="payment-method-buttons-container" size={12}>
        <CustomButton label="Pay $300" className="pay-button" />
        <CustomButton
          startIcon={<ArrowLeftIcon />}
          label="Back"
          variant="text"
          className="back-button"
        />
      </Grid>
    </Grid>
  );
};

export default PaymentMethod;
