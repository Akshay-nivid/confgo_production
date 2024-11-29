import { DataGridList } from "@/components/DataGrid/DataGridList";
import routes from "@/router/routes";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EventFilterIcon from '@/assets/svg/EventFilterIcon.svg';
import FilterModal from "@/components/CustomFilter/FilterModal";
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Typography } from "@mui/material";
import { ISource } from "@/Libs/type";
import { Logger } from "@/Utils/Logger";
import React from "react";
import NoEvent from "../../assets/png/NoEvent.png";
interface EventListProps {
  hideAction?: boolean;
}

/**
 * Used to render events list
 * @author Vanisree
 */
const EventList: React.FC<EventListProps> = React.memo(({ hideAction }) => {
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false); // To indicate loading state for API
  const { control } = useForm();
  /**
   * Useeffect hook handles the api call
   */
  useEffect(() => {
    eventList();
  }, [filters]);
  // const [filterValue, setFilterValue] = useState('');
  /**
   *  Fetch summary balance when the component mounts
   */
  const eventList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      sortBy: "id",
      sortDirection: "DESC",
      filters: filters,
    };

    setSource({
      method: "POST",
      data: req,
      url: `event/list`,
      listName: "eventList",
    });
    return;
  }, []);

  const columns = [
    { type: "default", field: "id", headerName: "ID", width: 150 },
    {
      type: "default",
      field: "name",
      headerName: "Event Name",
      width: 200,
    },
    { type: "default", field: "eventClass", headerName: "Type", width: 150 },
    {
      type: "dateField",
      field: "createdOn",
      headerName: "Created Date",
      width: 200,
      dateFormat: "DD/MM/YYYY",
    },
    {
      type: "dateField",
      field: "startTime",
      headerName: "Start Date",
      width: 200,
      dateFormat: "DD/MM/YYYY",
    },
    { type: "status", field: "statusId", headerName: "Status", width: 150 },
  ];
  /**
   * Apply filter
   * @param newFilters
   */
  const handleApplyFilters = (newFilters: any) => {
    setSource({
      method: "GET",
      data: {
        offset: 0,
        limit: 5,
        filters: {
          ...newFilters,
        },
      },
      url: `event/list`,
      listName: "eventList",
    });
    setFilters(newFilters);
  };

  /**
   * Row click navigation
   */
  const handleRowClick = (id: number | string) => {
    navigate(routes.viewEvent(id));
  };
  /**
   * Function to handle search API for autocomplete
   */
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      let req: any = {
        filters: {
          name: query,
        },
      };
      const response = await await apiClient.post(`event/list`, req);
      const { status, data } = await processAPIResponse(response, "eventList");
      if (status) {
        setSearchResults(data);
      }
      // Update the options based on API response
    } catch (error) {
      Logger.error(error, "EventList.tsx");
    } finally {
      setLoading(false);
    }
  };
  /**
   * Function to handle search API for autocomplete
   *  New handler for when an event is selected from autocomplete
   * @param selected
   */
  const handleAutocompleteChange = (selected: any) => {
    if (selected) {
      setSource({
        method: "GET",
        data: {
          offset: 0,
          limit: 5,
          filters: {
            id: selected.id, // Assuming the selected event has an 'id'
          },
        },
        url: `event/list`,
        listName: "eventList",
      });
    }
  };
  return (
    <Grid container className="custom-list">
      <Grid size={{ xs: 4 }}>
        <Typography className="custom-list-list-title" gutterBottom>
          Events
        </Typography>
      </Grid>

      {/* Buttons for 'Create New Event' and 'Filters' */}
      <Grid container size={{ xs: 8 }} spacing={2} justifyContent="flex-end">
        {!hideAction && (
          <>
            <Grid container>
              <CustomAutocomplete
                name="search"
                className="custom-search-text-field"
                control={control}
                placeholder="Search Events Name"
                options={searchResults} // Dynamic options based on API results
                getOptionLabel={(option: any) => option.name || ""} // Adjust based on your data structure
                onSearch={handleSearch} // Call the search function
                loading={loading}
                onChange={handleAutocompleteChange}
              />
            </Grid>
            <Grid container spacing={2}>
              <CustomButton
                className="custom-list-next-btn"
                label="Create New Event"
                variant="contained"
                size="large"
                type="submit"
                startIcon={<AddIcon />}
                onClick={() => {
                  navigate(routes.createEvent());
                }}
                // disabled={loading}
              />
              <CustomButton
                className="custom-list-filter-btn"
                onClick={() => setIsFilterModalOpen(true)}
                label="Filters"
                startIcon={<EventFilterIcon />}
                variant="contained"
                color="primary"
                size="large"
              />
            </Grid>
          </>
        )}
      </Grid>
      <Grid size={{ xs: 12 }}>
       <DataGridList
          source={source}
          onRowClick={(params: any) => handleRowClick(params.id)}
          title="Event"
          hideFooterPagination={hideAction ? true : false}
          columns={columns}
          id="event-datagrid"
          noRecordIcon={NoEvent}
          noRecordSubtitle="You haven’t registered for any events yet. Explore upcoming events and secure your spot today!"
        /> 
      </Grid>
      {hideAction && (
        <Grid
          container
          size={{ xs: 12, sm: 12 }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CustomButton
            className="custom-list-view-all-button"
            label="View All"
            variant="outlined"
            size="large"
            onClick={() => navigate("/events")}
          />
        </Grid>
      )}

      {/* Filter Modal */}
      <FilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </Grid>
  );
});

export default EventList;
