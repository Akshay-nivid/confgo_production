import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SepekerCard from "./SpeakerCard";
import VolunteerListCard from "./VolunteerListCard";
import { AccordionAddIcon, AccordionArrowIcon } from "@/assets/svg";
import AbstractReviewer from "./AbstactReviewerListCard";
import React from "react";
import useStore from "@/Libs/store";

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
  const speakerData = useStore((state: any) => state?.compData?.["speaker-lists"]?.data) ?? []; 
  const abstractReviewerData= useStore((state:any)=>state?.compData?.['AbstractReviewer-list']?.data) ?? [];
  const volunteerListsDta=useStore((state:any)=>state?.compData?.['volunteer-lists']?.data) ?? [];
  const TeamAndRoleData =useStore((state:any)=> state?.compData?.['TeamAndRoleData']?.data) ?? [];

  const [expanded, setExpanded] = React.useState<string | false>("panel1-header"); 
  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
  setExpanded(isExpanded ? panel : false);
  };

    return(
     <Grid className="accordion-container" container spacing={3}>
      <Grid size={12}>
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
      </Grid>
      {TeamAndRoleData?.isAbstract===1&&
      <Grid size={12}>
      <Accordion className="accordion-container-box"
        expanded={expanded === "panel2-header"} 
        onChange={handleChange("panel2-header")}>
        <AccordionSummary
       expandIcon={abstractReviewerData.length!==0 ?<AccordionArrowIcon/>:<AccordionAddIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
           className="accordion-container-icon"
        >
          <Typography className="accordion-container-heading">Abstracts Reviewer</Typography>
        </AccordionSummary>
      
        <AccordionDetails>
          <AbstractReviewer /> 
        </AccordionDetails>
      </Accordion>
      </Grid>
       } 
      <Grid size={12}>
      <Accordion  className="accordion-container-box"
        expanded={expanded === "panel3-header"} 
        onChange={handleChange("panel3-header")}>
        <AccordionSummary
          expandIcon={volunteerListsDta.length?<AccordionArrowIcon/>:<AccordionAddIcon/>}
          aria-controls="panel2-content"
          id="panel2-header"
          className="accordion-container-icon"
        >
          <Typography className="accordion-container-heading">Volunteer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <VolunteerListCard />
        </AccordionDetails>
      </Accordion>
      </Grid>
      </Grid>   
    ) 
}
export default TeamAndRole