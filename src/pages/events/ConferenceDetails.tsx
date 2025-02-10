/**
 * ConferenceDetails component displays the conference details
 */
import { toSentenceCase, truncateString } from '@/Utils/CommonBaseClass';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import moment from 'moment';
import React from 'react';
import parse from 'html-react-parser';
import SessionCard from './view/sessionCard';
import { ReviewCalender, ReviewMap,EventReview } from '@/assets/svg';
import ReviewLocation from './ReviewLocation';


type ConferenceDetailsProps = {
    data: any;
    addOnOptions?: any;
}

const ConferenceDetails: React.FC<ConferenceDetailsProps> = React.memo(({ data,addOnOptions }) => {
	
    const startDate = moment(data?.event?.startTime).format("MMMM D");
    const endDate = moment(data?.event?.endTime).format("MMMM D, YYYY");
    /**
     * Method checks the start and end date matches or not
     * @param start 
     * @param end 
     * @returns 
     */
    // const checkDateCondition = (start: any, end: any) => {
    //     return new Date(start) === new Date(end);
    // }
	const checkDateCondition = (start: any, end: any) => {
		
		return moment(start).isSame(moment(end), 'day');
	};
	
	const checkMonthCondition = (start: any, end: any) => {
		return moment(start).isSame(moment(end), 'month');
	};
	

		/**
		* Group programs and addons by date,and general addons without dates
		*/
		const combinedData = data?.program?.concat(data?.addOns || []).reduce((acc:any, item:any) => {
			const isAddon = !!item.addonId;
			let dateTime = '';
			
			// Combine startDate and startTime to create a full datetime object
			if (item.startDate && item.startTime) {
				dateTime = moment(item.startDate + ' ' + item.startTime, ['YYYY-MM-DD HH:mm', 'DD/MM/YYYY HH:mm']).format('YYYY-MM-DD HH:mm');
			}
			else if (item.date && item.startTime) {
				dateTime = moment(item.date + ' ' + item.startTime, ['YYYY-MM-DD HH:mm', 'DD/MM/YYYY HH:mm']).format('YYYY-MM-DD HH:mm');
			}
			
			// Skip invalid items
			if (!dateTime || (isAddon && !item.addonId) || (!item.name && !item.addonId)) {
				return acc;  // Do not add to accumulator if invalid
			}
			// Group by startDate
			const startDate = moment(item.startDate||item.date).format("YYYY-MM-DD");
			// Separate addOns with `dateRequired: false`
			if (isAddon && item.dateRequired === false) {
				// Create 'withoutDateRequired' array if it doesn't exist
				if (!acc.general) {
					acc.general = [];
				}
				acc.general.push({ ...item, isAddon, dateTime });
			} else {
				// Initialize the group for this date if it doesn't exist
				if (!acc[startDate]) {
					acc[startDate] = [];
				}
				
				// Add the item to the group for this date
				acc[startDate].push({ ...item, isAddon, dateTime });
			}
			return acc;
		}, {});		
		// Sorting function by startTime within each startDate group
		Object.keys(combinedData).reduce((sortedAcc: any, date: any) => {
			const items = combinedData[date];
			
			// Sort items by startTime
			const sortedItems = items.sort((a: any, b: any) => {
				return moment(a.dateTime, 'YYYY-MM-DD HH:mm').isBefore(moment(b.dateTime, 'YYYY-MM-DD HH:mm')) ? -1 : 1;
			});
		
			sortedAcc[date] = sortedItems;
			return sortedAcc;
		}, {});	
		/**
		 * Separate general addons without dates from combinedData
		 */
		const { general: generalAddons = [], ...scheduledData } = combinedData;
		return (
			<Grid container size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details" >
			  <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2} ml={3}>
				<Grid>
				  <EventReview className="custom-stepper-conference-details-review-img" />
				</Grid>
				<Grid>
				  <Typography variant="h3" className="custom-stepper-conference-details-content-title">
					Review And Submit
				  </Typography>
				</Grid>
				<Grid size={10}>
				  <Typography align="center" className="custom-stepper-conference-details-content-subtext">
					Check all the details carefully before submission. Make sure everything is perfect!
				  </Typography>
				</Grid>
			  </Grid>
			  <Grid container direction={"column"} size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-container">
				<Grid display={"flex"} direction={"row"} mb={2}>
				  <Grid size={data?.event?.type !== "ONLINE" ? 8 : 12}  className="custom-stepper-conference-details-border">
					<Grid container size={{ xs: 12, sm: 12 }} alignItems={"center"} mb={2}>
					  <Typography className="custom-stepper-conference-details-eventname">
						{truncateString(data?.event?.name, 40)}
					  </Typography>
					  {data?.event?.type && (
						<Grid container sx={{ width: "fit-content" }} className="custom-stepper-conference-details-content-type" justifyContent={"flex-start"} alignItems={"center"}>
						 <Typography mt={0.3}>{toSentenceCase(data.event.type)}</Typography> 
						</Grid>
					  )}
					</Grid>
					<Grid container size={{ xs: 12, sm: 12 }} alignItems={"center"} mb={1}>
					  <Typography className="custom-stepper-conference-details-event-description">
						{parse(truncateString(data?.event?.description, 750))}
					  </Typography>
					</Grid>
					<Grid container direction="row" alignItems="center" spacing={1} mb={1}>
					  <Grid className="custom-stepper-conference-details-content-date-icon">
						<ReviewCalender />
					  </Grid>
					  <Grid className="custom-stepper-conference-details-content-date-and-location">
					  {
 							 checkDateCondition(data?.event?.startDate, data?.event?.endTime)
 				 			  ? moment(data?.event?.startDate).format("MMM D, YYYY") 
   							 : checkMonthCondition(data?.event?.startDate, data?.event?.endTime)
    						? `${moment(data?.event?.startDate).format("MMM D")}-${moment(data?.event?.endTime).format("D, YYYY")}`
    						: `${startDate} - ${endDate}`
						}
					<Grid  container className="custom-stepper-conference-details-content-time">
						<>
						<span>
							{moment(startDate, "HH:mm").format("hh:mm A")}
						</span>-<span>
							{moment(endDate, "HH:mm").format("hh:mm A")}
						</span>
						</>
					</Grid>
					</Grid>
					  {data?.event?.type !== "ONLINE" && data?.event?.venueName && (
						<Grid display={"flex"} direction={"row"} alignItems={"center"}>
						  <Grid className="custom-stepper-conference-details-content-date-icon" mr={1}>
							<ReviewMap />
						  </Grid>
						  <Grid className="custom-stepper-conference-details-content-date-and-location">
							{data?.event?.venueName}
						  </Grid>
						</Grid>
					  )}
					</Grid>
				  </Grid>
				  {data?.event?.type !== "ONLINE" && data?.event?.venueName && (
					<Grid container className="show-map" size={4}>
					  <ReviewLocation eventData={data?.event} />
					</Grid>
				  )}
				</Grid>
						{/* Addons without datetime */}
						<Grid>
							{generalAddons?.length > 0 && (
								<Grid container direction="column" className="general-addons-section">
										<Grid container spacing={2}>
												{generalAddons?.map((addon: any, index: number) => (
													<SessionCard
													optionsData={addOnOptions}
															key={index}
															item={addon}
															titleField="name"
															fields={[
																	{ label: "Description", field: "description" },
																	{ label: "Total Seats", field: "totalSeat" },
															]}
															hasAddOns={true}
															startTimeField=''
															endTimeField=''
													/>
												))}
										</Grid>
								</Grid>
							)}
						</Grid>
					{/* Date grouped Programs and Addons */}
					{Object.keys(scheduledData)?.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort dates in ascending order
					.map((date: string,index) => (
						<Grid container size={{xs:12}}  key={date}  className="scheduled-programs-section" display={"flex"} direction={"row"}>
							<Grid container mb={2} mt={2}>
								<Grid className="custom-stepper-conference-details-content-scheduled-date">Programme & Add-ons | {date && moment(date).format("MMMM D yyyy")} | Day {index+1} </Grid>
							</Grid>
							<Grid container spacing={3} size={{xs:12}} alignItems={'center'}>
								{scheduledData[date]?.map((item: any, index: number) => (
									<SessionCard
										key={index}
										item={item}
										titleField="name"
										fields={
											[
												{ label: "Descriptions", field: "description" },
												{label: "Total Seats", field: "totalSeat"},
											]
										}
										startTimeField="startTime"
										endTimeField="endTime"
										hasAddOns={item.isAddon}
										optionsData={addOnOptions}
									/>
								))}
							</Grid>
						</Grid>
					))}
				</Grid>
    </Grid>
)});

export default ConferenceDetails;