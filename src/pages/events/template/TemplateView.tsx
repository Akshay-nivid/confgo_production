/**
 * Component handles the default template
 */
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import AboutSection from './AboutSection';
import ProgramSection from './ProgramSection';
import HeaderSection from './HeaderSection';
import EventContributorsSection from './EventContributorsSection';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import FooterSection from './FooterSection';

type TemplateViewProps = {
  temp: string | undefined;
  eventId: string | undefined;
}

const TemplateView: React.FC<TemplateViewProps> = React.memo(({ temp, eventId }) => {

  const GET = useStore((state: any) => state.GET);
  const dataInfo = useStore((state: any) => state?.compData?.['defaultTemplateEventDetails']?.[`event/${eventId}`]) ?? [];
  const clearDataById = useStore((state: any) => state?.clearDataById)
  console.log('testvalues', dataInfo)

  /**
  * Useeffect hook handles the api call for fetching event details
  */
  useEffect(() => {
    fetchEventDetails();
  }, [])

  useEffect(() => () => {
    clearDataById('defaultTemplateEventDetails')
  }, [])

  /**
* Method fetch the event details
*/
  const fetchEventDetails = async () => {
    try {
      await GET({
        url: `event/${eventId}`,
        id: 'defaultTemplateEventDetails',
        errorCB: (context: any) => {
          Logger.error('TemplateView.tsx', context?.message);
        }
      });
    } catch (error) {
      Logger.error('TemplateView.tsx', error);

    }
  }

  return <Grid container size={{ xs: 12, sm: 12 }} className="event-template">
    {dataInfo?.data && <><HeaderSection temp={temp} data={dataInfo?.data} />
      <AboutSection temp={temp} data={dataInfo?.data} />
      <EventContributorsSection temp={temp} data={dataInfo?.data?.eventProgramSchedules} />
      <ProgramSection temp={temp} data={dataInfo?.data} />
      <FooterSection temp={temp} data={dataInfo?.data} /></>}
  </Grid>
});

export default TemplateView;
