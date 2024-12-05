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
import { ISource } from '@/Libs/type';
import moment from 'moment';
import { NoEvent } from '@/assets/svg';

type DefColumn = {
    type?: string;
    field: string;
    headerName: string;
    width: number;
    renderCell?: (params: any) => JSX.Element;
};

type DataGridListProps = {
    id: string;
    columns: DefColumn[];
    hideFooterPagination: boolean;
    source?: ISource;
    dataTransformer?: Function;
    data?: any;
    title?: string
    onRowClick?: (params: any) => void;
    subNode?: string;
    noRecordIcon?:React.ReactNode;
    noRecordTitle?: string;
    noRecordSubtitle?:string;
    redirectTo?: () => string;
    btnName?: string;
};

/**
 * Method used to render listing
 * @returns 
 */
export const DataGridList: React.FC<DataGridListProps> = ({ id, columns, hideFooterPagination, source, dataTransformer, onRowClick, subNode, data,noRecordIcon,noRecordTitle,noRecordSubtitle,redirectTo,btnName}) => {
    const setDataById = useStore((state: any) => state.setDataById)
    const dataInfo = useStore((state: any) => state?.compData?.[id]) ?? [];
    const prevPageRef = useRef<any>();
    const pageSize = dataInfo.source?.data?.limit || 5;
    const currentPage = dataInfo.currentPage || 1;
    const [loading, setLoading] = useState(false); // Added loading state
    const noRecordImg = noRecordIcon || <NoEvent/>;
    /**
     * Method used to find screen height and set datagrid height
     */
    useEffect(() => {
        const updateGridHeight = () => {
            const root = document.documentElement;
            const availableHeight = window.innerHeight - 250; // Adjust offset as needed
            root.style.setProperty('--grid-height', `${availableHeight}px`);
        };

        updateGridHeight();
        window.addEventListener('resize', updateGridHeight);
        return () => window.removeEventListener('resize', updateGridHeight);
    }, []);

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
                const processedData = dataTransformer
                    ? dataTransformer(subNode ? data?.[subNode] : data)
                    : subNode ? data?.[subNode] : data;
                // Check if the data array is empty
                if (!processedData || processedData.length === 0) {
                    setDataById(id, { pagination, source, data: null, count: 0, dataTransformer });
                } else {
                    setDataById(id, { pagination: pagination, source: source, data: dataTransformer ? dataTransformer(subNode ? data?.[subNode] : data) : subNode ? data?.[subNode] : data, count: subNode ? data?.pagination?.total : pagination.total, dataTransformer: dataTransformer });

                }
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
        const newSource = { ...dataInfo?.source };
        const newSourceData = newSource['data'];
        newSourceData.offset = newSourceData.limit * (currentPage - 1);
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
                    cellClassName: 'default-label flex',
                    renderCell: (params: any) => <StatusComponent className="data-grid-status" value={params.value}
                    />
                };
            }
            if (item.type === 'default') {
                return {
                    ...item,
                    cellClassName: 'default-label'
                };
            } else if (item.type === 'dateField') {
                return {
                    ...item,
                    cellClassName: 'default-label',
                    renderCell: (params: { value: any }) => <div>{moment(params.value).format(item?.dateFormat ? item?.dateFormat : 'DD/MM/YYYY')}</div>
                }
            }
            else if (item.type === 'custom') {
                return {
                    ...item,
                    cellClassName: 'default-label',
                    renderCell: (params: any) => {
                        const customElement = params.value;
                        if (React.isValidElement(customElement)) {
                            return customElement;
                        }
                    },
                };
            }
            return item;

        });
    }, [columns]);

    /*
    * funtion to handles page limt 
    */
    const handlePageSizeChange = (newSize: number) => {
        onPaginationChange(newSize, 1);
    };
    /*
    * funtion to handles pagination 
    */
    const handlePageChange = (_event: any, newPage: number) => {
        onPaginationChange(pageSize, newPage);
    };

    /**
     * Function which set pagination
     * @param props 
     */
    function CustomPagination(props: any) {
        return (
            <Grid container size={12} className="pagination" justifyContent="space-between" alignItems={"center"}>
                <Grid container size={4} >
                    <Typography className='pagination-label' alignSelf={'center'}> Show result : </Typography>
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
                <Grid container>
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
        <Grid container className="custom-data-grid-grid" justifyContent={'center'}>
            {loading ? (
                <CircularProgress />
            ) : dataInfo?.data && dataInfo?.data?.length > 0 ? (
                <Grid className="w-full h-full flex flex-col">
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
                <Grid container size={12} justifyContent={"center"} alignContent={"center"}>
                     <NoRecords noRecordImage={noRecordImg} noRecordSubtitle={noRecordSubtitle} noRecordTitle={noRecordTitle} redirectTo={redirectTo} btnName={btnName}/>
                     
                </Grid>
               
            )}
        </Grid>
    );
};
