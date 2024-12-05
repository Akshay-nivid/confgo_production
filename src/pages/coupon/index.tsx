import { DataGridList } from "@/components/DataGrid/DataGridList";
import routes from "@/router/routes";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import TuneRoundedIcon from "../../../src/assets/svg/filter.svg";
import FilterModal from "@/components/CustomFilter/FilterModal";
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Typography } from "@mui/material";
import { ISource } from "@/Libs/type";
import { NoCouponDataSvg } from "@/assets/svg";

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
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState<FilterType>({});
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false); // To indicate loading state for API

  const { control } = useForm();
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
    { type: "default", field: "id", headerName: "ID", width: 130 },
    { type: "default", field: "name", headerName: "Coupon Name", width: 200 },
    { type: "default", field: "discountType", headerName: "Type", width: 250 },
    {
      type: "dateField",
      field: "endDate",
      headerName: "Expiry Date",
      width: 200,
      dateFormat: "DD/MM/YYYY",
    },
    {
      type:"default", field:"code", headerName: "Coupon Code", width:200
    }
  ];
  /**
   * Apply filter
   * @param newFilters
   */
  const handleApplyFilters = (newFilters: any) => {
    // Update filters when modal is applied
    setSource({
      method: "POST",
      data: {
        offset: 0,
        limit: 5,
        filters: {
          ...newFilters,
        },
      },
      url: `coupon/list`,
      listName: "couponList",
    });
    setFilters(newFilters);
  };

  /**
   * Row click navigation
   */
  const handleRowClick = (id: number | string) => {
    navigate(routes.CouponView(id));
  };
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
          <CustomAutocomplete
            name="search"
            className="custom-search-text-field"
            control={control}
            placeholder="Search Coupon Name"
            options={searchResults} // Dynamic options based on API results
            getOptionLabel={(option: any) => option.name || ""} // Adjust based on your data structure
            onSearch={handleSearch} // Call the search function
            loading={loading}
            onChange={handleAutocompleteChange}
          />
        </Grid>
        <Grid container spacing={2}>
          <CustomButton
            className="create-coupon-create-btn"
            label="Create New Coupon"
            variant="contained"
            size="large"
            type="submit"
            startIcon={<AddIcon />}
            onClick={() => {
              navigate(routes.createCoupon());
            }}
            // disabled={loading}
          />
          <CustomButton
            className="create-coupon-filter-btn"
            onClick={() => setIsFilterModalOpen(true)}
            label="Filters"
            startIcon={<TuneRoundedIcon />}
            variant="contained"
            color="primary"
            size="large"
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <DataGridList
          source={source}
          onRowClick={(params: any) => handleRowClick(params.id)}
          title="Coupon"
          hideFooterPagination={false}
          columns={columns}
          id="coupon-datagrid"
          noRecordIcon={<NoCouponDataSvg className="no-coupon-icon"/>}
          noRecordTitle="No Coupons Available"
          noRecordSubtitle="It looks like you haven't created any coupons yet. Start by creating your first discount coupon to boost event registrations."
          redirectTo={() => routes.createCoupon()} // define the route
          btnName="Create New Coupon" //define the label of btn
        />
      </Grid>

      {/* Filter Modal */}
      <FilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </Grid>
  );
};

export default Coupon;
