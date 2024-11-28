import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
  } from "@mui/material";
  import { MinusIcon, PlusIcon } from "@/assets/svg";
  import { useState } from "react";
  
  type FaqProps = {
    data: DataProps
  }
  
  type DataProps = {
    title: string,
    description: string
  }
  /**
   *Component used to draw Accordion
   */
  const CustomAccordion: React.FC<FaqProps> = ({ data }) => {
    const { title, description } = data;
  
    const [expanded, setExpanded] = useState(false);
  
    /**
     * Method used to set expand logic
     * @param isExpanded 
     */
    const handleChange = (isExpanded: boolean) => {
      setExpanded(isExpanded);
    };

    return (
      <Accordion
        expanded={expanded}
        onChange={(e, isExpanded) => handleChange(isExpanded)}
        disableGutters
        className="accordion">
        <AccordionSummary
          className="accordion-summary"
          expandIcon={!expanded ? <PlusIcon /> : <MinusIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography> {description}</Typography>
        </AccordionDetails>
      </Accordion>
    );
  };
  
  export default CustomAccordion;
  