import React from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';


interface AppBarProps {
  value: string;
}

const statusValues: any = [
  { id: "0", textColor: '#D6983A', cellColor: '#FFECDF' },
  { id: "5", textColor: '#0CAF60', cellColor: '#E7F7EF' },
  { id: ["2", "3"],  textColor: '#D32C2C', cellColor: '#FFE8EC'},
  { id: "4", textColor: '#2C3CD3', cellColor: '#E8EBFF' },
  { id: "1", textColor: '#0CAF60', cellColor: '#E7F7EF' },
];

const getStatusValue = (id: string) => {
  switch (id) {
    case "1":
      return "Active";
    case "2":
      return "Inactive";
    case "3":
      return "Pending";
    case "4":
      return "Complete";
    default:
      return "Pending";
  }
};

const findStatusById = (id: string) => {
  return statusValues.find((status: any) => status.id.indexOf(id) !== -1);
};


/**
 * Component used to render status
 * @param param
 * @returns 
 */
const StatusComponent: React.FC<AppBarProps> = ({ value }) => {
  const status = findStatusById(value);
  return (
    <Grid className="data-grid-status">
      <Typography sx={{alignItems:"center", backgroundColor: status?.cellColor, color: status?.textColor, fontFamily: 'inherit', fontWeight: 600, fontSize: 15,textAlign:"center",borderRadius:2, }}>{getStatusValue(value)}</Typography>
    </Grid>
  );
};

export default StatusComponent;