/**
 * ConferenceDetails component displays the conference details
 */
import { toSentenceCase } from '@/Utils/CommonBaseClass';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import moment from 'moment';
import React from 'react';
import parse from 'html-react-parser';
import DateIcon from '@/assets/svg/event-date.svg';
import LocationIcon from '@/assets/svg/event-location.svg';
import SessionCard from './view/sessionCard';


type ConferenceDetailsProps = {
    data: any;
    addOnOptions?: any;
}

const ConferenceDetails: React.FC<ConferenceDetailsProps> = React.memo(({ data,addOnOptions }) => {
    const startDate = moment(data?.event?.startDate).format("MMMM D, YYYY");
    const endDate = moment(data?.event?.endTime).format("MMMM D, YYYY");
    /**
     * Method checks the start and end date matches or not
     * @param start 
     * @param end 
     * @returns 
     */
    const checkDateCondition = (start: any, end: any) => {
        return new Date(start) === new Date(end);
    }

		/**
		* Group programs and addons by date,and general addons without dates
		*/
		const combinedData = data?.program?.concat(data?.addOns || []).reduce((acc:any, item:any) => {
			const isAddon = !!item.addonId;
			let date = '';
			
			if (item.startDate) {
				date = moment(item.startDate, ['YYYY-MM-DD', 'DD/MM/YYYY']).format("YYYY-MM-DD");
			}
			else if (item.date) {
				date = moment(item.date).format("YYYY-MM-DD");
			}
			// Skip invalid items: 
			if (!date || (isAddon && !item.addonId) || (!item.name && !item.addonId)) {
				return acc;  // Do not add to accumulator if invalid
			}
			// Separate addOns with `dateRequired: false`
			if (isAddon && item.dateRequired === false) {
				// Create 'withoutDateRequired' array if it doesn't exist
				if (!acc.general) {
					acc.general = [];
				}
				acc.general.push({ ...item, isAddon });
			} else {
				// Initialize the group for this date if it doesn't exist
				if (!acc[date]) {
					acc[date] = [];
				}
				// Add the item to the group for this date
				acc[date].push({ ...item, isAddon });
			}
			return acc;
		}, {});		

		/**
		 * Separate general addons without dates from combinedData
		 */
		const { general: generalAddons = [], ...scheduledData } = combinedData;
    return <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'center'} alignItems={'center'} className="custom-stepper-conference-details" padding={3}>
        <Grid size={{ xs: 12, sm: 12 }} justifyContent={'start'} ml={3}>
            <Typography variant="h3" className="custom-stepper-conference-details-content-title">Review And Submit</Typography>
        </Grid>
        <Grid container direction={'column'} size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-container" spacing={2}>
            <Grid container size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-header-container" alignItems={'center'}>
                <Typography variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">{data?.event?.name}</Typography>
            </Grid>
            {data?.event?.type && <Grid container sx={{ width: 'fit-content' }} className="custom-stepper-conference-details-content-type" justifyContent={'flex-start'} alignItems={'center'}>
                {toSentenceCase(data.event.type)}
            </Grid>}
            <Grid container size={{ xs: 12, sm: 12 }} spacing={2}>
                <Grid className="custom-stepper-conference-details-content-date-icon"><DateIcon /></Grid>
                <Grid>{checkDateCondition(data?.event?.startDate, data?.event?.endTime) ? startDate : `${startDate} - ${endDate}`}</Grid>
            </Grid>
            {data?.event?.type !== 'ONLINE' && data?.event?.location && <Grid container size={{ xs: 12, sm: 12 }} spacing={2}>
                <Grid className="custom-stepper-conference-details-content-date-icon"><LocationIcon /></Grid>
                <Grid>{data?.event?.location}</Grid>
            </Grid>}
			<Grid className='custom-stepper-parse'>{parse(data?.event?.description)}</Grid>
            <Grid container size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-header-container" alignItems={'center'}>
                <Typography variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">Scheduled Programmes</Typography>
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
					{Object.keys(scheduledData)?.map((date: string) => (
						<Grid container direction="column" key={date} className="scheduled-programs-section">
							<Grid
								container
								sx={{ width: "fit-content" }}
								className="custom-stepper-conference-details-content-date"
								justifyContent="space-around"
								alignItems="center"

							><Grid size={1}><DateIcon /></Grid>
								<Grid>{date && moment(date).format("MMMM D")}</Grid>
								
								</Grid>
							<Grid container spacing={3} size={12}>
								{scheduledData[date]?.map((item: any, index: number) => (
									<SessionCard
										key={index}
										item={item}
										titleField="name"
										fields={
											[
												{ label: "Description", field: "description" },
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
});

export default ConferenceDetails;