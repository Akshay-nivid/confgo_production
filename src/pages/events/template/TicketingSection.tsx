/**
 * Component displays the ticketing section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Typography } from '@mui/material';
import CustomButton from '@/components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { setDataById } from '@/Libs/store';


type TicketingSectionProps = {
    data?: any;
    temp?: number | undefined;
    ref: React.RefObject<HTMLDivElement>;
    classPrefix?: any;
}

const TicketingSection = React.memo(
    React.forwardRef<HTMLDivElement, TicketingSectionProps>(({ data, classPrefix }, ref) => {

        const navigate = useNavigate()



        /**
         * Method calculates the total amount
         * @param amountData : event data
         * @returns 
         */
        const calculateTotalAmount = (amountData: any) => {
            let totalAmount = 0;

            function traverse(node: any) {
                // If the current node has an 'amount', add it to the total
                if (node.amount) {
                    totalAmount += parseFloat(node.amount) || 0;
                }

                // Recursively traverse through arrays or objects
                for (const key in node) {
                    if (Array.isArray(node[key])) {
                        node[key].forEach(traverse);
                    } else if (typeof node[key] === 'object' && node[key] !== null) {
                        traverse(node[key]);
                    }
                }
            }

            // Start traversal from the root
            traverse(amountData);

            return totalAmount;
        }
        /**
         * Method groups the event price tiers array based on participant 
         * @param array : event price tiers array
         * @returns 
         */
        const groupByParticipantTypeId = (array: any) => {
            return array.reduce((result: any, item: any) => {
                // Use the participantTypeId as the key
                const key = item.participantType.name;

                // Initialize the group if it doesn't exist
                if (!result[key]) {
                    result[key] = [];
                }

                // Add the item to the corresponding group
                result[key].push(item);

                return result;
            }, {});
        }

        /**
         * Method calculates the tier amount based on percentage and total amount
         * @param groupedData : grouped event price tiers array 
         * @param totalAmount : total amount
         * @returns 
         */
        const calculateAmounts = (groupedData: any, totalAmount: any) => {
            // Loop through each group
            Object.keys(groupedData).forEach((participantTypeId) => {
                groupedData[participantTypeId].forEach((item: any) => {
                    // Convert percentage to a decimal and calculate the amount
                    const percentage = 1 - (parseFloat(item.percentage) / 100);
                    item.calculatedAmount = totalAmount * percentage;
                });
            });
            return groupedData;
        }


        /**
         * Method transforms the start date and end date to Nov 12, 2024 - Dec 12, 2024 format
         * @param startDate : start date
         * @param endDate : end date
         * @returns 
         */
        const formatDateRange = (startDate: any, endDate: any) => {

            const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
            const start = new Date(startDate).toLocaleDateString('en-US', options);
            const end = new Date(endDate).toLocaleDateString('en-US', options);
            return `${start} - ${end}`;

        }

        /**
        * Handles the click event of the 'Register' button
        * by setting the participantTypeId in the store and navigating to the program selection page
        * @param {object} tierData - contains the participantTypeId and tierName
        */
        function handleClickRegister(tierData: any) {

            setDataById('participantTypeId', { value: tierData.participantTypeId });

            navigate(routes.programSelection())
        }



        const totalAmount = calculateTotalAmount(data);

        const amountCalculatedData = calculateAmounts(groupByParticipantTypeId(data?.eventPriceTiers), totalAmount);


        return <Grid ref={ref} container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} justifyContent={'center'} alignItems={'center'} spacing={2} direction={'column'}>
            <Grid><Typography className={`${classPrefix}-title`}>Registration & Ticketing</Typography></Grid>

            <Grid className={'anim-container'} container spacing={2}>
                {
                    Object.keys(amountCalculatedData)
                        .map((participantType: any) => {

                            return (

                                <Grid size={{ xs: 12, sm: 6 }} key={participantType} className={`${classPrefix}-item-container anim-item`}>
                                    <Grid container justifyContent={'center'}>
                                        <Typography className={`${classPrefix}-item-title`}>
                                            {participantType}
                                        </Typography>
                                    </Grid>
                                    <Grid className={`${classPrefix}-content-container`}>
                                        {
                                            amountCalculatedData[participantType]
                                                .map((item: any) => {
                                                    const dateRange = formatDateRange(item.startDate, item.endDate);
                                                    return (
                                                        <Grid container className={`${classPrefix}-sub-item-container`} justifyContent={'space-between'}>
                                                            <Grid container direction={'column'}>
                                                                <Grid><Typography className={`${classPrefix}-sub-item-name`}>{item.name}</Typography></Grid>
                                                                <Grid><Typography className={`${classPrefix}-sub-item-date`}>{dateRange}</Typography></Grid>
                                                            </Grid>
                                                            <Grid container alignItems={'center'}>
                                                                <Typography className={`${classPrefix}-sub-item-amount`}>{parseFloat(item?.percentage)}% OFF</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    );
                                                })
                                        }
                                    </Grid>
                                    <Grid container justifyContent={'center'} alignItems={'flex-end'} className={`${classPrefix}-register-button-container`}><CustomButton onClick={() => handleClickRegister(amountCalculatedData[participantType]?.[0])} label="Register Now" className={`${classPrefix}-register-button`} /></Grid>

                                </Grid>)
                        })
                }
            </Grid>
        </Grid>
    }));

export default TicketingSection;

