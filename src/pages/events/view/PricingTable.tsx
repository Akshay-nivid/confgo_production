import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import moment from "moment";
import { setDataById } from "@/Libs/store";

interface PricingTier {
  id: number;
  tierName: string;
  percentage?: number;
  endDate: string;
  startDate: string;
}

interface Attendee {
  id: number;
  attendeeName: string;
  attendeeDescription: string;
  pricingTiers?: PricingTier[];
}


interface PricingTableProps {
  pricingTiers?: PricingTier[];
  attendees?: Attendee[];
  control?: any;
  payLoad?: any;
  getValues?:any
  setValue?:any;
  watch?:any
  isListView?: boolean;
  onSubmitData?: (data: any) => void; // Function to handle form submission
}

const PricingTable: React.FC<PricingTableProps> = ({
  pricingTiers = [],
  attendees = [],
  control,
  isListView = false,
}) => {

  // Group pricing tiers by unique tier name to avoid duplicate columns
  const uniqueTiers = Array.from(
    new Map(pricingTiers.map((tier) => [tier.tierName, tier])).values()
  );


  return (
    <TableContainer
      component={Paper}
      className="pricing-table-table-container-root"
    >
      <Table className="pricing-table-table">
        <TableHead>
          <TableRow>
            <TableCell className="pricing-table-table-header">
              Attendee Types
            </TableCell>
            {uniqueTiers.map((tier) => {
              return (
                <TableCell className="pricing-table-table-header" key={tier.id}>
                 
                  {tier.tierName}
                  
                  
                  <small className="pricing-table-table-header date">
                    ({moment(tier.startDate).format("DD/MM/YYYY")}-{" "}
                    {moment(tier.endDate).format("DD/MM/YYYY")})
                  </small>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {attendees.map((attendee, attendeeIndex) => (
            <TableRow key={attendee.id}>
              <TableCell className="pricing-table-table-header">
                {attendee.attendeeName}
              </TableCell>
              {uniqueTiers.map((tier) => { 
                return (
                  <TableCell key={`${attendee.id}-${tier.id}`}>
                    <Controller
                      name={`attendees.${attendeeIndex}.pricingTiers.${tier.tierName}.percentage`}
                      control={control}
                      defaultValue={
                        isListView
                          ? attendee.pricingTiers?.find(
                              (atTier) => atTier.tierName === tier.tierName
                            )?.percentage + " " + "%" || "0" // When isListView is true, use attendee-specific percentage or leave empty
                          : attendee.pricingTiers?.find(
                              (atTier) => atTier.tierName === tier.tierName
                            )?.percentage ||
                            tier.percentage ||
                            "0" // When isListView is false, fallback to tier-specific or default value
                      }
                      rules={{
                        required: "Percentage is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message:
                            "Please enter a valid number with up to two decimal places",
                        },
                        validate: (value) =>
                          parseFloat(value) <= 100 || "Percentage cannot exceed 100%",
                      }}
                      render={({ field }) => (
                        <TextField
                          className="pricing-table-table-input-text"
                          {...field}
                          variant="outlined"
                          placeholder="%"
                          InputProps={{
                            readOnly: isListView,
                          }}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(input)) {
                              if (parseFloat(input) > 100) {
                                setDataById("snackBarInfo", {
                                  open: true,
                                  autoHideDuration: 2000,
                                  severity: "error",
                                  message: "Value cannot exceed 100%",
                                }); // Trigger validation error
                              } else {
                                field.onChange(input);


                              }
                            }
                          }}
                        />
                      )}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PricingTable;


