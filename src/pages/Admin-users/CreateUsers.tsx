import CustomButton from "@/components/CustomButton/CustomButton";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { validateEmail, validateMaxLength, validatePhoneNumber, validateRequiredField } from "@/Utils/Validation";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";

const CreateNewUsers = () => {
    type FormData = {
        name: string,
        role: any,
        email: string,
        phone: string
    }
    const { handleSubmit, control } = useForm<FormData>();
    const onSubmit = () => {

    }
    const selectOptions = [
        { value: "volunteer", label: "Volunteer" },
        { value: 'member', label: 'Member' },
    ]
    return <Grid container className='admin-users'>
        <Grid size={12} >
            <Typography className="admin-users-header">Create New User</Typography>
        </Grid>
        <Grid className="admin-users-form-wrap">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container display={"flex"} size={12} justifyContent={"space-between"} spacing={2} alignItems={"center"}>
                    <Grid className="admin-users-form-gap" size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                            placeholder="Full Name"
                            label="Full Name "
                            control={control}
                            name="name"
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
                    <Grid className="admin-users-form-gap" size={{ xs: 12, sm: 6 }}>
                        <CustomSelect
                         fullWidth
                            name="role"
                            control={control}
                            label="Select Field Type"
                            options={selectOptions}
                            rules={{required:validateRequiredField({})}}
                        />
                    </Grid>
                </Grid>
                <Grid container display={"flex"} size={12} justifyContent={"space-between"} spacing={2} alignItems={"center"}>
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
                <Grid className="admin-users-submit-btn-container" display={"flex"}   size={12} justifyContent={"flex-end"}  alignItems={"center"} >                 
                    <CustomButton type="submit" className="admin-users-submit-btn-container-btn" label="Submit" />
                </Grid>
            </form>
        </Grid>
    </Grid>

}
export default CreateNewUsers;