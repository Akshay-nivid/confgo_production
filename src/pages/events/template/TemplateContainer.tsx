/**
 * TemplateContainer component handles the template creation
 */
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Template1 from './Template1';
import useStore, { setDataById } from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import routes from '@/router/routes';
import Template3 from './Template3';
import Template2 from './Template2';

type TemplateContainerProps = {
    id?: number;
}

const templates: any = {
  1: Template1,
  2: Template2,
  3: Template3,
};

/**
 * Component handles the template creation
 */
const TemplateContainer: React.FC<TemplateContainerProps> = React.memo(({ }) => {

    const { id, entityId, slug } = useParams();

    const temp = typeof id === 'number' ? id : Number(id) || 1;
    const GET = useStore((state: any) => state.GET);
    const dataInfo = useStore((state: any) => state?.compData?.['templateEventDetails']?.[`event/${entityId}`]) ?? [];
    const slugInfo = useStore((state: any) => state?.compData?.['slugEventDetails']?.[`event/slug/${slug}`]) ?? [];
    const clearDataById = useStore((state: any) => state?.clearDataById);
    const navigate = useNavigate();

    /**
  * Useeffect hook handles the api call for fetching event details
  */
  useEffect(() => {
    if (entityId) {
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
        url: `event/${entityId}`,
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

  /**
   * Method returns the template id
   * @param eventData : event details
   * @param slugData : slug details
   * @returns : template id
   */
  const findTemp = ( temp: any, slugData: any) => {
    return slugData?.templateId || temp;
  }

  const SelectedTemplate = templates[findTemp(temp, slugInfo?.data)];



    return <Grid container size={{ xs: 12, sm: 12 }} className={`event-template${!slug ? " event-template-preview" : ""}`} spacing={1}>
        {(dataInfo?.data || slugInfo?.data) && <Grid container size={{ xs: 12, sm: 12 }} spacing={1}>
        <Grid container size={{ xs: 12, sm: 12 }} className="event-template">
            {SelectedTemplate ? <SelectedTemplate data={dataInfo?.data || slugInfo?.data} /> : null}
            </Grid>
        </Grid>}
    </Grid>
});

export default TemplateContainer;