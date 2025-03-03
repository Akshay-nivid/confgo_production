import { DataGridList } from "@/components/DataGrid/DataGridList";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import {IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { ISource } from "@/Libs/types/type";
import { Filter } from "@/components/Filter";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CreateCoupon from "./CreateCoupon";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@/assets/svg/DeleteIcon.svg";
import { PUT, setDataById } from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import {CouponNoData} from "@/assets/svg";

interface FilterType {
  id?: number;
  name?: string;
  // Add other filter fields here if needed
}

/**
 * Used to render coupon list
 * @author Neethu
 */
const Coupon = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState<FilterType>({});
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false); // To indicate loading state for API
  const [dataLength, setDataLength] = useState(0);
  const { control } = useForm();
  const [selectedCoupon, setSelectedCoupon] = useState({});
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentCouponId, setCurrentCouponId] = useState<number | null>(null);
  const [rowData, setRowData] = useState<number | null>(null);
  
  /**
   * Useeffect hook handles the api call
   */
  useEffect(() => {
    if (!filters.id) {
      couponList();
    }
  }, []);



  // const [filterValue, setFilterValue] = useState('');
  /**
   *  Fetch summary balance when the component mounts
   */
  const couponList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      filters: filters,
    };

    setSource({
      method: "POST",
      data: req,
      url: `coupon/list`,
      listName: "couponList",
    });
    return;
  }, []);

  const columns = [
    { type: "default", field: "id", headerName: "ID", width: 120 },
    { type: "custom", field: "name", headerName: "Coupon Name", width: 250 },
    { type: "default", field: "discountType", headerName: "Type", width: 200 },
    {
      type: "dateField",
      field: "endDate",
      headerName: "Expiry Date",
      width: 150,
      dateFormat: "DD/MM/YYYY",
    },
    {
      type:"default", field:"code", headerName: "Coupon Code", width:150
    },
    { type: "custom", field: "actions", headerName: "", width: 150 }
  ];

  const DiscountTypeArray = [
    { label: "flat", value: "flat" },
    { label: "percentage", value: "percentage" },
  ];
  
  const filterFields: any = [
    {
      type: 'date',
      fieldName: 'startTime',
      label: 'Today',
      heading: 'Filter with Date'
    },
    {
      type: 'tiles',
      fieldName: 'discountType',
      label: 'Discount Type',
      heading: 'Filter with Discount Type',
      options: DiscountTypeArray
    },
  ]


  // Function to handle search API for autocomplete
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const req = {
        filters: {
          name: query,
        },
      };
      const response = await await apiClient.post(`coupon/list`, req);
      const { status, data } = processAPIResponse(response, "couponList");
      if (status) {
        setSearchResults(data);
      }
      // Update the options based on API response
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };
  // Function to handle search API for autocomplete
  // New handler for when a coupon is selected from autocomplete
  const handleAutocompleteChange = (selected: any) => {
    //setSelectedCoupon(selected); // Update selected coupon
    if (selected) {
      // Here you can filter the data grid based on the selected coupon
      setSource({
        method: "POST",
        data: {
          offset: 0,
          limit: 5,
          filters: {
            id: selected.id, // Assuming the selected coupon has an 'id'
          },
        },
        url: `coupon/list`,
        listName: "couponList",
      });
      setFilters({
        id: selected.id,
      });
    }
  };


  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    couponId: number,
    item: any
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentCouponId(couponId);
    setRowData(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentCouponId(null);
    setRowData(null);
  };

  /**
   * deletes a coupon by updating statusId
   * @param id 
   */
  const handleCouponDelete = async (id: number) => {
      try {
        await PUT({
          url: `coupon/${id}`,
          body: {
            statusId: 2
          },
          id: 'coupon-delete',
          successCB: (_data: any) => {
            setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: "Coupon Deleted Successfully" });
            couponList();
  
          },
          errorCB: (context: any) => {
            setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
          }
        });
      } catch (error) {
        Logger.error("Error in coupon delete", error)
      }
      handleMenuClose();
  
    }

   /**
   * Transforms the raw data from the API to match the required format for the DataGrid component.
   * @param data - The raw data from API response
   * @returns Transformed data for DataGrid
   */
  const transformData = (data: any) => {
    setDataLength(data?.length)
    if (!data) return [];
    return data.map((item: any) => ({
      id: item?.id,
      name: item?.name,
      discountType: item?.discountType,
      endDate: item?.endDate,
      code: item?.code,
      actions: (
        <IconButton onClick={(e) => handleMenuOpen(e, item.id, item)}>
          <MoreHorizIcon />
        </IconButton>
      )
    }));
  };
  
  /**
  * Opens the "Create Coupon Drawer" by updating the non-persisted state.
  * This function sets `craeteCouponDrawer` to `true`, triggering the drawer to open.
  */

  function handleCouponDrawer(params?:any) {
    setSelectedCoupon(params);
    setDrawerOpen(true);
    handleMenuClose();
  };

  /**
  * Fetches the list of coupons whenever a coupon is edited or a new coupon is created
  */
  function onSuccess() {
    couponList();
  };

  return (
    <Grid container className="custom-list">
      <Grid size={{ xs: 4 }}>
        <Typography className="custom-list-list-title" gutterBottom>
          Coupon
        </Typography>
      </Grid>

      {/* Buttons for 'Create New Coupon' and 'Filters' */}
      <Grid container size={{ xs: 8 }} spacing={2} justifyContent="flex-end">
        <Grid container>
          { dataLength > 0 &&
          <CustomAutocomplete
          name="search"
          className="custom-search-text-field textfield-border"
          control={control}
          placeholder="Search Coupon Name"
          options={searchResults} // Dynamic options based on API results
          getOptionLabel={(option: any) => option.name || ""} // Adjust based on your data structure
          onSearch={handleSearch} // Call the search function
          loading={loading}
          onChange={handleAutocompleteChange}
        />}
          
        </Grid>
        <Grid container spacing={2}>
          <CustomButton
            className="create-coupon-create-btn"
            label="Create New Coupon"
            variant="contained"
            size="large"
            type="submit"
            startIcon={<AddIcon />}

            onClick={
              handleCouponDrawer
              }
           
          />
          <Filter datagridId='coupon-datagrid' fields={filterFields} />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }} className="shadow-app app-border-radius mt-8">
      <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
        >
          <MenuItem onClick={(_e) => handleCouponDrawer(rowData)}>
          <img src="/src/assets/png/writing.png" alt="Edit" className="action-icon" />
            <Typography className="action-text">Edit</Typography>
          </MenuItem>
          <MenuItem onClick={() => {
            if (currentCouponId !== null) {
              handleCouponDelete(currentCouponId);
            }
          }}>

            <DeleteIcon className="action-icon" />
            <Typography className="action-text">Delete</Typography>
          </MenuItem>
        </Menu>
        <DataGridList
          dataTransformer={transformData}
          source={source}
          // onRowClick={(params: any) => {
          //   handleCouponDrawer(params)
          // }}
          title="Coupon"
          hideFooterPagination={false}
          columns={columns}
          id="coupon-datagrid"
          noRecordIcon={
          <CouponNoData className="no-coupon-icon"/>
         }
          noRecordTitle="No Coupons Available"
          noRecordSubtitle="Offer discounts and special deals to attract more participants. Create coupons and manage promotions effortlessly."
          // redirectTo={() => routes.createCoupon()} // define the route
          // btnName="Create New Coupon" //define the label of btn
        />
      </Grid>

      {/* coupoun drawer */}

      <Grid container size={6}>

        <CustomDrawer open={drawerOpen} type={"right"}>
          <CreateCoupon data={selectedCoupon} onSuccess={onSuccess} closeDrawer={()=>{setDrawerOpen(false)}}/>
        </CustomDrawer>
      </Grid>


    </Grid>
  );
};

export default Coupon;
