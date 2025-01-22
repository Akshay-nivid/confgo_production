/**
 * all the details of user for an event
 * @author Nevin
 * view the programs and other informations of the user
 */
import { useState } from "react";
import { Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import StatusComponent from "@/components/Status/StatusComponent";
import "./userdetail.scss";
import React from "react";
import { formatDateTimeRange } from "@/Utils/CommonBaseClass";
import NoEvents from "../../Participant-User/No-Event/NoEvent"
import confgo  from "../../../../config.json"

interface DetailProps {
  userdetail: any;
}

/**
 * it contains all the information reguarding the user
 */
const UserAllDetail: React.FC <DetailProps> = ({ userdetail }) => { 
  const [tabValue, setTabValue] = useState(1); // Default to tab 1
  const currency=confgo.currency;
  //stores the customform data
  const cleanedFormData = userdetail.formData.map((item:any) => {
    const parsedResponse = JSON.parse(item.response);
    delete parsedResponse.fieldType; // Remove the fieldType key
    return parsedResponse; // Return the cleaned object
  });
  
  //stores the payment informations
  const PaymentDetails = userdetail.payment;

  //stores the attendees informations 
  const attendanceDetails = userdetail.attendanceDetails
  const categories = [
    { label: "Event Sessions Attended", key: "attendedPrograms" },
    { label: "Upcoming Event Sessions", key: "upcomingPrograms" },
    { label: "Not Attended Events", key: "absentPrograms" },
  ];

  const handleTabChange = (newValue: any) => {
    setTabValue(newValue); // Update the tab value
  };

  return (
    <Grid>
      <Tabs value={tabValue} className="main-account-tabs" onChange={(_event, newValue) => handleTabChange(newValue)}>
        <Tab value={1} label="User Information" className="main-account-tab-title account-tabs"/>
        <Tab value={2} label="Payment Details" className="main-account-tab-title account-tabs"/>
        <Tab value={3} label="Attendance Details" className="main-account-tab-title account-tabs"/>
        <Tab value={4} label="Documents" className="main-account-tab-title account-tabs"/>
      </Tabs>
      {tabValue === 1 ? (
        <Grid container direction="column" spacing={2} className="all-details-attendance-grid">
          <Grid>
            <Typography className="all-details-title">
              Personal Details
            </Typography>
          </Grid>
          {cleanedFormData.length !==0?cleanedFormData.map((data: any, index: any) => (
        <Grid key={index}>
          {Object.entries(data).map(([key, value]) => (
              <Grid container key={index}>
             <Grid size={3}>
             <Typography className="all-details-data-title">{key}</Typography>
           </Grid>
            <Grid size={8}>
            <Typography className="all-details-data">{String(value)}</Typography>
          </Grid>
          </Grid>
          ))}
        </Grid>
      ))
    :
    <NoEvents description="No personal details  found" />
    }

  </Grid>
      ) : tabValue === 2 ? (
        <Grid container direction="column" className="all-details-attendance-grid" spacing={2}>
          <Grid>
            <Typography className="all-details-title">
              Payment Information
            </Typography>
          </Grid>
          <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Transcation ID</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data">{PaymentDetails.transactionId ? PaymentDetails.transactionId : "Not Available"}</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Total Amount</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data">{currency}{PaymentDetails.amount}</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Payment Method</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data">{PaymentDetails.paymentMethod.name}</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Payment Date</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data"> {formatDateTimeRange({ date: PaymentDetails.createdOn,format: "DD/MM/YYYY",})}</Typography>
          </Grid>
      </Grid>
        </Grid> 
      ) : tabValue === 3 ? (
        <Grid className="all-details-attendance-grid">
        <Typography className="all-details-title">
        Attendance Overview
      </Typography>

      <Grid>
    {categories.map(({ label, key }) => (
      attendanceDetails[key].length > 0 && ( 
        <Grid key={key}>
          <Typography className="all-details-attendence-label">
            {label}
          </Typography>
          <Grid container spacing={2}>
            {attendanceDetails[key].map((program: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={program.id}>
                <Grid className="userdetail-event-card">
                  <Grid container direction="row" className="userdetail-time-status">
                    <Typography className="userdetail-time">
                      {formatDateTimeRange({ date: program.startTime, format: "h:mm A" })}-
                      {formatDateTimeRange({ date: program.endTime, format: "h:mm A" })}
                    </Typography>
                    {program.statusId && (
                      <StatusComponent className="user-status" value={program.statusId} />
                    )}
                  </Grid>
                  <Typography className="userdetail-name">
                    {program.name}
                  </Typography>
                  <Typography className="userdetail-card-data">
                    Location:{ `${program.venue?.city},${program.venue?.country}`}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )
    ))}
  </Grid>
        </Grid> 
      ) : tabValue === 4 ? (
        <Grid spacing={2} className="all-details-attendance-grid">
          <Typography className="all-details-title">Uploaded Files</Typography>
        </Grid> 
      ) : null}
    </Grid>
  );
};

export default UserAllDetail;
