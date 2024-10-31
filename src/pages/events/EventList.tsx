import { DataGridList } from "@/components/DataGrid/DataGridList"
import routes from "@/router/routes";
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import FilterModal from "@/components/CustomFilter/FilterModal";
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Typography } from "@mui/material";
import { ISource } from "@/Libs/type";
import { Logger } from "@/Utils/Logger";
import useStore from '@/Libs/store';
/**
 * Used to render events list
 * @author Vanisree 
 */
const EventList = () => {
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
  }, [filters])
  // const [filterValue, setFilterValue] = useState(''); 
  /**
  *  Fetch summary balance when the component mounts
  */
  const eventList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      sortBy: 'id',
      sortDirection: 'DESC',
      filters:filters
    };

    setSource({
      method: 'POST',
      data: req,
      url: `event/list`,
      listName: 'eventList'
    })
    return;
  }, []);

  const columns = [
    { type: 'default', field: 'id', headerName: "ID", width: 150 },
    { type: 'default', field: 'name', headerName: "Conference Name", width: 200 },
    { type: 'default', field: 'type', headerName: "Type", width: 150 },
    { type: 'dateField', field: 'createdOn', headerName: "Date & Time", width: 250,dateFormat:'DD-MM-YYYY hh:mm A' },
    { type: 'default', field: 'description', headerName: "Host/Organizer", width: 200 },
    { type: 'status', field: 'statusId', headerName: "Status", width: 150 }
  ]
  /**
   * Apply filter 
   * @param newFilters 
   */
  const handleApplyFilters = (newFilters: any) => {
    setSource({
      method: 'GET',
      data: {
        offset: 0,
        limit: 5,
        filters: {
          ...newFilters,
        },
      },
      url: `event/list`,
      listName: 'eventList',
    });
    setFilters(newFilters);
  };

  /**
   * Row click navigation
   */
  const handleRowClick = (id: number | string) => {
   navigate(routes.viewEvent(id)); 
  }
/**
   * Function to handle search API for autocomplete
*/
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      let req:any = {
        filters: {
          name: query
        }
      };
      const response = await await apiClient.get(`event/list`, req);
      const { status, data } = await processAPIResponse(response, 'eventList');
      if (status) {
        setSearchResults(data);
      }
     // Update the options based on API response
    } catch (error) {
     Logger.error(error,'EventList.tsx');
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
                method: 'GET',
                data: {
                    offset: 0,
                    limit: 5,
                    filters: {
                        id: selected.id, // Assuming the selected event has an 'id'
                    },
                },
                url: `event/list`,
                listName: 'eventList',
            });
        }
    };
  return (
    <Grid container className="custom-list">
      <Grid size={{ xs: 4 }} >
        <Typography className='custom-list-list-title' gutterBottom>
          Events
        </Typography>
      </Grid>

      {/* Buttons for 'Create New Event' and 'Filters' */}
      <Grid container size={{ xs: 8 }} spacing={2} justifyContent='flex-end'  >
        <Grid container>
        <CustomAutocomplete
            name="search"
            className="custom-search-text-field"
            control={control}
            options={searchResults} // Dynamic options based on API results
            getOptionLabel={(option:any) => option.name || ''} // Adjust based on your data structure
            onSearch={handleSearch} // Call the search function
            loading={loading} 
            onChange={handleAutocompleteChange}
          />

        </Grid>
        <Grid container spacing={2}>
          <CustomButton
            className="custom-list-next-btn"
            label='Create New Event'
            variant='contained'
            size='large'
            type='submit'
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
            startIcon={<TuneRoundedIcon />}
            variant="contained"
            color="primary"
            size="large"
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }} >
        <DataGridList source={source}   onRowClick={(params:any) => handleRowClick(params.id)}  title="Event" hideFooterPagination={false} columns={columns} id="event-datagrid" />
      </Grid>

      {/* Filter Modal */}
      <FilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </Grid>
  )
}

export default EventList