import CustomButton from "@/components/CustomButton/CustomButton";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import FileListModal from "@/components/FileUpload/FileListModal";
import useStore, { setNonPersistedDataById } from "@/Libs/store";
import routes from "@/router/routes";
import { validateEmail, validateRequiredField } from "@/Utils/Validation";
import { Badge, Button, Typography,IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import config from "../../../config.json";
import { useLocation } from "react-router-dom";
import {UplodIcon ,RemoveIcon} from "@/assets/svg";
import CloseIcon from '@mui/icons-material/Close';
interface userProps{
    NoNavigation?:boolean
    defaultValue?:any
    refreshUserRoles?: () => void; // Accept function as prop
    onSuccess?: (query: any, data: any) => void;
}
interface Role {
    value: number,
    label: string
}
type RoleList = {
    id: number;
    roleName: string;
    description: string;
    createdBy: string | null;
    createdOn: string;
    modifiedBy: string | null;
    modifiedOn: string;
};
interface CustomFile {
    id: string;
    name: string;
    sourcePath: string;
}
/**
* Component for creating new Company Users
*/
const CreateNewUsers:React.FC<userProps> = ({NoNavigation,defaultValue, refreshUserRoles,onSuccess}) => {
    const { data: role, eventId } = useLocation().state || '';
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const baseUrl = config.api.url;
    const companyId = sessionStorage.getItem('companyId');
    type FormData = {
        firstName: string,
        lastName: string,
        role: any,
        email: string,
        phone: string,
        assetId: string | number,
        designation: string,
        userDescription: string
    }
    /**
    * useEffect fetch full role list
    */
    useEffect(() => {
        getRoleList();
    }, [])
    const navigate = useNavigate();
    const POST = useStore((state: any) => state.POST);
    const setDataById = useStore((state: any) => state.setDataById);
    const { handleSubmit, control, reset, setValue, getValues } = useForm<FormData>();
    const [roleList, setRoleList] = useState<Role[]>([])
    /**
    * handle form submission 
    */
    const onSubmit = (data: FormData) => {
        createUser(data);
    }
    /**
    * get full role list 
    */
    const getRoleList = async () => {
        await POST({
            url: 'role/list',
            body: {
                "offset": 0,
                "limit": 100,
                "sortBy": "id",
                "sortDirection": "DESC",
            },
            id: 'user-role-list',
            successCB: (context: any) => {
                let roleData: Role[] = [];
                context.data.forEach((item: RoleList) => {
                    if (![1, 2, 3].includes(item.id)) {
                        roleData.push({
                            value: item.id,
                            label: item.roleName
                        });
                    }
                });
                setRoleList(roleData);
            },
            errorCB: (context: any) => {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
            }
        });
    }
    /**
    * handle create new user
    */
    const createUser = async (data: FormData) => {
        const companyId = sessionStorage.getItem('companyId');
        await POST({
            url: 'user',
            body: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                roleId: data.role,
                companyId: companyId,
                assetId: selectedFile?.id,
                designation: data.designation,
                userDescription: data.userDescription
            },
            id: 'create-admin-user',
            successCB: (context: any) => {
                if (context?.success) {
                    reset();
                    setNonPersistedDataById('craeteUserDrawer', { value: false })
                    setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: `Account Created Please check ${data.email}` });
                    getRoleList();
                   
                    onSuccess && onSuccess("", context?.data)

                    if(eventId){

                        const requestBody = {
                            userIds: [context.data?.token?.userId],
                            eventId: eventId,
                            companyId: companyId,
                        };

                        POST({
                            url: "user/assignEvent",
                            body: requestBody,
                            id: "createVolunteer",
                            successCB: (context: any) => {
                                if (context?.success) {

                                    setDataById("snackBarInfo", {
                                        open: true,
                                        autoHideDuration: 2000,
                                        severity: "success",
                                        message: "Volunteer Assign Successfully",
                                    });

                                    navigate(`/events/detail/${eventId}`, { state: { tabId: "2" } });

                                }
                            },
                            errorCB: () => {
                                setDataById("snackBarInfo", {
                                    open: true,
                                    autoHideDuration: 2000,
                                    severity: "error",
                                    message: "Error in assigning volunteer.",
                                });
                            },
                        });
                    }

                    NoNavigation ? null : navigate(routes.users());
                }
                //Call refreshUserRoles() if provided
                if (refreshUserRoles) {
                    refreshUserRoles();
               }
            },
            errorCB: (context: any) => {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
            }

        });
    };

    /**
    * Defaultly set the role value in the form state
    */
    useEffect(() => {
        if (role) {
            reset({
                ...getValues(),
                ...(role === "VOLUNTEER" && { role: 4 })
            });
        }
    }, []);

    /**
     *function to handle clean file state
     */
    const handleFileDelete = () => {
        setSelectedFile(null);
    };

    /**
      * Handle close create coupon drawer close
      */
    const closeDrawer = () => {
        setNonPersistedDataById('craeteUserDrawer', { value: false })
    }


    return <Grid container className='admin-users' spacing={2} >

        <Grid size={12} container >

            <Grid size={10}  >
                <Typography className="admin-users-header">Create New User</Typography>
            </Grid>
            <Grid size={2} justifyContent={"flex-end"} container className="admin-users-header-DrawerClose">
            
            
             <IconButton onClick={closeDrawer}>
                    <CloseIcon/>
                </IconButton>
            </Grid>
        </Grid>
        <Grid className="admin-users-form-wrap" container size={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid container display={"flex"} size={12} justifyContent={"space-between"} alignItems={"center"} spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 ,lg:12 }}>
                            <CustomTextField
                                placeholder="Full Name"
                                label="First Name"
                                control={control}
                                name="firstName"
                                type="text"
                                rules={{
                                    required: { value: true, message: "First Name is required" },
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: "First Name contains only alphabets"
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 ,lg:12}}>
                            <CustomTextField
                                placeholder="Last Name"
                                label="Last Name "
                                control={control}
                                name="lastName"
                                type="text"
                                rules={{
                                    required: { value: true, message: "Last Name is required" },
                                    pattern: {
                                        value:/^[A-Za-z\s]+$/,
                                        message: "Last Name contains only alphabets"
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container display={"flex"} size={12} justifyContent={"space-between"} alignItems={"center"}>
                        <Grid size={{ xs: 12, sm: 6}}>
                            <CustomTextField
                                control={control}
                                name="email"
                                placeholder="Email Address"
                                label={'Email Address'}
                                rules={{
                                    required: validateRequiredField({ fieldName: 'Email' }),
                                    pattern: validateEmail({}),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                control={control}
                                name="phone"
                                placeholder="Phone Number"
                                label="Phone Number"
                                type="phone"
                                isNumeric={true}
                                rules={{
                                    required: validateRequiredField({fieldName: 'Phone Number'}),
                                    //pattern: validatePhoneNumber({}),
                                    // maxLength: validateMaxLength({
                                    //     maxLength: 10,
                                    //     fieldName: 'Phone Number',
                                    // }),
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container display={"flex"} size={12} justifyContent={"space-between"} alignItems={"center"}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            {roleList.length > 0 && <CustomSelect
                                fullWidth
                                name="role"
                                control={control}
                                defaultValue={role ? 5 : defaultValue ? defaultValue : ''}
                                label="Role"
                                options={roleList}
                                rules={{ required: validateRequiredField({}) }}
                                disabled={defaultValue}
                            />}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                placeholder="Designation"
                                label="Designation "
                                control={control}
                                name="designation"
                                type="text"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                                placeholder="Description"
                                label="Description "
                                control={control}
                                name="userDescription"
                                type="text"
                                multiline={true}
                                rows={3}
                            />
                        </Grid>
                        {!selectedFile &&(
                        <Grid size={{ xs: 12, sm: 12,lg:12 }} onClick={() => setModalOpen(true)} className="admin-users-form-wrap-UploadLogo"   >
                            <Grid
                                className="create-event-btn-container"
                                container
                                justifyContent={"flex-start"}
                                size={{ xs: 12, sm: 12 }}
                                direction={'row'}
                            >
                                <Grid>
                                    {modalOpen && (
                                        <FileListModal
                                            open={modalOpen}
                                            handleClose={(e?: any) => {
                                                if (e) e.stopPropagation();
                                                setModalOpen(false);
                                              }}
                                            onSelectFile={(files: CustomFile[]) => {
                                                // Automatically select the newly uploaded file if it exists
                                                if (files && files.length > 0) {
                                                    setSelectedFile(files[0]); // Set only the first selected file
                                                    setValue('assetId', files[0]?.id);
                                                }
                                                setModalOpen(false);
                                            }}
                                            companyId={companyId}
                                            multipleSelect={false}
                                            imagesPerRow={4}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                           
                          
                           
                            <Grid  container size={12}justifyContent={"center"} >
                              
                             <Grid size={10} container spacing={0}>

                                  <Grid container size={12} justifyContent={"center"} alignItems={"center"} >
                                    <Button  className="admin-users-form-wrap-UploadLogo-icon" > <UplodIcon/></Button>
                                    </Grid>

                                   <Grid container size={12} justifyContent={"center"} alignItems={"center"}className="admin-users-form-wrap-UploadLogo-title">
                                      <Typography>Upload Logo</Typography>
                                   </Grid>

                                   <Grid container size={12} justifyContent={"center"} alignItems={"center"} className="admin-users-form-wrap-UploadLogo-info">
                                      <Typography>Choose a file to upload, Max file size: 5MB. Recommended ratio: 16:9 for best fit</Typography>
                                   </Grid>

                                </Grid>
                                
                            </Grid>
                          
                        </Grid>) }
                        {selectedFile && (
                            <Grid size={6} minHeight={"3.5rem"} className="admin-users-form-wrap-uplodedImg " >
                                < Badge

                                    badgeContent={<RemoveIcon onClick={() => { setModalOpen(false); handleFileDelete(); }} />}
                                    className="badge"
                                >  <Grid container size={8} >
                                        <Grid className="m-3" container size={4} >


                                            <img
                                                src={`${baseUrl}asset/${selectedFile.id}`}
                                                alt={selectedFile.name}
                                            /></Grid>
                                        <Grid size={6} container alignItems={"center"} className="pl-3">   <Typography className="admin-users-form-wrap-uplodedImg-name pl-3">{selectedFile.name}</Typography></Grid>

                                    </Grid>
                                </Badge>
                            </Grid>

                        )}

                    
                    </Grid>
                    <Grid container size={12} justifyContent={"flex-end"}> 
                          <CustomButton type="submit" className="admin-users-submit-btn-container-btn" label="Submit" />
                    </Grid>
                </Grid>
            </form>
        </Grid>
    </Grid>

}
export default CreateNewUsers;