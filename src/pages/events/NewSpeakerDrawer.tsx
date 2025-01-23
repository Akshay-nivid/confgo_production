/** Component to create a new speaker User */
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import FileListModal from "@/components/FileUpload/FileListModal";
import useStore from "@/Libs/store";
import { validateEmail, validateRequiredField } from "@/Utils/Validation";
import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import config from "../../../config.json";
import { CloseOutlined } from "@mui/icons-material";
interface Role{
    value:number,
    label:string
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
    id: number;
    name: string;
    sourcePath: string;
  }
  interface NewSpeakerDrawerProps {
    onSuccess?: () => void;
    closeDrawer: () => void;
  }
/**
* Component for creating new Company Users
*/ 
const NewSpeakerDrawer :React.FC<NewSpeakerDrawerProps> = ({ onSuccess, closeDrawer}) =>{
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
        assetId:string|number
    }
    /**
    * useEffect fetch full role list
    */
    useEffect(() => {
        getRoleList();
    }, [])
    const POST = useStore((state: any) => state.POST);
    const setDataById = useStore((state: any) => state.setDataById);
    const { handleSubmit, control,setValue} = useForm<FormData>();
    const [roleList,setRoleList]=useState<Role []>([])
    /**
    * handle form submission 
    */
    const onSubmit = (data: FormData) => {
        createUser(data);
    }
    /**
    * get full role list 
    */
    const getRoleList=async ()=>{
        await POST({
            url:'role/list',
            body:{
                    "offset": 0,
                    "limit": 100,
                    "sortBy": "id",
                    "sortDirection": "DESC",
            },
            id:'user-role-list',
            successCB: (context: any) => {
                let roleData: Role[] = []; 
                context.data.forEach((item: RoleList) => {
                    if (![1,3].includes(item.id)) {
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
        const companyId=sessionStorage.getItem('companyId');
        await POST({
            url: 'user',
            body: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                roleId: roleList.find((item) => item.label === 'SPEAKER')?.value || null,
                companyId:companyId,
                assetId:selectedFile?.id
            },
            id: 'create-admin-user',
            successCB: (context: any) => { 
              setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: context?.message });
              onSuccess && onSuccess();
              closeDrawer();              
            },
            errorCB: (context: any) => {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:context?.message || "error creating speaker" });
            }
        });
    };

    /**
     *function to handle clean file state
     */
  const handleFileDelete = () => {
    setSelectedFile(null);
  };
    return <Grid container className='add-program-drawer' spacing={2}>
      <Grid
        size={{ xs: 12 }}
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography className="add-program-drawer-heading">
          Create New Speaker
        </Typography>
        <IconButton onClick={closeDrawer}>
          <CloseOutlined />
        </IconButton>
      </Grid>
        <div className="admin-users-form-wrap">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                <Grid container display={"flex"} size={12} justifyContent={"space-between"} alignItems={"center"} spacing={2}>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                            placeholder="Full Name"
                            label="First Name "
                            control={control}
                            name="firstName"
                            type="text"
                            rules={{
                                required: { value: true, message: "Name is required" },
                                pattern: {
                                    value: /^(?!\s*$)(?!\s+$).+/,
                                    message: "Name cannot be only spaces"
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                            placeholder="Last Name"
                            label="Last Name "
                            control={control}
                            name="lastName"
                            type="text"
                            rules={{
                                required: { value: true, message: "Name is required" },
                                pattern: {
                                    value: /^(?!\s*$)(?!\s+$).+/,
                                    message: "Name cannot be only spaces"
                                },
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container display={"flex"} size={12} justifyContent={"space-between"} alignItems={"center"}>
                    <Grid size={{ xs: 12, sm: 12 }}>
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
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                            control={control}
                            name="phone"
                            placeholder="Phone Number"
                            label="Phone Number"
                            type="phone"
                            rules={{
                                required: validateRequiredField({
                                    fieldName: 'Phone Number',
                                }),
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container display={"flex"} size={12} justifyContent={"space-between"} alignItems={"center"}>
                    <Grid size={{xs:12,sm:12}}>
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
                                handleClose={() => setModalOpen(false)}
                                onSelectFile={(files: CustomFile[]) => {
                                  // Automatically select the newly uploaded file if it exists
                                  if (files && files.length > 0) {
                                    setSelectedFile(files[0]); // Set only the first selected file
                                    setValue('assetId',files[0]?.id);
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
                            <Grid container direction={'row'} alignItems={'center'} justifyContent={"center"} alignContent={"center"}>
                                {selectedFile && (
                                    <Grid className="create-event-btn-container-img-box" >
                                        <img
                                            src={`${baseUrl}asset/${selectedFile.id}`}
                                            alt={selectedFile.name}
                                        />
                                    </Grid>
                                )}
                                <CustomButton
                                    className="create-event-btn-container-select-btn"
                                    label={selectedFile ? "Change Avathar " : "Choose Avathar"}
                                    variant="outlined"
                                    onClick={() => setModalOpen(true)}
                                />
                                {selectedFile && (<Grid container spacing={1}>
                                    <CustomButton
                                        className="create-event-btn-container-delete-btn"
                                        label="Delete"
                                        variant="outlined"
                                        onClick={handleFileDelete}
                                    />
                                </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                <Grid className="admin-users-submit-btn-container" display={"flex"} size={12} justifyContent={"center"} alignItems={"center"} >
                    <CustomButton type="submit" className="admin-users-submit-btn-container-btn" label="Submit" />
                </Grid>
                </Grid>
            </form>
        </div>
    </Grid>

}
export default NewSpeakerDrawer;