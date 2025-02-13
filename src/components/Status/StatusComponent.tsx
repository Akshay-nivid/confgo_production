import React from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';


interface AppBarProps {
  value: string | undefined ;
  className?:string;
}

/**
 * Component used to render status
 * @param param
 * @returns 
 */
const StatusComponent: React.FC<AppBarProps> = ({ value ,className}) => {
  const statusValues: any = [
    { id: "0", textColor: '#D6983A', cellColor: '#FFECDF' },
    { id: "1", textColor: '#0CAF60', cellColor: '#E7F7EF' },
    { id: "5", textColor: '#232323', cellColor: '#B6B6B6' },
    { id: "3", textColor: '#D32C2C', cellColor: '#FFE8EC' },
    { id: "2", textColor: '#D32C2C', cellColor: '#FFE8EC' },
    { id: "6", textColor: '#F39200', cellColor: '#FFECDF' },
    { id: "4", textColor: '#2C3CD3', cellColor: '#E8EBFF' },
    { id: "7", textColor: '#2C3CD3', cellColor: '#E8EBFF' },
    { id: "8", textColor: '#0CAF60', cellColor: '#E7F7EF' },
    { id: "9", textColor: '#0CAF60', cellColor: '#E7F7EF' },
    { id: "10", textColor: '#D32C2C', cellColor: '#FFE8EC' },
    { id: "11", textColor: '#D32C2C', cellColor: '#FFE8EC' },
    { id: "12", textColor: '#D6983A', cellColor: '#FFECDF' }, 
    { id: "13", textColor: '#2C3CD3', cellColor: '#E8EBFF' },
    { id: "14", textColor: '#0CAF60', cellColor: '#E7F7EF' },
  ];

/**
 * Retrieves the status value based on a given ID.
 * 
 * @param id - A string representing the status ID.
 * @returns A string representing the corresponding status value:
 * - "1" returns "Active"
 * - "2" returns "Inactive"
 * - "3" returns "Pending"
 * - "4" returns "Complete" 
   * */ 
  const getStatusValue = (id: string) => {
    switch (id.toString()) {
      case "1":
        return "Active";
      case "2":
        return "Inactive";
      case "3":
        return "Pending";
      case "4":
        return "Completed";
      case "5":
        return "Draft";
      case "6":
        return "Published";
      case "7":
        return "Not Attended";
      case "8":
            return "Attended";  
      case "9":
        return "Approved";  
        case "10":
          return "Rejected"; 
        case "11":
            return "Expired";  
            case "12":
              return "Paid";    
        case "13":
            return "Assigned"; 
        case "14":
              return "Upcoming";    
      default:
        return "Pending";
    }
  };
  /**
   * @param id  * Finds a status object from the `statusValues` array by matching a given ID.
   * @returns The first status object from `statusValues` where the `id` contains the specified ID.
   *           Returns `undefined` if no matching status is found.
    */
  const findStatusById = (id: string) => {
    return statusValues.find((status: any) => status.id.indexOf(id) !== -1);
  };
  const status = findStatusById(value ?? '');
  return (
    <Grid className={className}>
      <Typography className="statusText" sx={{ backgroundColor: status?.cellColor, color: status?.textColor}}>{getStatusValue(value ?? '')}</Typography>
    </Grid>
  );
};

export default StatusComponent;



