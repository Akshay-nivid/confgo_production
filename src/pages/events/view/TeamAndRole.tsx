import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SepekerCard from "./SpeakerCard";
import VolunteerListCard from "./VolunteerListCard";
import { AccordionArrowIcon } from "@/assets/svg";
import AbstractReviewer from "./AbstactReviewerListCard";
const TeamAndRole=(data:any)=>{
    return(
     <Grid className="accordion-container" container spacing={3}>
      <Grid size={12}>
        <Accordion>
        <AccordionSummary
          expandIcon={<AccordionArrowIcon width={20} height={20}  />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography className="accordion-container-heading">Event Contributor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SepekerCard eventData={data}/>
        </AccordionDetails>
      </Accordion>
      </Grid>
      <Grid size={12}>
      <Accordion>
        <AccordionSummary
          expandIcon={<AccordionArrowIcon width={20} height={20} />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className="accordion-container-heading">Abstracts Reviewer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AbstractReviewer /> 
        </AccordionDetails>
      </Accordion>
      </Grid>
      <Grid size={12}>
      <Accordion>
        <AccordionSummary
          expandIcon={<AccordionArrowIcon width={20} height={20} />}
          aria-controls="panel2-content"
          id="panel2-header"
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