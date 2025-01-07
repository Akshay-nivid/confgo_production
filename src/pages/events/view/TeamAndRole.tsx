import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SepekerCard from "./SpeakerCard";
import VolunteerListCard from "./VolunteerListCard";
import { AccordionAddIcon, AccordionArrowIcon } from "@/assets/svg";
import AbstractReviewer from "./AbstactReviewerListCard";
const TeamAndRole=(data:any)=>{
    return(
     <Grid className="accordion-container" container spacing={3}>
      <Grid size={12}>
        <Accordion  className="accordion-container-box">
        <AccordionSummary
          expandIcon={data?.eventData?.id?<AccordionArrowIcon />:<AccordionAddIcon/>}
          aria-controls="panel1-content"
          id="panel1-header"
          className="accordion-container-icon" 
        >
          <Typography className="accordion-container-heading">Event Contributor</Typography>
        </AccordionSummary>
        {data?.eventData?.id&&
        <AccordionDetails>
          <SepekerCard eventData={data}/>
        </AccordionDetails>}
      </Accordion>
      </Grid>
      {data?.eventData?.specialtyId===1&&
      <Grid size={12}>
      <Accordion className="accordion-container-box">
        <AccordionSummary
         expandIcon={data?.eventData?.id?<AccordionArrowIcon />:<AccordionAddIcon/>}
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
      </Grid>}
      <Grid size={12}>
      <Accordion  className="accordion-container-box">
        <AccordionSummary
          expandIcon={data?.eventData?.id?<AccordionArrowIcon />:<AccordionAddIcon/>}
          aria-controls="panel2-content"
          id="panel2-header"
          className="accordion-container-icon"
        >
          <Typography className="accordion-container-heading">Event Volunteer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <VolunteerListCard/>
        </AccordionDetails>
      </Accordion>
      </Grid>
      </Grid>   
    ) 
}
export default TeamAndRole