import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import CustomButton from "@/components/CustomButton/CustomButton";
import { ISource } from "@/Libs/types/type";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import FilterModal from "@/components/CustomFilter/FilterModal";
import { Logger } from "@/Utils/Logger";
import { useNavigate, useParams } from "react-router-dom";
import routes from "@/router/routes";
import { NoUserList } from "@/assets/svg";


/**
 * Component to display a list of registered event participants with search and filter functionality.
 */
const UserListCard = () => {
  // Retrieve the event ID from route parameters
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({ eventId: id });
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false); // To indicate loading state for API

  const { control } = useForm();
  /**
   * Fetches the participant list when the component mounts.
   */
  useEffect(() => {
    eventPartcipantList();
  }, []);

  /**
   * Function to set the initial request configuration for fetching participant data.
   */
  const eventPartcipantList = useCallback(() => {
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
        id: item?.participant?.id,
        name: item?.participant?.user?.firstName, 
        email: item?.participant?.user?.email, 
        registrationType: item?.participant?.registrationType, 
        createdOn: item?.participant?.createdOn
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
          eventId:filters
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

const handleRowClick=(id:string |number)=>{
  navigate(routes.userdetail(id))
}
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
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      type: "dateField",
      field: "createdOn",
      headerName: "Registration Date & Time",
      width: 250,
      dateFormat: "DD-MM-YYYY hh:mm A",
    },
    {
      type: "default",
      field: "registrationType",
      headerName: "Registration Type",
      width: 200,
    },
  ];
  return (
    <Grid container>
      <Grid
        container
        size={{ xs: 12 }}
        className="user-list-card"
        spacing={2}
        justifyContent="flex-end"
      >
        <Grid container>
          <CustomAutocomplete
            name="search"
            className="custom-user-search-field"
            placeholder="Search by Id,Name or Phone..."
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
          noRecordIcon={<NoUserList className="userdetail-noimage"/>}
          hideFooterPagination={false}
          columns={columns}
          id="participant-list-datagrid"
          noRecordSubtitle="There are no participants registered for this event."
          onRowClick={(params:any) => handleRowClick(params.id)}
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

export default UserListCard;
