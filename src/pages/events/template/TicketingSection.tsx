/**
 * Component displays the ticketing section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Typography } from '@mui/material';
import CustomButton from '@/components/CustomButton/CustomButton';


type TicketingSectionProps = {
    data?: any;
    temp: number | undefined;
}

const eventData = {
    "id": 6,
    "name": "Health Club",
    "description": "Blood Test Camp",
    "startTime": "2024-10-25T00:00:00.000Z",
    "endTime": "2024-11-30T00:00:00.000Z",
    "venueId": 4,
    "eventClass": "ONLINE",
    "interval": " not required ",
    "companyId": 12,
    "title": "Blood Test",
    "amount": "100.00",
    "discount": 0,
    "statusId": 1,
    "slugName": "https://www.health.com",
    "published": true,
    "venue": {
        "id": 4,
        "name": "Science Hall",
        "address": "Left block",
        "city": "Bangalore",
        "state": "Karnataka",
        "country": "INDIA",
        "postCode": null,
        "totalCapacity": 100,
        "mapUrl": null
    },
    "status": {
        "id": 1,
        "statusName": "ACTIVE",
        "description": "ACTIVE"
    },
    "templateId": 0,
    "eventPriceTiers": [
        {
            "id": 1,
            "name": "firstRegistration",
            "description": "Price tier for who registering early.",
            "participantTypeId": 9,
            "eventId": 6,
            "percentage": "25",
            "startDate": "2024-11-12T00:00:00.000Z",
            "endDate": "2024-12-12T00:00:00.000Z",
            "participantType": {
                "id": 9,
                "name": "Doctors",
                "eventId": 6,
                "description": null
            }
        },
        {
            "id": 5,
            "name": "secondRegistration",
            "description": "Price tier for who registering after one month.",
            "participantTypeId": 9,
            "eventId": 6,
            "percentage": "10",
            "startDate": "2024-12-13T00:00:00.000Z",
            "endDate": "2025-01-13T00:00:00.000Z",
            "participantType": {
                "id": 9,
                "name": "Doctors",
                "eventId": 6,
                "description": null
            }
        },
        {
            "id": 6,
            "name": "thirdRegistration",
            "description": "Price tier for who registering after two month.",
            "participantTypeId": 9,
            "eventId": 6,
            "percentage": "15",
            "startDate": "2025-01-14T00:00:00.000Z",
            "endDate": "2025-02-14T00:00:00.000Z",
            "participantType": {
                "id": 9,
                "name": "Doctors",
                "eventId": 6,
                "description": null
            }
        },
        {
            "id": 7,
            "name": "fourthRegistration",
            "description": "Price tier for who registering after two month.",
            "participantTypeId": 10,
            "eventId": 6,
            "percentage": "15",
            "startDate": "2025-01-14T00:00:00.000Z",
            "endDate": "2025-02-14T00:00:00.000Z",
            "participantType": {
                "id": 10,
                "name": "Student",
                "eventId": 6,
                "description": null
            }
        },
        {
            "id": 8,
            "name": "firstRegistration",
            "description": "Price tier for who registering early.",
            "participantTypeId": 10,
            "eventId": 6,
            "percentage": "25",
            "startDate": "2024-11-12T00:00:00.000Z",
            "endDate": "2024-12-12T00:00:00.000Z",
            "participantType": {
                "id": 10,
                "name": "Student",
                "eventId": 6,
                "description": null
            }
        },
        {
            "id": 9,
            "name": "fourthRegistration",
            "description": "Price tier for who registering after two month.",
            "participantTypeId": 8,
            "eventId": 6,
            "percentage": "5",
            "startDate": "2025-01-14T00:00:00.000Z",
            "endDate": "2025-02-14T00:00:00.000Z",
            "participantType": {
                "id": 8,
                "name": "Employee",
                "eventId": 6,
                "description": null
            }
        },
        {
            "id": 10,
            "name": "firstRegistration",
            "description": "Price tier for who registering early.",
            "participantTypeId": 8,
            "eventId": 6,
            "percentage": "10",
            "startDate": "2024-11-12T00:00:00.000Z",
            "endDate": "2024-12-12T00:00:00.000Z",
            "participantType": {
                "id": 8,
                "name": "Employee",
                "eventId": 6,
                "description": null
            }
        },
    ],
    "eventProgramSchedules": [
        {
            "id": 2,
            "eventId": 6,
            "programType": "Online",
            "name": "james",
            "phone": "9876543211",
            "email": "mailto:nihal@gmail.com",
            "bio": "nil",
            "assetId": 1,
            "description": "nil",
            "startTime": "12:00:00",
            "endTime": "07:00:00",
            "topic": "nothing",
            "language": "english",
            "mediaUrl": "https://bbc.com",
            "designation": "HR",
            "statusId": 2
        }
    ],
    "programs": [
        {
            "id": 7,
            "parentId": 6,
            "name": "sdv",
            "description": "d",
            "startTime": "2024-11-25T00:00:00.000Z",
            "endTime": "2024-11-25T00:00:00.000Z",
            "venueId": 4,
            "eventClass": "ONLINE",
            "interval": " not required ",
            "companyId": 12,
            "title": "Dengue Testing",
            "amount": "25.00",
            "discount": null,
            "statusId": 1,
            "registrationDeadline": null,
            "slugName": null,
            "published": false,
            "url": null,
            "speciality": null,
            "templateId": null,
            "status": {
                "id": 1,
                "statusName": "ACTIVE",
                "description": "ACTIVE"
            }
        },
        {
            "id": 8,
            "parentId": 6,
            "name": "Maleria test",
            "description": "testing blood",
            "startTime": "2024-10-25T00:00:00.000Z",
            "endTime": "2024-10-30T00:00:00.000Z",
            "venueId": 4,
            "eventClass": "ONLINE",
            "interval": " not required ",
            "companyId": 12,
            "title": "Maleria Testing",
            "amount": "25.00",
            "discount": null,
            "statusId": 1,
            "registrationDeadline": null,
            "slugName": null,
            "published": false,
            "url": null,
            "speciality": null,
            "templateId": null,
            "status": {
                "id": 1,
                "statusName": "ACTIVE",
                "description": "ACTIVE"
            }
        }
    ],
    "addons": [
        {
            "id": 9,
            "eventId": 6,
            "addonId": 4,
            "companyId": 9,
            "amount": "100.00",
            "tier": "not rquired",
            "startTime": "2024-10-25T00:00:00.000Z",
            "endTime": "2024-10-30T00:00:00.000Z",
            "description": null,
            "statusId": null,
            "addon": {
                "id": 4,
                "name": "dinner",
                "description": "Night food",
                "companyId": 12,
                "owner": "richards",
                "enabled": 1,
                "assetId": null
            },
            "eventAddonProperties": [
                {
                    "id": 9,
                    "name": "veg",
                    "amount": "200.00",
                    "eventAddonId": 9,
                    "description": null,
                    "enabled": 1,
                    "assetId": null
                },
                {
                    "id": 13,
                    "name": "veg",
                    "amount": "200.00",
                    "eventAddonId": 9,
                    "description": null,
                    "enabled": 1,
                    "assetId": null
                },
                {
                    "id": 14,
                    "name": "non veg",
                    "amount": "250.00",
                    "eventAddonId": 9,
                    "description": null,
                    "enabled": 1,
                    "assetId": null
                }
            ]
        }
    ]
}

const TicketingSection: React.FC<TicketingSectionProps> = React.memo(({ temp }) => {

    const classPrefix = `event-template-ticketing-${temp}`;


    /**
     * Method calculates the total amount
     * @param data : event data
     * @returns 
     */
    const calculateTotalAmount = (data: any) => {
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
        traverse(data);

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
                const percentage = parseFloat(item.percentage) / 100;
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

    const totalAmount = calculateTotalAmount(eventData);
    const amountCalculatedData = calculateAmounts(groupByParticipantTypeId(eventData?.eventPriceTiers), totalAmount);

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} justifyContent={'center'} alignItems={'center'} spacing={2} direction={'column'}>
        <Grid><Typography className={`${classPrefix}-title`}>Registration & Ticketing</Typography></Grid>

        <Grid container spacing={2}>
            {
                Object.keys(amountCalculatedData)
                    .map((participantType: any) => {
                        return <Grid size={{ xs: 12, sm: 6 }} key={participantType} className={`${classPrefix}-item-container`}>
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
                                                        <Typography className={`${classPrefix}-sub-item-amount`}>₹{item.calculatedAmount.toFixed(2)}</Typography>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })
                                }
                            </Grid>
                            <Grid container justifyContent={'center'} alignItems={'flex-end'} className={`${classPrefix}-register-button-container`}><CustomButton label="Register Now" className={`${classPrefix}-register-button`} /></Grid>

                        </Grid>
                    })
            }
        </Grid>
    </Grid>
});

export default TicketingSection;

