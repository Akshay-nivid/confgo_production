import Box from '@mui/material/Box/Box'
import './sponsor.scss'
import { Avatar, FormLabel, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete'
import { useForm } from 'react-hook-form'
import CustomButton from '@/components/CustomButton/CustomButton'
import AddIcon from "@mui/icons-material/Add";
import CustomDrawer from '@/components/CustomDrawer/CustomDrawer'
import CloseIcon from "../../../assets/svg/Close.svg"
import useStore, { POST, setNonPersistedDataById, snackBar } from '@/Libs/store'
import CustomTextField from '@/components/CustomTextfield/CustomTextField'
import FileUpload from '@/components/FileUpload/FileUpload'
import { DataGridList } from '@/components/DataGrid/DataGridList'
import React, { useCallback, useEffect, useState } from 'react'
import { ISource } from '@/Libs/types/type'
import { NewDrawerClose } from "@/assets/svg";
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import config from "../../../../config.json";
import Grid from '@mui/material/Grid2';
import SponsorDetailsModal from './SponsorDetailsModal'
import clsx from 'clsx'
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@/assets/svg/DeleteIcon.svg";
import { SponsorNoData } from '@/assets/svg';

/**
 * Component for Sponsors list,create,edit and delete
 */
const Sponsors = () => {


    const isModalOpen = useStore(state => state.nonPersistedData['createSponsorModalOpen']?.value)
    const isLoading = useStore(state => state.compData?.['createSponsor']?.['sponsor']?.loading) || false
    const sponsorResponseData = useStore(state => state.compData?.['sponsor-datagrid']) || {}
    const listData = sponsorResponseData?.data || []
    // const sponsorId = useStore(state => state?.compData?.['sponsorId']?.value) || null;
    const sponsorId = useStore(state=>state.nonPersistedData.sponsorId?.value)
    const sponsorDrawerType = useStore(state => state.nonPersistedData.sponsorDrawerType?.value)
    const isEditSponsorLoading = useStore(state => state.compData?.['createSponsor']?.[`sponsor/edit/${sponsorId}`]?.loading) || false
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [rowData, setRowData] = useState<number | null>(null);

    const schema = z.object({
        name: z.string({ message: "Name is required" }).min(3, { message: "Name is required" }),
        email: z.string({ message: "Email is required" }).email({ message: "Please enter a valid email" }),
        phone: z.string({ message: "Phone is required" }).regex(/^\+?[0-9\s\-()]+$/, {
            message: "Please enter a valid phone number",
        }),
        website: z.string().optional(),
        logoId: z.union([z.string(), z.number()]).optional(),
        bannerId: z.union([z.string(), z.number()]).optional(),
    })


    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            website: '',
            logoId: '',
            bannerId: ''
        },
        resolver: zodResolver(schema),
        reValidateMode: "onChange",
    })




    /**
     * Resets the form and sets the createSponsorModalOpen and sponsorDrawerType 
     * to false and null respectively, which closes the modal.
     */
    function handleCloseModal() {
        form.reset({
            name: '',
            email: '',
            phone: '',
            website: '',
            logoId: '',
            bannerId: ''
        });
        setNonPersistedDataById('createSponsorModalOpen', { value: false })
        setNonPersistedDataById('sponsorDrawerType', { value: null })
    }

    /**
     * Opens the create/edit sponsor modal based on the type provided as argument
     * @param type - 'create' or 'edit'
     */
    function handleOpenModal(type: 'create' | 'edit') {

        setNonPersistedDataById('sponsorDrawerType', { value: type })

        setNonPersistedDataById('createSponsorModalOpen', { value: true })

    }

    /**
     * Handles the file upload and sets the value of the form field.
     * @param file - The file object to be uploaded.
     * @param key - The key of the form field to set, either 'logoId' or 'bannerId'.
     */

    function handleFileUpload(file: any, key: 'logoId' | 'bannerId') {

        form.setValue(key, file?.id)
    }

    const columns = [
        { type: "default", field: "id", headerName: "ID", width: 80 },
        {
            type: "custom",
            field: "logo",
            headerName: "Logo",
            width: 130,

        },
        {
            type: "custom",
            field: "name",
            headerName: "Name",
            width: 150,
        },
        {
            type: "custom",
            field: "email",
            headerName: "Email",
            width: 150,
        },
        {
            type: "default",
            field: "phone",
            headerName: "Phone",
            width: 150,
        },
        {
            type: "dateField",
            field: "createdOn",
            headerName: "Created Date",
            width: 150,
            dateFormat: "DD/MM/YYYY",
        },
        { type: "custom", field: "actions", headerName: "", width: 150 },

    ];

    useEffect(() => {
        sponsorList()
    }, [])



    /**
     * fucntion to set source for fetching sponsor list
     */
    const sponsorList = useCallback((filters?: any) => {
        const req = {
            offset: 0,
            limit: sponsorResponseData?.pagination?.limit,
            sortBy: "id",
            sortDirection: "DESC",
            filters: filters,
        };

        setSource({
            method: "POST",
            data: req,
            url: `sponsor/list`,
            listName: "sponsorList",

        });
        return;
    }, []);




    const baseUrl = config.api.url;


/**
 * Handles the click event for editing a sponsor.
 * Prevents the default action and propagation of the event.
 * Sets the sponsor ID in non-persisted data and resets the form with the sponsor's data.
 * Opens the modal in edit mode.
 *
 * @param {React.MouseEvent} e - The click event.
 * @param {any} data - The data object containing sponsor details.
 */

    function handleClickEdit(e: React.MouseEvent, data: any) {
        e.preventDefault()
        e.stopPropagation()


        setNonPersistedDataById('sponsorId', { value: data?.id })

        form.reset({
            name: data?.name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            website: data?.website || '',
            logoId: data?.logoAssetId || '',
            bannerId: data?.bannerImgAssetId || ''
        })
        handleOpenModal('edit')
        handleMenuClose();
    }

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        userId: number,
        item: any
    ) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setCurrentUserId(userId);
        setRowData(item);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentUserId(null);
        setRowData(null);
      };



    /**
     * Transforms the raw API response data into the format required by the DataGrid.
     * @function transformData
     * @param {any} data - The raw data from the API response.
     * @returns {Array} Transformed data for the DataGrid.
     */
    const transformData = (data: any): Array<any> => {
        const newData = data.map((item: any) => {
            return {
                id: item?.id,
                name: item?.name,
                email: item?.email,
                createdOn: item?.createdOn,
                modifiedOn: item?.modifiedOn,
                phone: item?.phone,
                website: item?.website,
                logo: <Avatar className='top-2' src={item?.logoAssetId ? `${baseUrl}/asset/${item?.logoAssetId}` : ''} >{item?.name?.slice(0, 2)}</Avatar>,

                actions: (
                    <IconButton onClick={(e) => handleMenuOpen(e, item.id, item)}>
                      <MoreHorizIcon />
                    </IconButton>
                  ),
                bannerUrl: `${baseUrl}/asset/${item?.bannerImgAssetId}`,
                bannerId: item?.bannerImgAssetId,
                logoId: item?.logoAssetId,
            }
        })
        return newData
    };



    const [source, setSource] = useState<ISource | undefined>(undefined);

    /**
     * Handles the click event for deleting a sponsor.
     * Prevents the default action and propagation of the event.
     * Sets the sponsor ID in non-persisted data and sends a request to delete the sponsor.
     * If the request is successful, it reloads the sponsor list and shows a success message.
     * If the request fails, it shows an error message.
     * @function handleClickDelete
     * @param {React.MouseEvent} e - The click event.
     * @param {number} id - The sponsor ID to be deleted.
     */
    function handleClickDelete(e: React.MouseEvent, id: number) {
        e.preventDefault()
        e.stopPropagation()
        setNonPersistedDataById('sponsorId', { value: id })
        POST({
            url: `sponsor/delete/${id}`,
            id: 'deleteSponsor',
            successCB: () => {
                sponsorList();
                snackBar({ severity: 'success', message: 'Sponsor deleted successfully' })
            },
            errorCB: (error) => {
                snackBar({ severity: 'error', message: error?.message || 'something went wrong' })
            }
        })
        handleMenuClose();
    }

    /**
     * Handles the row click event for the sponsor list.
     * Sets the sponsor details into the non-persisted state and opens the sponsor details modal.
     * 
     * @param {any} data - The data of the clicked row, which contains sponsor information.
     */

    function onRowClick(data: any) {

        if (!anchorEl) {
            setNonPersistedDataById('sponsorAdminDetails', {
                value: {
                    name: data?.row?.name,
                    email: data?.row?.email,
                    phone: data?.row?.phone,
                    website: data?.row?.website,
                    createdOn: data?.row?.createdOn,
                    modifiedOn: data?.row?.modifiedOn,
                    logoUrl: data?.row?.logo?.props?.src,
                    bannerUrl: data?.row?.bannerUrl,
                    bannerId: data?.row?.bannerId,
                    logoId: data?.row?.logoId

                }
            })

            setNonPersistedDataById('isAdminSponsorDetailsModalOpen', { value: true })
        }
    }

    /**
     * Handles the submit event for the sponsor form.
     * Validates the website URL, constructs the form data and sends a POST request to create or update a sponsor.
     * 
     * @param {any} data - The data of the form, which contains sponsor information.
     */
    function onSubmit(data: any) {

        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        const website = data?.website?.trim();

        if (website) {
            const isUrlValid = urlRegex.test(website);
            if (!isUrlValid) {
                form.setError('website', { message: 'Please enter a valid URL' });
                return;
            }
        } else {
            form.clearErrors('website');
        }

        const companyId = sessionStorage.getItem('companyId') || '';


        const url = sponsorDrawerType === "create" ? 'sponsor' : `sponsor/update/${sponsorId}`


        const body = {
            name: data.name,

            email: data.email,
            phone: data.phone,
            ...(sponsorDrawerType === "create" && { companyId: parseInt(companyId) }),
            ...(data.logoId && { logoAssetId: data.logoId }),
            ...(data.bannerId && { bannerImgAssetId: data.bannerId }),
            ...(website && { website })
        }



        POST({
            url: url, body: body, id: 'createSponsor', successCB: () => {

                form.reset();
                sponsorList();
                snackBar({ severity: 'success', message: 'Sponsor created successfully' })
                handleCloseModal();

            }, errorCB: (error) => {
                snackBar({ severity: 'error', message: error?.message || 'something went wrong' })
            }
        })
    }


    /**
     * Handles removing the logo or banner image from the sponsor form.
     * @param {React.MouseEvent} e The event that triggered the function.
     * @param {'logoId' | 'bannerId'} type The type of image to remove.
     */
    function handleRemoveImage(e: React.MouseEvent, type: 'logoId' | 'bannerId') {
        e.preventDefault()
        e.stopPropagation()
        form.setValue(type, '')
    }


    const bannerId = form.watch('bannerId')
    const logoId = form.watch('logoId')

    return (
        <Grid container  className="sponsor">
            <Grid size={12} className='title-filter-container'>
                <Typography className='title-filter-container-title'>Sponsors</Typography>
                <Box className='title-filter-container-filter-container'>
                    <Box className="auto-complete">
                        <CustomAutocomplete
                            name='sponsors'
                            className='auto-complete-input textfield-border'
                            placeholder='search sponsors by name'
                            control={form.control} loading={false}
                            options={listData}
                            getOptionLabel={(option: any) => option?.name}
                            onSearch={(query: string) => { sponsorList({ name: query }) }}
                            onChange={() => { }}
                            clearable={false}

                        />
                    </Box>
                    {/* <Box className="filter-button">
                    <Filter datagridId='coupon-datagrid filter-button' fields={filterFields} />
                    </Box> */}
                    <Box className="button-container">
                        <CustomButton
                            onClick={() => handleOpenModal('create')}
                            className="create-coupon-create-btn"
                            label="Create New Sponsor"
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                        />
                    </Box>
                </Box>
            </Grid>


            <Grid size={12} className="sponsor-datagrid mt-8">
            <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
        >
          <MenuItem onClick={(e) => handleClickEdit(e, rowData)}>
          <img src="/src/assets/png/writing.png" alt="Edit" className="action-icon" />
            <Typography className="action-text">Edit</Typography>
          </MenuItem>
          <MenuItem onClick={(e) => {
          if (currentUserId !== null) {
             handleClickDelete(e, currentUserId); 
           }
           }}>

            <DeleteIcon className="action-icon" />
            <Typography className="action-text">Delete</Typography>
          </MenuItem>
        </Menu>
                <DataGridList
                    
                    dataTransformer={transformData}
                    source={source}
                    onRowClick={onRowClick}
                    title="Sponsor List"
                    hideFooterPagination={false}
                    columns={columns}
                    id="sponsor-datagrid"
                    key={'sponsor-list-datagrid'}

                    noRecordIcon={
                     <SponsorNoData />
                    }
                noRecordTitle="No Sponsors Yet"
                    noRecordSubtitle="Add sponsors to showcase their support and enhance your event’s visibility. Start building valuable partnerships now."


                />
            </Grid>


            <CustomDrawer className='sponsor-drawer' open={isModalOpen} type='right' >
                <Box className="sponsor-drawer-content">
                    <Box className="header-container">
                        <Typography className="header-container-label"> {sponsorDrawerType === "edit" ? "Edit Sponsor" : "Create new sponsor"}</Typography>
                        <Grid onClick={handleCloseModal}className='header-container-close'>
                            
                            <NewDrawerClose  />

                        </Grid>
                    </Box>

                    <Box>
                        <form className='form' onSubmit={form.handleSubmit(onSubmit)}>

                            <CustomTextField control={form.control} name='name' placeholder='Sponsor Name' />

                            <CustomTextField control={form.control} name='email' placeholder='Email' />
                            <CustomTextField control={form.control}  isNumeric={true} name='phone' placeholder='Phone Number' />
                            <CustomTextField control={form.control} name='website' placeholder='(e.g.: https://www.example.com)' label='Website Url' />

                            <Box className="form-file-upload ">
                                <FormLabel className={clsx('form-file-upload-label',logoId && 'mb-5')}>{logoId ? 'Sponsor Logo' : 'Please upload the sponsor logo'}</FormLabel>
                                {logoId ? (
                                <Box className="form-file-upload-image-logo" >
                                    <Box className='relative w-max flex gap-x-1'>
                                        <img src={`${baseUrl}/asset/${logoId}`} alt='' />
                                         <IconButton onClick={(e) => handleRemoveImage(e, 'logoId')} className='form-file-upload-image-logo-close'>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                ) :
                                ( <FileUpload onFileSelect={() => { }} onSubmit={(file) => handleFileUpload(file, 'logoId')} className='form-file-upload-input' /> )}   
                            </Box>

                            <Box className="form-file-upload">
                                <FormLabel className={clsx('form-file-upload-label')}>{ bannerId ? 'Sponsor Banner' : 'Please upload the sponsor banner'}</FormLabel>
                                { bannerId ? (
                                <Box className={clsx("form-file-upload-image-banner")} >
                                    <Box className={clsx('relative w-max flex gap-x-1')}>
                                        <img src={`${baseUrl}/asset/${bannerId}`} alt='' />
                                        <IconButton onClick={(e) => handleRemoveImage(e, 'bannerId')} className='form-file-upload-image-logo-close'>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                ) :
                                ( <FileUpload onSubmit={(file) => handleFileUpload(file, 'bannerId')} className='form-file-upload-input' maxSize={3}/> )}
                            </Box>

                            <Box className="form-button-container">
                                <CustomButton isLoading={isLoading || isEditSponsorLoading} disabled={isLoading || isEditSponsorLoading} label='Submit' type='submit' />
                            </Box>

                        </form>
                    </Box>



                </Box>
            </CustomDrawer>
            <SponsorDetailsModal className='sponsor-details-modal'/>
        </Grid>
    )
}

export default Sponsors


