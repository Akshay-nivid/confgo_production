/**
 * AddProgram component handles the program addition for event
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Avatar, Box, Chip, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import EditIcon from "@/assets/svg/edit-program-icon.svg";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import moment from "moment";
import CustomActionModal from "@/components/CustomActionModal/CustomActionModal";
import  { POST, setDataById } from "@/Libs/store";
import { NoProgramIcon, WarningIcon } from "@/assets/svg";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { CloseOutlined } from "@mui/icons-material";
import { Logger } from "@/Utils/Logger";
import { Speaker } from '@mui/icons-material';
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import config from "../../../config.json";
import NewSpeakerDrawer from "./NewSpeakerDrawer";
import confgo from "../../../config.json"
import SponsorForm from "./Sponsor/SponsorForm";
import DrawerCreateSponosor from "./Sponsor/DrawerCreateSponsor";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
type Speaker = {
  speakerId?: string;
  speakerFullName?: string;
  speakerAssetId?: string;
  designation?: string;
  isModerator?: boolean
}

type Sponsor = {
  sponsorId?: string;
  sponsorFullName?: string;
  sponsorLogoId?: string;
  bannerId?: string;
}

type FormData = {
  programs: {
    name: string;
    description: string;
    totalSeat: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    type: string;
    amount: string;
    speakers?: {
      speakerId?: string;
      speakerFullName?: string;
      speakerAssetId?: string;
      designation?: string;
      isModerator?: boolean
    }[];
    speakerId?: string;
    speakerFullName?: string;
    speakerAssetId?: string;
    designation?: string;
    speakerSelection?: any;
    sponsor?: {
      sponsorId?: string;
      sponsorFullName?: string;
      speakerLogoId?: string;
      sponsorTypeId?: string;
    }[];
    sponsorId?: string;
    sponsorFullName?: string;
    sponsorLogoId?: string;
    sponsorbannerId?: string;
    sponosrSelection?: any;
    sponosorReservedSeats?: string;
    sponsorTypeId?: string;
    isModerator?: [],
    hallName?: string
    hallArray?: [],
    createHallName?: string
  }[];
  savedPrograms: {
    id?: string;
    name: string;
    description: string;
    totalSeat: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    type: string;
    amount: string;
    speakers?: {
      speakerId?: string;
      speakerFullName?: string;
      speakerAssetId?: string;
      designation?: string;

    }[];
    speakerId?: string;
    speakerFullName?: string;
    speakerAssetId?: string;
    designation?: string;
    speakerSelection?: any;
    sponsor?: {
      sponsorId?: string;
      sponsorFullName?: string;
      speakerLogoId?: string;
      sponsorTypeId?: string;

    }[];
    sponsorId?: string;
    sponsorFullName?: string;
    sponsorLogoId?: string;
    sponsorbannerId?: string;
    sponosrSelection?: any;
    sponosorReservedSeats?: string;
    sponsorTypeId?: string;
    isModerator?: [],
    hallName?: string,
    hallArray?: [],
    createHallName?: string
  }[];
};
type ProgramProps = {
  formSubmit: boolean;
  formDraftSubmit: boolean;
  onSubmitHandler: (event: any, type: string) => void;
  onDraftSubmitHandler: (event: any, type: string) => void;
  onSaveHandler: (event: any, type: string) => void;
  data: any;
  addOnOptions?: any;
  eventData?: any
};
const typeArray = [
  { label: "Paid", value: "PAID" },
  { label: "Free", value: "FREE" },
];



const AddProgram: React.FC<ProgramProps> = React.memo(
  ({ formSubmit, formDraftSubmit, onSubmitHandler, onDraftSubmitHandler, data, onSaveHandler, eventData }) => {
    const { handleSubmit, control, watch, setValue, setError, setFocus, resetField, trigger } = useForm<FormData>({
      defaultValues: {
        programs: [
          {
            name: "",
            description: "",
            startDate: moment(eventData?.startTime).format("YYYY-MM-DD"),
            endDate: moment(eventData?.startTime).format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime: moment(new Date()).format("HH:mm"),
            type: "PAID",
            amount: "",
            totalSeat: "",
            speakers: [],
            sponsor: []
          },
        ],
      },
    });
    const { fields, append, remove } = useFieldArray({
      control,
      name: "programs",
    });

    const [programIndex, setProgramIndex] = useState<any>();
    const [editMode, setEditMode] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    // const eventDate = useStore((state: any) => state?.compData?.["event-date"]);
    // const eventStartDate = eventDate?.startDate;
    // const eventEndDate = eventDate?.endDate;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const companyId = sessionStorage.getItem("companyId")
    const [searchResults, setSearchResults] = useState<Speaker[]>([]);
    const [searchSpekerResults, setSearchSpeakerResults] = useState<Sponsor[]>([]);
    const [showSpeakerSection, setShowSpeakerSection] = useState(false);
    const [showSponserSeciton, setShowSponsorSection] = useState(false);
    const baseUrl = config.api.url;
    const [newSpeakerDrawerOpen, setNewSpeakerDrawerOpen] = useState(false);
    const [newSponsorDrawerOpen, setNewSponsorDrawerOpen] = useState(false)
    const currency = confgo.currency;
    const [hallModal, setHallModal] = useState(false);
    const [hallOptions, setHallOptions] = useState<any>([]);

    /**
     * Method transforms data to the autocomplete data format
     * @param data : api response data
     * @returns 
     */
    function transformUserData(data: any): Speaker[] {
      return data?.map((item: any) => ({
        speakerId: item?.id,
        speakerFullName: `${item?.firstName} ${item?.lastName}`,
        speakerAssetId: item?.assetId,
        designation: item?.designation,
        ...item
      }));
    }

    /**
    * Method transforms data to the autocomplete data format
    * @param data : api response data
    * @returns 
    */
    function transformSponsoerData(data: any): Sponsor[] {
      return data?.map((item: any) => ({
        sponsorId: item?.id,
        sponsorFullName: item?.name,
        sponsorLogoId: item?.logoAssetId,
        ...item
      }));
    }
    // sponsor/list'
    /**
     *  Function to handle search API for user role autocomplete 
     */
    const handleSearch = async (query: string, data?: any) => {
      setLoading(true);
      await POST({
        url: "user/userRole/list",
        id: "userRoleList",
        body: {
          filters: {
            statusId:1,
            roleEnums: ['SPEAKER'],
            name: query,
            companyId: companyId,
          },
          limit: 30
        },
        successCB: (context: any) => {
          const results = transformUserData(context?.data);
          setSearchResults(results);
          setLoading(false);           
          if (data) {
            const newObj = results.find((item: any) => item.id === data.id) || null;    
            setValue(`programs.${programIndex}.speakerSelection`, newObj);
            setValue(`programs.${programIndex}.speakerId`, newObj?.speakerId);
            setValue(`programs.${programIndex}.speakerAssetId`, newObj?.speakerAssetId);
            setValue(`programs.${programIndex}.speakerFullName`, newObj?.speakerFullName);
          
          }
        },
        errorCB: (context: any) => {
          Logger.error("Error fetching search results:", context?.message);
          setLoading(false);
        }
      })
    };
    
    const handleSponsorSearch = async (query: string, data?:any) => {
      setLoading(true);
      await POST({
        url: "sponsor/list",
        id: "sponsorList",
        body: {
          filters: {
            name: query,
            companyId: companyId,
          },
          limit: 30
        },
        successCB: (context: any) => {
          setSearchSpeakerResults(transformSponsoerData(context?.data))
          setLoading(false);
          if (data){
            const newObj = transformSponsoerData(context?.data)?.find((item: any) => item.id === data.id) || null;
            setValue(`programs.${programIndex}.sponosrSelection`,newObj)
            setValue(`programs.${programIndex}.sponsorId`, newObj?.sponsorId)
            setValue(`programs.${programIndex}.sponsorLogoId`, newObj?.sponsorLogoId)
            setValue(`programs.${programIndex}.sponsorFullName`, newObj?.sponsorFullName)
          }    
        },
        errorCB: (context: any) => {
          Logger.error("Error fetching search results:", context?.message);
          setLoading(false);
        }
      })
    };

    /**
     * function to close the add program drawer
     */
    const closeDrawer = () => {
      setDrawerOpen(false);
      setEditMode(false);
      setValue('programs', watch('savedPrograms'))
      setShowSpeakerSection(false)
    };


    /**
     * Useeffect hook updates the programIndex value based on the savedPrograms dependency
     */
    useEffect(() => {
      const savedPrograms = watch("savedPrograms");
      if (savedPrograms?.[length - 1]?.hallArray) {
        setHallOptions(savedPrograms[0]?.hallArray);
      }
      setProgramIndex(savedPrograms?.length ? savedPrograms.length - 1 : 0);
    }, [watch("savedPrograms")]);


    /**
     * Useeffect hook submits the form based on the formSubmit variable
     */
    useEffect(() => {
      if (!formSubmit) return; // Short-circuit if formSubmit is false
      if (onSubmitHandler) {
        onSubmitHandler(data?.savedPrograms, "PROGRAM");
      }
    }, [formSubmit]);

    /**
       * Useeffect hook submits the form based on the formDraftSubmit variable
       */
    useEffect(() => {
      if (!formDraftSubmit) return; // Short-circuit if formDraftSubmit is false
      if (onDraftSubmitHandler) {
        onDraftSubmitHandler(watch()?.savedPrograms, "PROGRAM");
      }
    }, [formDraftSubmit]);



    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSubmit: SubmitHandler<FormData> = (data) => {
      if (onSubmitHandler) {
        onSubmitHandler(data.savedPrograms, "PROGRAM");
      }
    };


    /**
     * useEffect to format program start and end dates based on the event's start time.
     * it ensures that each programs 'startDate' and 'endDate' are not earlier than event's startTime.
     * If they are, the program dates are updated to match event's startTime.
     * form state ('programs' and 'savedPrograms') will be updated with formatted data.
     */
    useEffect(() => {
      if (!data) return;
      if (!eventData?.startTime) return;
      const formattedData = data.map((item: any) => {
        const eventStartDate = moment(eventData.startTime);
        const itemStartDate = moment(item.startDate);
        const itemEndDate = moment(item.endDate);
        // Check if startDate or endDate is earlier than eventData.startTime
        return {
          ...item,
          startDate: itemStartDate.isBefore(eventStartDate)
            ? eventStartDate.format("YYYY-MM-DD")
            : itemStartDate.format("YYYY-MM-DD"),
          endDate: itemEndDate.isBefore(eventStartDate)
            ? eventStartDate.format("YYYY-MM-DD")
            : itemEndDate.format("YYYY-MM-DD"),
        };
      });
      // Update the form values with the validated and formatted data
      setValue("programs", formattedData);
      setValue("savedPrograms", formattedData);

    }, [data, eventData?.startTime, setValue]);

    /**
     * This method ensures that the field with validation errors or requiring attention and Scrolls smoothly to that field
     */
    const scrollToError = (errorField: string) => {
      const fieldElement = document.querySelector(`[name="${errorField}"]`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
        (fieldElement as HTMLElement).focus();
      }
    };

    /**
     * handle add program button click
     */
    const handleAddProgram = () => {
      const savedPrograms = watch("savedPrograms");


      setProgramIndex(savedPrograms?.length ? savedPrograms.length - 1 : 0);
      setEditMode(false);
      setDrawerOpen(true); // Open the drawer for the new program
      setShowSponsorSection(false)
    };

    /**
     * Method handles the saving of the programs
     */
    const handleSaveNewPrograms = () => {

      // handleSubmit(onSave)();
      handleSubmit(onSave, (errors) => {
        // Check if programs exists and is an array before forEach
        if (errors.programs && Array.isArray(errors.programs)) {
          errors.programs.forEach((programError, index) => {
            const firstErrorKey = Object.keys(programError ?? {})[0] as keyof FormData["programs"][number] | undefined;

            if (firstErrorKey) {
              const errorField = `programs.${index}.${firstErrorKey}` as const;

              scrollToError(errorField);
              setFocus(errorField as unknown as keyof FormData);
            }
          });
        }
      })();
    };

    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSave: SubmitHandler<FormData> = () => {

      const programs = watch("programs");
      const lastItem = programs[programs?.length - 1];

      const eventStartDate = moment(eventData?.startTime).utc().valueOf();  // Ensure event start time is in UTC
const eventEndDate = moment(eventData?.endTime).utc().valueOf();      // Ensure event end time is in UTC

const programStartDate = moment(`${lastItem?.startDate} ${lastItem?.startTime}`, "YYYY-MM-DD HH:mm").utc();  // Convert to UTC
const programEndDate = moment(`${lastItem?.endDate} ${lastItem?.endTime}`, "YYYY-MM-DD HH:mm").utc();      // Convert to UTC

const programUtcStartDate = programStartDate.valueOf();  // Convert to milliseconds (UTC)
const programUtcEndDate = programEndDate.valueOf();      // Convert to milliseconds (UTC)

// Check if the program start date is after the event start date
if (programUtcStartDate < eventStartDate) {
  setError(`programs.${programIndex}.startTime`, {
    type: 'manual',
    message: 'Start time cannot be in the past',
  });
  return;
}

// Check if the program start date is greater than the program end date
if (programUtcStartDate > programUtcEndDate) {
  setError(`programs.${programIndex}.startDate`, {
    type: 'manual',
    message: 'Start date cannot be greater than end date',
  });
  return;
}

// Check if the program end date is greater than the event end date
if (programUtcEndDate > eventEndDate) {
  setError(`programs.${programIndex}.endDate`, {
    type: 'manual',
    message: 'End date cannot be greater than event end date',
  });
  return;
}




      // const lastIndex = programs?.length - 1;
      // const startDate = new Date(lastItem.startDate);
      // // const endDate = new Date(lastItem.endDate);
      // if (startDate > endDate) {
      //   setError(`programs.${lastIndex}.startDate`, {
      //     type: 'manual',
      //     message: 'Start date cannot be greater than end date',
      //   });
      //   return
      // }
      // Ensure dates are valid Date objects
      // const selectedDate = programs?.[programIndex]?.startDate
      // const selectedEndDate = programs?.[programIndex]?.endDate
      // const formattedStartDate = moment(selectedDate)?.format('YYYY-MM-DD');
      // const formattedeventStartDate = moment(eventStartDate)?.format('YYYY-MM-DD');
      // const formattedeventeventEndDate = moment(eventEndDate)?.format('YYYY-MM-DD');
      // const formattedeventendDate = moment(programs?.[programIndex]?.endDate).format('YYYY-MM-DD');
      const eventEndDateObj = new Date(eventEndDate)
      eventEndDateObj.setHours(23, 59, 59, 999);

      // Perform the comparison of dates
      // if (formattedStartDate < formattedeventStartDate || formattedStartDate > formattedeventeventEndDate) {
      //   setError(`programs.${programIndex}.startDate`, {
      //     type: 'manual',
      //     message: 'Start date should be within event Dates',
      //   });
      //   return
      // }
      // if (formattedeventendDate > formattedeventeventEndDate) {
      //   setError(`programs.${programIndex}.endDate`, {
      //     type: 'manual',
      //     message: 'End date should be within event Dates',
      //   });
      //   return
      // }

      // const today = moment(new Date()).format("YYYY-MM-DD")
      // const selectedStartTime = programs?.[programIndex]?.startTime;
      // const selectedEndTime = programs?.[programIndex]?.endTime;

      //check if time is greater than current time if selected date is today
      // if (selectedDate == today) {
      //   const now = moment(new Date()).format("HH:mm");
      //   if (selectedStartTime < now) {
      //     setError(`programs.${programIndex}.startTime`, {
      //       type: 'manual',
      //       message: 'Start time cannot be in the past',
      //     });
      //     return
      //   }
      // }
      // //check if selected end time is greater than selected start time is start and end dates are equal
      // if (selectedEndDate == selectedDate) {
      //   if (selectedEndTime < selectedStartTime) {
      //     setError(`programs.${programIndex}.endTime`, {
      //       type: 'manual',
      //       message: 'End time must be greater than start time',
      //     });
      //     return
      //   }
      // }
      //check if end date is greater than start date
      // if (selectedEndDate < selectedDate) {
      //   setError(`programs.${programIndex}.startDate`, {
      //     type: 'manual',
      //     message: 'Start Date must be earlier than End date',
      //   });
      //   return
      // }


      const newPrograms = [...programs];
      // Handle saving logic based on `editMode`
      if (!editMode) {
        const newProgram = {
          name: "",
          description: "",
          totalSeat: "",
          startDate: moment(eventData?.startTime).format("YYYY-MM-DD"),
          endDate: moment(eventData?.startTime).format("YYYY-MM-DD"),
          startTime: moment().format("HH:mm"),
          endTime: moment().format("HH:mm"),
          type: "PAID",
          amount: "",
          speakers: [],
          speakerId: "",
          speakerFullName: "",
          speakerAssetId: "",
          designation: "",
          sponsor: [],
          sponsorId: "",
          sponsorFullName: "",
          sponsorLogoId: "",
          sponsorTypeId: "",


        };
        newPrograms.push(newProgram);

        // Update both `savedPrograms` and the local `programs` array
        setValue("savedPrograms", programs);
        append(newProgram);
        setProgramIndex(programs?.length || 0);
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Program added to the event" })
      } else {
        // If in `editMode`, just update the program index
        setProgramIndex(programs?.length ? programs.length - 1 : 0);
      }

      // Trigger the save handler with the current programs
      if (onSaveHandler) {
        onSaveHandler(newPrograms, 'program')
      }
      // onSaveHandler && onSaveHandler(newPrograms, 'program')

      closeDrawer();
      setShowSpeakerSection(false)

      // Exit edit mode
      setEditMode(false);
    };

    // const handleClick=()=>{

    // }
    /**
     * Method handles the Update of the program
     * @param index : index of the program to edit
     */
    const handleEdit = (index: number) => {
      setEditMode(true);
      setDrawerOpen(true);
      setValue("programs", watch("savedPrograms"));
      setProgramIndex(index);
      if (watch(`programs.${index}.speakers`)) {
        setShowSpeakerSection(watch(`programs.${index}.speakers`)?.length == 0 ? false : true)
      }
      // if(watch(`programs.${index}.hallArray`)){
      //   setHallOptions(watch(`programs.${index}.hallArray`));
      // }
      // if(watch(`programs.${index}.hallName`)){
      //   const hallValue=watch(`programs.${index}.hallName`)
      //   setHallOptions([hallValue]);
      // }
      if (watch(`programs.${index}.sponsor`)) {
        setShowSponsorSection(watch(`programs.${index}.sponsor`)?.length == 0 ? false : true)
      }
    };

    /**
     * opens the custom action model to show warning
     */
    const handleDeleteConfirmbox = (index: number) => {
      setOpenModal(true)
      setProgramIndex(index);
    }

    /**
     * Method handles the deletion of the program
     * @param index : index of the program to delete
     */
    const handleDelete = (index: number) => {
      setOpenModal(false)
      setValue("programs", watch("savedPrograms"));
      setProgramIndex(index);
      const programsCopy = [...watch("savedPrograms")];
      programsCopy.splice(index, 1);
      setValue("savedPrograms", programsCopy);
      const saveProgram = programsCopy;

      remove(index);
      if (index === programsCopy?.length) {
        if (index === 0) {
          append({
            name: "",
            description: "",
            totalSeat: "",
            startDate: moment().format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime: moment(new Date()).format("HH:mm"),
            type: "PAID",
            amount: "",
            speakers: [{ speakerId: "", speakerFullName: "", designation: "", speakerAssetId: "" }],
            speakerId: "",
            speakerFullName: "",
            speakerAssetId: "",
            designation: "",
          });
          saveProgram.push({
            name: "",
            description: "",
            totalSeat: "",
            startDate: moment().format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime: moment(new Date()).format("HH:mm"),
            type: "PAID",
            amount: "",
            speakers: [{ speakerId: "", speakerFullName: "", designation: "", speakerAssetId: "" }],
            speakerId: "",
            speakerFullName: "",
            speakerAssetId: "",
            designation: "",
            hallName: "",
          });
          setHallOptions([]);
        } else {
          setProgramIndex(programsCopy?.length);
        }
      }

      if (onSaveHandler) {
        onSaveHandler(saveProgram, 'program')
      }

      // onSaveHandler && onSaveHandler(saveProgram, 'program');
    };
    /**
     * process spekaer in which only make one moderator while creation of speaker
     * @param arr:Speaker
     */
    function processModerators(arr: Speaker[]) {
      // Find the index of the last object with isModerator: true
      const lastModeratorIndex = arr?.reduce((lastIndex, obj, currentIndex) => {
        if (obj.isModerator === true) {
          return currentIndex;
        }
        return lastIndex;
      }, -1);

      // Create a new array with all moderators set to false except the last one
      return arr?.map((obj, index) => ({
        ...obj,
        isModerator: index === lastModeratorIndex ? true : false
      }));
    }
    /**
     * Adds a new speaker to the specified program's speakers array.
     * fetches the current form values for the specified program (using `index`), 
     * prepares a new speaker object using the form values, and adds it to the `speakers` array
     * After adding the speaker, the form fields related to the speaker are reset for the next input.
     * @param {number} index - The index of the program which the speaker is to be added.
     */
    const addSpeaker = (index: number) => {
      const values = watch();
      const speakerId = values.programs[index].speakerId;
      const speakerFullName = values.programs[index].speakerFullName;
      const speakerAssetId = values.programs[index].speakerAssetId;
      const designation = values.programs[index].designation;
      const speakerSelection = values.programs[index].speakerSelection;
      const isModerator = values.programs[index]?.isModerator && values.programs[index]?.isModerator?.length > 0 ? true : false


      if (!speakerSelection) {
        setError(`programs.${index}.speakerSelection`, {
          type: 'manual',
          message: 'please select a speaker',
        });
        return;
      }
      // if (!designation) {
      //   setError(`programs.${index}.designation`, {
      //     type: 'manual',
      //     message: 'Designation is required',
      //   });
      //   return;
      // }

      const newSpeaker = {
        speakerId,
        speakerFullName,
        speakerAssetId,
        designation,
        isModerator
      };


      // Get current programs list and update the speakers array for the selected program index
      const updatedPrograms = [...values.programs];
      if (!updatedPrograms[index].speakers) {
        updatedPrograms[index].speakers = [];
      }


      // Filter out empty or undefined speakers
      updatedPrograms[index].speakers = updatedPrograms[index].speakers?.filter(
        speaker => speaker.speakerId
      );


      // Check if a speaker with the same ID already exists
      const isDuplicate = updatedPrograms[index].speakers.some(
        (speaker) => speaker.speakerId === newSpeaker.speakerId
      );
      if (isDuplicate) {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: "speaker is already added" })
        return;
      }

      const speakers = updatedPrograms[index]?.speakers
      updatedPrograms[index].speakers = processModerators([...speakers, newSpeaker]);
      setValue("programs", updatedPrograms);
      resetField(`programs.${index}.speakerId`);
      resetField(`programs.${index}.speakerAssetId`);
      resetField(`programs.${index}.designation`);
      resetField(`programs.${index}.speakerFullName`);
      resetField(`programs.${index}.speakerSelection`);
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "speaker added successfully" })
    };

    /**
     * Adds a new sponosr to the specified program's sponosr array.
     * fetches the current form values for the specified program (using `index`), 
     * prepares a new sponosr object using the form values, and adds it to the `sponosr` array
     * After adding the sponosr, the form fields related to the sponosr are reset for the next input.
     * @param {number} index - The index of the program which the sponosr is to be added.
     */
    const addSponsor = (index: number) => {
      const values = watch();

      const sponsorId = values.programs[index].sponsorId;
      const sponsorFullName = values.programs[index].sponsorFullName;
      const sponsorAssetId = values.programs[index].sponsorLogoId;
      const sponosorReservedSeats = values.programs[index].sponosorReservedSeats;
      const sponsorSelection = values.programs[index].sponosrSelection;
      const sponsorTypeId = values.programs[index].sponsorTypeId

      if (!sponsorSelection) {
        setError(`programs.${index}.sponosrSelection`, {
          type: 'manual',
          message: 'please select a sponsor',
        });
        return;
      }
      if (!sponsorTypeId) {
        setError(`programs.${index}.sponsorTypeId`, {
          type: 'manual',
          message: 'Choose Sponsor Type',
        });
        return;
      }

      const newSponsor = {
        sponsorId,
        sponsorFullName,
        sponsorAssetId,
        sponosorReservedSeats,
        sponsorTypeId
      };
      // Get current programs list and update the speakers array for the selected program index
      const updatedPrograms = [...values.programs];
      if (!updatedPrograms[index].sponsor) {
        updatedPrograms[index].sponsor = [];
      }
      // Filter out empty or undefined speakers
      // Filter out empty or undefined speakers
      updatedPrograms[index].sponsor = updatedPrograms[index].sponsor?.filter(
        speaker => speaker.sponsorId
      );
      // Check if a speaker with the same ID already exists
      const isDuplicate = updatedPrograms[index].sponsor.some(
        (sponsor) => sponsor.sponsorId === newSponsor.sponsorId
      );
      if (isDuplicate) {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: "sponosr is already added" })
        return;
      }

      // Add the new speaker to the speakers array
      updatedPrograms[index].sponsor.push({ ...newSponsor });
      setValue("programs", updatedPrograms);

      resetField(`programs.${index}.sponsorId`);
      resetField(`programs.${index}.sponsorLogoId`);
      resetField(`programs.${index}.sponosorReservedSeats`);
      resetField(`programs.${index}.sponsorFullName`);
      resetField(`programs.${index}.sponosrSelection`);
      resetField(`programs.${index}.sponsorTypeId`);
      resetField(`programs.${index}.isModerator`);
    };

    /**
     * Removes a speaker from the specified program's speakers array.
     * This function filters out the speaker with the matching `speakerId` from the `speakers` array of the program (by `item.speakerId`).
     * @param {object} item - The speaker object that needs to be removed.
     * @param {number} _index - The index of the program in the programs array .
     */
    const removeSpeaker = (item: any, index: number) => {
      // Retrieve current form values
      const values = watch();

      // Update only the specific program at the provided index
      const updatedPrograms = [...values.programs];
      const updatedSpeakers = updatedPrograms[index].speakers?.filter(
        (speaker) => speaker?.speakerId !== item?.speakerId
      ) || [];
      updatedPrograms[index].speakers = updatedSpeakers;

      // Set the updated programs back to the form
      setValue('programs', updatedPrograms);
    };

    /**
     * Removes a sponosr from the specified program's sponosr array.
     * This function filters out the sponosr with the matching `sponosorId` from the `sponosr` array of the program (by `item.sponosrId`).
     * @param {object} item - The speaker object that needs to be removed.
     * @param {number} _index - The index of the program in the programs array .
     */
    const removeSponsor = (item: any, index: number) => {
      // Retrieve current form values
      const values = watch();

      // Update only the specific program at the provided index
      const updatedPrograms = [...values.programs];
      const updatedSpeakers = updatedPrograms[index].sponsor?.filter(
        (sponsor) => sponsor?.sponsorId !== item?.sponsorId
      ) || [];
      updatedPrograms[index].sponsor = updatedSpeakers;

      // Set the updated programs back to the form
      setValue('programs', updatedPrograms);
    };





    /**
     * Adds a new hallName to the specified program's hallArray array.
     * @param {number} index - The index of the program which the hallArray is to be added.
     */
    const addHallName = async (index: number) => {
      const isValid = await trigger(`programs.${index}.createHallName`); // Validate only this field
      if (!isValid) {
        return;
      }
      const values = watch();
      const hallName = values.programs[index]?.createHallName
      const newHall: any =  {hallName} ;


      // TypeScript now knows hallArray is an array of { hallName: string }
      const updatedPrograms: any = [...values.programs];


      if (!updatedPrograms[index]?.hallArray) {
        updatedPrograms[index].hallArray = [];
      }
      const isDuplicate = updatedPrograms[index]?.hallArray.some(
        (item: any) => item.hallName === newHall.hallName
      );
      const isDuplicateExistingOptions = hallOptions?.some(
        (item: any) => item.hallName === newHall.hallName
      )

      if (isDuplicate || isDuplicateExistingOptions) {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: "Same hall name" })
        return;
      }

      setHallOptions([...hallOptions, newHall]);
      updatedPrograms[index].hallArray?.push(newHall);
      setValue("programs", updatedPrograms);
      resetField(`programs.${index}.createHallName`);
    };

    /**
     * assign moderator created speakers list.
     * @param {index-program,speakerIndex:speaker list index}.
     */
    const assignModerator = (index: any, speakerIndex: any) => {
      const values = watch();
      // 
      // Get current programs list and update the speakers array for the selected program index
      const updatedPrograms: any = [...values.programs];
      const speakers: any = updatedPrograms[index]?.speakers;

      // updatedPrograms[index].speakers = processModerators([...speakers,newSpeaker]);
      const updatedData = updateModeratorStatus(speakers, speakerIndex);

      updatedPrograms[index].speakers = updatedData

      setValue("programs", updatedPrograms);
    }


    /**
     * updating moderator status 
     * @param {speakersArray,index}.
     */
    function updateModeratorStatus(speakersArray: any, index: any) {

      // Create a new array with the updated moderator status
      return speakersArray.map((speaker: any, i: any) => {
        if (i === index) {
          return {
            ...speaker,
            isModerator: true
          };
        } else {
          return {
            ...speaker,
            isModerator: false
          };
        }
      });
    }
    /**
      * Removes Hall Name from the state.
      * @param {number} _item - object to be deleted,hallIndex-seleted hall,index:program index
      */
    const handleHallNameDelete = (_item: any, hallIndex: any, index: any) => {
      const values = watch();
      const updatedPrograms: any = [...values.programs];

      // Filter out the hall at the specified hallIndex
      const hallArrayValues = hallOptions.filter(
        (_: any, i: any) => i != hallIndex
      );
      updatedPrograms[index].hallArray = updatedPrograms[index].hallArray.filter((_: any, i: any) => i != hallIndex);
      setHallOptions(hallArrayValues)
      setValue("programs", updatedPrograms);
    };
    return (
      <Grid container className="add-program-container" justifyContent={'center'} spacing={4}>
        <CustomDrawer open={drawerOpen} type="right">
          <Grid container spacing={2} padding={2} className="add-program-drawer">
            <Grid
              size={{ xs: 12 }}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className="add-program-drawer-heading">
                Add Program
              </Typography>
              <IconButton onClick={closeDrawer}>
                <CloseOutlined />
              </IconButton>
            </Grid>
            <Box className={"add-program-form-wrapper1"}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => {
                  if (index === programIndex) {
                    return (
                      <Box key={field.id} mb={2}>
                        <Grid
                          container
                          size={{ xs: 12, sm: 12 }}
                          spacing={2}
                        >

                          <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                              placeholder="Program Name"
                              control={control}
                              name={`programs.${index}.name`}
                              type="text"
                              rules={{ required: true }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                              placeholder="Program Description"
                              control={control}
                              name={`programs.${index}.description`}
                              type="text"
                              rules={{ required: true }}
                              multiline={true}
                              rows={10}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                              placeholder="Total Seats"
                              control={control}
                              name={`programs.${index}.totalSeat`}
                              type="number"
                              rules={{
                                pattern: {
                                  value: /^(0|[1-9]\d{0,7})$/,
                                  message: "Enter a valid number (e.g., 0, 123, 27)",
                                },
                              }}
                            />
                          </Grid>
                          <Grid container display={"flex"} size={{ xs: 12, sm: 12 }} alignItems={"center"} >
                            <Grid size={9}>
                              <CustomAutocomplete
                                defaultValue={data && data[index]?.hallName}
                                name={`programs${index}.hallName`}
                                className='auto-complete-input'
                                placeholder='search by hall name'
                                control={control} loading={false}
                                options={hallOptions ?? []}
                                getOptionLabel={(option: any) => option.hallName || option}
                                onSearch={(_query: string) => { }}
                                onChange={(e: any) => {
                                  setValue(`programs.${index}.hallName`, e);
                                }}
                                // onCustomButtonClick={()=>addHallName(index)}
                                // onCustomButtonClick={()=>{setHallModal(true)}}
                                // customButtonLabel="Add New Hall"
                                clearable={false}
                                onTextChange={(e: any) =>
                                  setValue(`programs.${index}.hallName`, e)
                                }
                              />
                            </Grid>
                            <Grid size={3}>
                              <CustomButton
                                className="add-program-hallcreate"
                                variant="outlined"
                                label="Add New Hall"
                                onClick={() => { setHallModal(true) }}
                              />

                            </Grid>
                            {/* <CustomModal onClose={() => setHallModal(false)} open={hallModal} children={
                              <Grid  className="h-screen w-screen" justifyContent={"center"} alignContent={"center"} sx={{backgroundColor:"white",height:200,width:400}}>
                                <Typography>Hello</Typography>
                              </Grid>
                            }>
                            </CustomModal> */}
                            <Modal open={hallModal} >
                              <Box className="add-program-hall-modal">
                                <Grid container spacing={2}>
                                  <Box className="add-program-hall-modal-container">
                                    <Grid container spacing={1} justifyContent={"flex-end"}>
                                      <IconButton onClick={() => { setHallModal(false) }}><CloseIcon /></IconButton>
                                    </Grid>

                                    <Typography variant={"h6"}>Create Hall Name</Typography>
                                    <Grid className="add-program-hall-modal-textField" container size={12}>
                                      <CustomTextField
                                        placeholder="Hall Name"
                                        className="create-event"
                                        control={control}
                                        name={`programs.${index}.createHallName`}
                                        type="text"
                                        rules={{
                                          required: true,

                                        }}
                                      />
                                    </Grid>
                                    {watch(`programs.${index}.hallArray`)?.length !== 0 &&
                                      <Grid className="add-program-hall-modal-chipBox">
                                        {hallOptions.map((item: any, hallIndex: any) => {
                                          return <Chip key={hallIndex + "hallName"} className="add-program-hall-modal-chipBox-chip" label={item?.hallName} variant="outlined" onDelete={() => handleHallNameDelete(item, hallIndex, index)} />
                                        }
                                        )} </Grid>}

                                    <Grid container justifyContent={"flex-end"}>
                                      <CustomButton
                                        className="add-program-hall-modal-btn"
                                        label="Save"
                                        onClick={() => addHallName(index)}
                                      />
                                    </Grid>
                                  </Box>
                                </Grid>
                              </Box>
                            </Modal>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"} container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <CustomTextField
                                placeholder="Start Date"
                                className="create-event"
                                control={control}
                                name={`programs.${index}.startDate`}
                                type="date"
                                defaultValue={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                min={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                max={moment(eventData?.endTime).format("YYYY-MM-DD")}
                                rules={{
                                  required: true
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <CustomTextField
                                className="create-event"
                                placeholder="Start Time"
                                control={control}
                                name={`programs.${index}.startTime`}
                                type="time"
                                defaultValue={moment().format("HH:mm")}
                                rules={{
                                  required: true,
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"} container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <CustomTextField
                                placeholder="End Date"
                                className="create-event"
                                control={control}
                                name={`programs.${index}.endDate`}
                                type="date"
                                defaultValue={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                min={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                max={moment(eventData?.endTime).format("YYYY-MM-DD")}
                                rules={{
                                  required: true
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <CustomTextField
                                placeholder="End Time"
                                className="create-event"
                                control={control}
                                name={`programs.${index}.endTime`}
                                type="time"
                                defaultValue={moment().format("HH:mm")}
                                rules={{
                                  required: true,
                                  validate: (value) => {
                                    if (
                                      typeof value === "string" &&
                                      value
                                    ) {
                                      const today = moment(new Date()).format("YYYY-MM-DD")
                                      const endDate = moment(eventData.endTime).format("YYYY-MM-DD");
                                      if (endDate == today) {
                                        //check if time is greater than current time
                                        const now = moment(new Date()).format("HH:mm");
                                        if (value < now) {
                                          return (
                                            "End Time cannot be in the past"
                                          );
                                        }
                                      }
                                    }
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomRadio
                              className="add-program-radio-btn"
                              control={control}
                              name={`programs.${index}.type`}
                              label=""
                              options={typeArray}
                              row={true}
                              value={"PAID"}
                              onChange={(e) => {
                                const newType = e.target.value;
                                if (newType === "FREE") {
                                  setValue(`programs.${index}.amount`, "");
                                }
                              }}
                            />
                          </Grid>
                          {watch(`programs.${index}.type`) === "PAID" && (
                            <Grid size={{ xs: 12, sm: 12 }}>
                              <CustomTextField
                                placeholder="Price"
                                prefix={currency}
                                control={control}
                                name={`programs.${index}.amount`}
                                type="number"
                                rules={{
                                  required: "Price is required",
                                  pattern: {
                                    value: /^(0?[1-9]|[1-9]\d{0,7})(\.\d{1,2})?$/,
                                    message:
                                      "Enter a valid price (up to 2 decimal places & Zero not accepted)price up to 1Crore",
                                  }
                                }}
                              />
                            </Grid>
                          )}
                          {!showSpeakerSection ? (
                            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'center'}>
                              <CustomButton
                                className="add-program-drawer-speaker-option-btn"
                                label="Assign Speakers for this Program?"
                                variant="outlined"
                                size="large"
                                type="button"
                                onClick={() => setShowSpeakerSection(true)}
                              />
                            </Grid>
                          ) : (
                            <Grid container size={{ xs: 12, sm: 12 }} p={{ xs: 1, sm: 2 }} className="add-program-speaker-section">
                              {/* speaker add section */}
                              <Grid
                                size={{ xs: 12 }}
                                container
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Typography className="add-program-drawer-heading">
                                  Assign Speakers
                                </Typography>
                                {watch(`programs.${index}.speakers`)?.length == 0 && (
                                  <IconButton onClick={() => setShowSpeakerSection(false)}>
                                    <CloseOutlined />
                                  </IconButton>
                                )}
                              </Grid>{/*end of speaker header section */}
                              <Grid size={{ xs: 12 }}>
                                <CustomAutocomplete
                                  name={`programs.${index}.speakerSelection`}
                                  control={control}
                                  placeholder="Search Speaker"
                                  options={searchResults}
                                  getOptionLabel={(option: any) => option.speakerFullName || ""}
                                  onSearch={handleSearch}
                                  loading={loading}
                                  onChange={(selectedOption) => {
                                    setValue(`programs.${index}.speakerId`, selectedOption?.speakerId)
                                    setValue(`programs.${index}.speakerAssetId`, selectedOption?.speakerAssetId)
                                    setValue(`programs.${index}.speakerFullName`, selectedOption?.speakerFullName)
                                    setValue(`programs.${index}.designation`, selectedOption?.designation)
                                  }}
                                />
                              </Grid>
                              <Grid container className="add-program-drawer-new-speaker-link" justifyContent={'end'} size={{ xs: 12 }}>
                                <Typography onClick={() => setNewSpeakerDrawerOpen(true)} className="cursor-container" variant="h6">Create New Speaker ?</Typography>
                              </Grid>
                              {/* <Grid size={{ xs: 12}}>
                                  <CustomTextField
                                    placeholder="Designation"
                                    control={control}
                                    name={`programs.${index}.designation`}
                                    type="text"
                                  />
                                </Grid> */}
                              <Grid container size={12}>
                                {/* <CustomCheckbox 
                                   className="add-addons-check-btn"
                                   options={[{ label: 'Moderator', value: "YES" }]}
                                   control={control}
                                   name={`programs.${index}.isModerator`}
                                  /> */}
                                <Box className="registration-fee-list-decription-helper" display={"flex"} justifyContent={"center"} alignItems={"flex-start"} mr={1}><InfoOutlinedIcon style={{ marginRight: 2 }} /><Typography className="registration-fee-list-decription-helper-text">If the 'Moderator' button is pressed, assign the user as a moderator. Only the most recently selected user with the 'Moderator' button pressed will be added as a moderator.</Typography></Box>
                              </Grid>
                              <Grid size={{ xs: 12 }} >
                                <CustomButton
                                  className="add-program-drawer-btn-cancel"
                                  label="Assign Speaker"
                                  variant="outlined"
                                  size="large"
                                  onClick={() => addSpeaker(index)}
                                />
                              </Grid>
                              {watch(`programs.${index}.speakers`)?.length !== 0 && (
                                <Grid container flexDirection={"column"} className="add-program-speaker-section-card-container" size={{ xs: 12 }}>
                                  <Grid container spacing={1}>
                                    {watch(`programs.${index}.speakers`)?.map((item, speakerIndex) => {
                                      return (

                                        <Grid size={{ xs: 12 }} key={speakerIndex + "grid"} container alignItems="center" className="add-program-speaker-section-card-item" p={1}>
                                          <Grid size={{ xs: 2 }} justifyItems={'center'}>
                                            <Avatar
                                              alt={item.speakerFullName}
                                              src={item?.speakerAssetId
                                                ? `${baseUrl}asset/${item?.speakerAssetId}`
                                                : ""}
                                            />
                                          </Grid>
                                          <Grid size={{ xs: 6 }} justifyItems={'start'}>
                                            <Typography className="add-program-speaker-section-card-item-title">
                                              {item.speakerFullName}
                                            </Typography>
                                            {/* <Typography className="add-program-speaker-section-card-item-subtitle">
                                                  {truncateString(item?.designation, 35, "")}
                                                </Typography> */}
                                            <Typography className="add-program-speaker-section-card-item-subtitle">
                                              {item.isModerator ? "Moderator" : ""}
                                            </Typography>

                                          </Grid>
                                          <Grid size={{ xs: 4 }} justifyItems={'center'} display={"flex"}>
                                            <Tooltip title="Make as Moderator" classes={{ tooltip: 'add-program-speaker-section-card-tool-tip' }}>
                                              {/* <IconButton disabled={item.isModerator?true:false} onClick={() =>assignModerator(index,speakerIndex)}>
                                              <MicNoneIcon/>
                                                </IconButton> */}
                                              <CustomButton
                                                //  className="add-program-hallcreate"
                                                variant="outlined"
                                                label="Moderator"
                                                disabled={item.isModerator ? true : false}
                                                onClick={() => assignModerator(index, speakerIndex)}
                                              />
                                            </Tooltip>
                                            <IconButton
                                              onClick={() => removeSpeaker(item, index)} // Handle removal logic
                                              sx={{ padding: 1 }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Grid>
                                        </Grid>
                                      );
                                    })}
                                  </Grid>
                                </Grid>
                              )}
                            </Grid>// end of add speaker section
                          )}
                          {!showSponserSeciton ? (
                            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'center'}>
                              <CustomButton
                                className="add-program-drawer-speaker-option-btn"
                                label="Assign Sponsor for this Program?"
                                variant="outlined"
                                size="large"
                                type="button"
                                onClick={() => setShowSponsorSection(true)}
                              />
                            </Grid>
                          ) : (<SponsorForm sponsorSectionShow={() => setShowSponsorSection(false)} control={control} handleSearch={handleSponsorSearch} addSponsor={addSponsor} baseUrl={baseUrl} index={index} loading={loading} removeSponsor={removeSponsor} setValue={setValue} searchResults={searchSpekerResults} sponsorDrawerhandle={() => setNewSponsorDrawerOpen(true)} watch={watch} />)}
                          <Grid
                            container
                            direction={"row"}
                            justifyContent="right"
                            alignItems="center"
                            size={{ xs: 12, sm: 12 }}
                          >
                            <Grid>
                              <CustomButton
                                className="add-program-drawer-btn-cancel"
                                label="Cancel"
                                variant="outlined"
                                size="large"
                                onClick={closeDrawer}
                              />
                            </Grid>
                            <Grid>
                              <CustomButton
                                className="add-program-drawer-btn-save"
                                onClick={handleSaveNewPrograms}
                                label={"Save"}
                                variant="contained"
                                size="large"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  }
                })}

              </form>
            </Box>
          </Grid>
        </CustomDrawer>
        <Grid
          container
          direction={"row"}
          className="add-program-program-display-container"
          size={{ xs: 12, sm: 7 }}
          spacing={2}
          key='add-program-display-container'
          mt={{ xs: 2, sm: 4 }}
          sx={{ height: { xs: 200, sm: 300, md: 400 } }}
          p={3}
          justifyContent={'center'}
        >
          {watch("savedPrograms")?.length > 1 ? (
            <Grid size={{ xs: 12, sm: 12 }}>
              <Grid size={{ xs: 12, sm: 12 }}>
                <Typography textAlign={"start"} className="add-program-display-title">
                  Saved Programs
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 12 }}
                className="add-program-program-display-items"
                alignItems="flex-start"
                justifyContent="flex-start"
                mt={{ xs: 1, sm: 3 }}
              >
                {watch("savedPrograms")?.map(
                  (field, index) =>
                    field.name
                    && (
                      <Grid
                        key={field.id}
                        container
                        alignItems="flex-start"
                        className="add-program-display-item"
                        alignContent={"center"}
                        size={{ xs: 12 }}
                      >
                        <Grid size={{ xs: 8, sm: 9 }} >
                          <Grid container size={{ xs: 12 }} direction={'column'}>
                            <Grid size={{ xs: 12 }}><Typography className="text-p2 font-700 truncate-text" title={field.name}>{field.name}</Typography> </Grid>
                            <Grid size={{ xs: 12 }}><Typography className="truncate-text" title={field.description} >{field.description}</Typography></Grid>
                          </Grid>

                        </Grid>
                        <Grid container size={{ xs: 4, sm: 3 }} justifyContent={'center'}>
                          <IconButton key={`${index}-edit-program`} onClick={() => handleEdit(index)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton key={`${index}-delete-program`} onClick={() => handleDeleteConfirmbox(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                        <CustomActionModal
                          open={openModal}
                          icon={<WarningIcon className="unpublish-modal-icon" />}
                          onClose={() => setOpenModal(false)}
                          cancelLabel="Cancel"
                          cancelAction={() => setOpenModal(false)}
                          header="Delete Program?"
                          subHeader="Are you sure you want to delete this program? This action cannot be undone"
                          submitAction={() => handleDelete(programIndex)}
                          submitLabel="Delete"
                          modalClassName="publish-modal"
                        />
                      </Grid>
                    )
                )}
              </Grid>
            </Grid>) : (
            <Grid container alignSelf={'center'} justifyContent={'center'}>
              <Grid container size={{ xs: 12, sm: 8 }} alignSelf={'center'} justifyContent={'center'} spacing={3}>
                <Grid>
                  <NoProgramIcon width={90} height={90} />
                </Grid>
                <Grid>
                  <Typography className="add-program-empty-title">No Programs Added Yet</Typography>
                  <Typography className="add-program-empty-subtitle">Start creating your first program to bring your event to life!</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid
            container
            size={{ xs: 12, sm: 8 }}
            alignSelf={'end'}
          >
            <CustomButton
              className="add-program-save-btn"
              onClick={handleAddProgram}
              label="Add Program"
              variant="contained"
              size="large"
            />
          </Grid>
        </Grid>
        {/* Drawer to create a new Speaker */}
        <Grid >
          <CustomDrawer
            children={<NewSpeakerDrawer onSuccess={handleSearch} closeDrawer={() => setNewSpeakerDrawerOpen(false)} />}
            open={newSpeakerDrawerOpen}
            type="right"
          />
        </Grid>
        {/* Drawer to create a new sponsor */}
        <Grid>
          <CustomDrawer
            children={
              <DrawerCreateSponosor onSuccess={handleSponsorSearch}
                closeDrawer={() =>
                  setNewSponsorDrawerOpen(false)

                }
              />
            }
            open={newSponsorDrawerOpen}
            type="right"
          />
        </Grid>

      </Grid>
    );
  }
);

export default AddProgram;
