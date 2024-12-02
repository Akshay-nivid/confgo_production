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
import FormBuilder from "@/components/FormBuilder";
import StatusComponent from "@/components/Status/StatusComponent";
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore from "@/Libs/store";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";
import PublishIcon from "@/assets/svg/publish.svg";
import UnpublishIcon from "@/assets/svg/unpublish.svg";
import CopyIcon from "@/assets/svg/external-link.svg";
import ShareIcon from "@/assets/svg/share.svg";
import config from '../../../../config.json';
import ShareInvitationDrawer from "./ShareInvitationDrawer";
import PriceTierList from "./PriceTierList";
import CustomActionModal from "@/components/CustomActionModal/CustomActionModal";
import { PublishTickIcon, WarningIcon } from "@/assets/svg";



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
  mapUrl:string;
  postCode:string;
  country:string
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
  slugName: string;
}

const ViewEventDetail = () => {

  const [value, setTabValue] = React.useState('1');
  const { setDataById }: any = useStore();
  const { setValue, control, watch} = useForm<any>();
  const {id } = useParams<Record<string, string | undefined>>();
  const [eventFullData,setEventFullData]=useState<Addon>();
  const [link, setLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [openModal,setOpenModal]=useState(false);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	// Functions to open and close the drawer.
	const openDrawer = () => setIsDrawerOpen(true);
	const closeDrawer = () => setIsDrawerOpen(false);

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
          
          setValue('event', data.slugName? `event-link/${data.slugName}`: '')
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
   * Mehod handles the publish/unpublish using the modal
   */
  const handlePublishUnPublish = () => {
    setOpenModal(!openModal);
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
      setOpenModal(false);
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
      slugName: event?.target?.value,
      eventId: id
    }
    const response = await apiClient.post('event/slug/isAvailable', req);
    const { status, data } = await processAPIResponse(response, 'link-availablility');
    if (status) {
      setErrorMessage(data === false ? 'Url already exist. Please enter a different url.' : '')
    }
  }

  /**
   * Method handles the copy to clipboard functionality
   */
  const handleEventCopy = () => {
    const textToCopy = watch("event");
    if (textToCopy) {
      const subDomain = config['event-link']['sub-domain'];
      navigator.clipboard.writeText(`${subDomain}${textToCopy}`)
        .then(() => {
          setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: 'Text copied to clipboard' });
        })
        .catch((err) => {
          Logger.error("Failed to copy text: ", err);
        });
    }
  }

  /**
   * Method handles the click event for the copy to clipboard icon
   */
  const handleToggleSuffixIcon = () => {
    const url = `/event-link/${eventFullData?.slugName}`;
    window.open(url, '_blank');
  }

  /**
   * Method gets triggered when successfully submitting the edit form
   */
  const handleSubmitHandler = () => {
    getEventDetails();
  }
  return <Grid >
    <Grid container
      className="event-detail-card" >
      <Grid size={{ xs: 12, sm: 12 }} flexDirection={"column"} >
        <Grid className="event-detail-header" size={{ xs: 12, sm: 12 }} >
          <Grid container justifyContent={'space-between'} alignItems={"center"}>
            <Grid container>
              <Grid >
                <Typography variant="h4" className="event-detail-header-title">{eventFullData?.name}</Typography>
              </Grid>
              <Grid>
                {eventFullData?.statusId &&
                  <Grid ml={2}> <StatusComponent value={eventFullData?.statusId.toString()} /></Grid>}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid>
              {eventFullData?.published? <Grid container size={{ xs: 12, sm: 12 }} direction={'column'}>
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
									                  handleToggleSuffixSecondIcon={openDrawer}
                                    value={link}
                                    onClick={handleEventCopy}
                                /></Grid>
                </Grid>
            </Grid>:
            <Grid container size={{ xs: 12, sm: 12 }} direction={'column'}>
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
                <CustomButton className={eventFullData?.published?"event-detail-event-info-card-unpublish-btn": "event-detail-event-info-card-publish-btn"} startIcon={eventFullData?.published?<UnpublishIcon/>:<PublishIcon />} label={eventFullData?.published? "Unpublish Event": "Publish Event"} onClick={() =>{ handlePublishUnPublish()}}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction={"column"} size={{ xs: 12, sm: 12 }} className="event-detail-tab-layout-container">
        <TabContext value={value}>
        <Grid container direction={"column"} size={{ xs: 12, sm: 12 }} >
            <TabList className="event-detail-tab-layout" onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Event Information" className="event-detail-tab-layout-item" value="1" />
              <Tab label="Event Contributors" className="event-detail-tab-layout-item" value="2" />
              <Tab label="Sessions" className="event-detail-tab-layout-item" value="3" />
              <Tab label="Location" className="event-detail-tab-layout-item" value="4" />
              <Tab label="Users" className="event-detail-tab-layout-item" value="5" />
              <Tab label="Template" className="event-detail-tab-layout-item" value="6" />
              <Tab label="Custom Fields" className="event-detail-tab-layout-item" value="7" />
              <Tab label='Settings' className="event-detail-tab-layout-item" value="8"/>
            </TabList>
          </Grid>
          <TabPanel value="1">
            <EventInfoCard eventData={eventFullData} onSubmitHandler={handleSubmitHandler}/>
          </TabPanel>
          <TabPanel value="2">
            <SepekerCard eventData={eventFullData} />
          </TabPanel>
          <TabPanel value="3">
            <Sessions eventData={eventFullData} onSubmitHandler={handleSubmitHandler}/>
          </TabPanel>
          <TabPanel value="4">
            <LocationCard data={eventFullData?.venue}/>
          </TabPanel>
          <TabPanel value="5">
            <UserListCard />
          </TabPanel>
          <TabPanel value="6">
            <TemplateCard eventData={eventFullData} onSubmitHandler={handleSubmitHandler}/>
          </TabPanel>
          <TabPanel value="7">
            <FormBuilder />
          </TabPanel>
          <TabPanel value="8">
            <PriceTierList />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
		<ShareInvitationDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        eventData={eventFullData}
		eventURL={watch('event')}
    />
    {eventFullData?.published ? <CustomActionModal
      icon={<WarningIcon className="unpublish-modal-icon" />}
      open={openModal}
      onClose={() => setOpenModal(false)}
      cancelLabel="Cancel"
      cancelAction={() => setOpenModal(false)}
      header="Unpublish Event?"
      subHeader="Are you sure you want to unpublish this event? It will no longer be visible to attendees."
      submitAction={() => handlePublish(eventFullData?.published)}
      submitLabel="Unpublish"
      modalClassName="unpublish-modal"
    /> : <CustomActionModal
      open={openModal}
      icon={<PublishTickIcon className="publish-modal-icon"/>}
      onClose={() => setOpenModal(false)}
      cancelLabel="Cancel"
      cancelAction={() => setOpenModal(false)}
      header="Ready to Publish"
      subHeader="Are you sure you want to publish this event? Once published, it will be visible to attendees."
      submitAction={() => handlePublish(eventFullData?.published)}
      submitLabel="Publish"
      modalClassName="publish-modal"
    />}
  </Grid>

}

export default ViewEventDetail;