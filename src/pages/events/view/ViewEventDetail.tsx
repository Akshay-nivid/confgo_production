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
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";
import PublishIcon from "@/assets/svg/publish.svg";
import UnpublishIcon from "@/assets/svg/unpublish.svg";
import CopyIcon from "@/assets/svg/copy-clipboard.svg";
import ShareIcon from "@/assets/svg/share.svg";


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
  published: boolean;
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

  const [value, setTabValue] = React.useState('1');
  const { setDataById }: any = useStore();
  const { setValue, control, watch} = useForm<any>();
  const {id } = useParams<Record<string, string | undefined>>();
  const [eventFullData,setEventFullData]=useState<Addon>();
  const [link, setLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('')

  

  /**
   * Method handles the click event for the tab
   * @param _event : event parameter
   * @param newValue : new value to be assigned to tab
   */
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  


  /**
   * Useeffect hook initializes the parameter and handles the get event api call
   */
  useEffect(() => {
    setErrorMessage('')
    getEventDetails();
  }, [])

  /**
   * Method handles the api call for generating slug
   */
  const handleLinkGenerationApiCall = async () => {
    try {
      const req = {
        eventId: id
      }
      const response = await apiClient.post(`event/slug/generate`, req);
      const { status, data } = await processAPIResponse(response, 'linkData');
      if (status) {
        setValue('eventLink', data)
      }
    } catch (error) {
      Logger.error('ViewEventDetail', error);
    }
  }


  /**
   *function to  get Event detail
   */
  const getEventDetails = async () => {
    try {
      const response = await apiClient.get(`event/${id}`);
      const { status, data } = await processAPIResponse(response, 'eventData');
      if (status) {
        setEventFullData(data)
        if(data.published){
          setValue('event', data.slugName? data.slugName: '')
          setLink(data);
        }
        else{
          handleLinkGenerationApiCall();
        }
      }
    } catch (error) {
      Logger.error('ViewEventDetail', error);
    }
  }

  /**
   * Method handles the api call for updating the slug
   */
  const updateSlug = async () => {
    const req = {
      eventId: id,
      slugName: watch('eventLink')
    };
    const response = await apiClient.post('event/slug', req);
    const { status, message } = await processAPIResponse(response, 'slug-update');
    if (!status) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message });
    }
  }

  /**
   * Mehod handles the publish/unpublish of the event
   */
  const handlePublish = async (published: boolean | undefined) => {
    !published && await updateSlug()
    const req = {
      eventId: id,
      published: !published
    };
    const url = published ? 'event/unpublish' : 'event/publish';
    const response = await apiClient.post(url, req);
    const { status, message } = await processAPIResponse(response, 'event-status');
    if (status) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: message });
      setErrorMessage('')
      getEventDetails();
      published && handleLinkGenerationApiCall();
    }
    else {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message });
    }
  }

  /**
   * Method handles the on blur event for the event link field
   * @param event : event parameter
   * @returns 
   */
  const handleOnBlur = async (event: any) => {
    if (event?.target?.value?.length < 5) {
      setErrorMessage('Minimun 5 characters required.')
      return;
    }
    const req = {
      slugName: event?.target?.value
    }
    const response = await apiClient.post('event/slug/isAvailable', req);
    const { status, data } = await processAPIResponse(response, 'link-availablility');
    if (status) {
      setErrorMessage(data === false ? 'Url already exist. Please enter a different url.' : '')
    }
  }

  /**
   * Method handles the click event for the copy to clipboard icon
   */
  const handleToggleSuffixIcon = () => {
    const textToCopy = watch("event");
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: 'Text copied to clipboard' });
        })
        .catch((err) => {
          Logger.error("Failed to copy text: ", err);
        });
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
              {/* <Grid>
                <CustomButton className="event-detail-event-info-card-invite-participant-btn" startIcon={<ShareOutlinedIcon />} label="Invite Participant" variant="outlined" />
              </Grid> */}
              <Grid>
              {eventFullData?.published? <Grid container size={{ xs: 12, sm: 10 }} direction={'column'}>
                <Grid container direction={'row'} size={{ xs:12, sm:12 }} className="event-detail-card-published-link">
                    <Grid className="event-detail-card-published-link-text"><CustomTextField
                                    key='event-detail-card-published-link-event'
                                    control={control}
                                    name="event"
                                    type="text"
                                    readOnly={true}
                                    suffixIconButton={<CopyIcon />}
                                    handleToggleSuffixIcon={handleToggleSuffixIcon}
                                    suffixIconSecondButton={<ShareIcon />}
                                    value={link}
                                /></Grid>
                </Grid>
            </Grid>:
            <Grid container size={{ xs: 12, sm: 10 }} direction={'column'}>
                <Grid container direction={'row'} size={{ xs:12, sm:12 }} className="event-detail-card-link">
                    <Grid className="event-detail-card-link-label">
                    <CustomTextField
                                    key='event-detail-card-published-link-event-label'
                                    control={control}
                                    name="eventLabel"
                                    type="text"
                                    defaultValue={`event-link/`}
                                    readOnly={true}
                                    
                                />
                    </Grid>
                    <Grid className="event-detail-card-link-text"><CustomTextField
                                    control={control}
                                    name="eventLink"
                                    type="text"
                                    onBlur={handleOnBlur}
                                /></Grid>
                </Grid>
                {errorMessage && <Grid container direction={'row'} size={{ xs:12, sm:12 }} className="event-detail-card-link-error-message">
                  <Typography>{errorMessage}</Typography>
                </Grid>}
            </Grid>}
              </Grid>
              <Grid>
                <CustomButton className={eventFullData?.published?"event-detail-event-info-card-unpublish-btn": "event-detail-event-info-card-publish-btn"} startIcon={eventFullData?.published?<UnpublishIcon/>:<PublishIcon />} label={eventFullData?.published? "Unpublish Event": "Publish Event"} onClick={() => handlePublish(eventFullData?.published)}/>
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
            <SepekerCard eventData={eventData} />
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