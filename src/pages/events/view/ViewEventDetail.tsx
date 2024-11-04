import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EventInfoCard from "./EventInfoCard";
import SepekerCard from "./SpeakerCard";
import Sessions from "./Sessions";
import LocationCard from "./LocationCard";
import UserListCard from "./UserListCard";
import TemplateCard from "./TemplateCard";
import { Logger } from "@/Utils/Logger";
import apiClient from "@/Libs/Https/API-client";
import { useParams } from "react-router-dom";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import moment from "moment";
import FormBuilder from "@/components/FormBuilder/FormBuilder";
import StatusComponent from "@/components/Status/StatusComponent";
import CustomButton from "@/components/CustomButton/CustomButton";
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import useStore from "@/Libs/store";


interface Status {
  id: number;
  statusName: string;
  description: string;
}

interface Program {
  amount: string;
  companyId: number;
  description: string;
  discount: number | null;
  endTime: string;
  eventClass: string;
  id: number;
  interval: string;
  name: string;
  parentId: number;
  startTime: string; 
  status: Status;
  statusId: number;
  title: string;
  venueId: number;
}

interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface Addon {
  addons: Program[];
  amount: string;
  companyId: number;
  description: string;
  discount: number;
  endTime: string; 
  eventClass: string;
  id: number;
  interval: string;
  name: string;
  programs: Program[];
  startTime: string; 
  status: Status;
  statusId: number;
  title: string;
  venue: Venue;
  venueId: number;
}
const eventData = {
  event_name: 'Annual Cardiology Symposium',
  time: "Aug 26, 2024 11:27 am",
  status: "Pending",
  type: "Online",
  event_info: "Vestibulum tempus imperdiet sem ac porttitor. Vivamus pulvinar commodo orci, suscipit porttitor velit elementum non. Fusce nec pellentesque erat, id lobortis nunc. Donec dui leo, ultrices quis turpis nec, sollicitudin sodales tortor. Aenean dapibus magna quam, id tincidunt quam placerat consequat. Nulla eu laoreet ex. Vestibulum nec vulputate turpis, id euismod orci. Phasellus consectetur tortor est. Donec lectus ex, rhoncus ac consequat at, viverra sit amet sem. Aliquam sed vestibulum nibh. Phasellus ut lorem pharetra, placerat urna id, tincidunt quam. Praesent non ex congue, tristique risus quis, blandit purus. Sed tristique sapien ut vehicula pretium. Donec purus metus, vulputate sit amet ullamcorper vel, aliquet ac lectus.",
  speakers: [
    {
      name: "Dr. John Doe",
      designation: "Cardiologist",
      organization: "John Doe Hospital",
      profile_image: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.1819120589.1728432000&semt=ais_hybrid"

    }, {
      name: "Dr. Jane Doe",
      designation: "Cardiologist",
      organization: "Jane Doe Hospital",
      profile_image: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.1819120589.1728432000&semt=ais_hybrid"
    }, {
      name: "Dr. John Doe",
      designation: "Cardiologist",
      organization: "John Doe Hospital",
      profile_image: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.1819120589.1728432000&semt=ais_hybrid"
    },
    {
      name: "Dr. John Doe",
      designation: "Cardiologist",
      organization: "John Doe Hospital",
      profile_image: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.1819120589.1728432000&semt=ais_hybrid"
    },

  ],
  sessions: [
    {
      title: "Session 1",
      description: "This is the description of the session 1",
      date: "Aug 26, 2024 11:27 am",
      time: "Aug 26, 2024 11:27 am",
      location: "Online",
      speakers: [
        {
          name: "Dr. John Doe",

        },
        {
          name: "Dr.Doe",
        },
        {
          name: "Dr. John",
        }
      ]
    }, {
      title: "Session 2",
      description: "This is the description of the session 2",
      date: "Aug 26, 2024 11:27 am",
      time: "Aug 26, 2024 11:27 am",
      location: "Online",
      speakers: [
        {
          name: "Dr. John Doe",
        },
        {
          name: "Dr. Doe",
        },
        {
          name: "Dr. John",
        }
      ]
    }
  ],
  location: {
    lat: '',
    long: ""
  },
  users: [
    {}, {}
  ],
  template: [
    {}, {}
  ]


}


const ViewEventDetail = () => {

  const [value, setValue] = React.useState('1');
  const { setDataById }: any = useStore();
  


  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const {id } = useParams<Record<string, string | undefined>>();
  const [eventFullData,setEventFullData]=useState<Addon>();
  useEffect(() => {
    getEventDetails();
  }, [])
  /**
   *function to  get Event detail
   */
  const getEventDetails = async () => {
    try {
      const response = await apiClient.get(`event/${id}`);
      const { status, data } = await processAPIResponse(response, 'eventData');
      if (status) {
        setEventFullData(data)
      }
    } catch (error) {
      Logger.error('ViewEventDetail', error);
    }
  }

  /**
   * Mehod handles the publish/unpublish of the event
   */
  const handlePublish = async () => {
    const req = {
      "eventId": id,
      "published":true
    };
    const response = await apiClient.post('event/publish', req);
    const { status, message } = await processAPIResponse(response, 'event-status');
    if (status) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: message });
    }
    else {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message });
    }
  }

  return <Grid >
    <Grid container
      className="event-detail-card" spacing={2} >
      <Grid size={{ xs: 12, sm: 12 }} flexDirection={"column"} >
        <Grid className="event-detail-header" size={{ xs: 12, sm: 6 }} >
          <Grid container justifyContent={'space-between'}>
            <Grid container>
              <Grid>
                <Typography variant="h4">{eventFullData?.name}</Typography>
              </Grid>
              <Grid>
                {eventFullData?.statusId &&
                  <Grid ml={2}> <StatusComponent value={eventFullData?.statusId.toString()} /></Grid>}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid>
                <CustomButton className="event-detail-event-info-card-invite-participant-btn" startIcon={<ShareOutlinedIcon />} label="Invite Participant" variant="outlined" />
              </Grid>
              <Grid>
                <CustomButton className="event-detail-event-info-card-publish-btn" startIcon={<DoneOutlineOutlinedIcon />} label="Publish Event" onClick={handlePublish}/>
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="h6">{moment(eventFullData?.startTime).format('MMM D, YYYY h:mm a')}</Typography>
        </Grid>
      </Grid>
      <Grid container direction={"column"} size={{ xs: 12, sm: 12 }} >
        <TabContext value={value}>
        <Grid container direction={"column"} size={{ xs: 10, sm: 10 }} >
            <TabList className="event-detail-tab-layout" onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Event Information" value="1" />
              <Tab label="Event Contributors" value="2" />
              <Tab label="Sessions" value="3" />
              <Tab label="Location" value="4" />
              <Tab label="Users" value="5" />
              <Tab label="Template" value="6" />
              <Tab label="Custom Fields" value="7" />
            </TabList>
          </Grid>
          <TabPanel value="1">
            <EventInfoCard eventData={eventFullData} />
          </TabPanel>
          <TabPanel value="2">
            <SepekerCard eventData={eventFullData} />
          </TabPanel>
          <TabPanel value="3">
            <Sessions eventData={eventFullData} />
          </TabPanel>
          <TabPanel value="4">
            <LocationCard  />
          </TabPanel>
          <TabPanel value="5">
            <UserListCard />
          </TabPanel>
          <TabPanel value="6">
            <TemplateCard />
          </TabPanel>
          <TabPanel value="7">
            <FormBuilder />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  </Grid>

}

export default ViewEventDetail;