import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import CustomButton from "@/components/CustomButton/CustomButton";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import apiClient from "@/Libs/Https/API-client";
import { ISource } from "@/Libs/type";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { Logger } from "@/Utils/Logger";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import routes from "@/router/routes";
import FilterModal from "@/components/CustomFilter/FilterModal";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
const AdminUsersList=()=>{
    const navigate = useNavigate();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [filters, setFilters] = useState();
    const [source, setSource] = useState<ISource | undefined>(undefined);
    const [loading, setLoading] = useState(false); // To indicate loading state for API
  
    const { control } = useForm();
  /**
   * Fetches the userRole list when the component mounts.
   */
  useEffect(() => {
    UserRoleList();
  }, []);

  /**
   * Function to set the initial request configuration for fetching participant data.
   */
  const UserRoleList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      filters: filters,
    };

    setSource({
      method: "POST",
      data: req,
      url: `user/userRole/list`,
      listName: "UserRoleList",
    });
    return;
  }, []);

  /**
   * Transforms the raw data from the API to match the required format for the DataGrid component.
   * @param data - The raw data from API response
   * @returns Transformed data for DataGrid
   */
  const transformData = (data: any) => {
    if (!data) return [];
    return data.map((item: any) => {
      return {
        ...item,
        name: item?.user?.firstName, 
        role:item?.role?.roleName,
        email:item?.user?.email,
        phone:item?.user?.phone,
        status:item?.user?.statusId
      };
    });
  };

  /**
   * Updates the filters and source for the data grid when new filters are applied.
   * @param newFilters - The new filters applied by the user
   */
  const handleApplyFilters = (newFilters: any) => {
    setSource({
      method: "POST",
      data: {
        offset: 0,
        limit: 5,
        filters: {
          ...newFilters,
        },
      },
      url: `user/userRole/list`,
      listName: "newRoleFilter",
    });
    setFilters(newFilters);
  };

  /**
   * Updates the source for the data grid when an autocomplete selection is made.
   * @param selected - The selected item from the autocomplete list
   */
  const handleAutocompleteChange = (selected: any) => {
    if (selected) {
      setSource({
        method: "POST",
        data: {
          offset: 0,
          limit: 5,
          filters: {
            id: selected.id,
          },
        },
        url: `user/userRole/list`,
        listName: "newRole-1",
      });
    }
  };

// const handleRowClick=(id:string |number)=>{
//   navigate(routes.userdetail(id))
// }
  /**
   * Searches users based on the query entered by the user.
   * @param query - The search query entered by the user
   */
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      let req = {
        filters: {
          name: query,
        },
      };
      const response = await await apiClient.post(
        `user/userRole/list'`,
        req
      );
      const { status, data } = await processAPIResponse(
        response,
        "UserRoleListSearch"
      );
      if (status) {
        setSearchResults(data);
      }
    } catch (error) {
      Logger.error("UserListCard.tsx", error);
    } finally {
      setLoading(false);
    }
  };

  // Column configuration for the DataGrid component
  const columns = [
    { type: "default", field: "id", headerName: "ID", width: 150 },
    { type: "default", field: "name", headerName: "Name", width: 200 },
    {
      type: "default",
      field: "role",
      headerName: "Role",
      width: 200,
    },
    {
      type: "default",
      field: "email",
      headerName: "Email",
      width: 180
    },
    {
      type: "default",
      field: "phone",
      headerName: "Phone No",
      width: 180,
    },
    { type: "status", field: "statusId", headerName: "Status", width: 150 }
  ];
    return(
        <Grid container className="custom-list">
            <Grid size={{ xs: 4 }}>
                <Typography className="custom-list-list-title" gutterBottom>
                    Users
                </Typography>
            </Grid>
        <Grid
          container
          size={{ xs: 8 }}
          spacing={2}
          justifyContent="flex-end"
        >
          <Grid container >
            <CustomAutocomplete
              name="search"
              className="custom-search-text-field"
              placeholder="Search by name"
              control={control}
              options={searchResults}
              getOptionLabel={(option: any) =>
                option.user?.firstName || ""
              }
              onSearch={handleSearch}
              loading={loading}
              onChange={handleAutocompleteChange}
            />
          </Grid>
          <Grid container >
          <CustomButton
            className="create-coupon-create-btn"
            label="Create New User"
            variant="contained"
            size="large"
            type="submit"
            startIcon={<AddIcon />}
            onClick={() => {
              navigate(routes.createNewUsers());
            }}
            // disabled={loading}
          />
            <CustomButton
              className="custom-list-filter-btn"
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
            dataTransformer={transformData}
            source={source}
            title="Event Partcipant List"
            hideFooterPagination={false}
            columns={columns}
            id="data-role-list"
            // onRowClick={(params:any) => handleRowClick(params.id)}
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

}

export default AdminUsersList;