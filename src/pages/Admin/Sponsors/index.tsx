import Box from '@mui/material/Box/Box'
import './sponsor.scss'
import { Avatar, FormLabel, IconButton, Typography } from '@mui/material'
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete'
import { useForm } from 'react-hook-form'
import CustomButton from '@/components/CustomButton/CustomButton'
import AddIcon from "@mui/icons-material/Add";
import CustomDrawer from '@/components/CustomDrawer/CustomDrawer'
import CloseIcon from '@mui/icons-material/Close';
import useStore, { POST, setDataById, setNonPersistedDataById, snackBar } from '@/Libs/store'
import CustomTextField from '@/components/CustomTextfield/CustomTextField'
import FileUpload from '@/components/FileUpload/FileUpload'
import { DataGridList } from '@/components/DataGrid/DataGridList'
import React, { useCallback, useEffect, useState } from 'react'
import { ISource } from '@/Libs/types/type'
import { NoEvent as NoEventIcon } from "@/assets/svg";
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import config from "../../../../config.json";
import { Delete, Edit } from '@mui/icons-material'
import Grid from '@mui/material/Grid2';
import SponsorDetailsModal from './SponsorDetailsModal'

/**
 * Component for Sponsors list,create,edit and delete
 */
const Sponsors = () => {


    const isModalOpen = useStore(state => state.nonPersistedData['createSponsorModalOpen']?.value)
    const isLoading = useStore(state => state.compData?.['createSponsor']?.['sponsor']?.loading) || false
    const sponsorResponseData = useStore(state => state.compData?.['sponsor-datagrid']) || {}
    const listData = sponsorResponseData?.data || []
    const sponsorId = useStore(state => state?.compData?.['sponsorId']?.value) || null;
    const isDeleteSponsorPending = useStore(state => state.compData?.['deleteSponsor']?.[`sponsor/delete/${sponsorId}`]?.loading) || false

    const sponsorDrawerType = useStore(state => state.nonPersistedData.sponsorDrawerType?.value)

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

    function handleOpenModal(type: 'create' | 'edit') {

        setNonPersistedDataById('sponsorDrawerType', { value: type })

        setNonPersistedDataById('createSponsorModalOpen', { value: true })

    }

    function handleFileUpload(file: any, key: 'logoId' | 'bannerId') {

        form.setValue(key, file?.id)
    }

    const columns = [
        { type: "default", field: "id", headerName: "ID", width: 100 },
        {
            type: "custom",
            field: "logo",
            headerName: "Logo",
            width: 150,

        },
        {
            type: "default",
            field: "name",
            headerName: "Name",
            width: 200,
        },
        {
            type: "default",
            field: "email",
            headerName: "Email",
            width: 210,
        },
        {
            type: "default",
            field: "phone",
            headerName: "Phone",
            width: 180,
        },
        {
            type: "dateField",
            field: "createdOn",
            headerName: "Created Date",
            width: 150,
            dateFormat: "DD/MM/YYYY",
        },
        {
            type: "custom",
            field: "edit",
            headerName: " ",
            width: 70,
        },
        {
            type: "custom",
            field: "delete",
            headerName: " ",
            width: 70,
        },

    ];

    useEffect(() => {
        eventList()
    }, [])



    // const limit

    const eventList = useCallback((filters?: any) => {
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



    // const navigate = useNavigate();

    /**
  * Row click navigation
  */
    const baseUrl = config.api.url;


    function handleClickEdit(e: React.MouseEvent, data: any) {
        e.preventDefault()
        e.stopPropagation()

        form.reset({
            name: data?.name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            website: data?.website || '',
            logoId: data?.logoAssetId || '',
            bannerId: data?.bannerImgAssetId || ''
        })
        handleOpenModal('edit')
    }



    const transformData = (data: any) => {
        const newData = data.map((item: any) => {
            return {
                id: item?.id,
                name: item?.name,
                email: item?.email,
                phone: item?.phone,
                website: item?.website,
                logo: <Avatar className='top-2' src={item?.logoAssetId ? `${baseUrl}/asset/${item?.logoAssetId}` : ''} >{item?.name?.slice(0, 2)}</Avatar>,
               
                delete: <IconButton disabled={isDeleteSponsorPending} onClick={(e) => handleClickDelete(e, item?.id)}>
                    <Delete />
                </IconButton>,
                edit: <IconButton disabled={isDeleteSponsorPending} onClick={(e) => handleClickEdit(e, item)}>
                    <Edit />
                </IconButton>,
                bannerUrl: `${baseUrl}/asset/${item?.bannerImgAssetId}`,
                bannerId: item?.bannerImgAssetId,
                logoId: item?.logoAssetId,
            }
        })
        return newData
    };



    const [source, setSource] = useState<ISource | undefined>(undefined);

    function handleClickDelete(e: React.MouseEvent, id: number) {
        e.preventDefault()
        e.stopPropagation()
        setDataById('sponsorId', { value: id })
        POST({
            url: `sponsor/delete/${id}`,
            id: 'deleteSponsor',
            successCB: () => {
                eventList();
                snackBar({ severity: 'success', message: 'Sponsor deleted successfully' })
            },
            errorCB: (error) => {
                snackBar({ severity: 'error', message: error?.message || 'something went wrong' })
            }
        })

    }

    function onRowClick(data: any) {

        setNonPersistedDataById('sponsorAdminDetails', {
            value: {
                name: data?.row?.name,
                email: data?.row?.email,
                phone: data?.row?.phone,
                website: data?.row?.website,
                logoUrl: data?.row?.logo?.props?.src,
                bannerUrl: data?.row?.bannerUrl,
                bannerId: data?.row?.bannerId,
                logoId: data?.row?.logoId

        } })

        setNonPersistedDataById('isAdminSponsorDetailsModalOpen', { value: true })

    }

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
            ...( sponsorDrawerType === "create" && {companyId: parseInt(companyId)}),
            ...(data.logoId && { logoAssetId: data.logoId }),
            ...(data.bannerId && { bannerImgAssetId: data.bannerId }),
            ...(website && { website })
        }



        POST({
            url: url, body: body, id: 'createSponsor', successCB: () => {

                form.reset();
                eventList();
                snackBar({ severity: 'success', message: 'Sponsor created successfully' })
                handleCloseModal();

            }, errorCB: (error) => {
                snackBar({ severity: 'error', message: error?.message || 'something went wrong' })
            }
        })
    }

    // const [selectedFile,setSelectedFile] = React.useState<any>(null);  

    return (
        <Grid container className="sponsor">
            <Grid size={12} className='title-filter-container'>
                <Typography className='title-filter-container-title'>Sponsors</Typography>
                <Box className='title-filter-container-filter-container'>
                    <Box className="auto-complete">
                        <CustomAutocomplete
                            name='sponsors'
                            className='auto-complete-input'
                            placeholder='search sponsors by name'
                            control={form.control} loading={false}
                            options={listData}
                            getOptionLabel={(option: any) => option?.name}
                            onSearch={(query: string) => { eventList({ name: query }) }}
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


            <Grid size={12} className="sponsor-datagrid">
                <DataGridList
                    dataTransformer={transformData}
                    source={source}
                    onRowClick={onRowClick}
                    title="Sponsor List"
                    hideFooterPagination={false}
                    columns={columns}
                    id="sponsor-datagrid"
                    key={'sponsor-list-datagrid'}

                    noRecordIcon={<NoEventIcon className="event-list-no-events-icon" />}
                    noRecordSubtitle="It looks like you haven't created any events yet.Start by setting up your first conference or meeting."

                />
            </Grid>


            <CustomDrawer className='sponsor-drawer' open={isModalOpen} type='right'>
                <Box className="sponsor-drawer-content">
                    <Box className="header-container">
                        <Typography className="header-container-label">Create new sponsor</Typography>
                        <IconButton onClick={handleCloseModal}>
                            <CloseIcon className='header-container-close' />
                        </IconButton>
                    </Box>

                    <Box>
                        <form className='form' onSubmit={form.handleSubmit(onSubmit)}>

                            <CustomTextField control={form.control} name='name' placeholder='Sponsor Name' />

                            <CustomTextField control={form.control} name='email' placeholder='Email' />
                            <CustomTextField control={form.control} name='phone' placeholder='Phone Number' />
                            <CustomTextField control={form.control} name='website' placeholder='(e.g., https://www.example.com)' label='Website Url' />

                            <Box className="form-file-upload">
                                <FormLabel className='form-file-upload-label'>Please upload the sponsor logo</FormLabel>
                                <FileUpload onFileSelect={() => { }} onSubmit={(file) => handleFileUpload(file, 'logoId')} className='form-file-upload-input' />
                            </Box>

                            <Box className="form-file-upload">
                                <FormLabel className='form-file-upload-label'>Please upload the sponsor banner</FormLabel>
                                <FileUpload onSubmit={(file) => handleFileUpload(file, 'bannerId')} className='form-file-upload-input' />
                            </Box>

                            <Box className="form-button-container">
                                <CustomButton isLoading={isLoading} disabled={isLoading} label='Submit' type='submit' />
                            </Box>

                        </form>
                    </Box>



                </Box>
            </CustomDrawer>
            <SponsorDetailsModal />
        </Grid>
    )
}

export default Sponsors


