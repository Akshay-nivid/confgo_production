import React, { useState } from "react";
import { Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@/assets/svg/event-edit.svg";
import AddIcon from "../../../assets/svg/event-addon-icon.svg"; // Importing the icon to display next to the start time
import Grid from "@mui/material/Grid2";
import { DeleteContributorIcon, WarningIcon} from "@/assets/svg";
import CustomActionModal from "@/components/CustomActionModal/CustomActionModal";
import { getLocalTimeDate } from "@/Utils/CommonBaseClass";

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
  timeCorrection?: boolean;
  onDeleteClick?: (item: any) => void;
}

interface AddOnOptions{
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
  timeCorrection,
  onDeleteClick,
}) => {

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  /**
   * function to access nested properties in an object.
   * @param obj - Object to search.
   * @param path - Key path.
   * @returns Value at the specified key path.
   */
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };


  /**
  * render the selected addon property label from it's value using useMemo
  */
  const selectedLabel = React.useMemo(() => {
    const option: any = optionsData?.find((option: AddOnOptions) => option?.value === item?.addonId);
    return option ? option?.label : 'Unknown';
  }, [item?.addonId, optionsData]); 

  const title = getNestedValue(item, titleField) || selectedLabel || "";
  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
        md: 4,
      }}
      className="event-sessions-session-card"
    >
      <Grid size={{xs:12}} className="event-sessions-session-card-header">
        <Grid  className="event-sessions-session-card-time">
          {/* Conditionally render the Add icon next to the start time */}

          <Typography variant="subtitle2">
            <Box display="flex" alignItems="center" gap={1}>
              {hasAddOns && (
                <AddIcon fontSize="small"  />
              )}
              {item[startTimeField]&&item[endTimeField]?<><span>{timeCorrection ? getLocalTimeDate(item[startTimeField]) : item[startTimeField]}</span>
              <span>{timeCorrection ? getLocalTimeDate(item[endTimeField]) : item[endTimeField]}</span></>:<span>General Addon</span>}
            </Box>
          </Typography>
        </Grid>
        <Grid>
        {onEditClick && (
        <IconButton
          size="small"
          className="event-detail-event-info-card-edit-btn"
          onClick={() => onEditClick(item)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
          )}
          {onDeleteClick && (
            <IconButton
              size="small"
              className="event-detail-event-info-card-edit-btn"
              onClick={() => setDeleteModalOpen(true)}
            >
              <DeleteContributorIcon fontSize="small" />
            </IconButton>
          )}
        </Grid>
      </Grid>

      <Grid size={{xs:12}} className="session-details">
        {/* Render title */}
        <Typography variant="h6" className="event-detail-sessions-card-header">
          {title}
        </Typography>
        {/* Dynamically render fields based on configuration */}
        {!hasAddOns?fields.map(
          (field, index) =>
            (item[field.field] !== undefined && item[field.field] !== null && item[field.field]!="") && (
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
        )
        :<>
        <Grid container display="flex" justifyContent="flex-start">
              <Typography className="event-sessions-session-card-speaker">{item?.description}</Typography>
        </Grid>
      </>
      }
      </Grid>
      {/* Delete Confirmation Modal */}
       <CustomActionModal
        icon={<WarningIcon className="unpublish-modal-icon"/>}
        header="Delete Session"
        subHeader="Are you sure you want to delete this session? This action cannot be undone."
        cancelLabel="Cancel"
        submitLabel="Delete"
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        cancelAction={() => setDeleteModalOpen(false)}
        submitAction={() => {
          setDeleteModalOpen(false);
          onDeleteClick?.(item);
        }}
        />
    </Grid>
  );
};

export default SessionCard;
