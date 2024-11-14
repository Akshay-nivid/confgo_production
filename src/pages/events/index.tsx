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
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import useStore from '@/Libs/store';
import AddAddOns from './AddAddons';

const steps = [
  { label: 'Create Event', description: '' },
  { label: 'Program', description: '' },
  { label: 'Add Ons', description: '' },
  { label: 'Confirm', description: '' },
];
interface Program {
  name: string;
  description: string;
  startDate: string;  
  endDate: string;    
  startTime: string;  
  endTime: string;   
  type: 'PAID' | 'FREE'|''; 
  amount: number; 
  addOnId:number;   
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
  const [activeStep, setActiveStep] = useState(0);
  const [formSubmit, setFormSubmit] = useState<any>({
    event: false,
    program: false,
    addOns: false
  });
  const [formData, setFormData] = useState<any>({});
  const [statusId, setStatusId] = useState('');
  const [addOnOptions, setAddOnOptions] = useState<any>()
  const navigate = useNavigate();
  const { setDataById }: any = useStore();


  /**
   * Useeffect hook handles the api call for getting event status and add options
   */
  useEffect(() => {
    handleGetEventStatusApiCall()
    handleAddOnOptionsApiCall();
  }, [])

  /**
   * Method handles the api call for getting event statuses
   */
  const handleGetEventStatusApiCall = async () => {
    const response = await apiClient.post('event/status/list', {});
    const { status, data } = await processAPIResponse(response, 'event-status');
    if (status) {
      const id = data?.find((item: any) => item.statusName === 'ACTIVE')?.id
      setStatusId(id)
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
   */
  const handleStepChange = (step: number) => {
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
  const createFormRequest = (data: any) => {
    const event = data?.event;
    const programs = data?.program || [];
    const addOns=data?.addOns||[];
    const program = programs.filter((item: Program) => item.name!='');
    const addOn = addOns.filter((item: Addons) => item.addonId!='');
    console.log(JSON.stringify(addOn),'type')
    //tranform program fields
    const transformProgram = program.map(({type,addOnId, startDate, startTime, endDate, endTime,amount, ...item }: Program) => {
      // Combine startDate and startTime
      const startDateTime = `${startDate}T${startTime}`;
      
      // Combine endDate and endTime
      const endDateTime = `${endDate}T${endTime}`;
      return {
        ...item,               
        startTime:startDateTime,         
        endTime:endDateTime,
        statusId:1,
        amount:amount?amount:"0"

      };
    });
    //tranform addOnData
    const transformedAddOnData = addOn.map(({ propertyName,propertyAmount,description,repeat, name, addonType, noOfDays, dateRequired, propertyChip, type, startTime, endTime, date, properties,amount, ...item }: Addons) => {
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
        ...(combinedStartDateTime && { startTime: combinedStartDateTime }),
        ...(combinedEndDateTime&&{endTime:combinedEndDateTime}),
        ...(properties.length !== 0 && {
          properties: properties?.map(({ propertyId, propertyName, propertyAmount, ...rest }: any) => ({
            name: propertyName,
            amount: propertyAmount??"0",
            ...rest
          })),
        }),
        addonId: item.addonId
      };
    });
    let req: any = {
      name: event?.name,
      description: event?.description,
      startTime: event?.startTime,
      endTime: event?.endTime,
      statusId,
      amount: event?.amount || 0
    };

    // Handle URL and Venue logic
    if (event?.programType === 'ONLINE') {
      req['url'] = event?.url;
    } else {
      req['venue'] = {
        name: event?.name,
        mapUrl: event?.mapUrl,
        address: event?.address,
        city: event?.city,
        state: event?.state,
        country: event?.country,
        postalCode: event?.postalCode,
      };
      if (event?.programType !== 'OFFLINE') {
        req['url'] = event?.url;
      }
    }
    req['programs']=transformProgram;
    req['addon']=transformedAddOnData;

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
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  /**
   * Method handles the saving of the program
   * @param data : form data
   * @param type : program | addOns
   */
  const onSaveHandler = (data: object,type: string, ) => {
    setFormData({ ...formData, [type]: data });
  };
   /**
   * Method handles calls Add on get api when new Addon created
   */
  const onaddOnSubmitHandler=()=>{
    handleAddOnOptionsApiCall()
  }

  return (
    <Grid container size={{ xs: 12, sm: 12 }} className="custom-stepper">
      <Grid size={{ xs: 12, sm: 12 }} className="custom-stepper-main">
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
            onSubmitHandler={onSubmitHandler}
            data={formData?.event}
          />
        )}
        {activeStep === 1 && (
          <AddProgram
            formSubmit={formSubmit?.program}
            onSubmitHandler={onSubmitHandler}
            onSaveHandler={onSaveHandler}
            data={formData?.program}
            addOnOptions={addOnOptions}
            eventData={formData?.event}
          />
        )}
        {activeStep === 2 && (
          <AddAddOns
            formSubmit={formSubmit?.addOns}
            onSubmitHandler={onSubmitHandler}
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
          justifyContent={'right'}
          spacing={2}
          size={{ xs: activeStep === 2 ? 12 : 12, sm: activeStep === 2 ? 12 : 12 }}
          sx={{
            width: '100%'
          }}
          className="custom-stepper-button-container"
        >

          <Grid>
            <CustomButton
              className="custom-stepper-back-button"
              label="Back"
              onClick={handleBack}
              disabled={activeStep === 0}
            />
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
          {activeStep === 1 && <Grid className="custom-stepper-bottom-spacing"></Grid>}
        </Grid>
        <Grid container className="custom-stepper-button-container" size={{ xs: activeStep === 2 ? 2 : 3, sm: activeStep === 2 ? 2 : 3 }}></Grid>
      </Grid>
    </Grid>
  );
};

export default Events;
