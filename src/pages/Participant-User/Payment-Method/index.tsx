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
  // DebitCardIcon,
  // GpayIcon,
  // PhonePayIcon,
  // RaziorPayIcon,
  // StripeIcon,
  // UpiIcon,
} from "@/assets/svg";
import { useState } from "react";
import useStore, { IStoreState, setDataById } from "@/Libs/store";
import PayPalParticipantButton from "./PaypalPartcipantComponent";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import { OrderSummary } from "@/Libs/types/type";

/**
 * This component renders the payment method page, which displays the programs and their corresponding costs, the food and its corresponding cost, and the total cost of the programs and food. It also displays the different payment methods available to the user.
 * @returns {JSX.Element} The payment method page component.
 */
const PaymentMethod = () => {

  const [_expanded, setExpanded] = useState<string | false>("panel1");

  const orderData: OrderSummary = useStore((state: IStoreState) => state.compData?.order?.order?.data)

  const eventId = useStore(state => state?.compData?.["eventSelected"]?.id)

  const eventAmount = useStore((state: IStoreState) => state?.compData?.["eventData"]?.[`event/${eventId}`]?.data?.amount) || null

  // const handleChange =
  //   (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
  //     setExpanded(isExpanded ? panel : false);
  //   };

  const navigate = useNavigate()


  const handleClickBackButton = () => {

    setDataById("previousRoute", { url: routes.userPaymentMethod() });
    navigate(routes.dynamicUserForm());
  }



  return (
    <Grid container className="payment-method shadow">
      <Grid size={12} overflow={"hidden"}>
        <Typography className="payment-method-header bg-zinc-50 py-2 rounded-t-xl text-center text-2xl">
          Payment Method
        </Typography>
      </Grid>
      <Grid size={12}>
        <Box className="payment-bill-details-container">
          <Box className="payment-bill-details">

            <Box className="payment-bill-item">
              <Typography className="info-text">Event Total</Typography>
              <Typography className="info-text value">$ {Number(eventAmount).toFixed(2)}</Typography>
            </Box>

            <Box className="payment-bill-item">
              <Typography className="info-text">Programs Total</Typography>
              <Typography className="info-text value">$ {orderData?.programTotal.toFixed(2)}</Typography>
            </Box>
            <Box className="payment-bill-item">
              <Typography className="info-text">Addon Total</Typography>
              <Typography className="info-text value">$ {orderData?.addonTotal.toFixed(2)}</Typography>
            </Box>
            {/* {orderData?.tax < 1 && <Box className="payment-bill-item">
              <Typography className="info-text">Tax</Typography>
              <Typography className="info-text value">$ {orderData?.tax}</Typography>

            </Box>} */}
            <Box className="payment-bill-item">
              <Typography className="info-text">Tier Discount</Typography>
              <Typography className="info-text value">$ {Number(orderData?.priceTierDiscount).toFixed(2)}</Typography>
            </Box>
            {/* <Box className="payment-bill-item">
              <Typography className="info-text">Sub Total</Typography>
              <Typography className="info-text">$ {orderData?.subTotal}</Typography>
            </Box> */}
            <Box className="payment-bill-item">
              <Typography className="info-text">Coupon Discount</Typography>
              <Typography className="info-text value">$ {orderData?.discountAmount.toFixed(2)}</Typography>
            </Box>
          </Box>
          <Box className="divider"></Box>
          <Box className="payment-grand-total-container">
            <Typography className="sub-total-info-text">
              Sub Total
            </Typography>
            <Typography className="sub-total-info-text value">$ {Number(orderData?.subTotal).toFixed(2)}</Typography>
          </Box>

          <Box className="payment-grand-total-container  -mt-3">
            <Typography className="sub-total-info-text">
              Tax
              <span className="text-lg font-light ml-2">({orderData?.taxPercentage}%)</span>
            </Typography>
            <Typography className="sub-total-info-text value">$ {orderData?.tax.toFixed(2)}</Typography>
          </Box>

          <Box className="payment-grand-total-container">
            <Typography className="grand-total-info-text">
              Grand Total
              {/* {orderData?.taxPercentage == 0 && <span className="block text-lg font-normal">(Tax included - {orderData.taxPercentage }% )</span>} */}
            </Typography>
            <Typography className="grand-total-info-text value">$ { orderData?.finalPrice.toFixed(2)}</Typography>
          </Box>
        </Box>
      </Grid>
      {/* <Grid size={12} className="h-4 bg-gray-50"></Grid> */}
      <Grid className="payment-method-options-container" size={12}>
        <Typography className="payment-method-options-header bg-zinc-50 py-2">
          Choose Payment Method
        </Typography>
        <Box className="payment-method-list px-10">
          <PayPalParticipantButton />

          {/* <Accordion
            expanded={expanded === "panel1"}
            defaultExpanded={true}
            onChange={handleChange("panel1")}
            className="payment-method-list-item"
          >
            <AccordionSummary
              className="item-accordio-summary"
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography>Paypal</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PayPalParticipantButton />
            </AccordionDetails>
          </Accordion> */}
          {/* <Accordion
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
          </Accordion> */}

          {/* 2 */}
          {/* <Accordion
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
          </Accordion> */}
          {/* 3 */}
          {/* <Accordion
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
          </Accordion> */}
          {/* 4 */}
          {/* <Accordion
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
          </Accordion> */}
          {/* 5 */}
          {/* <Accordion
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
          </Accordion> */}
          {/* 6 */}
          {/* <Accordion
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
          </Accordion> */}
          {/* 7 */}
          {/* <Accordion
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
          </Accordion> */}
        </Box>
      </Grid>
      <Grid className="payment-method-buttons-container" size={12}>
        {/* <CustomButton label={`pay $${paymentDetails.car}`} className="pay-button" /> */}
        <CustomButton
          startIcon={<ArrowLeftIcon />}
          label="Back"
          variant="text"
          className="back-button"
          onClick={handleClickBackButton}
        />
      </Grid>
    </Grid>
  );
};

export default PaymentMethod;
