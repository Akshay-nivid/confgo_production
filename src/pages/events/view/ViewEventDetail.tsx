import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
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
import FormBuilder from "@/components/FormBuilder/FormBuilder";

const ViewEventDetail = () => {

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
  const [value, setValue] = React.useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return <Grid >
    <Grid container
      className="event-detail-card" spacing={2} >
      <Grid container size={{ xs: 12, sm: 12 }} flexDirection={"column"} >
        <Grid className="event-detail-header" size={{ xs: 12, sm: 6 }} >
          <Grid display={"flex"} >
            <Typography variant="h4">{eventData.event_name}</Typography>
            <Grid alignItems={"center"} className="event-detail-header-status">
              <Typography textAlign={"center"} variant="h6">{eventData.status}</Typography>
            </Grid>
          </Grid>
          <Typography variant="h6">{eventData.time}</Typography>
        </Grid>
      </Grid>
      <Grid container direction={"column"} size={{ xs: 12, sm: 12 }} >
        <TabContext value={value}>
        <Grid container direction={"column"} size={{ xs: 10, sm: 10 }} >
            <TabList className="event-detail-tab-layout" onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Event Information" value="1" />
              <Tab label="Speakers" value="2" />
              <Tab label="Sessions" value="3" />
              <Tab label="Location" value="4" />
              <Tab label="Users" value="5" />
              <Tab label="Template" value="6" />
              <Tab label="Custom Fields" value="7" />
            </TabList>
          </Grid>
        
          <TabPanel value="1">
            <EventInfoCard eventData={eventData} />
          </TabPanel>
          <TabPanel value="2">
            <SepekerCard eventData={eventData} />
          </TabPanel>
          <TabPanel value="3">
            <Sessions eventData={eventData} />
          </TabPanel>
          <TabPanel value="4">
            <LocationCard eventData={eventData} />
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