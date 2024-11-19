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

type DefaultTemplateProps = {
  temp: string;
}

const DefaultTemplate: React.FC<DefaultTemplateProps> = React.memo(({ temp }) => {

  const GET = useStore((state: any) => state.GET);
  const POST = useStore((state: any) => state.POST);
  const dataInfo = useStore((state: any) => state?.compData?.['defaultTemplateEventDetails']?.['event/49']) ?? [];
  const conributorInfo = useStore((state: any) => state?.compData?.['defaultTemplateEventContributors']?.['eventProgram/list']) ?? [];
  const clearDataById = useStore((state: any) => state?.clearDataById)

  /**
  * Useeffect hook handles the api call for fetching event details
  */
  useEffect(() => {
    fetchEventDetails();
    fetchEventContributorsData();
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
        url: `event/49`,
        id: 'defaultTemplateEventDetails',
        errorCB: (context: any) => {
          Logger.error('DefaultTemplate.tsx', context?.message);
        }
      });
    } catch (error) {
      Logger.error('DefaultTemplate.tsx', error);

    }
  }

  const fetchEventContributorsData = async () => {
    try {
      await POST({
        url: `eventProgram/list`,
        id: 'defaultTemplateEventContributors',
        body: {
          filters: {
            eventId: 49
          }
        },
        errorCB: (context: any) => {
          Logger.error('DefaultTemplate.tsx', context?.message);
        }
      });
    } catch (error) {
      Logger.error('DefaultTemplate.tsx', error);

    }
  }


  return <Grid container size={{ xs: 12, sm: 12 }} className="event-template">
    {dataInfo?.data && <><HeaderSection temp={temp} data={dataInfo?.data} />
      <AboutSection temp={temp} data={dataInfo?.data} />
      <EventContributorsSection temp={temp} data={conributorInfo?.data} />
      <ProgramSection temp={temp} data={dataInfo?.data} /></>}
    <FooterSection temp={temp} data={dataInfo?.data} />
  </Grid>
});

export default DefaultTemplate;
