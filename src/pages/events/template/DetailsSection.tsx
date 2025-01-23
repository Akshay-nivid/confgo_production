/**
 * Component displays the details section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import {Typography } from '@mui/material';
import LocationIcon from '@/assets/svg/template1-location.svg';
import CalendarIcon from '@/assets/svg/template1-calendar.svg';
import EmailIcon from '@/assets/svg/template1-email.svg';
import PhoneIcon from '@/assets/svg/template1-phone.svg';
import LinkIcon from '@/assets/svg/template1-url.svg';
import {  formatDateRange, toTitleCase, truncateString } from '@/Utils/CommonBaseClass';
import CustomTooltip from '@/components/CustomToolTip/CustomTooltip';

type DetailsSectionProps = {
    data?: any;
    classPrefix?: string;
    temp?: any;
}


/**
 * Component displays the details section of the template
 */
const DetailsSection: React.FC<DetailsSectionProps> = React.memo(({ data, classPrefix, temp }) => {
    

   

        //Create item array dynamically based on Event Class
        const itemArray = [];
        if (data?.eventClass === "ONLINE") {
          itemArray.push({ icon: <LinkIcon />, label: "Website link", value: data?.url || "" });
        } else {
          itemArray.push({ icon: <LocationIcon />, label: "Location", value: data?.venue?.address || "" });
        }
        itemArray.push({
          icon: <CalendarIcon />,
          label: "Date",
          value: formatDateRange(data?.startTime, data?.endTime),
        });
        itemArray.push({ icon: <EmailIcon />, label: "Email", value: data?.eventContacts[0]?.email || "" });
        if (data?.eventClass === "HYBRID") {
          itemArray.push({ icon: <LinkIcon />, label: "Website link", value: data?.url || "" });
        } else {
          itemArray.push({ icon: <PhoneIcon />, label: "Phone", value: data?.eventContacts[0]?.phone || "" });
        }
     


    return (
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-container`}>
            <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} justifyContent={'center'} alignItems={'center'}>
                <Grid size={{ xs: 12, sm: 12 }} container className={`${classPrefix}-item`} spacing={1}>
                    {
                        itemArray?.map((item: any,index:number) => {
                            return <Grid   className={
                                index === 2
                                  ? `${classPrefix}-index-box`
                                  : `${classPrefix}-box`
                              }  container size={{ xs: 12, sm: 3 }} direction={'column'} justifyContent={temp === 2? 'center': 'flex-start'} alignItems={temp === 2? 'center': 'flex-start'} columnGap={"2rem"}>
                                <Grid   className={
                                  index === 2
                                  ? `${classPrefix}-index-icon`
                                  : `${classPrefix}-icon`
                                   }>{item.icon} </Grid>
                                <Grid><Typography className={`${classPrefix}-label`}>{item.label}</Typography></Grid>
                                <Grid>
                                    <CustomTooltip title={item.value}>
                                    <Typography className={`${classPrefix}-value`} textAlign={temp === 2? 'center': 'left'}> {truncateString(toTitleCase(item.value),35, "Untitled")}
                                    </Typography>
                                    </CustomTooltip>
                                    </Grid>
                                    {index === 0 ? (<Grid className={`${classPrefix}-border-line`} />) : null}
                            </Grid>
                        })
                        
                    }
                </Grid>
            </Grid></Grid>)
                                      

});

export default DetailsSection;
