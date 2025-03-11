/**
 * Component handles the template selection
 */
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Template6 from '../../../assets/png/template6-preview.png';
import Template7 from '../../../assets/png/template7-preview.png';
import Template4 from '../../../assets/png/template1-preview.png'
import Template2 from '../../../assets/png/template2-preview.png'
import Template3 from '../../../assets/png/template3-preview.png'
import Template1 from '../../../assets/png/template4-preview.png'
import CustomButton from "@/components/CustomButton/CustomButton";
import CheckCircleIcon from '../../../assets/svg/template-select.svg'
import { useEffect} from "react";
import useStore, { PUT } from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
// import TemplateCustomizeCard from "./TemplateCustomizeCard";



const TemplateCard = (data: any) => {

  const POST = useStore((state: any) => state.POST);
  // const PUT = useStore((state: any) => state.PUT);
  const templateInfo = useStore((state: any) => state?.compData?.['templateList']?.[`template/list`]?.data) ?? [];
  const templates = [Template1, Template7, Template6,Template2, Template3, Template4];
  // const [customizeConfig, setCustomizeConfig] = useState<any>({});
  const backgroundColor=['#3B5B5A','#D4E1FF','#4E4E4E'];



  /**
   * Method transforms the template list data
   * @param tempData : template list data
   * @returns 
   */
  const createTemplateData = (tempData: any) => {
    return tempData?.map((item: any, index: number) => ({
      id: item.id,
      name: item.name,
      image: templates[index] || null,
      selected: item.id === data?.eventData?.templateId,
      backgroundColor:backgroundColor[index]||null
    }));
  }

  /**
   * Method handles the template preview functionality
   * @param temp : template id
   */
  const handlePreview = (temp: any) => {
    // setCustomizeConfig({
    //   id: temp?.id,
    //   entityId: data?.eventData?.id,
    //   editMode: true,
    //   colorId: data?.eventData?.color?.id
    // });
    const url = `/event/detail/${data?.eventData?.id}/template/${temp?.id}/preview`;
    window.open(url, '_blank');
  }

  const handleItem = (_tempItem: any) => {
    const url = `/event/${data?.eventData?.slugName}`;
    window.open(url, '_blank');
  }

  /**
   * Useeffect hook handles the api call for fetching template list
   */
  useEffect(() => {
    fetchTemplateList();
  }, [])


  /**
* Method fetch the event details
*/
  const fetchTemplateList = async () => {
    try {
      await POST({
        url: `template/list`,
        id: 'templateList',
        body: { enabled: 1, limit: 5 },
        errorCB: (context: any) => {
          Logger.error('TemplateView.tsx', context?.message);
        }
      });
    } catch (error) {
      Logger.error('TemplateView.tsx', error);

    }
  }

  /**
   * Method handles the template selection updation
   * @param item : template id
   */
  const handleApply = async (item: any) => {
    try {
      await PUT({
        url: `event/template/${data?.eventData?.id}`,
        id: 'templateUpdate',
        body: { templateId: item.id },
        successCB: (context: any) => {
          if (context?.success) {
            data?.onSubmitHandler && data?.onSubmitHandler();

          }
        },
        errorCB: (context: any) => {
          Logger.error('TemplateView.tsx', context?.message);
        }
      });
    } catch (error) {
      Logger.error('TemplateView.tsx', error);

    }
  }

  // const handleCustomizeCancel = () => {
  //   setCustomizeConfig({});
  // }


  return (
    <Grid className="event-detail-template-card" container spacing={2}>
       <Grid container size={{ xs: 12, md: 12 }}>
        <Typography className="event-detail-template-card-header" >
          Templates
        </Typography>
      </Grid>
      <Grid container className="event-detail-template-card-selection" spacing={2}>
        {templateInfo && createTemplateData(templateInfo)?.map((item: any) => (
          <Grid className={item.selected ? `event-detail-template-card-selection-container event-detail-template-card-selection-container-selected` : `event-detail-template-card-selection-container`}>
            <Grid container className="event-detail-template-card-selection-container-icon-container" justifyContent={'flex-end'}>{item.selected && <CheckCircleIcon />}</Grid>
            <Grid container className="event-detail-template-card-selection-container-overlay" spacing={2} direction={'column'}>
              {!item.selected && <CustomButton onClick={() => handleApply(item)} label="Apply Theme" className="event-detail-template-card-selection-container-overlay-apply-button" />}
              <CustomButton onClick={() => handlePreview(item)} label="Preview Theme" className="event-detail-template-card-selection-container-overlay-preview-button" />
            </Grid>
            <Grid className="event-detail-template-card-selection-preview-container" onClick={() => handleItem(item)}>
              <img id={item.id.toString()} src={item.image} alt={item.name} />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default TemplateCard;
