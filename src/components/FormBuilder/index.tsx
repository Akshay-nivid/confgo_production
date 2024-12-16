
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography, } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import CustomRadio from "../CustomRadio/CustomRadio";
import FormEditor from "./FormEditor";
import FormFieldList from "./FormFieldList";
import useStore, { POST, setDataById } from '@/Libs/store';
import  { useEffect } from 'react';
import CustomButton from '../CustomButton/CustomButton';
import { useLocation } from 'react-router-dom';

interface FormBuilderProps {
  eventData: any;
}

/**
 * Form Builder Component to creact custom form field
 *
 */
  const FormBuilder: React.FC<FormBuilderProps> = ({ eventData }) => { 


  const eventId = useLocation()?.pathname.split("/")[3];

  const { control, watch } = useForm({
    defaultValues: {
      category: "generic",
    }
  })

  const participantTypeList = useStore((state: any) => state?.compData?.["participantTypeList"]?.["participant/type/list"]?.data) ?? [];

  const formFieldsArray = useStore((state: any) => state?.compData?.["formFieldsArray"]) ?? {};

  const category = watch("category");


  /**
   * Fetches the participant type list
   */
  useEffect(() => {

    POST({
      url: "participant/type/list",
      id: "participantTypeList",
      body: {
        filters: {
          eventId: eventId
        }
      }
    })


  }, [])





  /**
   * Handles the generation of the form based on the participant type
   * @param participantType - generic | doctor | engineer | student
   */
  const handleClickGenerateForm = (participantType: string) => {


    const GENERIC = "generic";

    const isGeneric = participantType === GENERIC;


    if (eventData?.published) {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Event is Already Published !",
      });}
      else{
        if (isGeneric && formFieldsArray[GENERIC].length === 0) {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: "Please add at least one field",
          });
          return
        }
      }


    let parsedData;
    let formData;
    if (isGeneric) {

      if (formFieldsArray[GENERIC].length === 0) return;

      parsedData = formFieldsArray[GENERIC].map(
        (field: any) => {
          return {
            name: field.uuid,
            metadata: JSON.stringify(field),
          };
        }
      );

      formData = {
        eventId: parseInt(eventId),
        formData: [
          {
            data: parsedData
          }
        ]
      };

    }


    if (!isGeneric) {
      formData = Object.entries(formFieldsArray)

        .filter(([key]) => key !== GENERIC)

        .reduce<{ participantTypeId: number; data: { name: String; metadata: string; }[] }[]>((acc, [key, value]) => {

          if (Array.isArray(value) && value.length > 0) {

            const parsedData = value.map((field) => {

              return {
                metadata: JSON.stringify(field),
                name: field.uuid
              }
            });

            if (parsedData.length > 0) {

              acc.push({
                participantTypeId: parseInt(key),
                data: parsedData
              });

            }
          }

          return acc;

        }, []);

    }

    const body = isGeneric ? formData : { eventId: parseInt(eventId), formData: formData }

    if (eventData?.published) {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Event is Already Published !",
      });}
      else{
        if (formData && formData.length === 0) {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: "Please add at least one field",
          });
          return
        }
    
        POST({
          url: "event/form",
          body: body,
          id: "dynamicGeneratedForm",
          successCB: () => {
    
            if (isGeneric) {
              const { generic, ...specificFormFieldsArray } = formFieldsArray
    
    
              const updatedSpecificFormFieldsArray = Object.keys(specificFormFieldsArray).reduce((acc: any, key: string) => {
    
                acc[key] = [];
                return acc;
              }, {});
    
    
              setDataById('formFieldsArray', { ...formFieldsArray, ...updatedSpecificFormFieldsArray });
            } else {
    
              setDataById('formFieldsArray', { ...formFieldsArray, generic:[] });
              
            }
    
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "success",
              message: "Form generated successfully!",
            });
    
          }
        });
      } 
      }

  return (
    <Grid justifyContent={"center"} container className="form-builder layout">
      <HeaderSection />
      <Box className="choose-category-section ">
        <Typography className="form-builder-sub-title">
          Choose Category
        </Typography>
        <Box className="choose-category-radio-container ">
          <CustomRadio className="category-radio" row={true} control={control} name="category" options={[{ label: "Generic", value: "generic" }, { label: "Specific audience category", value: "specific" }]} />
        </Box>
      </Box>
      {
        category === "generic" ? (
          <Grid size={12} container className="form-builder-title-container">
            <Grid display={"flex"} className="grid-left" size={6}>

              <Box className="fields-data-container">
                <FormFieldList participantType={"generic"} eventData={eventData}/>

              </Box>

            </Grid>
            <Grid
              size={6}
              className="grid-right"
              display={"flex"}
              overflow={"auto"}
              height={"100%"}
              paddingBlock={"2rem"}
            >
              <FormEditor handleGenerateForm={handleClickGenerateForm} participantType="generic" participantData={{}} eventData={eventData}/>

            </Grid>
          </Grid>
        ) : (
          <Box className='space-y-10 px-1 pb-5 pt-8 w-full form-accordion' >

            {
              participantTypeList && participantTypeList.map((user: any, idx: number) => {
                return (
                  <Accordion defaultExpanded={idx === 0 ? true : false} key={idx} className="">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} className="font-bold text-xl tracking-wider">{user?.name.toUpperCase()}</AccordionSummary>
                    <AccordionDetails className="shadow-none">
                      <Grid size={12} container className="form-builder-title-container">
                        <Grid display={"flex"} className="grid-left" size={6}>
                          <Box className="fields-data-container">
                            <FormFieldList participantType={user?.id} eventData={eventData}/>
                          </Box>
                        </Grid>
                        <Grid
                          size={6}
                          className="grid-right"
                          display={"flex"}
                          overflow={"auto"}
                          height={"100%"}
                          paddingBlock={"2rem"}
                        >
                          <FormEditor handleGenerateForm={handleClickGenerateForm} participantType={user?.id} participantData={user} eventData={eventData}/>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )
              })
            }
            <Box className="flex justify-end">
              <CustomButton className="save-form-btn" onClick={() => {
                handleClickGenerateForm("specific")
              }} label="Save Form" />
            </Box>
          </Box>
        )
      }


    </Grid>
  );
};

export default FormBuilder;









/**
 * HeaderSection
 *
 * This component is responsible for rendering the title and content of the
 * FormBuilder page.
 *
 * @returns {JSX.Element} - The rendered JSX element.
 */
const HeaderSection = () => {
  return (
    <Grid container size={12} spacing={2}>
      <Grid size={12}>
        <Typography className="form-builder-title">
          Custom Form Builder
        </Typography>
      </Grid>
      <Grid size={12} className="form-builder-content-container">
        <Typography className="form-builder-content">
          Custom Fields Builder allows you to easily create and customize
          fields for your forms. Tailor your input options to gather the
        </Typography>
        <Typography className="form-builder-content">
          exact information you need, with a simple and user-friendly
          interface.
        </Typography>
      </Grid>
    </Grid>
  )
}



