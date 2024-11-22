import useStore from '@/Libs/store';
import CustomButton from '@/components/CustomButton/CustomButton';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';
import routes from '@/router/routes';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export interface Event {
  id: number;
  parentId: number | null;
  name: string;
  description: string;
  startTime: string; // ISO string format
  endTime: string; // ISO string format
  venueId: number;
  eventClass: "ONLINE" | "OFFLINE" | "HYBRID"; // If only "ONLINE" is valid, keep it as is
  interval: number | null;
  companyId: number;
  title: string | null;
  amount: string; // If this is always a string
  discount: string | null; // Assuming it might have discount as string or null
  statusId: number;
  registrationDeadline: string; // ISO string format
  slugName: string;
  published: boolean;
  url: string | null;
  speciality: string | null;
  templateId: number | null;
  venue: Venue;
  status: Status;
  eventProgramSchedules: EventProgramSchedule[]; // If this is an array of objects
}

interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postCode: string | null;
  totalCapacity: number | null;
  mapUrl: string | null;
}

interface Status {
  id: number;
  statusName: string;
  description: string;
}

interface EventProgramSchedule {
  // Define the structure if you know the fields, otherwise keep it empty
  [key: string]: any;
}

/**
 * Component used ot draw event details
 * @param param
 * @returns 
 */
export default function EventInfo({ slugName }: { slugName: string }) {
  // let { name, description, id }: Event = data;
  const navigate = useNavigate();
  const setDataById = useStore((state: any) => state.setDataById);
  // const slugNameFromStore = useStore((state: any) => state.compData?.slugName);
  const event: Event = useStore((state: any) => state?.compData?.['eventSlugInfo']?.[`event/slug/${slugName}`]?.data) || {};
  const participantList = useStore((state: any) => state?.compData?.['participantTypeOptions']?.options) ?? [];

  const { control, getValues } = useForm({
    defaultValues: {
      participantType: undefined
    }
  })



  
  /**
   * Handles the participate button click. If the participant type is not selected,
   * show a snackbar error message. Otherwise, store the selected event id in the store
   * and navigate to the program selection page.
   */

  const handleParticipate = () => {


    if (participantList && participantList.length > 0) {
      const participantType = getValues('participantType');
      if (!participantType) {

        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: 'Please select participant type' });

        return;
      }
    }

    setDataById('eventSelected', { id: event?.id });
    navigate(routes.programSelection())
  }

  return (
    <Grid container spacing={2} className="eventInfo-conatiner" justifyContent={'center'}>
      <Grid container size={12} className="eventInfo">
        <Grid size={4}>

        </Grid>
        <Grid container size={8} justifyContent={'center'} direction={'column'}>
          <Grid container>
            <Typography>Welcome to </Typography> &nbsp;
            {event?.name}
          </Grid>
          {event?.description}
        </Grid>
      </Grid>
      <Grid container>
        <CustomButton
          label="Participate"
          variant="outlined"
          onClick={handleParticipate}

        />
        {(participantList && participantList.length > 0) && <Grid size={12}>
          <CustomSelect name='participantType' control={control} label='choose type' options={participantList} />
        </Grid>}
      </Grid>
    </Grid>

  )
}
