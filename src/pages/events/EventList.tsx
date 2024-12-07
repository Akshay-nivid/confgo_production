import { DataGridList } from "@/components/DataGrid/DataGridList";
import routes from "@/router/routes";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EventFilterIcon from '@/assets/svg/EventFilterIcon.svg';
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Button, IconButton, Typography } from "@mui/material";
import { ISource } from "@/Libs/type";
import { Logger } from "@/Utils/Logger";
import React from "react";
import { NoEvent as NoEventIcon } from "@/assets/svg";
import { CloseOutlined } from "@mui/icons-material";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import moment from "moment";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
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
  const [filters, setFilters] = useState({ requestDate : '', eventType : ''});
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false); // To indicate loading state for API
  const [dateTemplate, setDateTemplate] = useState(String); // To store the selected date template : Today/Yesterday
  const [typeTemplate, setTypeTemplate] = useState(String); // To store the selected date template : Today/Yesterday

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

  const EventTypeArray = [
    { label: "Offline", value: "OFFLINE" },
    { label: "Online", value: "ONLINE" },
    { label: "Hybrid", value: "HYBRID" },
  ];

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
    {
      type: "default",
      field: "published",
      headerName: "Publish",
      width: 150,
      renderCell: (params: any) => {
        if (params.row.statusId !== 1) {
          return <div></div>;
        }
        return (
          <div>
            {params.row.published ? "Yes" : "No"}
          </div>
        );
      },
    }
  ];
  /**
   * Apply filter
   * @param newFilters
   */
  const handleApplyFilters = () => {
    setSource({
      method: "GET",
      data: {
        offset: 0,
        limit: 5,
        filters: {
          ...filters,
        },
      },
      url: `event/list`,
      listName: "eventList",
    });
    setFilters(filters);
    setIsFilterModalOpen(false);
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
                className="event-list-create-btn"
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
                className="event-list-filter-btn"
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
          noRecordIcon={<NoEventIcon className="event-list-no-events-icon"/>}
          noRecordSubtitle="You haven’t registered for any events yet. Explore upcoming events and secure your spot today!"
          redirectTo={() => routes.createEvent()} // define the route
          btnName="Create New Event" //define the label of btn
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

      {/* Filter Drawer */}
      <CustomDrawer
        type="right"
        open={isFilterModalOpen}
        children={
          <Grid className="event-detail-speakers-card-drawer-box">
            <Grid container justifyContent={"space-between"} mb={1}>
              <Typography className="event-detail-speakers-card-contributor-header">
                Filter
              </Typography>
              <IconButton onClick={() => setIsFilterModalOpen(false)}>
                 <CloseOutlined />
              </IconButton>
            </Grid>
            <Grid>
              <form>
                <Grid container spacing={3}>
                  <Grid container size={{ xs: 12 }}>
                    <Typography className="event-detail-speakers-card-contributor-header">
                      Filter with Request Date
                    </Typography>
                    <Grid size={{ xs: 12}}>
                    <CustomTextField
                      placeholder="Request Date"
                      control={control}
                      name="requestDate"
                      type="date"
                      value={filters.requestDate}
                      onChange={(e : any) => {console.log(e); filters.requestDate = e}}
                      className="create-event"
                      defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                      min={moment(new Date()).format("YYYY-MM-DD")}
                    />
                    </Grid>
                    <Grid size={{ xs: 12}} container>
                      <Grid size={{ xs: 3 }}
                        sx={{ cursor: 'pointer' }}
                        className= {(dateTemplate == 'Today') ? "event-list-filter-card-template-selected" : "event-list-filter-card-template"}>
                        <Button
                          type="button"
                          onClick={() => { filters.requestDate = moment(new Date()).format("YYYY-MM-DD"); setDateTemplate('Today');  }}>
                          Today
                        </Button>
                      </Grid>
                      <Grid size={{ xs: 3 }}
                        sx={{ cursor: 'pointer' }}
                        className= {(dateTemplate == 'Yesterday') ? "event-list-filter-card-template-selected" : "event-list-filter-card-template"}>
                        <Button
                          type="button"
                          onClick={() => { filters.requestDate = moment().subtract(1, 'days').format("YYYY-MM-DD"); setDateTemplate('Yesterday'); }}>
                          Yesterday
                        </Button>
                      </Grid>
                     
                    </Grid>
                  </Grid>
                  <Grid container size={{ xs: 12 }} spacing={3}>
                    <Typography className="event-detail-speakers-card-contributor-header">
                      Filter with Event Type 
                    </Typography>
                    <Grid size={{ xs: 12}} container>
                    {EventTypeArray.map((option) => (
                      <Grid size={{ xs: 3 }}
                        sx={{ cursor: 'pointer' }}
                        className= {( typeTemplate == option.value) ? "event-list-filter-card-template-selected" : "event-list-filter-card-template"}
                        onClick={() => { filters.eventType = option.value; console.log(filters.eventType) }}>
                        <Button
                          type="button"
                          onClick={() => { filters.eventType = option.value; setTypeTemplate(option.value); }}>
                          {option.label}
                        </Button>
                      </Grid>
                      
                    ))}
                    </Grid>
                  </Grid>
                  <Grid size={{ xs: 12}}>
                  <CustomButton
                    className="event-list-filter-submit-btn"
                    label="Apply Filters"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleApplyFilters}
                  />
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        }
      />
    </Grid>
  );
});

export default EventList;
