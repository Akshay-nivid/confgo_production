import { Typography, IconButton, Box, Avatar } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomButton from "@/components/CustomButton/CustomButton";
import Grid from "@mui/material/Grid2";
import { useForm, FieldValues, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import moment from "moment";
import SessionAddonDrawer from "./SessionAddonDrawer";
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { POST, setDataById} from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { truncateString } from "@/Utils/CommonBaseClass";
import config from "../../../../config.json";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import NewSpeakerDrawer from "../NewSpeakerDrawer";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { useParams } from "react-router-dom";
import DrawerCreateSponosor from "../Sponsor/DrawerCreateSponsor";
import MicNoneIcon from '@mui/icons-material/MicNone';

interface FormData {
  isPaid: "PAID" | "FREE";
  startTime: string;
  endTime: string;
  name: string
  description: string;
  amount: string;
  totalSeat: string;
  price: string;
  startDate: string;
  endDate: string
  speakerId?: any;
  speakerName?: string;
  speakerAssetId?: string;
  speakerDesignation?:string;
  moderator:boolean;
  hallName:string
  speakers: {
    speakerId?: any;
    speakerName?: string;
    speakerAssetId?: string;
    speakerDesignation?:string;
    moderator?:boolean
  }[];
  speakerSelection?:string;
  sponsorId?: string;
  sponsorName?: string;
  sponsorAssetId?: string;
  sponsorType?: string;
  reservedSeats?:string
  sponsors: {
    sponsorId?:string;
    sponsorName?: string;
    sponsorAssetId?: string;
    sponsorType?: string;
    reservedSeats?:string;
  }[];
  sponsorSelection?: string;
}
type Speaker = {
  speakerId?: any;
  speakerName?: string;
  speakerAssetId?: string;
  speakerDesignation?: string;
}
type Sponsor = { 
  sponsorId?: string;
  sponsorName?: string;
  sponsorAssetId?: string;
  sponsorType?: string;
  reservedSeats?:string;
}

interface SponsorType{
  value: number;
  label: string;
}


interface SessionDrawerContentProps {
    isEditing: boolean;
    selectedProgram: any;
    onSubmit: (data: FieldValues) => void;
    closeDrawer: () => void;
    isAddon: boolean; 
    eventEndTime:any;
    eventStartTime:any;
    eventData:any
    submitHandler:()=>void;
  }
  
  const SessionDrawerContent: React.FC<SessionDrawerContentProps> = ({
    isEditing,
    selectedProgram,
    eventEndTime,
    eventStartTime,
    onSubmit,
    closeDrawer,
    isAddon, // Destructuring the isAddon prop
    eventData,
    submitHandler
  }) => {
    const {
      control,
      getValues,
      setValue,
      handleSubmit,
      watch,
      setError,
      reset,
      clearErrors,
    } = useForm<FormData>({
      defaultValues: {
        isPaid: isEditing && selectedProgram?.amount > 0 ? "PAID" : "FREE", 
        startTime: selectedProgram ? selectedProgram.startTime : (eventStartTime ? eventStartTime:""),
        endTime: selectedProgram ? selectedProgram.endTime : (eventEndTime ? eventEndTime:""),
        name: selectedProgram ? selectedProgram.name : "",
        description: selectedProgram ? selectedProgram.description : "",
        totalSeat: selectedProgram ? selectedProgram?.eventParticipantEntries?.[0]?.totalSeat : null,
        price: selectedProgram ? selectedProgram.amount : "",
        startDate:selectedProgram ? selectedProgram.startTime : (eventStartTime ? eventStartTime:""),
        endDate:selectedProgram ? selectedProgram.endTime : (eventEndTime ? eventEndTime:""),
      },
    });

    const isPaid = watch("isPaid");
    const [showSpeakerSection, setShowSpeakerSection] = useState(false);
    const [existingSpeakers, setExistingSpeakers] = useState<any>();
    const [showSponserSection, setShowSponsorSection] = useState(false);
    const [loading, setLoading] = useState(false);
    const companyId = sessionStorage.getItem("companyId")
    const [searchResults, setSearchResults] = useState<Speaker[]>([]);
    const [delspeaker,setDelSpeaker]=useState<any>([])
    const [sponsorSearchResults, setSponsorSearcResults] = useState<Sponsor[]>([]);
    const [sponsorType,setSponsorType]=useState<SponsorType[]>([]);
    const baseUrl = config.api.url;
    const [existingSponsor, setExistingSponsor] = useState<any>();
    const [delsponsor,setDelSponsor]=useState<any>([])
    const [newSpeakerDrawerOpen, setNewSpeakerDrawerOpen] = useState(false);
    const [newSponsorDrawerOpen, setNewSponsorDrawerOpen] = useState(false);
    const [latestModerator, setLatestModerator] = useState<string | null>(null);
    const {append } = useFieldArray({
      control,
      name: "speakers",
    });
 
    const { append: appendSponsor } = useFieldArray({
      control,
      name: "sponsors", // Field array for sponsors
    });  
   
  /**
   * Used to set value into the field if its edit and reset if it's add
   */
    useEffect(() => {
      if (isEditing && selectedProgram) {
        setValue("name", selectedProgram.name);
        setValue("description", selectedProgram.description);
        setValue("totalSeat", selectedProgram?.totalSeat);
        setValue("startTime", moment(selectedProgram?.startTime).format("HH:mm"));
        setValue("endTime", moment(selectedProgram?.endTime).format("HH:mm"));
        setValue("isPaid", selectedProgram.amount > 0 ? "PAID" : "FREE");
        setValue("price", selectedProgram.amount);
        setValue('startDate', moment(selectedProgram?.startTime).format("YYYY-MM-DD"))
        setValue('endDate', moment(selectedProgram?.endTime).format("YYYY-MM-DD"))
        setValue('hallName',selectedProgram?.hall)
        const speakers = selectedProgram?.eventSpeakers?.map((speaker: any) => ({
          speakerId: speaker?.userId,
          speakerName: `${speaker?.user?.firstName} ${speaker?.user?.lastName}`,
          speakerDesignation: speaker?.user?.designation,
          speakerAssetId:speaker?.user?.assetId,
          moderator: speaker?.speakerBios?.[0]?.isModerator || false, 
        }));
      //set the assigned moderator as latestmoderator
      const assignedModerator = speakers?.find((speaker: any) => speaker?.moderator);
      if (assignedModerator) {
        setLatestModerator(assignedModerator?.speakerId);
      } 
        const sponsors = selectedProgram?.eventSponsors?.map((sponsor: any) => ({
          sponsorId: sponsor?.sponsor?.id,
          sponsorName: sponsor?.sponsor?.name ,
          sponsorType: sponsor?.sponsorTypeId,
          reservedSeat: sponsor?.reservedSeats,
          sponsorAssetId:sponsor?.sponsor?.logoAssetId,
        }))

        setValue("speakers", speakers);
        setExistingSpeakers(speakers);
        setShowSpeakerSection(speakers?.length > 0)

        setValue("sponsors", sponsors)
        setExistingSponsor(sponsors)
        setShowSponsorSection(sponsors?.length > 0)

        } else {
        reset({
          isPaid: "FREE",
          startTime: moment(eventStartTime).format("HH:mm"),
          endTime: moment(eventStartTime).format("HH:mm"),
          startDate:moment(eventStartTime).format("YYYY-MM-DD"),
          endDate:moment(eventStartTime).format("YYYY-MM-DD"),
          name: "",
          description: "",
          totalSeat: "",
          price: "",
          speakerId: "",
          speakerAssetId: "",
          speakerDesignation: "",
          speakerName:"",
          sponsorId:"",
          sponsorAssetId:"",
          sponsorType:"",
          sponsorName:"",
          reservedSeats:"",
          hallName:""
        });
      }
    }, [isEditing, selectedProgram, reset, setValue]);
 
    const{id} = useParams();
  /**
   * making the field price 0 if free
   */
    useEffect(() => {
        if (isPaid === "FREE") setValue("price", "0");
      }, [isPaid, setValue]);
  
		if(isAddon){
				return <SessionAddonDrawer closeDrawer={closeDrawer} isEditing={isEditing} selectedAddOn={selectedProgram} onSubmit={onSubmit} eventData={eventData}  onSubmitHandler={submitHandler} />
		}  

  /**
 * Filters out speakers from the `speakers` array whose `speakerId` exists in the `existingSpeakers` array.
 *
 * @param {Array} speakers - The array of speaker objects to filter.
 * @param {Array} existingSpeakers - The array of existing speaker objects with `speakerId`s to exclude.
 * @returns {Array} A new array of speakers excluding those with `speakerId`s found in `existingSpeakers except the edited speaker`.
 */
  function removeExistingSpeakers(speakers: any,existingSpeakers: any,latestModerator: string | null) {
    // Create a Set of speakerIds from the existingSpeakers array for fast lookup
    const existingSpeakerIds = new Set(existingSpeakers?.map((speaker: any) => speaker.speakerId));
    // Filter out speakers, but keep the latestModerator so that to give to payload
    return (
      speakers &&
      speakers.filter(
        (speaker: any) =>
          !existingSpeakerIds.has(speaker?.speakerId) || speaker?.speakerId === latestModerator
      )
    );
  }
  /**
   * formating the submit request
   */
    const handleSubmitRequest = (data: FieldValues) => {
      const startDateTime = `${data.startDate}T${data.startTime}`;
      const endDateTime = `${data.endDate}T${data.endTime}`;

      const startDate = `${data.startDate}`;
      const endDate = `${data.endDate}`

      const startDates = moment(startDate)
      const endDates = moment(endDate);
      if (startDate > endDate) {
        setError(`startDate`, {
          type: 'manual',
          message: 'Start date cannot be greater than end date',
        });
        return
      }

      const currentDate = moment().startOf("day"); // Today's date (time set to 00:00)
      const currentTime = moment(); // Current date and time
          
      // If the program starts today, validate the start time
      if (startDates.isSame(currentDate, 'day')) {
        const selectedStartTime = moment(startDateTime, "YYYY-MM-DDTHH:mm");
        if (selectedStartTime.isBefore(currentTime)) {
            setError(`startTime`, {
                type: 'manual',
                message: 'Start time cannot be earlier than the current time for today.',
            });
            return;
        }
    }

    // If the start date and end date are the same, check startTime vs endTim
    if (startDates.isSame(endDates, 'day')) {
      const selectedStartTime = moment(startDateTime, "YYYY-MM-DDTHH:mm");
      const selectedEndTime = moment(endDateTime, "YYYY-MM-DDTHH:mm");

      if (selectedEndTime.isBefore(selectedStartTime)) {
          setError(`endTime`, {
              type: 'manual',
              message: 'End time cannot be earlier than start time when the start and end dates are the same.',
          });
          return;
      }
  }
      // Map speakers to the desired format
      const newAddedSpeakers = data?.speakers?.map((speaker: any) => ({
        speakerId: speaker?.speakerId,  
        isModerator:speaker?.moderator
      }));

       const speakers = removeExistingSpeakers(newAddedSpeakers, existingSpeakers,latestModerator);
      //updating the speaker array with latest moderator as true 
      const updatedSpeakers = speakers?.map((speaker: any) => ({
        ...speaker,
        isModerator: speaker?.speakerId === latestModerator, 
      }));
      // Map sponsors to the desired format
      const newAddedSponsors = data?.sponsors?.map((sponsor: any) => ({
        sponsorId: sponsor?.sponsorId,
        sponsorTypeId: sponsor?.sponsorType || ' ',
      ...(sponsor?.reservedSeats&&{reservedSeats: sponsor?.reservedSeats}),
        parentEventId: id,

      }));

      const sponsor = removeExistingSponsors(newAddedSponsors, existingSponsor);


      // Create the new transformed object
      const transformedProgram = {
        isPaid: data.isPaid,
        name: data.name,
        description: data.description,
        price: data.price,
        ...(data.totalSeat ? { totalSeat: data.totalSeat } : {}),
        startTime: startDateTime,
        endTime: endDateTime,
        speakers:updatedSpeakers,
        sponsor,
        ...(data?.hallName ? { hall: data?.hallName }: {}),
      };
      onSubmit(transformedProgram);


    }

    /**
     * @param speaker function to remove a speaker from program
     * if the speaker data is from api  then it removes the speaker from state 
     * else calls the api to delete speaker
     */
    const removeSpeaker = (speaker: Speaker) => {
      const speakers = watch('speakers');
      setDelSpeaker([...delspeaker,speaker.speakerId])
    
      // Check if the speaker is part of the original data (selectedProgram) using userId
      const isExistingSpeaker = selectedProgram?.eventSpeakers?.some(
        (existingSpeaker: any) => existingSpeaker?.userId === speaker?.speakerId
      );
    
      if (isExistingSpeaker) {
        // If the speaker is from the original program data, call the API to remove it
        const speakerToRemove = selectedProgram?.eventSpeakers?.find(
          (existingSpeaker: any) => existingSpeaker?.userId === speaker?.speakerId
        );
    
        if (speakerToRemove) {
          const speakerId = speakerToRemove?.id; // Use `id` for deletion
    
          POST({
            url: `eventSpeaker/delete/${speakerId}`, // Your API endpoint to remove a speaker
            id: "removeSpeaker",
            body: { },
            successCB: (context: any) => {
              Logger.info("Speaker removed successfully", context);
              // Proceed to remove from the field array once the API call is successful
              const updatedSpeakers = speakers?.filter((s: Speaker) => s.speakerId !== speaker.speakerId);
              setValue('speakers', updatedSpeakers); // Update form data after successful API call
            },
            errorCB: (context: any) => {
              Logger.error("Error removing speaker", context);
            }
          });
        }
      } else {
        // If the speaker is newly added, just remove it from the field array
        const updatedSpeakers = speakers?.filter((s: Speaker) => s?.speakerId !== speaker?.speakerId);
        setValue('speakers', updatedSpeakers); // Update form data to remove the speaker
      }
    };
       
    /**
     * Method transforms data to the autocomplete data format
     * @param data : api response data
     * @returns 
     */
    function transformUserData(data: any): Speaker[] {
      return data?.map((item: any) => ({
        speakerId: item?.id,
        speakerName: `${item?.firstName} ${item?.lastName}`,
        speakerAssetId: item?.assetId,
        speakerDesignation:item?.designation,
        ...item
      }));
    }
    /**
     *  Function to handle search API for user role autocomplete
     */
    const handleSearch = async (query: string) => {
      setLoading(true);
      await POST({
        url: "user/userRole/list",
        id: "userRoleList",
        body: {
          filters: {
            roleEnums: ['SPEAKER'],
            name: query,
            companyId: companyId,
          },
          limit: 30
        },
        successCB: (context: any) => {
          setSearchResults(transformUserData(context?.data))
          setLoading(false);
        },
        errorCB: (context: any) => {
          Logger.error("Error fetching search results:", context?.message);
          setLoading(false);
        }
      })
    };


     /**
     * Method transforms data to the autocomplete data format of sponsor
     * @param data : api response data
     * @returns 
     */
     function transformSponsorData(data: any): Sponsor[] {
      return data?.map((item: any) => ({
        sponsorId: item?.id,
        sponsorName: `${item?.name}`,
        sponsorAssetId: item?.logoAssetId,
        reservedSeats:item?.reservedSeats,
        ...item
      }));
    }
    /**
     *  Function to handle search Sponsor API for user role autocomplete
     */
    const handleSearchSponsor = async (query: string) => {
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
          setSponsorSearcResults(transformSponsorData(context?.data))
          setLoading(false);
        },
        errorCB: (context: any) => {
          Logger.error("Error fetching search results:", context?.message);
          setLoading(false);
        }
      })
    };


    function removeExistingSponsors(sponsors: any, existingSponsors: any) {
      const existingSponsorsIds = new Set(existingSponsors?.map((sponsor: any) => sponsor.sponsorId));
      return sponsors && sponsors.filter((sponsor: any) => !existingSponsorsIds.has(sponsor.sponsorId));
    }
    
    const removeSponsor = (sponsor: Sponsor) => {
      const sponsors = watch('sponsors');
      setDelSponsor([...delsponsor, sponsor.sponsorId])
    
      // Check if the speaker is part of the original data (selectedProgram) using userId
      const isExistingSponsor = selectedProgram?.eventSponsors?.some(
        (existingSponsor: any) => existingSponsor?.sponsorId === sponsors?.[0]?.sponsorId
      );
    
      if (isExistingSponsor) {
        // If the speaker is from the original program data, call the API to remove it
        const sponsorToRemove = selectedProgram?.eventSponsors?.find(
          (existingSponsor: any) => existingSponsor?.sponsorId === sponsors?.[0]?.sponsorId
        );

        if (sponsorToRemove) {
          const sponsorId = sponsorToRemove?.id; // Use `id` for deletion
    
          POST({
            url: `sponsor/remove/${sponsorId}`, // Your API endpoint to remove a speaker
            id: "removeSponsor",
            body: { },
            successCB: (context: any) => {
              Logger.info("Sponsorr removed successfully", context);
              // Proceed to remove from the field array once the API call is successful
              const updatedSponsors = sponsors.filter((s: Sponsor) => s.sponsorId !== sponsor.sponsorId);
              setValue('sponsors', updatedSponsors); // Update form data after successful API call
            },
            errorCB: (context: any) => {
              Logger.error("Error removing sponsor", context);
            }
          });
        }
      } else {
        // If the speaker is newly added, just remove it from the field array
        const updatedSponsor = sponsors?.filter((s: Sponsor) => s?.sponsorId !== sponsor?.sponsorId);
        setValue('sponsors', updatedSponsor); // Update form data to remove the speaker
      }
    };


    const addSponsor = () => {
      const values = watch();
      const sponsorId = values?.sponsorId;
      const sponsorName = values?.sponsorName;
      const sponsorAssetId = values?.sponsorAssetId;
      const sponsorType = values?.sponsorType;
      const reservedSeats = values?.reservedSeats;

            const isDuplicate = values?.sponsors?.some((sponsor: any) => sponsor.sponsorId === sponsorId);
            if(isDuplicate){
              setError('sponsorSelection', {type:"manual", message:"Sponsor already exist please select another sponsor"});
              return;
            }
            // Check if the speaker is part of the original data (selectedProgram) using userId
            const isExistingSponsor = selectedProgram?.eventSpeakers?.some(
              (existingSponsor: any) => existingSponsor?.userId === sponsorId
            );

            if(isExistingSponsor){
              setError(`sponsorSelection`, { type: "manual", message: "Sponsor Already assigned. please select another sponser" });
              return;
            }

            if (!sponsorId) {
              setError(`sponsorSelection`, { type: "manual", message: "Please select a sponsor" });
              return;
            }
            if (!sponsorType) {
              setError(`sponsorType`, { type: "manual", message: "Sponsor type is required" });
              return;
            }

             // Append speaker to the speakers field
      appendSponsor({
        sponsorId,
        sponsorName,
        sponsorAssetId,
        sponsorType,
        reservedSeats,
      });
      clearErrors();
      
        // Reset the speaker form fields
      setValue("sponsorId", "");
      setValue("sponsorName", "");
      setValue("sponsorAssetId", "");
      setValue("sponsorType", "");
      setValue("reservedSeats","")
    }

    /**
     * Adds a new speaker to the program's speakers array.
     */
    const addSpeaker = () => {
      const values = watch();

      const speakerId = values?.speakerId;
      const speakerName = values?.speakerName;
      const speakerAssetId = values?.speakerAssetId;
      const speakerDesignation = values?.speakerDesignation;
      const moderator = values?.moderator
      const isDuplicate = values?.speakers?.some((speaker: any) => speaker.speakerId === speakerId);
      if(isDuplicate){
        setError(`speakerSelection`, { type: "manual", message: "Speaker Already assigned. please select another speaker" });
        return;
      }
    
      if (!speakerId) {
        setError(`speakerSelection`, { type: "manual", message: "Please select a speaker" });
        return;
      }
      // if (!speakerDesignation) {
      //   setError(`speakerDesignation`, { type: "manual", message: "Designation is required" });
      //   return;
      // }
        // Append speaker to the speakers field
      append({
        speakerId,
        speakerName,
        speakerAssetId,
        speakerDesignation,
        moderator,
      });
      clearErrors();
      
        // Reset the speaker form fields
      setValue("speakerId", "");
      setValue("speakerName", "");
      setValue("speakerAssetId", "");
      setValue("speakerDesignation", "");
      
    };
    
    
     const getSponsor=async ()=>{
              await POST({
                  url:'sponsorType/list',
                  body:{},
                  id:'sponsorType-list',
                  successCB: (_context: any) => {
                    let _sponsor:any=[];
                    _context.data.forEach((item: any) => {
                      _sponsor.push({
                        value: item?.id,
                        label: item?.name
                      })
                    })
                    setSponsorType(_sponsor)
                  }, 
                  errorCB: (context: any) => {
                      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
                  }
              });
          }
    
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            getSponsor()
          }, [])
          
    // function to update the list      
    const handleSponsorSearch = async (query: string) => {
          setLoading(true);
          await POST({
            url: "sponsor/list",
            id: "sponsorList",
            body: {
              filters: {
                name: query,
                companyId: companyId,
              },
              limit:30
            },
            successCB: (context: any) => {
              setSponsorSearcResults(transformSponsorData(context?.data))
              setLoading(false);
            },
            errorCB: (context: any) => {
              Logger.error("Error fetching search results:", context?.message);
              setLoading(false);
            }
          })
        };

    /**
     * assign moderator function only latest selected is given as true
     */
    const handleAssignModerator = (speakerIndex: number, speakerId: string) => {
      return () => {
        const speakers = getValues("speakers");
        // Update all moderators to false except the selected one
        const updatedSpeakers = speakers?.map((speaker: any, index: number) => ({
          ...speaker,
          moderator: index === speakerIndex, // Set selected speaker as moderator
        }));
        setValue("speakers", updatedSpeakers);
        // Update the latest moderator state
        setLatestModerator(speakerId);
      };
    };

    return (
      <Box sx={{ maxWidth: 600 }}>
        <Grid container spacing={2} padding={2}>
          <Grid container justifyContent="space-between" alignItems="center" size={{xs:12}}>
            <Typography className="event-detail-speakers-card-contributor-header">
              {isEditing ? "Edit Program" : "Add Program"}
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
  
          <Grid size={{xs:12}}>
            <CustomTextField
              name="name"
              placeholder="Name"
              control={control}
              rules={{required:"Name is compolsory"}}
 
            />
          </Grid>
  
          <Grid size={{xs:12}}>
            <CustomTextField
              name="description"
              placeholder="Description"
              control={control}
              rules={{required:"Description is required"}}
            />
          </Grid>
          <Grid size={{xs:12}}>
            <CustomTextField
              name="totalSeat"
              placeholder="Total Seats"
              control={control}
              type="number"
              rules={{
                pattern: {
                value: /^(0?[1-9]|[1-9]\d{0,7})$/,
                  message:
                    "Enter a positive whole number",
                }
              }}
            />
          </Grid>
          <Grid size={12}>
            <CustomTextField
              name="hallName"
              placeholder="Hall Name"
              control={control}
            />
          </Grid>
          <Grid size={12}>
          <CustomTextField
              name="startDate"
              label="Start Date"
              placeholder="Program Date"
              control={control}
              defaultValue={moment(eventStartTime).format("YYYY-MM-DD")} 
              min={moment(eventStartTime).format("YYYY-MM-DD")} 
              max={moment(eventEndTime).format("YYYY-MM-DD")}
              type="date"
              requiredField={true}
            />
          </Grid>
          <Grid size={12}>
          <CustomTextField
              name="endDate"
              label="End Date"
              placeholder="Program Date"
              control={control}
              defaultValue={moment(eventStartTime).format("YYYY-MM-DD")} 
              min={moment(eventStartTime).format("YYYY-MM-DD")} 
              max={moment(eventEndTime).format("YYYY-MM-DD")}
              type="date"
              requiredField={true}
            />
          </Grid>
  
  
          <Grid container size={{xs:12}} justifyContent={"space-between"}>
<Grid size={6}>
          <CustomTextField
                name="startTime"
                label="Start Time"
                placeholder="Start Time"
                control={control}
                type="time"
              />
              </Grid>
              <Grid size={6}>
             <CustomTextField
                name="endTime"
                label="End Time"
                placeholder="End Time"
                control={control}
                type="time"
              />
              </Grid>
          </Grid>
  
          <Grid size={{xs:12}}>
         
          </Grid>
  
          <Grid size={{xs:12}}>
            <CustomRadio
              name="isPaid"
              options={[
                { label: "Paid", value: "PAID" },
                { label: "Free", value: "FREE" },
              ]}
              control={control}
              row
            />
          </Grid>
  
          {isPaid === "PAID" && (
            <Grid size={{xs:12}}>
              <CustomTextField
                name="price"
                placeholder="Price"
                control={control}
                type="number"
                requiredField={true}
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
                <IconButton onClick={() => setShowSpeakerSection(false)}>
                  <CloseOutlined />
                </IconButton>
              </Grid>{/*end of speaker header section */}
              <Grid size={{ xs: 12 }}>
                <CustomAutocomplete
                  name={`speakerSelection`}
                  control={control}
                  placeholder="Search Speaker"
                  options={searchResults}
                  getOptionLabel={(option: any) => option?.speakerName || ""}
                  onSearch={handleSearch}
                  loading={loading}
                  onChange={(selectedOption) => {
                    setValue(`speakerId`, selectedOption?.speakerId)
                    setValue(`speakerAssetId`, selectedOption?.speakerAssetId)
                    setValue(`speakerName`, selectedOption?.speakerName)
                    setValue(`speakerDesignation`, selectedOption?.speakerDesignation)
                  }}
                />
              </Grid>
              <Grid container className="add-program-drawer-new-speaker-link"  justifyContent={'end'} size={{xs:12}}>
                <Typography className="cursor-container" variant="h6" onClick={() => setNewSpeakerDrawerOpen(true)}>Create New Speaker ?</Typography>
              </Grid>
              {/* <Grid size={{ xs: 12 }}>
                <CustomTextField
                  placeholder="Designation"
                  control={control}
                  name={`speakerDesignation`}
                  type="text"
                />
              </Grid> */}
              <Grid size={{ xs: 12 }} >
                <CustomButton
                  className="add-program-drawer-btn-cancel"
                  label="Assign Speaker"
                  variant="outlined"
                  size="large"
                  onClick={addSpeaker}
                />
              </Grid>
              {watch(`speakers`)?.length !== 0 && (
                <Grid container flexDirection={"column"} className="add-program-speaker-section-card-container" size={{ xs: 12 }}>
                  <Grid container spacing={1}>
                    {watch(`speakers`)?.map((item, speakerIndex) => {
                      return (
                        <Grid size={{ xs: 12 }} key={speakerIndex + "grid"} container alignItems="center" className="add-program-speaker-section-card-item" p={1}>
                          <Grid size={{ xs: 2 }} justifyItems={'center'}>
                            <Avatar
                              alt={item?.speakerName}
                              src={item?.speakerAssetId
                                ? `${baseUrl}asset/${item?.speakerAssetId}`
                                : ""}
                            />
                          </Grid>
                          <Grid size={{ xs: 8 }} justifyItems={'start'}>
                            <Typography className="add-program-speaker-section-card-item-title">
                              {item?.speakerName}
                            </Typography>
                            <Typography className="add-program-speaker-section-card-item-subtitle">
                            {item?.moderator ? "Moderator" : ""}
                            </Typography>
                            <Typography className="add-program-speaker-section-card-item-subtitle">
                              {truncateString(item?.speakerDesignation, 35, "")}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 2 }}  display={"flex"}>
                          <>
                          <IconButton  onClick={handleAssignModerator(speakerIndex, item.speakerId)}>
                          <MicNoneIcon/>
                            </IconButton>
                            <IconButton onClick={() => removeSpeaker(item)}>
                              <DeleteIcon />
                            </IconButton>
                          </>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              )}
            </Grid>// end of add speaker section
          )}
          {/* Drawer to create a new Speaker */}
          <Grid >
            <CustomDrawer
              children={<NewSpeakerDrawer onSuccess={() => { handleSearch("") }} closeDrawer={() => setNewSpeakerDrawerOpen(false)} />}
              open={newSpeakerDrawerOpen}
              type="right"
            />
          </Grid>


{!showSponserSection ? (
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'center'}>
              <CustomButton
                className="add-program-drawer-speaker-option-btn"
                label="Assign Sponsors for this Program?"
                variant="outlined"
                size="large"
                type="button"
                onClick={() => setShowSponsorSection(true)}
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
                  Assign Sponsors
                </Typography>
                <IconButton onClick={() => setShowSponsorSection(false)}>
                  <CloseOutlined />
                </IconButton>
              </Grid>{/*end of sponsor header section */}
              <Grid size={{ xs: 12 }}>
                <CustomAutocomplete
                  name={`sponsorSelection`}
                  control={control}
                  placeholder="Search Sponsor"
                  options={sponsorSearchResults}
                  getOptionLabel={(option: any) => option?.name || ""}
                  onSearch={handleSearchSponsor}
                  loading={loading}
                  onChange={(selectedOption) => {
                    setValue(`sponsorId`, selectedOption?.sponsorId)
                    setValue(`sponsorAssetId`, selectedOption?.sponsorAssetId)
                    setValue(`sponsorName`, selectedOption?.sponsorName)
                  }}
                />
              </Grid>
             
              <Grid size={{ xs: 12 }}>
              <CustomSelect
                    fullWidth
                    name="sponsorType"
                    control={control}
                    label="Sponsor Type"
                    options={sponsorType}
                    />
              </Grid>
              <Grid size={{ xs: 12 }}>
              <CustomTextField         
                    name="reservedSeats"
                    control={control}
                    label="Reservation seat"
                    />
              </Grid>
              <Grid container className="add-program-drawer-new-speaker-link" justifyContent={'end'}  size={{xs:12}} >
              <Typography onClick={() => setNewSponsorDrawerOpen(true)} className="cursor-container" variant="h6">Create New Sponsor ?</Typography>
            </Grid>
              <Grid size={{ xs: 12 }} >
                <CustomButton
                  className="add-program-drawer-btn-cancel"
                  label="Assign Sponsor"
                  variant="outlined"
                  size="large"
                  onClick={addSponsor}
                />
              </Grid>
              {watch(`sponsors`)?.length !== 0 && (
                <Grid container flexDirection={"column"} className="add-program-speaker-section-card-container" size={{ xs: 12 }}>
                  <Grid container spacing={1}>
                    {watch(`sponsors`)?.map((item, sponsorIndex) => {
                      return (
                        <Grid size={{ xs: 12 }} key={sponsorIndex + "grid"} container alignItems="center" className="add-program-speaker-section-card-item" p={1}>
                          <Grid size={{ xs: 2 }} justifyItems={'center'}>
                            <Avatar
                              alt={item?.sponsorName}
                              src={item?.sponsorAssetId
                                ? `${baseUrl}asset/${item?.sponsorAssetId}`
                                : ""}
                            />
                          </Grid>
                          <Grid size={{ xs: 8 }} justifyItems={'start'}>
                            <Typography className="add-program-speaker-section-card-item-title">
                              {item?.sponsorName}
                            </Typography>
                            <Typography className="add-program-speaker-section-card-item-subtitle">
                            {truncateString(
    sponsorType.find((type:any) => type.value === item?.sponsorType)?.label || "N/A",
    35
  )}                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 2 }} justifyItems={'center'}>
                            <IconButton onClick={() => removeSponsor(item)}>
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

          <Grid size={{xs:12}}>
            <Grid container justifyContent="right">
              <CustomButton
                label="Submit"
                onClick={handleSubmit(handleSubmitRequest)}
                className="event-sessions-edit-button"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid>
        <CustomDrawer
            children={
            <DrawerCreateSponosor onSuccess={()=>{handleSponsorSearch("")}} 
            closeDrawer={()=>
              setNewSponsorDrawerOpen(false)           
              }
              />
            }
            open={newSponsorDrawerOpen} 
            type="right"
          />
        </Grid>
      </Box>
    );
  };
  
  export default SessionDrawerContent;
  