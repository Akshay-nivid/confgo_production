/**
 * Component handles the speaker dashboard
 */
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import { findEventStatus } from '@/Utils/CommonBaseClass';
import { DataGridList } from '@/components/DataGrid/DataGridList';
import { NoEvent as NoEventIcon } from "@/assets/svg";
import StatusComponent from '@/components/Status/StatusComponent';
import { useNavigate } from 'react-router-dom';
import routes from "@/router/routes";
import { ISource } from '@/Libs/types/type';



const SpeakerHome: React.FC<any> = () => {

   
      const [source, setSource] = useState<ISource | undefined>(undefined);

      const speakerName = sessionStorage.getItem("name");

      const navigate = useNavigate();

   /**
   * fetch datas of Events
   */
    useEffect(()=>{
          (async()=>{
            const eventSpeakerListReq = {
                offset: 0,
                limit: 100,
                sortBy: "id",
                sortDirection: "DESC",
            };
            setSource({
            url:`eventSpeaker/assigned/events`,
            method:"POST",
            data: eventSpeakerListReq,
            listName: 'eventSpeakerList',
            })
        }

          )();
    },[]);

    const columns = [
        { type: "default", field: "eventId", headerName: "ID", width: 150 },
        {
            type: "default",
            field: "eventName",
            headerName: "Event Name",
            width: 800,
        },
        { type: "default", field: "eventType", headerName: "Type", width: 150 },
        { type: "custom", field: "eventStatus", headerName: "Status", width: 150, sortable: false },
    ];

    /**
    *Row click navigation
    */
    const handleRowClick = (data: any) => {
   
        navigate(routes.speakerDetails(data?.id))
    };

    /**
    * Transforms the raw data from the API to match the required format for the DataGrid component.
    * @param data - The raw data from API response
    * @returns Transformed data for DataGrid
    */
    const transformData = (data: any) => {
        if (!data) return [];
        return data.map((item: any) => {
            return {
                ...item,
                eventId:item?.id,
                eventName:item?.name,
                eventType:item?.eventClass,
                eventStatus: <Grid container style={{ display: 'flex', alignItems: 'center' }} className="speaker-home-list-status"><StatusComponent className="data-grid-status" value={findEventStatus(item?.id)} /></Grid>
            };
        });
    };


    return (
        <Grid container className="speaker-home" size={{ xs: 12, sm: 12 }}>
            <Grid size={{ xs: 12, sm: 12 }} className="speaker-home-banner-container">
                <Typography className="speaker-home-banner-title">{`Welcome, ${speakerName}! 👋`}</Typography>
                <Typography className="speaker-home-banner-subtitle">Simplifying your tasks for the upcoming event.</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
                <DataGridList
                    source={source}
                    dataTransformer={transformData}
                    onRowClick={(params: any) => handleRowClick(params.row)}
                    title="Events"
                    columns={columns}
                    id="event-speaker-home-lists"
                    noRecordIcon={<NoEventIcon className="event-list-no-events-icon" />}
                    noRecordSubtitle="It seems you are not associated with any events."
                    hideFooterPagination={false}
                />
            </Grid>

        </Grid>
    )
}

export default SpeakerHome

