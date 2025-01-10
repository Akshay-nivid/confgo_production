/**
 * Component handles the default template
 */
import Grid from '@mui/material/Grid2';
import React, { useEffect, useRef } from 'react';
import AboutSection from './AboutSection';
import ProgramSection from './ProgramSection';
import HeaderSection from './HeaderSection';
import EventContributorsSection from './EventContributorsSection';
import useStore, { setDataById } from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import FooterSection from './FooterSection';
import TicketingSection from './TicketingSection';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import LocationSection from './LocationSection';
import RegisterBannerSection from './RegisterBannerSection';

type TemplateViewProps = {
  temp: number | undefined;
  eventId: string | undefined;
  slug: string | undefined;
}

/**
 * TemplateView component handles the default template
 */
const TemplateView: React.FC<TemplateViewProps> = React.memo(({ temp, eventId, slug }) => {

  const GET = useStore((state: any) => state.GET);
  const dataInfo = useStore((state: any) => state?.compData?.['templateEventDetails']?.[`event/${eventId}`]) ?? [];
  const slugInfo = useStore((state: any) => state?.compData?.['slugEventDetails']?.[`event/slug/${slug}`]) ?? [];
  const clearDataById = useStore((state: any) => state?.clearDataById);
  const aboutRef = useRef(null);
  const contributorsRef = useRef(null);
  const programRef = useRef(null);
  const tierRef = useRef(null);
  const LocationRef = useRef(null);
const navigate = useNavigate();
  /**
   * Method handles the scroll functionality based on click event
   * @param ref : event reference
   */
  const handleScrollTo = (ref: any) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
  * Useeffect hook handles the api call for fetching event details
  */
  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
    else if (slug) {
      fetchEventDetailsFromSlug()
    }

  }, [])

  useEffect(() => () => {
    clearDataById('templateEventDetails');
    clearDataById('defaultProgramData')
  }, [])

  /**
* Method fetch the event details
*/
  const fetchEventDetails = async () => {
    try {
      await GET({
        url: `event/${eventId}`,
        id: 'templateEventDetails',
        errorCB: (context: any) => {
          Logger.error('TemplateView.tsx', context?.message);
        }
      });
    } catch (error) {
      Logger.error('TemplateView.tsx', error);

    }
  }

  /**
* Method fetch the event details from slug
*/
  const fetchEventDetailsFromSlug =  () => {
    try {
       GET({
        url: `event/slug/${slug}`,
        id: 'slugEventDetails',
        successCB: (context: any) => {
          setDataById('eventSelected', { id: context?.data?.id });
          setDataById('slugName', { value: slug });
          setDataById('templateId', { id: context?.data?.templateId });
          
        },
        errorCB: (context: any) => {
          Logger.error('TemplateView.tsx', context?.message);
          navigate(routes.userLogin());
        }
      });
    } catch (error) {
      Logger.error('TemplateView.tsx', error);

    }
  }
  const updatedTemp = slug ? slugInfo?.data?.templateId ? slugInfo.data.templateId : temp : temp;
  return <Grid container size={{ xs: 12, sm: 12 }} className="event-template">
    {(dataInfo?.data || slugInfo?.data) && <><HeaderSection onScrollToTier={()=>handleScrollTo(tierRef)} temp={updatedTemp} data={dataInfo?.data || slugInfo?.data} onScrollToProgram={() => handleScrollTo(programRef)} onScrollToAbout={() => handleScrollTo(aboutRef)} onScrollToContributors={() => handleScrollTo(contributorsRef)} onScrollToLocation={() => handleScrollTo(LocationRef)}/>
      <AboutSection temp={updatedTemp} data={dataInfo?.data || slugInfo?.data} ref={aboutRef}/>
      {(dataInfo?.data?.eventProgramSchedules?.length > 0 || slugInfo?.data?.eventProgramSchedules?.length > 0) && <EventContributorsSection temp={updatedTemp} data={dataInfo?.data?.eventProgramSchedules || slugInfo?.data?.eventProgramSchedules} ref={contributorsRef}/>}
      <ProgramSection temp={updatedTemp} data={dataInfo?.data || slugInfo?.data} ref={programRef}/>
      {
        (dataInfo?.data?.venue || slugInfo?.data?.venue) ? (
          <LocationSection
            temp={updatedTemp}
            data={dataInfo?.data || slugInfo?.data}
            onScrollToTier={LocationRef}
          />
        ) : (
          <RegisterBannerSection
            temp={updatedTemp}
            data={dataInfo?.data || slugInfo?.data}
            onScrollToTier={()=>handleScrollTo(tierRef)}
            />
        )
      }
      {(dataInfo?.data?.eventPriceTiers?.length > 0 || slugInfo?.data?.eventPriceTiers?.length > 0) && <TicketingSection ref={tierRef} temp={updatedTemp} data={dataInfo?.data || slugInfo?.data} />}
      {(dataInfo?.data?.venue || slugInfo?.data?.venue) &&
        <RegisterBannerSection
          temp={updatedTemp}
          data={dataInfo?.data || slugInfo?.data}
          onScrollToTier={()=>handleScrollTo(tierRef)}
        />
      }
      <FooterSection temp={updatedTemp} data={dataInfo?.data || slugInfo?.data} /></>}
  </Grid>
});

export default TemplateView;
