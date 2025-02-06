import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
// import SepekerCard from "./SpeakerCard";
import VolunteerListCard from "./VolunteerListCard";
//import AddIcon from '@mui/icons-material/Add';
//import RemoveIcon from '@mui/icons-material/Remove';
import AbstractReviewer from "./AbstactReviewerListCard";
import React from "react";
import useStore from "@/Libs/store";
import SponsorListCard from "./SponsorListCard";
import { AccordionAddIcon, AccordionArrowIcon } from "@/assets/svg";

/**
 * TeamAndRole Component
 * 
 * Renders a series of Material-UI Accordions to display event roles such as Event Contributor, 
 * Abstracts Reviewer, and Event Volunteer. It conditionally renders sections based on the provided 
 * `eventData` prop, including dynamic expand/collapse icons.
 * 
 * Props:
 * - data (any): Contains event details, including `eventData.id` and `eventData.specialtyId`.
 */

const TeamAndRole=()=>{
  // const speakerData = useStore((state: any) => state?.compData?.["speaker-lists"]?.data) ?? []; 
  const abstractReviewerData= useStore((state:any)=>state?.compData?.['AbstractReviewer-list']?.data) ?? [];
  const volunteerListsDta=useStore((state:any)=>state?.compData?.['volunteer-lists']?.data) ?? [];
  const sponsorListData=useStore((state:any) => state?.compData?.['sponsor-lists']?.data) ?? [];
  const TeamAndRoleData =useStore((state:any)=> state?.compData?.['TeamAndRoleData']?.data) ?? [];

  const [expanded, setExpanded] = React.useState<string | false>(abstractReviewerData?.length!== 0 && "panel2-header"); 
  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
  setExpanded(isExpanded ? panel : false);
  };

    return(
     <Grid className="accordion-container" container spacing={3}>
      {/* <Grid size={12}>
        <Accordion   className="accordion-container-box"
        expanded={expanded === "panel1-header"} 
        onChange={handleChange("panel1-header")}>
        <AccordionSummary
          expandIcon={speakerData?.length!==0?<AccordionArrowIcon />:<AccordionAddIcon/>}
          aria-controls="panel1-content"
          id="panel1-header"
          className="accordion-container-icon" 
        >
          <Typography className="accordion-container-heading">Speaker</Typography>
        </AccordionSummary>
        {TeamAndRoleData?.id&&
        <AccordionDetails>
          <SepekerCard  eventData={TeamAndRoleData} />
        </AccordionDetails>
         }
      </Accordion>
      </Grid> */}
      {TeamAndRoleData?.isAbstract===1&&
      <Grid size={12}>
      <Accordion className="accordion-container-box"
        expanded={expanded === "panel2-header"} 
        onChange={handleChange("panel2-header")}>
        <AccordionSummary
       expandIcon={abstractReviewerData?.length!==0 || expanded === "panel2-header"?<AccordionArrowIcon/>:<AccordionAddIcon/>}
          aria-controls="panel2-content"
          id="panel2-header"
           className="accordion-container-icon"
        >
          <Typography className="accordion-container-heading">Abstracts Reviewer</Typography>
        </AccordionSummary>
      
        <AccordionDetails>
          <AbstractReviewer drawerOpen={abstractReviewerData?.length == 0  ? true : false} expanded={expanded }/> 
        </AccordionDetails>
      </Accordion>
      </Grid>
       } 
      <Grid size={12}>
      <Accordion  className="accordion-container-box"
        expanded={expanded === "panel3-header"} 
        onChange={handleChange("panel3-header")}>
        <AccordionSummary
          expandIcon={volunteerListsDta?.length || expanded === "panel3-header" ?<AccordionArrowIcon/>:<AccordionAddIcon/>}
          
          aria-controls="panel3-content"
          id="panel3-header"
          className="accordion-container-icon"
        >
          <Typography className="accordion-container-heading">Volunteer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <VolunteerListCard eventData={TeamAndRoleData}/>
        </AccordionDetails>
      </Accordion>
      </Grid>
      <Grid size={12}>
      <Accordion  className="accordion-container-box"
        expanded={expanded === "panel4-header"} 
        onChange={handleChange("panel4-header")}>
        <AccordionSummary
          expandIcon={sponsorListData?.length?<AccordionArrowIcon/>:<AccordionAddIcon/>}
          aria-controls="panel2-content"
          id="panel2-header"
          className="accordion-container-icon"
        >
          <Typography className="accordion-container-heading">Sponsor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SponsorListCard />
        </AccordionDetails>
      </Accordion>
      </Grid>
      </Grid>   
    ) 
}
export default TeamAndRole