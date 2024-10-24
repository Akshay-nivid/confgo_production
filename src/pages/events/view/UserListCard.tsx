import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import CustomButton from "@/components/CustomButton/CustomButton";
import { ISource } from "@/Libs/type";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useForm } from 'react-hook-form';
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import FilterModal from "@/components/CustomFilter/FilterModal";

/**
 * Event registered user list
 * @author Neethu 
 */
const UserListCard = () => {
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
            filters: filters
        };

        setSource({
            method: 'POST',
            data: req,
            url: `coupon/list`,
            listName: 'couponList'
        })
        return;
    }, []);

  /**
   * Apply filter 
   * @param newFilters 
   */
  const handleApplyFilters = (newFilters: any) => {
    // Update filters when modal is applied
    setSource({
      method: 'POST',
      data: {
        offset: 0,
        limit: 5,
        filters: {
          ...newFilters,
        },
      },
      url: `coupon/list`,
      listName: 'couponList',
    });
    setFilters(newFilters);
    };
    // Function to handle search API for autocomplete
    // New handler for when a coupon is selected from autocomplete
    const handleAutocompleteChange = (selected: any) => {
        //setSelectedCoupon(selected); // Update selected coupon
        if (selected) {
            // Here you can filter the data grid based on the selected coupon
            setSource({
                method: 'POST',
                data: {
                    offset: 0,
                    limit: 5,
                    filters: {
                        id: selected.id, // Assuming the selected coupon has an 'id'
                    },
                },
                url: `coupon/list`,
                listName: 'couponList',
            });
        }
    };


    // Function to handle search API for autocomplete
    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            let req = {
                filters: {
                    name: query
                }
            };
            const response = await await apiClient.post(`coupon/list`, req);
            const { status, data, message } = await processAPIResponse(response, 'couponList');
            if (status) {
                setSearchResults(data);
            }
            // Update the options based on API response
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };
    const columns = [
        { type: 'default', field: 'id', headerName: "ID", width: 150 },
        { type: 'default', field: 'name', headerName: "Name", width: 200 },
        { type: 'default', field: 'discountType', headerName: "Speciality", width: 200 },
        {
            type: 'default',
            field: 'endDate',
            headerName: "Registration Date & Time",
            width: 250,
            renderCell: (params: any) => {
                const dateValue = new Date(params.value);
                const formattedDate = dateValue.toLocaleDateString('en-US', {
                    month: 'short', // Aug
                    day: 'numeric', // 24
                    year: 'numeric', // 2024
                });
                const formattedTime = dateValue.toLocaleTimeString('en-US', {
                    hour: 'numeric', // 4
                    minute: '2-digit', // 58
                    hour12: true, // AM/PM
                });
                return <span>{`${formattedDate} ${formattedTime}`}</span>;
            }
        },
       { type: 'status', field: 'status', headerName: "Registration Status", width: 250 }

    ]
    return (
        <Grid container >
            <Grid container size={{ xs: 12 }} className='user-list-card' spacing={2} justifyContent='flex-end'  >
                <Grid container >
                    <CustomAutocomplete
                        name="search"
                        className="custom-user-search-field"
                        placeholder="Search by name"
                        control={control}
                        options={searchResults}
                        getOptionLabel={(option: any) => option.name || ''}
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
            <Grid size={{ xs: 12 }} >
                <DataGridList source={source} title="Coupon" hideFooterPagination={false} columns={columns} id="coupon-datagrid" />
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

export default UserListCard;