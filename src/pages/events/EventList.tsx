import { DataGridList } from "@/components/DataGrid/DataGridList";
import routes from "@/router/routes";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { set, useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import { ISource } from "@/Libs/types/type";
import { Logger } from "@/Utils/Logger";
import React from "react";
import { NoEvent as NoEventIcon } from "@/assets/svg";
import { Filter } from "@/components/Filter";
import { StatusEnum } from "@/Utils/StatusEnum";
import moment from "moment";

interface EventListProps {
  hideAction?: boolean;
  view?:any;
  dashView ? :boolean;
}

/**
 * Used to render events list
 * @author Vanisree
 */
const EventList: React.FC<EventListProps> = React.memo(({ hideAction ,view , dashView}) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  let filters = { requestDate: '', eventClass: '',statusId:'' };
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false); // To indicate loading state for API

  const { control } = useForm();
  /**
   * Useeffect hook handles the api call
   */
  useEffect(() => {
    eventList();
  }, []);
  // const [filterValue, setFilterValue] = useState('');
  /**
   *  Fetch summary balance when the component mounts
   */
  const eventList = useCallback(() => {
    const req = {
      offset: 0,
      limit:dashView ? 3 :5,
      sortBy:dashView ? "startTime": "id",
      sortDirection:dashView ? "ASC" : "DESC",
      filters:dashView? {statusId:1,
        startTime:moment(new Date()).add(1,'days').format('YYYY-MM-DD'),
      }: 
      filters
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

  const statusArray = [
    { label: "Completed", value: "COMPLETED" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Pending", value: "PENDING" },
  ];

  const filterFields: any = [
    {
      type: 'date',
      fieldName: 'startTime',
      label: 'Today',
      heading: 'Filter with Request Date'
    },
    {
      type: 'tiles',
      fieldName: 'eventClass',
      label: 'Event Type',
      heading: 'Filter with Event Type',
      options: EventTypeArray
    },
    {
      type: 'tiles',
      fieldName: 'statusId',
      label: 'Status',
      heading: 'Filter with Status',
      options: statusArray
    }
  ]
  const columns = [
    { type: "default", field: "id", headerName: "ID", width: 150 },
    {
      type: "custom",
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
    { type: "status", field: "statusId", headerName: "Status", width: 150, sortable: false },
    
  ];

  /**
   * Row click navigation
   */
  const handleRowClick = (id: number | string, data: any) => {
    data.statusId === StatusEnum.DRAFTED ? navigate(routes.editDraftEvent(id)): navigate(routes.viewEvent(id))
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

    /**
     *  Transforms the raw data from the API to match the required format for the DataGrid component.
    * @param data - The raw data from API response
    * @returns Transformed data for DataGrid
    */
   const transformData = (data: any) => {
     if (!data) return [];
     return data.map((item: any) => ({
       id: item?.id,
       name: item?.name,
       eventClass: item?.eventClass,
       createdOn: item?.createdOn,
       startTime:item?.startTime,
       statusId: item?.published === true && item?.statusId == 1 ? 6 : item?.statusId,
     }));
   };





  return (
    <Grid container className="custom-list">
      
     
      <Grid  container size={{ xs: 8 }} spacing={2} justifyContent="flex-end " className="ml-auto w-max">
        {!hideAction && (
          <>
            <Grid container>
              <CustomAutocomplete
                
                name="search"
                className="custom-search-text-field textfield-border"
                control={control}
                placeholder="Search Events Name"
                options={searchResults} // Dynamic options based on API results
                getOptionLabel={(option: any) => option.name || ""} // Adjust based on your data structure
                onSearch={handleSearch} // Call the search function
                loading={loading}
                onChange={handleAutocompleteChange}
              />
            </Grid>
            <Grid container spacing={2} id ="event-create-new-event">
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
              <Filter datagridId='event-datagrid' fields={filterFields} />
            </Grid>
          </>
        )}
      </Grid>
      <Grid size={{ xs: 12 }} className="shadow-app mt-8 app-border-radius">
        <DataGridList
          dataTransformer={transformData}
          source={source}
          onRowClick={(params: any) => handleRowClick(params.id, params.row)}
          title="Event"
          hideFooterPagination={hideAction ? true : false}
          columns={columns}
          id={dashView?"dashboard-view":"event-datagrid"} 
          noRecordIcon={<NoEventIcon className="event-list-no-events-icon" />}
          noRecordSubtitle="It looks like you haven't created any events yet.Start by setting up your first conference or meeting."
          redirectTo={() => routes.createEvent()} // define the route
          btnName="Create New Event" //define the label of btn
        />
      </Grid>
      {hideAction && view && (
        <Grid
          container
          size={{ xs: 12, sm: 12 }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {/* <CustomButton
            className="custom-list-view-all-button"
            label="View All"
            variant="outlined"
            size="large"
            onClick={() => navigate("/events")}
          /> */}
        </Grid>
      )}
    
    </Grid>
  );
});

export default EventList;
