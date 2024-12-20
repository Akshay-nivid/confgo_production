import CustomButton from "@/components/CustomButton/CustomButton";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import useStore from "@/Libs/store";
import routes from "@/router/routes";
import { validateEmail, validateMaxLength, validatePhoneNumber, validateRequiredField } from "@/Utils/Validation";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
/**
* Component for creating new Company Users
*/ 
const CreateNewUsers = () => {
    type FormData = {
        firstName: string,
        lastName: string,
        role: any,
        email: string,
        phone: string
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
    const { handleSubmit, control,reset } = useForm<FormData>();
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
                    if (![1,3,4].includes(item.id)) {
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
                lastName: data.firstName,
                email: data.email,
                phone: data.phone,
                roleId:data.role,
                companyId:companyId
            },
            id: 'create-admin-user',
            successCB: (context: any) => {
                if (context?.success) {
                    reset();
                    setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message:`Account Created Please check ${data.email}` });
                    navigate(routes.users());
                }
            },
            errorCB: (context: any) => {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
            }
        });
    };
    return <Grid container className='admin-users' spacing={2}>
        <Grid size={12} >
            <Typography className="admin-users-header">Create New User</Typography>
        </Grid>
        <div className="admin-users-form-wrap">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                <Grid container display={"flex"} size={12} justifyContent={"space-between"} alignItems={"center"} spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                            placeholder="Full Name"
                            label="first Name "
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
                    <Grid size={{ xs: 12, sm: 6 }}>
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
                    <Grid size={{ xs: 12, sm: 6 }}>
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
                            rules={{
                                required: validateRequiredField({
                                    fieldName: 'Phone Number',
                                }),
                                pattern: validatePhoneNumber({}),
                                maxLength: validateMaxLength({
                                    maxLength: 10,
                                    fieldName: 'Phone Number',
                                }),
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container display={"flex"} size={12} justifyContent={"space-between"} alignItems={"center"}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomSelect
                            fullWidth
                            name="role"
                            control={control}
                            label="Select Field Type"
                            options={roleList}
                            rules={{ required: validateRequiredField({}) }}
                        />
                    </Grid>
                </Grid>
                <Grid className="admin-users-submit-btn-container" display={"flex"} size={12} justifyContent={"flex-end"} alignItems={"center"} >
                    <CustomButton type="submit" className="admin-users-submit-btn-container-btn" label="Submit" />
                </Grid>
                </Grid>
            </form>
        </div>
    </Grid>

}
export default CreateNewUsers;