import { Typography } from "@mui/material";
import  Grid  from "@mui/material/Grid2";
import React from "react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const ViewEventDetail=()=>{

const eventData={
    event_name:'Annual Cardiology Symposium',
    time:"Aug 26, 2024 11:27 am",
    status:"Pending",
    type:"Online",
    event_info:"Vestibulum tempus imperdiet sem ac porttitor. Vivamus pulvinar commodo orci, suscipit porttitor velit elementum non. Fusce nec pellentesque erat, id lobortis nunc. Donec dui leo, ultrices quis turpis nec, sollicitudin sodales tortor. Aenean dapibus magna quam, id tincidunt quam placerat consequat. Nulla eu laoreet ex. Vestibulum nec vulputate turpis, id euismod orci. Phasellus consectetur tortor est. Donec lectus ex, rhoncus ac consequat at, viverra sit amet sem. Aliquam sed vestibulum nibh. Phasellus ut lorem pharetra, placerat urna id, tincidunt quam. Praesent non ex congue, tristique risus quis, blandit purus. Sed tristique sapien ut vehicula pretium. Donec purus metus, vulputate sit amet ullamcorper vel, aliquet ac lectus.",
    speakers:[
        {

        },{},{},{}
    ],
    sessions:[
        {},{}
    ],
    location:{
        lat:'',
        long:""
    },
    users:[
        {},{}
    ],
    template:[
        {},{}
    ]


}    
const [value, setValue] = React.useState('1');

const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  setValue(newValue);
};

return<Grid >
    <Grid container
     className="event-detail-card" spacing={2} > 
        <Grid container size={{xs:12,sm:12}}>
            <Typography textAlign={"center"} variant="h4">{eventData.event_name}</Typography>
        </Grid>
        <Grid container direction={"column"}>
        <TabContext value={value}>
        <Grid>
          <TabList className="event-detail-tab-layout"  onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Event Information" value="1" />
            <Tab label="Speakers"value="2" />
            <Tab label="Sessions" value="3" />
            <Tab label="Locations" value="4" />
            <Tab label="Users" value="5" />
            <Tab label="Template" value="6" />
          </TabList>
        </Grid>
        <TabPanel value="1">
          
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
        <TabPanel value="4">Item Four</TabPanel>
        <TabPanel value="5">Item Five</TabPanel>
        <TabPanel value="6">Item Six</TabPanel>
      </TabContext>
        </Grid>
         </Grid>
</Grid>

}

export default ViewEventDetail;