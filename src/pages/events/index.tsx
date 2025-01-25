/*
 *Events component handles the event creation
 */
import { useEffect, useState } from 'react';
import CustomStepper from '@/components/CustomStepper/CustomStepper';
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import CreateEvent from './CreateEvent';
import AddProgram from './AddProgram';
import ConferenceDetails from './ConferenceDetails';
import apiClient from '@/Libs/Https/API-client';
import { formatUTCDateTime, processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '@/router/routes';
import useStore, { GET } from '@/Libs/store';
import AddAddOns from './AddAddons';
import LeftArrowIcon from '@/assets/svg/left-arrow.svg';
import moment from 'moment';

const steps = [
  { label: 'Create Event', description: '' },
  { label: 'Program', description: '' },
  { label: 'Add Ons', description: '' },
  { label: 'Confirm', description: '' },
];
type Speaker = {
  speakerId?: string;
  speakerFullName?: string;
  speakerAssetId?: string;
  designation: string;
}
interface Program {
  name: string;
  description: string;
  totalSeat?: string;
  startDate: string;  
  endDate: string;    
  startTime: string;  
  endTime: string;   
  type: 'PAID' | 'FREE'|''; 
  amount: number; 
  addOnId:number;   
  speakers: Speaker[];
  speakerAssetId:string;
  designation:string;
  speakerFullName:string;
  speakerId:string;
  speakerSelection:string;
}
interface Property {
  propertyId: string;
  propertyName: string; 
  propertyAmount: string; 
}

interface Addons {
  name: string;              
  description: string;    
  startTime: string;          
  endTime: string;           
  type: 'PAID' | 'FREE'|'';      
  date: string;               
  properties: Property[];    
  addonId: number|string;           
  dateRequired: string[];   
  addonType: 'PAID' | 'FREE'|'';
  noOfDays: string;          
  repeat: ('YES' | 'NO'|'')[];   
  amount: string;   
  propertyName:string;
  propertyAmount:string;
  propertyChip:string
}

const Events = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formSubmit, setFormSubmit] = useState<any>({
    event: false,
    program: false,
    addOns: false
  });
  const [formDraftSubmit, setFormDraftSubmit] = useState<any>({
    event: false,
    program: false,
    addOns: false
  });
  const [formData, setFormData] = useState<any>({});
  const [formDraftData, setFormDraftData] = useState<any>({});
  const [statusId, setStatusId] = useState('');
  const [draftStatusId, setDraftStatusId] = useState('');
  const [addOnOptions, setAddOnOptions] = useState<any>()
  const navigate = useNavigate();
  const { setDataById }: any = useStore();
  const [draftForm, setDraftForm] = useState(false);
  const eventInfo = useStore((state: any) => state?.compData?.getEventDetails?.[`event/${id}`]?.data)
  

  const [isDirty, setIsDirty] = useState(false); 
  /**
   * Check if form data has changed
   */ 
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== null;
    setIsDirty(hasChanges);
  }, [formData]);

  /**
   * Prompt user on navigating away or closing the tab
   */ 
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message; 
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  /**
   * Useeffect hook handles the api call for getting event status, add options and get event data
   */
  useEffect(() => {
    if(id){
      getEventDetails(Number(id));
    }
    handleGetEventStatusApiCall()
    handleAddOnOptionsApiCall();
  }, [])

  /**
   * Useeffect hook call the draft form submit function based on the variable draftForm
   */
  useEffect(() => {
    if(draftForm){
      handleDraftFormSubmit()
    }
  },[draftForm])

  /**
   * Useeffect hook set the form data based on the event info data
   */
  useEffect(() => {
    eventInfo && setFormData(transformEventData(eventInfo))
    eventInfo && setFormDraftData(transformEventData(eventInfo))
  }, [eventInfo])


   /**
   * Method handles the api call for getting event details
   */
   const getEventDetails = async (id: number) => {
      GET({
        url: `event/${id}`,
        id: 'getEventDetails',
        errorCB: (error: any) => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: error?.message || 'something went wrong',
          })

        }
      })
      
  }

  /**
   * Method handles the draft form submission 
   */
  const handleDraftFormSubmit = async () => {
    try {

      const req = createFormRequest(formDraftData, true)
      const response = await apiClient.post('event', req);
      const { status, data, message } = await processAPIResponse(response, 'event-status');
      if (status) {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message:`Event draft saved successfully!`});
        navigate(routes.editDraftEvent(data?.id))
      }
      else {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:message});
      }
      setDraftForm(false);
    }
    catch (e) {
      Logger.error('Create Event', e)
      setDraftForm(false);
    }
  };


  /**
   * Method handles the api call for getting event statuses
   */
  const handleGetEventStatusApiCall = async () => {
    const response = await apiClient.post('event/status/list', {});
    const { status, data } = await processAPIResponse(response, 'event-status');
    if (status) {
      const id = data?.find((item: any) => item.statusName === 'ACTIVE')?.id
      setStatusId(id)
      const draftStatusId = data?.find((item: any) => item.statusName === 'DRAFTED')?.id
      setDraftStatusId(draftStatusId)
    }
  }


  /**
   * Method handles the api call for getting add on options
   */
  const handleAddOnOptionsApiCall = async () => {
    const response = await apiClient.post('addon/list', {});
    const { status, data } = await processAPIResponse(response, 'event-add-on');
    if (status) {
      const optionsData = data?.map((item: any) => ({ label: item.name, value: item.id }))
      const updatedOptionsData=[...optionsData,{label:'Create new Add-on name',value:'other'}];
      setAddOnOptions(updatedOptionsData);
    }
  }

  /*
   * The function sets the active step of the stepper.
   * step number : 0,1,2,3
   */
  const handleStepChange = (step: number) => {
  
    const isEventValid = !!formData?.event;
    const isProgramValid = !!formData?.program?.[0]?.name && formData?.program?.length > 0;
  
    if ((step === 1 && !isEventValid) || ((step === 2 || step === 3) && (!isEventValid || !isProgramValid))) {
      return;
    }
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to continue?")) {
      return;
    }
  
    setActiveStep(step);
  };
  

  /*
   * The handleNext function is used to move the stepper to the next step.
   */
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const formKey =
        activeStep === 0
          ? 'event'
          : activeStep === 1
            ? 'program'
            : activeStep === 2
            ? 'addOns'
            : null;

      if (formKey) {
        setFormSubmit({ ...formSubmit, [formKey]: true });

        setTimeout(() => {
          setFormSubmit({ ...formSubmit, [formKey]: false });
        }, 1000);
      }
    }
  };

  /**
   * Method handles the final submission of all forms
   */
  const handleSubmit = async () => {
    try {
      const req = createFormRequest(formData)
      const response = await apiClient.post('event', req);
      const { status,  message } = await processAPIResponse(response, 'event-status');
      if (status) {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message:message});
        navigate(routes.events());
      }
      else {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:message});
      }
    }
    catch (e) {
      Logger.error('Create Event', e)
    }
  };


  /**
   * Method creates the form request for event creation
   * @param data : request data
   */
  const createFormRequest = (data: any, draft?: boolean) => {
    const event = data?.event;
    const EventStart = `${event?.startTime}T00:00`
    const EventEnd = `${event?.endTime}T23:59`
    const EventStartTime= formatUTCDateTime(EventStart)
    const EventEndTime= formatUTCDateTime(EventEnd)

    const programs = data?.program || [];
    const addOns=data?.addOns||[];
    const program = programs?.filter((item: Program) => item.name!='');
    const addOn = addOns?.filter((item: Addons) => item.addonId!='');
    //tranform program fields
    const transformProgram = program?.map(({ type, addOnId, startDate, startTime, endDate, endTime, amount, totalSeat, 
      speakers, 
      speakerAssetId,
      designation,
      speakerFullName,
      speakerId,
      speakerSelection, ...item }: Program) => {
      // Combine startDate and startTime
      const startDateTime = `${startDate}T${startTime}`;
      
      // Combine endDate and endTime
      const endDateTime = `${endDate}T${endTime}`;
      return {
        ...item,  
        totalSeat: totalSeat && totalSeat !== "" ? totalSeat : undefined,             
        startTime: formatUTCDateTime(startDateTime),         
        endTime: formatUTCDateTime(endDateTime),
        statusId: draft? draftStatusId: statusId,
        amount: amount ? amount : "0",
        ...(speakers.length !== 0 && {
          speaker: speakers?.map(({ speakerId }: any) => ({
            speakerId
          })),
        }),
      };
    });
    //tranform addOnData
    const transformedAddOnData = addOn?.map(({ propertyName,propertyAmount,repeat, name, addonType, noOfDays, dateRequired, propertyChip, type, startTime, endTime, date, properties,amount, ...item }: Addons) => {
      // Create the combined datetime field
      let combinedStartDateTime;
      let combinedEndDateTime;
      if (dateRequired?.length == 0) {
        // Combine date and time for start and end if applicable
        combinedStartDateTime = startTime && date ? `${date} ${startTime}:00` : undefined;
        combinedEndDateTime = endTime && dateRequired ? `${date} ${endTime}:00` : undefined;
      }
      return {
        ...item,
        amount:amount?amount:"0",
        ...(combinedStartDateTime && { startTime: formatUTCDateTime(combinedStartDateTime) }),
        ...(combinedEndDateTime&&{ endTime:formatUTCDateTime(combinedEndDateTime)}),
        ...(properties.length !== 0 && {
          properties: properties?.map(({ propertyId, propertyName, propertyAmount, ...rest }: any) => ({
            name: propertyName,
            amount: propertyAmount? Number(propertyAmount) : 0,
            ...rest
          })),
        }),
        addonId: item.addonId
      };
    });
    let req: any = {
      name: event?.name,
      description: event?.description,
      startTime: EventStartTime,
      endTime: EventEndTime,
      statusId: draft? draftStatusId: statusId,
      amount: event?.amount || 0,
      eventClass: event?.type,
      assetId:event?.assetId,
      contacts: [
        {
          phone: event?.phone,
          email: event?.email 
        }
      ],
      isAbstract:event?.isAbstract?1:0,
      abstractDate:event?.abstractDate,
      isDraft: draft? true: false
    };
    event?.specialtyId && (req['specialtyId'] = event?.specialtyId)
    id && (req['draftId'] = id)

    // Handle URL and Venue logic
    if ( event?.type === 'ONLINE') {
      req['url'] = event?.url;
    } else {
      req['venue'] = {
        name: event?.venueName,
        mapUrl: event?.mapUrl,
        address: event?.address,
        city: event?.city,
        state: event?.state,
        country: event?.country,
        ...(event?.postalCode ? { postalCode: event.postalCode } : {}),
      };
      const allNull = Object.values(req['venue']).every((value) => (value === undefined || value === null));

      if (allNull) {
        req['venue'] = null;
      }
      if ( event?.type !== 'OFFLINE') {
        req['url'] = event?.url;
      }
    }
    req['programs']=transformProgram;
    req['addons']=transformedAddOnData;

    return req;
  };



  /*
   * The handleBack function is used to move the stepper to the previous step.
   */
  const handleBack = () => {
    setFormSubmit({
      event: false,
      program: false,
      addOns: false
    })
    if (activeStep >= 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  /**
   * Method handles the submission of the various forms
   * @param data : form data
   * @param type : 'EVENT' | 'PROGRAM' | 'ADDS'
   */
  const onSubmitHandler = (data: object, type: string) => {
    const formKey =
      type === 'EVENT'
        ? 'event'
        : type === 'PROGRAM'
          ? 'program'
          : type === 'ADDS'
          ? 'addOns'
          : null;
    if (formKey && data) {
      setFormData({ ...formData, [formKey]: data });
      setFormDraftData({ ...formData, [formKey]: data });
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  
  /**
   * Method handles the submission of the various forms for save as draft
   * @param data : form data
   * @param type : 'EVENT' | 'PROGRAM' | 'ADDS'
   */
  const onDraftSubmitHandler = (data: object, type: string) => {
    const formKey =
      type === 'EVENT'
        ? 'event'
        : type === 'PROGRAM'
          ? 'program'
          : type === 'ADDS'
          ? 'addOns'
          : null;
    if (formKey && data) {
      setFormDraftData({ ...formDraftData, [formKey]: data });
    }
  };


  /**
   * Method handles the saving of the program
   * @param data : form data
   * @param type : program | addOns
   */
  const onSaveHandler = (data: object,type: string, ) => {
    setFormData({ ...formData, [type]: data });
    setFormDraftData({ ...formData, [type]: data });
  };
   /**
   * Method handles calls Add on get api when new Addon created
   */
  const onaddOnSubmitHandler=()=>{
    handleAddOnOptionsApiCall()
  }

  /**
   * Method handles the save as draft functionality
   */
  const handleSaveAsDraft = () => {
    if (activeStep < steps.length - 1) {
      const formKey =
        activeStep === 0
          ? 'event'
          : activeStep === 1
            ? 'program'
            : activeStep === 2
            ? 'addOns'
            : null;

      if (formKey) {
        setFormDraftSubmit({ ...formDraftSubmit, [formKey]: true });

        setTimeout(() => {
          setFormDraftSubmit({ ...formDraftSubmit, [formKey]: false });
          setDraftForm(true);
        }, 1000);
        
      }
    }
  }

  /**
   * Method transforms get event api data to the create event format data
   * @param data : get event api data
   * @returns 
   */
  const transformEventData = (data: any) => {
    // Helper function to format date
    const formatDate = (dateString: any) => moment(dateString).format("YYYY-MM-DD")
    // Helper function to format time
    const formatTime = (dateString: any) => moment(dateString)?.format()?.split("T")[1]?.slice(0, 5);

    const transformedData = {
        event: {
            type: data.eventClass,
            name: data.name || "",
            phone: data.eventContacts?.[0]?.phone || "",
            email: data.eventContacts?.[0]?.email || "",
            startTime: formatDate(data.startTime),
            endTime: formatDate(data.endTime),
            amount:data.amount && data.amount !== "0.00" ? data.amount : "",
            specialtyId: data.specialtyId || null,
            url: data.url || null,
            mapUrl: data.venue?.mapUrl || null, // Example map URL
            venueName: data.venue?.name || null, // Example venue name
            address: data.venue?.address || null, // Example address
            country: data.venue?.country || null, // Example country
            state: data.venue?.state || null, // Example state
            city: data.venue?.city || null, // Example city
            postalCode: data.venue?.postalCode || null, // Example postal code
            description: data.description || "",
            ...(data.assetId && data.assetId != 0 ? { assetId: data.assetId } : {}),// Conditionally add assetId
            ...(data.abstractDate ? { abstractDate: data.abstractDate } : {}), // Conditionally add abstractDate
            isAbstract:data.isAbstract || false,
            ...(data.speciality ? { speciality: data.speciality } : {}),
        },
        program: data.programs?.map((program: any) => ({
            name: program.name || "",
            description: program.description || "",
            startDate: formatDate(program.startTime),
            endDate: formatDate(program.endTime),
            startTime: formatTime(program.startTime),
            endTime: formatTime(program.endTime),
            type: program.amount === "0.00" ? "FREE" : "PAID",
            amount: program.amount || "",
            totalSeat: program ? program?.eventParticipantEntries?.[0]?.totalSeat : null,
            speakers: program?.eventSpeakers?.map((speaker: any) => ({
              speakerId: speaker?.userId,
              speakerFirstName: speaker?.user?.firstName,
              speakerLastName:speaker?.user?.lastName,
              speakerAssetId: speaker?.user?.assetId,
              designation: speaker?.user?.designation || " ",
            })) || [],
        })),
        addOns: data.addons?.map((addon: any) => ({
            name: addon.addon?.name || "",
            description: addon.description || "",
            date: formatDate(addon.startTime),
            startTime: formatTime(addon.startTime),
            endTime: formatTime(addon.endTime),
            type: addon.amount === "0.00" ? "FREE" : "PAID",
            properties: (addon.eventAddonProperties || []).map((property: any) => ({
              name: property.name,
              amount: property.amount,
              propertyName: property.name,
              propertyAmount: property.amount
            })),
            propertyName: "",
            propertyAmount: "",
            addonId: addon.addonId || "",
            propertyChip: "",
            dateRequired: [],
            addonType: addon.amount === "0.00" ? "FREE" : "PAID",
            repeat: [],
            noOfDays: ""
        }))
    };
      transformedData?.program.push({
        name: "",
        description: "",
        startDate:moment(data?.startTime).format("YYYY-MM-DD"),
        endDate:moment(data?.startTime).format("YYYY-MM-DD"),
        startTime: moment(new Date()).format("HH:mm"),
        endTime:moment(new Date()).format("HH:mm"),
        type: "PAID",
        amount: "",
        totalSeat:"",
        speakers: [],
      },)

      transformedData?.addOns.push({
          name: "",
          description: "",
          startTime:  moment().format("HH:mm"),
          endTime:  moment().format("HH:mm"),
          type: "PAID",
          date:moment(data?.startTime).format("YYYY-MM-DD"),
          properties: [
          ],
          addonId: "",
          dateRequired:[],
          addonType:"PAID",
          noOfDays:""
      })

    return transformedData;
}

 


  return (
    ((id && (formData?.event || formDraftData?.event)) || !id) && <Grid container size={{ xs: 12, sm: 12 }} className="custom-stepper">
      <Grid size={{ xs: 12, sm: 12 }} justifyItems={'center'} className="custom-stepper-main">
        <CustomStepper
          steps={steps}
          activeStep={activeStep}
          onStepChange={handleStepChange}
        />
      </Grid>
      <Grid container size={{ xs: 12, sm: 12 }}>
        {activeStep === 0 && (
          <CreateEvent
            formSubmit={formSubmit?.event}
            formDraftSubmit={formDraftSubmit?.event}
            onSubmitHandler={onSubmitHandler}
            onDraftSubmitHandler={onDraftSubmitHandler}
            data={formData?.event}
          />
        )}
        {activeStep === 1 && (
          <AddProgram
            formSubmit={formSubmit?.program}
            formDraftSubmit={formDraftSubmit?.program}
            onSubmitHandler={onSubmitHandler}
            onDraftSubmitHandler={onDraftSubmitHandler}
            onSaveHandler={onSaveHandler}
            data={formData?.program}
            addOnOptions={addOnOptions}
            eventData={formData?.event}
          />
        )}
        {activeStep === 2 && (
          <AddAddOns
            formSubmit={formSubmit?.addOns}
            formDraftSubmit={formDraftSubmit?.addOns}
            onSubmitHandler={onSubmitHandler}
            onDraftSubmitHandler={onDraftSubmitHandler}
            onSaveHandler={onSaveHandler}
            data={formData?.addOns}
            addOnOptions={addOnOptions}
            onaddOnSubmitHandler={onaddOnSubmitHandler}
            eventData={formData?.event}
            
             
          />
        )}
        {activeStep === 3 && <ConferenceDetails data={formData} addOnOptions={addOnOptions} />}

        <Grid
          container
          justifyContent={'space-between'}
          spacing={2}
          size={{ xs: activeStep === 2 ? 12 : 12, sm: activeStep === 2 ? 12 : 12 }}
          sx={{
            width: '100%'
          }}
          className="custom-stepper-button-container"
        >
          <Grid container>
          {activeStep !== 0 &&
            <CustomButton
              className="custom-stepper-back-button"
              label="Back"
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<LeftArrowIcon />}
            />}
          </Grid>
          <Grid container justifyContent={'right'}>
          <Grid>
            {activeStep <= 2 &&<CustomButton
              className={`custom-stepper-save-as-draft-button ${activeStep === 1 && !(formData?.program?.[0]?.name || formData?.program?.[0]?.addonId) ? 'disabled-button' : ''}`}
              label="Save as Draft"
              disabled={activeStep === 1 && !(formData?.program?.[0]?.name || formData?.program?.[0]?.addonId)}
              onClick={handleSaveAsDraft}
            />}
          </Grid>
          <Grid>
            {<CustomButton
              className={`custom-stepper-next-button ${activeStep === 0
                  ? 'custom-stepper-next-button-event'
                  : activeStep === 1
                    ? 'custom-stepper-next-button-program'
                    : 'custom-stepper-next-button-details'
                } ${activeStep === 1 && !(formData?.program?.[0]?.name || formData?.program?.[0]?.addonId) ? 'disabled-button' : ''}`}
              onClick={activeStep === 3 ? handleSubmit : handleNext}
              label={activeStep === 3 ? 'Submit' : 'Next'}
              disabled={(activeStep === steps.length) || (activeStep === 1 && !(formData?.program?.[0]?.name || formData?.program?.[0]?.addonId))}
            />}
          </Grid>
          </Grid>
          {/* {activeStep === 1 && <Grid className="custom-stepper-bottom-spacing"></Grid>} */}
        </Grid>
        <Grid container className="custom-stepper-button-container" size={{ xs: activeStep === 2 ? 2 : 3, sm: activeStep === 2 ? 2 : 3 }}></Grid>
      </Grid>
    </Grid>
  );
};

export default Events;
