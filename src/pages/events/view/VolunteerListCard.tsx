import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import CustomButton from "@/components/CustomButton/CustomButton";
import { ISource } from "@/Libs/type";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import FilterModal from "@/components/CustomFilter/FilterModal";
import { Logger } from "@/Utils/Logger";
import { useNavigate, useParams } from "react-router-dom";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import AssignedVolunteers from "./AssignedVolunteers";


/**
 * Component to display a list of volunteers with search, assign and filter functionality.
 */
const VolunteerListCard = () => {
  const { id } = useParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({ eventId: id });
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false); 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeOrganisationDrawer = () => setDrawerOpen(false);

  const { control } = useForm();
  /**
   * Fetches the volunteer list when the component mounts.
   */
  useEffect(() => {
    volunteerList();
  }, []);

  /**
   * Function to set the initial request configuration for fetching volunteer data.
   */
  const volunteerList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      filters: filters,
    };

    setSource({
      method: "POST",
      data: req,
      url: `participant/list`,
      listName: "eventPartcipantList",
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
        id: item?.id,
        name: item?.user?.firstName,
        email: item?.user?.email,
        role: item?.role,
        phone: item?.phone,
        status: item?.status
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
      url: `participant/list`,
      listName: "participantList",
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
        url: `participant/list`,
        listName: "participant-list-",
      });
    }
  };


  /**
   * Searches participants based on the query entered by the user.
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
        `participant/list`,
        req
      );
      const { status, data } = await processAPIResponse(
        response,
        "eventPartcipantList"
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
      width: 200,
    },
    {
      type: "default",
      field: "phone",
      headerName: "Phone No",
      width: 200,
    },
    {
      type: "status",
      field: "status",
      headerName: "Status",
      width: 200,
    },
  ];

  const onClose = () => {
    closeOrganisationDrawer();
  }

  return (
    <Grid container>
      <Grid
        container
        size={{ xs: 12 }}
        className="volunteer-list-card"
        spacing={2}
        justifyContent="flex-end"
      >
        <Grid container>
          <CustomAutocomplete
            name="search"
            className="custom-user-search-field"
            placeholder="Search by ID, Name or Phone ..."
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
        <Grid container spacing={2}>
          <CustomButton
            className="custom-green-btn"
            onClick={() => setDrawerOpen(true)}
            label="Assign"
            startIcon={<AddIcon />}
            size="large"
          />
        </Grid>
        <Grid container spacing={2}>
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
          title="Volunteers"
          hideFooterPagination={false}
          columns={columns}
          id="volunteer-list-datagrid"
        />
      </Grid>

      <FilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
          <CustomDrawer open={drawerOpen} type="right">
        <AssignedVolunteers onClose={onClose} />
         
    </CustomDrawer>
    </Grid>
  );
};

export default VolunteerListCard;
