import React, { useState } from 'react';
import { Button, TextField, FormControlLabel, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, Typography, RadioGroup, Radio, IconButton } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { Controller, useForm } from 'react-hook-form';
import useStore from '@/Libs/store';
import apiClient from '@/Libs/Https/API-client';
import { convertLocalToUTC, processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CustomButton from './CustomButton/CustomButton';
import EventFilterIcon from '@/assets/svg/EventFilterIcon.svg';
import CustomDrawer from './CustomDrawer/CustomDrawer';
import { CloseOutlined } from '@mui/icons-material';
import moment from 'moment';

type FilterProps = {
    datagridId: string;
    fields: Array<any>
}

/**
 * Component used to draw filter
 * @returns 
 */
export const Filter: React.FC<FilterProps> = ({ datagridId, fields }: any) => {
    const dataGridInfo = useStore(
        (state: any) => state?.compData?.[datagridId]
    ) ?? [];
    const setDataById = useStore((state: any) => state.setDataById)
    const { control, setValue, reset, formState: { errors, isSubmitting }, handleSubmit } = useForm()
    const [showDateRange, setShowDateRange] = useState(false);

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [dateTemplate, setDateTemplate] = useState(String); // To store the selected date template : Today/Yesterday
    const [selectedTile, setSelectedTile] = useState(String); // To store the selected date template : Today/Yesterday
      
    const handleClose = () => {
        setIsFilterModalOpen(false);
    };

    /**
     * Method to check value is not empty
     * @param data 
     */
    const checkValueIsNotEmpty = (data: any) => {
        return Object.keys(data)
            .filter(key => data[key] !== null && data[key] !== undefined && data[key].toString().trim() !== '')
            .reduce((acc, key) => {
                acc[key] = data[key];
                return acc;
            }, {} as Record<string, any>);
    }
    /**
     * Method used to submit filter
     * @param event 
     */
    const onSubmit = (data: any) => {
        const formattedData = Object.keys(data).reduce((acc: any, key: string) => {
            if (data[key] && typeof data[key] === 'object' && dayjs(data[key]).isValid()) {
                acc[key] =convertLocalToUTC( dayjs(data[key]).format('YYYY-MM-DD'));
            } else {
                acc[key] = data[key];
            }
            return acc;
        }, {});

        let req: any = {
            ...dataGridInfo?.source?.data,
        };
        req.filters = {...dataGridInfo?.source?.data.filters,...formattedData };

        req['start'] = 0;
        let dataSource: any = { ...dataGridInfo?.source }
        dataSource.data = checkValueIsNotEmpty(req);
        handleApiCall(dataSource, dataGridInfo?.dataTransformer)

        handleClear();
    }

    /**
    * Method call the api and set the data
    * @param source 
    */
    const handleApiCall = async (source: any, dataTransformer: any) => {
        try {
            const response = await apiClient.post(source.url, source.data);
            const { status, data, message } = processAPIResponse(response, source.listName);
            if (status) {
                const pagination = response?.data?.pagination; 
                setDataById(datagridId, { source, data: dataTransformer ? dataTransformer(data) : data, count: data?.count,pagination,});
            }
            else {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message })
            }
        }
        catch (e) {
            Logger.error('API Error:', e);
        }
        handleClose();
    }
    /**
     * Method used to handle filter reset
     */

    const handleClear = () => {
        reset();
        fields?.forEach((item: any) => {
            setValue(item.fieldName, item?.defaultValue||'')
        })
        setValue("startTime", ''); // Clear startTime
        setValue("endTime", '');
        setDateTemplate('');
        setSelectedTile('');
    }
    
    const setTodaysDate = () => {
        const currentDate = moment(); // Get the current local date and time
        setValue("startTime",currentDate);
        setValue("endTime", currentDate);
        setDateTemplate('Today');
    };
    const setYesterDaysDate = () => {
        const yesterday = dayjs().subtract(1, "day");
        setValue("startTime", yesterday);
        setValue("endTime", yesterday);
        setDateTemplate('Yesterday');
    };
    const setCurrentWeek = () => {
        const startOfWeek = dayjs().startOf('week'); 
        const endOfWeek = dayjs().endOf('week'); 
    
        setValue("startTime", startOfWeek);
        setValue("endTime", endOfWeek);
        setDateTemplate("This Week");
    };

    const setCurrentMonth = () => {
        const startOfMonth = dayjs().startOf('month'); 
        const endOfMonth = dayjs().endOf('month');    
    
        setValue("startTime", startOfMonth);
        setValue("endTime", endOfMonth);
        setDateTemplate("This Month");
    };

    const setLastMonth = () => {
        const startOfLastMonth = dayjs().subtract(1, "month").startOf('month');
        const endOfLastMonth = dayjs().subtract(1, "month").endOf('month');
    
        setValue("startTime", startOfLastMonth);
        setValue("endTime", endOfLastMonth);
        setDateTemplate("Last Month");
    };

    const setCurrentYear = () => {
        const startOfYear = dayjs().startOf('year');
        const endOfYear = dayjs().endOf('year'); 
    
        setValue("startTime", startOfYear);
        setValue("endTime", endOfYear);
        setDateTemplate("This Year");
    };

    const setLastYear = () => {
        const startOfLastYear = dayjs().subtract(1, "year").startOf('year'); 
        const endOfLastYear = dayjs().subtract(1, "year").endOf('year'); 
    
        setValue("startTime", startOfLastYear);
        setValue("endTime", endOfLastYear);
        setDateTemplate("Last Year");
    };

     const handleClick = (item: any, option: any) => {
    setSelectedTile((prevState: any) => {
      const updatedState = { ...prevState, [item.fieldName]: option.value };
      return updatedState;
    });
   setValue(item.fieldName, option.value);
  };

    /**
     * on click the calender shows a date range
     * @param value 
     */

    const handleRadioChange = (value: any) => {
        if (value === 'calendar') {
            setShowDateRange(true);
        } else {
            setShowDateRange(false);
        }
    };
    return (
        <>
            <CustomButton
                className="custom-list-filter-btn"
                onClick={() => setIsFilterModalOpen(true)}
                label="Filters"
                startIcon={<EventFilterIcon />}
                variant="contained"
                color="primary"
                size="large"
            />
            <CustomDrawer
                className='filter-drawer'
                type="right"
                open={isFilterModalOpen}
                children={
                    <form onSubmit={handleSubmit(onSubmit)} className='filter' >
                        <Grid className="filter-drawer" spacing={3}>
                            <Grid container justifyContent={"space-between"} mb={1}>
                                <Typography className="filter-drawer-header">
                                    Filter
                                </Typography>
                                <IconButton onClick={() => setIsFilterModalOpen(false)}>
                                    <CloseOutlined />
                                </IconButton>
                            </Grid>
                            {fields?.map((item: any) => (
                                <Grid key={item.fieldName} >
                                    <Typography className="filter-drawer-subheader">
                                        {item.heading}
                                    </Typography>
                                    {item.type === 'textField' && (
                                        <Controller
                                            name={item.fieldName}
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: false }}
                                            render={({ field }: any) => (
                                                <TextField
                                                    {...field}
                                                    label={item?.label}
                                                    fullWidth
                                                    error={!!errors?.[item.fieldName]}
                                                    helperText={errors?.[item.fieldName]?.message || ''}
                                                />
                                            )}
                                        />
                                    )}
                                    {item.type === 'dateRange' && (
                                        <Grid container spacing={2}>
                                            <Grid >
                                                <Controller
                                                    name="from_date"
                                                    control={control}
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                                                            <DatePicker
                                                                label="Start Date"
                                                                value={field.value || null}
                                                                onChange={(newValue) => {
                                                                    field.onChange(newValue);
                                                                }}
                                                                slotProps={{
                                                                    textField: {
                                                                        fullWidth: true,
                                                                    },
                                                                }} />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid >
                                                <Controller
                                                    name="to_date"
                                                    control={control}
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DatePicker
                                                                label="End Date"
                                                                value={field.value || null}
                                                                onChange={(newValue) => {
                                                                    field.onChange(newValue);
                                                                }}
                                                                slotProps={{
                                                                    textField: {
                                                                        fullWidth: true,
                                                                    },
                                                                }}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                    {item.type === 'date' && (
                                        <Grid >
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={item.fieldName}
                                                    control={control}
                                                    defaultValue={null}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                                                            <DatePicker
                                                                name={item.fieldName}
                                                                sx={{ width: '100%' }}
                                                                label={item.label}
                                                                value={field.value || null}
                                                                defaultValue={null}
                                                                onChange={(newValue) => {
                                                                    field.onChange(newValue);
                                                                    setDateTemplate('');
                                                                }}
                                                            />
                                                        </LocalizationProvider>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }} margin={2} container spacing={1} sx={{ marginLeft: 0 }} >
                                                <Grid size={{ xs: 3 }}
                                                    sx={{ cursor: 'pointer' }}
                                                    className={(dateTemplate == 'Today') ? "filter-drawer-card-template-selected" : "filter-drawer-card-template"}>
                                                    <Button
                                                        type="button"
                                                        onClick={setTodaysDate} >
                                                        Today
                                                    </Button>
                                                </Grid>
                                                <Grid size={{ xs: 3 }}
                                                    sx={{ cursor: 'pointer' }}
                                                    className={(dateTemplate == 'Yesterday') ? "filter-drawer-card-template-selected" : "filter-drawer-card-template"}>
                                                    <Button
                                                        type="button"
                                                        onClick={setYesterDaysDate}>
                                                        Yesterday
                                                    </Button>
                                                </Grid>
                                                <Grid size={{ xs: 3 }}
                                                    sx={{ cursor: 'pointer' }}
                                                    className={(dateTemplate == 'This Week') ? "filter-drawer-card-template-selected" : "filter-drawer-card-template"}>
                                                    <Button
                                                        type="button"
                                                        onClick={setCurrentWeek}>
                                                        This week
                                                    </Button>
                                                </Grid>
                                                <Grid size={{ xs: 3 }}
                                                    sx={{ cursor: 'pointer' }}
                                                    className={(dateTemplate == 'This Month') ? "filter-drawer-card-template-selected" : "filter-drawer-card-template"}>
                                                    <Button
                                                        type="button"
                                                        onClick={setCurrentMonth}>
                                                        This month
                                                    </Button>
                                                </Grid>
                                                <Grid size={{ xs: 3 }}
                                                    sx={{ cursor: 'pointer' }}
                                                    className={(dateTemplate == 'Last Month') ? "filter-drawer-card-template-selected" : "filter-drawer-card-template"}>
                                                    <Button
                                                        type="button"
                                                        onClick={setLastMonth}>
                                                        Last month
                                                    </Button>
                                                </Grid>
                                                <Grid size={{ xs: 3 }}
                                                    sx={{ cursor: 'pointer' }}
                                                    className={(dateTemplate == 'This Year') ? "filter-drawer-card-template-selected" : "filter-drawer-card-template"}>
                                                    <Button
                                                        type="button"
                                                        onClick={setCurrentYear}>
                                                        This year
                                                    </Button>
                                                </Grid>
                                                <Grid size={{ xs: 3 }}
                                                    sx={{ cursor: 'pointer' }}
                                                    className={(dateTemplate == 'Last Year') ? "filter-drawer-card-template-selected" : "filter-drawer-card-template"}>
                                                    <Button
                                                        type="button"
                                                        onClick={setLastYear}>
                                                        Last year
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <hr className="seperator" ></hr>
                                        </Grid>
                                    )}
                                    {item.type === 'tiles' && (
                                        <Grid size={{ xs: 12 }} container spacing={1}>
                                            {item.options.map((option: any) => (
                                                <Grid size={{ xs: 3 }}
                                                    sx={{ cursor: 'pointer' }}
                                                    key={option.value}
                                                    className={selectedTile[item.fieldName] === option.value ? "filter-drawer-card-template-selected" : "filter-drawer-card-template"}>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleClick(item,option)}>
                                                        {option.label}
                                                    </Button>
                                                </Grid>

                                            ))}
                                        </Grid>
                                    )}
                                    {item.type === 'select' && (
                                        <Controller
                                            name={item.fieldName}
                                            control={control}
                                            defaultValue={item?.defaultValue}
                                            //  rules={{ required: false }}
                                            render={({ field }: any) => (
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel>{item.label}</InputLabel>
                                                    <Select
                                                        value={field.value}
                                                        className='search-input'
                                                        label={item?.label}
                                                        onChange={(e) => field.onChange(e.target.value)}>
                                                        {item?.options?.map((option: any) => (
                                                            <MenuItem
                                                                value={option?.value}
                                                            >{option?.label}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    )}
                                    {item.type === 'checkBox' && (
                                        <Grid container spacing={2}>
                                            <Grid >
                                                <Typography variant="subtitle1">{item.label}</Typography>
                                            </Grid>
                                            <Grid >
                                                <Controller
                                                    name={item.fieldName}
                                                    control={control}
                                                    defaultValue={[]}
                                                    render={({ field }) => (
                                                        <FormGroup row={true}>
                                                            {item?.data?.map((option: any, index: any) => (
                                                                <FormControlLabel
                                                                    key={index}
                                                                    control={
                                                                        <Checkbox
                                                                            id={`${option.name}-${option.value}`}
                                                                            checked={field.value.includes(option.value)}
                                                                            onChange={(e) => {
                                                                                const newValue = e.target.checked
                                                                                    ? [...field.value, option.value]
                                                                                    : field.value.filter((value: any) => value !== option.value);
                                                                                field.onChange(newValue);
                                                                            }}
                                                                        />
                                                                    }
                                                                    label={option.name}
                                                                />
                                                            ))}
                                                        </FormGroup>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                    {item.type === 'radio' && (
                                        <Grid container spacing={2}>
                                            <Grid >
                                                <Typography variant="subtitle1">{item.label}</Typography>
                                            </Grid>
                                            <Grid >
                                                <Controller
                                                    name={item.fieldName}
                                                    control={control}
                                                    defaultValue={item.defaultValue}
                                                    render={({ field }) => (
                                                        <>
                                                            <RadioGroup
                                                                {...field}
                                                                row
                                                                onChange={(e) => {
                                                                    field.onChange(e.target.value);
                                                                    handleRadioChange(e.target.value);
                                                                }}
                                                            >
                                                                {item?.data?.map((option: any, index: any) => (
                                                                    <FormControlLabel
                                                                        key={index}
                                                                        value={option.value}
                                                                        control={<Radio />}
                                                                        label={option.name}
                                                                    />
                                                                ))}
                                                            </RadioGroup>
                                                            {/* Move the date range picker outside of RadioGroup */}
                                                        </>
                                                    )}
                                                />
                                                {showDateRange && (
                                                    <Grid container spacing={2} style={{ marginTop: '16px' }}>
                                                        <Grid >
                                                            <Controller
                                                                name="from_date"
                                                                control={control}
                                                                defaultValue={null}
                                                                render={({ field }) => (
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                                                                        <DatePicker
                                                                            label="Start Date"
                                                                            value={field.value || null}
                                                                            onChange={(newValue) => {
                                                                                field.onChange(newValue);
                                                                            }}
                                                                            slotProps={{
                                                                                textField: {
                                                                                    fullWidth: true,
                                                                                },
                                                                            }} />
                                                                    </LocalizationProvider>
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid >
                                                            <Controller
                                                                name="to_date"
                                                                control={control}
                                                                defaultValue={null}
                                                                render={({ field }) => (
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <DatePicker
                                                                            label="End Date"
                                                                            value={field.value || null}
                                                                            onChange={(newValue) => {
                                                                                field.onChange(newValue);
                                                                            }}
                                                                            slotProps={{
                                                                                textField: {
                                                                                    fullWidth: true,
                                                                                },
                                                                            }}
                                                                        />
                                                                    </LocalizationProvider>
                                                                )}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    )}


                                </Grid>
                            ))}

                        </Grid>
                        <Grid container className="filter-drawer" justifyContent={"space-between"}>
                            <Grid >
                                <CustomButton
                                    className="filter-drawer-clear-button"
                                    label="Clear Filters"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={handleClear}
                                />
                            </Grid>
                            <Grid >
                                {/* <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                className="apply-button"
                            >
                                Apply Filters
                            </Button> */}
                                <CustomButton
                                    // className="custom-list-filter-submit-btn"
                                    className="filter-drawer-apply-button"
                                    type="submit"
                                    label="Apply Filters"
                                    variant="contained"
                                    size="large"
                                    disabled={isSubmitting}
                                    fullWidth
                                //onClick={handleApplyFilters}
                                />
                            </Grid>
                        </Grid>
                    </form>
                }
            />
        </>
    )
}