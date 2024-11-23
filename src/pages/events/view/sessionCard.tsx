import React from "react";
import { Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@/assets/svg/event-edit.svg";
import AddIcon from "../../../assets/svg/event-addon-icon.svg"; // Importing the icon to display next to the start time
import Grid from "@mui/material/Grid2";
import { getTimeFromTimestamp } from "@/Utils/CommonBaseClass";

interface FieldConfig {
  label: string;
  field: string;
  format?: (value: any) => string;
}
interface SessionCardProps {
  item: any;
  onEditClick?: (item: any) => void;
  titleField: string;
  fields: FieldConfig[];
  startTimeField: string;
  endTimeField: string;
  hasAddOns?: boolean;
  optionsData?:[];
}

interface addOnOptions{
  label:string;
  value:number|string
}

/**
 * Component for listing data in a card format, dynamically rendering fields based on item type
 */
const SessionCard: React.FC<SessionCardProps> = ({
  item,
  onEditClick,
  titleField,
  fields,
  startTimeField,
  endTimeField,
  hasAddOns = false,
 optionsData,
}) => {
  /**
  * render the selected addon property label from it's value using useMemo
  */
  const selectedLabel = React.useMemo(() => {
    const option:any = optionsData?.find((option:addOnOptions) => option?.value === item?.addonId);
    return option ? option?.label : 'Unknown';
  }, [item?.addonId, optionsData]); 
  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
        md: 4,
      }}
      className="event-sessions-session-card"
    >
      <div className="event-sessions-session-card-header">
        <div className="event-sessions-session-card-time">
          {/* Conditionally render the Add icon next to the start time */}

          <Typography variant="subtitle2">
            <Box display="flex" alignItems="center" gap={1}>
              {hasAddOns && (
                <AddIcon fontSize="small"  />
              )}
              {item[startTimeField]&&item[endTimeField]?<><span>{getTimeFromTimestamp(item[startTimeField])}</span>
              <span>{getTimeFromTimestamp(item[endTimeField])}</span></>:<span>General Addon</span>}
            </Box>
          </Typography>
        </div>
        {onEditClick && (
        <IconButton
          size="small"
          className="event-detail-event-info-card-edit-btn"
          onClick={() => onEditClick(item)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
          )}
      </div>

      <div className="session-details">
        {/* Render title */}
        <Typography variant="h6" className="event-detail-sessions-card-header">
          {item[titleField] || selectedLabel||""}
        </Typography>
        {/* Dynamically render fields based on configuration */}
        {fields.map(
          (field, index) =>
            item[field.field] && (
              <Typography
                key={index}
                className="event-sessions-session-card-speaker"
              >
                {field.label}:{" "}
                {field.format
                  ? field.format(item[field.field])
                  : item[field.field]}
              </Typography>
            )
        )}
      </div>
    </Grid>
  );
};

export default SessionCard;
