import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useMemo, useRef } from 'react';
import useStore from '../../Libs/store';
import apiClient from '../../Libs/Https/API-client';
import { processAPIResponse } from '../../Utils/CommonBaseClass';
import { Typography } from '@mui/material';
import { Logger } from '../../Utils/Logger';
import Grid from '@mui/material/Grid2';
import StatusComponent from '../Status/StatusComponent';


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
            const response = await apiClient.post(source.url, source.data);
            const { status, data, message } = await processAPIResponse(response, source.listName);
            if (status) {
                setDataById(id, { source: source, data: dataTransformer ? dataTransformer(subNode ? data?.[subNode] : data) : subNode ? data?.[subNode] : data, count: subNode ? data?.pagination?.total : data?.count, dataTransformer: dataTransformer });
            }
            else {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message })
            }
        }
        catch (e) {
            Logger.error('API Error:', e);
        }
    }
    /**
     * Method to handle pagination and call API
     */
    const onPaginationChange = (data: any) => {
        const currentPage = data?.page;
        let newSource = { ...dataInfo?.source };
        let newSourceData = newSource['data'];
        if (currentPage < prevPageRef.current) {
            newSourceData['start'] = currentPage === 0 ? currentPage : newSourceData['start'] - newSourceData['limit'];
        }
        else {
            newSourceData['start'] = currentPage === 0 ? currentPage : newSourceData['start'] + newSourceData['limit'];
        }
        prevPageRef.current = currentPage;
        newSourceData['limit'] = data?.pageSize;
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

    return (
        <Grid container className="custom-data-grid-grid">
            {dataInfo?.data ? <Grid style={{ width: '100%' }}>
                {title && (
                    <Typography className='list-title' variant="h6" gutterBottom>
                        {title}
                    </Typography>
                )}
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
                    pageSizeOptions={[25, 50, 75, 100]}
                    disableColumnResize
                    onPaginationModelChange={onPaginationChange}
                    onRowClick={onRowClick}
                    paginationMode={'server'}
                    getRowClassName={() => 'custom-row'}
                    className="custom-data-grid"
                />
            </Grid> :
                <>Loading...........</>}
        </Grid>
    );
};
