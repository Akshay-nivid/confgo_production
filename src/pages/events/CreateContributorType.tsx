import CustomButton from "@/components/CustomButton/CustomButton";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { useParams } from "react-router-dom";

type FormData = {
  name: string;
};
interface createAddonProps {
  closeDrawer: () => void;
  submitHandler: () => void;
}

/**
 * Component for creating a new contributor type.
 */
const CreateContributorType: React.FC<createAddonProps> = React.memo(
  ({ closeDrawer, submitHandler }: createAddonProps) => {
    const { handleSubmit, control } = useForm<FormData>({});
    const POST = useStore((state: any) => state.POST);
    const setDataById = useStore((state: any) => state.setDataById);
    const { id } = useParams();
    /**
     * Method to handle form submission
     */
    const onSubmit = (data: any) => {
      data && handleCreateContributorType(data);
    };

    /**
     * Handles the creation of a new contributor type.
     * @param formData.
     */
    const handleCreateContributorType = async (formData: FormData) => {
      try {
        const requestBody = {
          name: formData?.name,
          eventId: id,
          isContributor: 1,
        };
        await POST({
          url: "/participant/type",
          body: requestBody,
          successCB: () => {
            submitHandler();
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "success",
              message: "New Type Created",
            });
            closeDrawer();
          },
          errorCB: (error: any) => {
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "error",
              message: error.message,
            });
          },
        });
      } catch (error) {
        Logger.error(error, "CreteContributorType.tsx");
      }
    };
    return (
      <>
        <Grid className="add-on-create" container spacing={2}>
          <Grid container display={"flex"} justifyContent={"space-between"} size={12}>
            <Typography className="add-on-create-header">Create New Contributor Type </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid flexDirection={"column"} size={12} spacing={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid className="add-on-create-form-wrap">
                <CustomTextField placeholder="Contributor Type name" name="name" control={control} />
              </Grid>
              <Grid container spacing={2} justifyContent={"flex-end"}>
                <CustomButton className="add-on-create-btn" label="Submit" type="submit" />
              </Grid>
            </form>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default CreateContributorType;
