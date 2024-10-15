import CustomButton from "@/components/CustomButton/CustomButton";
import { DataGridList } from "@/components/DataGrid/DataGridList"
import routes from "@/router/routes";
import { Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useForm } from "react-hook-form";
import CustomSearchTextField from "@/components/CustomSearchTextField/CustomeSearchTextField";
/**
 * Method used to render coupon list
 * @returns 
 */
const Coupon = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm();
  const [source, setSource] = useState({});
  useEffect(() => {
    couponList();
  }, [])
  // const [filterValue, setFilterValue] = useState(''); 
  /**
  *  Fetch summary balance when the component mounts
  */
  const couponList = useCallback(() => {

    const req = {
      offset: 0,
      limit: 5,
      // head:filterValue
    };

    setSource({
      method: 'POST',
      data: req,
      url: `coupon/list`,
      listName: 'couponList'
    })
    return;
  }, []);

  const columns = [
    { type: 'default', field: 'id', headerName: "ID", width: 150 },
    { type: 'default', field: 'name', headerName: "Coupon Name", width: 250 },
    { type: 'default', field: 'discountType', headerName: "Type", width: 200 },
    { type: 'default', field: 'endDate', headerName: "Expiry Date", width: 250 },
    // { type: 'default', field: 'agent_name', headerName: "Host/Organizer", width: 300 },
    { type: 'dots', field: 'statusId', headerName: "", width: 250 }
  ]


  return (
    <Grid container className="custom-list">
      <Grid size={{ xs: 4 }} >
        <Typography className='custom-list-list-title' gutterBottom>
          Coupon
        </Typography>
      </Grid>

      {/* Buttons for 'Create New Coupon' and 'Filters' */}
      <Grid container size={{ xs: 8 }}  spacing={2} justifyContent='flex-end'  >
        <Grid container>
          <CustomSearchTextField
            name="search"
            control={control}
            placeholder="Search by Id or Name"
            rules={{}}
            style={{ margin: '0px 0' }}
            className="custom-search-text-field"
          />
        </Grid>
        <Grid container spacing={2}>
          <CustomButton
            className="custom-list-next-btn"
            label='Create New Coupon'
            variant='contained'
            size='large'
            type='submit'
            startIcon={<AddIcon />}
            onClick={() => {
              navigate(routes.createCoupon());
            }}
          // disabled={loading}
          />
          <CustomButton
            className="custom-list-filter-btn"
            // onClick={}
            label="Filters"
            startIcon={<TuneRoundedIcon />}
            variant="contained"
            color="primary"
            size="large"
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }} >
        <DataGridList source={source} title="Coupon" hideFooterPagination={false} columns={columns} id="coupon-datagrid" />
      </Grid>
    </Grid>
  )
}

export default Coupon