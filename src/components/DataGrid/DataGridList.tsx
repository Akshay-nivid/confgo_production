import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useStore from '../../Libs/store';
import apiClient from '../../Libs/Https/API-client';
import { processAPIResponse } from '../../Utils/CommonBaseClass';
import { CircularProgress, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { Logger } from '../../Utils/Logger';
import Grid from '@mui/material/Grid2';
import StatusComponent from '../Status/StatusComponent';
import { NoRecords } from '../NoRecords/NoRecords';

type DefColumn = {
    type?: string;
    field: string;
    headerName: string;
    width: number;
    renderCell?: (params: any) => JSX.Element;
};
type DataGridListProps = {
    id: any;
    columns: DefColumn[];
    hideFooterPagination: boolean;
    source?: any;
    dataTransformer?: Function;
    data?: any;
    title?: String
    onRowClick?: (params: any) => void;
    subNode?: string;
};

/**
 * Method used to render listing
 * @returns 
 */
export const DataGridList: React.FC<DataGridListProps> = ({ id, columns, hideFooterPagination, source, dataTransformer, title, onRowClick, subNode, data }) => {
    const setDataById = useStore((state: any) => state.setDataById)
    const dataInfo = useStore((state: any) => state?.compData?.[id]) ?? [];
    const prevPageRef = useRef<any>();
    const pageSize = dataInfo.pageSize || 5;
    const currentPage = dataInfo.currentPage || 1;
    const [loading, setLoading] = useState(false); // Added loading state

    const totalItems = dataInfo?.pagination?.total || 0;
    /*
    * total pages
    */
    const totalPages = Math.ceil(totalItems / dataInfo?.source?.data?.limit);
    /**
    * Useeffect hook handles the api call 
    */
    useEffect(() => {

        if (source?.url) {

            handleApiCall(source)
        }
        if (data) {
            setDataById(id, { data: data, count: data.length });
        }
    }, [source, data])

    /**
     * Method call the api and set the data
     * @param source 
     */
    const handleApiCall = async (source: any) => {
        try {
            setLoading(true);
            const response = await apiClient.post(source.url, source.data);
            const { status, data, message } = await processAPIResponse(response, source.listName);
            if (status) {
                const pagination = response?.data?.pagination;
                setDataById(id, { pagination: pagination, source: source, data: dataTransformer ? dataTransformer(subNode ? data?.[subNode] : data) : subNode ? data?.[subNode] : data, count: subNode ? data?.pagination?.total : pagination.total, dataTransformer: dataTransformer });
                // setPageSize(response?.data?.pagination?.limit);
            }
            else {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message })
            }
        }
        catch (e) {
            Logger.error('API Error:', e);
        } finally {
            setLoading(false); // End loading
        }
    }
    /**
     * Method to handle pagination and call API
     */
    const onPaginationChange = (pageSize: any, currentPage: any) => {
        //setPageSize(dataInfo.source.data.limit);
        let newSource = { ...dataInfo?.source };
        let newSourceData = newSource['data'];
        if (currentPage < prevPageRef.current) {

            newSourceData['offset'] = currentPage === 1 ? currentPage - 1 : newSourceData['offset'] - newSourceData['limit'];
        } else {
            newSourceData['offset'] = currentPage === 1 ? currentPage - 1 : newSourceData['offset'] + newSourceData['limit'];
        }
        prevPageRef.current = currentPage;
        newSourceData['limit'] = pageSize;
        newSource['data'] = newSourceData;

        handleApiCall(newSource);
    }
    /**
     * Method used to render columns with custom effects
     */
    const renderColumn = useMemo(() => {
        return columns?.map((item: any) => {
            if (item.type === 'status') {
                return {
                    ...item,
                    cellClassName: 'status-container',
                    renderCell: (params: any) => <StatusComponent value={params.value}
                    />
                };
            }
            if (item.type === 'default') {
                return {
                    ...item,
                    cellClassName: 'default-label'
                };
            }
            return item;
        });
    }, [columns]);

    /*
    * funtion to handles page limt 
    */
    const handlePageSizeChange = (newSize: number) => {
        // setPageSize(newSize);
        // setCurrentPage(1);
        onPaginationChange(newSize, 1);
    };
    /*
    * funtion to handles pagination 
    */
    const handlePageChange = (_event: any, newPage: number) => {
        // setCurrentPage(newPage);

        onPaginationChange(pageSize, newPage);
    };

    /**
     * Function which set pagination
     * @param props 
     */
    function CustomPagination(props: any) {
        return (
            <Grid container className="pagination" justifyContent="space-between" spacing={2} alignItems={"center"}>
                <Grid display={'flex'} alignItems={'center'}>
                    <Typography className='pagination-label'> Show result : </Typography>
                    <Select
                        value={props.rowsPerPage}
                        defaultValue={10}
                        onChange={(event) => {
                            const newValue = event.target.value;
                            handlePageSizeChange(newValue); // Call the size change function
                        }}
                        variant="outlined"
                        size="small"
                    >
                        {[5, 10, 25, 50].map((rows) => (
                            <MenuItem key={rows} value={rows}>
                                {rows}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid alignSelf={'flex-end'}>
                    <Pagination
                        count={dataInfo.pagination.totalPages}
                        page={dataInfo.pagination.currentPage}
                        onChange={handlePageChange}
                        className="pagination"
                    />
                </Grid>
            </Grid>
        );
    }
    return (
        <Grid container className="custom-data-grid-grid">
            {loading ? (
                <CircularProgress/>
            ) : dataInfo?.data ? (

                <Grid style={{ width: '100%' }}>
                    <DataGrid
                        rows={dataInfo?.data?.rows || dataInfo?.data}
                        columns={renderColumn}
                        hideFooterPagination={hideFooterPagination}
                        disableColumnMenu
                        autoHeight
                        initialState={{
                            pagination: { paginationModel: { pageSize: 25 } }
                        }}
                        rowCount={dataInfo?.count} // Set the row count here
                        pageSizeOptions={[5, 10, 15, 25]}
                        disableColumnResize
                        onPaginationModelChange={onPaginationChange}
                        onRowClick={onRowClick}
                        paginationMode={'server'}
                        getRowClassName={() => 'custom-row'}
                        className="custom-data-grid"
                        hideFooterSelectedRowCount={true}
                        slots={{
                            pagination: CustomPagination, // Use the custom pagination component
                        }}
                        slotProps={{
                            pagination: {
                                count: dataInfo.pagination.totalPages,
                                page: currentPage + 1, // Convert to 1-based
                                onPageChange: handlePageChange,
                                rowsPerPage: dataInfo.pagination.limit,
                                className: 'custom-pagination'
                            }
                        }}
                    />
                </Grid>
            ) : (
                <NoRecords/>
            )}
        </Grid>
    );
};
