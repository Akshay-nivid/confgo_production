import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import MikeIcon from "../../assets/svg/karaoke.svg"
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore, { setNonPersistedDataById } from "@/Libs/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { truncateString } from "@/Utils/CommonBaseClass";


/**
 * EventDropDown Component
 * 
 * Displays a dropdown menu with event options and a "Create Event" button.
 * Allows users to select an event type and triggers the update of custom data in the store.
 * Also shows an icon and label related to events.
 * 
 * @param {Object} data - Contains event data for populating the dropdown options.
 * @returns {JSX.Element} - Renders a dropdown menu and create event button.
 */

const EventDropDown = (data: any): JSX.Element => {


    const navigate = useNavigate();
    const publishedEventInitialFetchDone = useStore(state => state.nonPersistedData?.publishedEventInitialFetchDone?.value) || false

    /**
     * Filtered only Published events
     */

    const publishedEvent = data?.data?.data?.filter((event: any) => event?.published === true);

    /**
     * Mapping event data to options for the dropdown
     */

    const options = publishedEvent?.map((item: any) => ({
        label: truncateString(item?.name, 40),
        value: item?.id
    }));

    /**
     * React Hook Form's control and state management
     */

    const {
        watch,
        setValue,
        control,
    } = useForm<any>({
        defaultValues: {
            title: "",
            fieldType: "",
            required: false,
        },
    });

    /**
     * Set default value for fieldType from the provided event data
     * Save selected eventId type to the store using the watch hook
     */
  
    useEffect(() => {
        if (publishedEventInitialFetchDone) {
            setValue('fieldType', publishedEvent?.[0]?.id);
            setNonPersistedDataById("CustomSelectData", { data: watch('fieldType') });
            setNonPersistedDataById("publishedEventInitialFetchDone", { value: true })
        }


    }, [data,watch('fieldType')]);
   

    return (
        <Grid container size={12} className="adminDashBoard-EventsMenu">
            <Grid className="adminDashBoard-EventsMenu-content" container size={12} alignItems={"center"} spacing={1}>
                <Grid className="heading" size={{ xs: 12, md: 3 }}>
                    <Typography className="heading">Dashboard</Typography>
                </Grid>

                <Grid className="DropDownBox " flex={{ xs: 1 }} size={{ sm: 6, md: 6 }} display={"flex"} >
                    <Grid display={{ xs: "none", sm: "flex" }} size={5} container justifyContent={"center"} alignItems={"center"} columnSpacing={.4}
                        className="DropDownBox-container-mikeIcon"  >
                        <MikeIcon />
                        <Typography className="DropDownBox-container-mikeIcon-title"> Events</Typography>
                    </Grid>
                    <Grid className="DropDownBox-container" size={12} display={"flex"}>

                        <Grid size={12}>
                            <CustomSelect
                                className="DropDownBox-container-dropDown"
                                size="medium"
                                name="fieldType"
                                control={control}
                                defaultValue={options?.length>0 ? options?.[0]?.value:null}
                                label=""
                                options={options?.length ? options : [{ label: "No events available", value:null, disabled: true }]} // Show a default option when no events exist
                            />
                        </Grid>

                    </Grid>
                </Grid>
                <Grid className="DropDownBox-container-createEvent" display={"flex"}  >
                    <CustomButton
                        className="DropDownBox-container-createEvent-btn min-w-max"
                        fullWidth
                        label="Create Event"
                        onClick={() => navigate('/events/create')}
                    />
                </Grid>
            </Grid>
        </Grid>
    )

}
export default EventDropDown;