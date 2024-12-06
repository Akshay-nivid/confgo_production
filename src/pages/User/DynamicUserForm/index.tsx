import { useForm } from "react-hook-form";
import { CardContent, Typography, Box, Chip, Backdrop, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import useStore, { clearDataById, IStoreState, POST } from "@/Libs/store";
import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker";
import FileUpload from "@/components/FileUpload/FileUpload";
import { Navigate, useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomActionModal from "@/components/CustomActionModal/CustomActionModal";
import { useState } from "react";

interface Option {
  value: string;
}

interface Metadata {
  title: string;
  fieldType: string;
  required: string[];
  option?: Option[];
  id: string;
}

interface FormField {
  id: number;
  eventId: number;
  name: string;
  participantTypeId: number;
  metadata: Metadata;
}


/**
 * DynamicUserForm is a React component that renders a dynamic form based on the form
 * fields provided in the API response. It uses the react-hook-form library to handle
 * form submissions and provide form validation. The form fields can be of different
 * types such as text, number, email, file, select, radio, checkbox, date, and address.
 * The component also provides a file upload feature and a delete feature for the
 * uploaded files.
 * @return {JSX.Element} A JSX element representing the dynamic form
 */
const DynamicUserForm = () => {

  const { control, handleSubmit } = useForm();

  const setDataById = useStore((state: IStoreState) => state.setDataById);

  const dynamicFormData = useStore((state: IStoreState) => state?.compData?.["dynamicFormData"]) ?? [];

  const uploadedFiles = useStore((state: IStoreState) => state?.compData?.["uploadedFiles"]) ?? [];

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formSubmissionLoading = useStore((state: IStoreState) => state?.compData?.["registrationRecord"]?.registrationRecord?.loading) ?? false

  const eventId = useStore((state: IStoreState) => state?.compData?.["eventSelected"]?.id) ?? null;

  const dynamicFormLoading = useStore((state: IStoreState) => state?.compData?.["dynamicFormData"]?.[`event/form/${eventId}`]?.loading) ?? false

  const participantTypeId = useStore((state: IStoreState) => state?.compData?.participantTypeId?.value) ?? null;

  const previousRoute = useStore((state: IStoreState) => state?.compData?.["previousRoute"]?.url) ?? null

  const filteredFormData = dynamicFormData?.data?.filter((item: FormField) => item.participantTypeId === participantTypeId) ?? []


  /**
   * Closes the modal
   */
  function handleCloseModal() {
    setIsModalOpen(false);
  }



  /**
   * Navigates to the user payment method page
   */
  function handleSkipForm() {
    navigate(routes.userPaymentMethod())
  }

  /**
   * 
   * fucntion to handle form submition
   * @param data :form data
   * 
   * 
   */
  const handleFormSubmit = (data: any) => {


    if (formSubmissionLoading) return

    const formData = Object.entries(data).map(([key, value]: [string, any]) => {

      if (value === undefined || value === null || value === "") {
        return null

      }

      const [fieldName, id, fieldType] = key.split("_");


      return {

        eventRegistrationFormId: id,
        response: JSON.stringify({ [fieldName]: value, fieldType: fieldType })

      }
    })

    const uploadedFileData = Object.entries(uploadedFiles).map(([key, value]: [string, any]) => {

      if (value.length === 0) return


      const [fieldName, id, fieldType] = key.split("_");

      return {

        eventRegistrationFormId: id,
        response: JSON.stringify({ [fieldName]: value, fieldType: fieldType })

      }
    })


    if ((formData.length === 0 || formData[0] === undefined) && uploadedFileData.length === 0) {
      setIsModalOpen(true)
      return;
    }

    const filteredFormData = formData.filter(item => item !== null)

    if (filteredFormData.length === 0 && uploadedFileData.length === 0) {
      setIsModalOpen(true)
      return;
    }

    const body = {
      eventId: eventId,
      data: [...filteredFormData, ...uploadedFileData]
    }




    POST({

      url: 'registrationRecord',
      body: body,
      id: 'registrationRecord',
      successCB: () => {
        clearDataById('uploadedFiles')
        navigate(routes.userPaymentMethod())
      },
      errorCB: (error: any) => {

        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: error?.message,

        })
      }
    })
    return formData
  };



  /**
   * Handles a file upload event. Adds the uploaded file to the uploadedFiles store, which is keyed by the id of the form element.
   * @param file - The file that was uploaded.
   * @param id - The id of the form element.
   */
  function handleFileUpload(file: any, id: string) {

    setDataById("uploadedFiles", { [id]: uploadedFiles[id] ? [...uploadedFiles[id], file] : [file] })

  }

  /**
   * Deletes a file from the uploadedFiles store based on the itemId and parentId.
   * @param {string} itemId - The id of the file to be deleted.
   * @param {string} parentId - The id of the form element.
   */
  function handleDeleteFile(itemId: string, parentId: string) {



    const updatedFiles = uploadedFiles[parentId].filter((item: any) => item.id !== itemId)

    setDataById("uploadedFiles", { [parentId]: updatedFiles })
  }

  /**
   * This function renders a form field based on the field type provided in the
   * metadata of the form field.
   * 
   * @param field - The form field object that contains information about the field
   * @returns A JSX element representing a form field
   */
  const renderFormField = (field: FormField) => {

    const { id, metadata } = field;
    const isRequired = metadata.required;

    const commonProps = {
      control,
      name: metadata.title + "_" + id.toString() + "_" + metadata.fieldType,
      label: metadata.title.charAt(0).toUpperCase() + metadata.title.slice(1),
      placeholder:
        metadata.title.charAt(0).toUpperCase() + metadata.title.slice(1),
      rules: isRequired
        ? { required: `${metadata.title} is required` }
        : undefined,
    };

    switch (metadata.fieldType) {

      case "text":
        return <CustomTextField  {...commonProps} type="text" size="medium" />;

      case "number":
        return <CustomTextField {...commonProps} type="number" size="medium" />;

      case "email":
        return <CustomTextField {...commonProps} type="email" size="medium" />;

      case "file":
        return (
          <>
            <Grid className="file-upload-wrapper" size={12} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              <FileUpload resolution={{ width: 150, height: 150 }} onSubmit={(data) => handleFileUpload(data, commonProps.name)} className="dynamic-file-upload" height={"max-content"} />
              <Box paddingInline={3} display={"flex"} columnGap={1} rowGap={1} flexWrap={"wrap"}>


                {
                  (uploadedFiles[commonProps.name] && uploadedFiles[commonProps.name].length > 0) && uploadedFiles[commonProps.name].map((item: any) => {
                    return (
                      <Chip onDelete={() => {
                        handleDeleteFile(item.id, commonProps.name)
                      }} label={item.name} />
                    )
                  })
                }
              </Box>
            </Grid >
          </>
        )
      case "select":
        return (
          <CustomSelect
            defaultValue={""}
            {...commonProps}
            options={
              metadata.option?.map((opt) => ({
                value: opt.value,
                label: opt.value,
              })) || []
            }
            size="medium"
          />
        );

      case "radio":
        return (
          <CustomRadio
            {...commonProps}
            options={
              metadata.option?.map((opt) => ({
                value: opt.value,
                label: opt.value,
              })) || []
            }
            row
          />
        );

      case "checkbox":
        return (
          <CustomCheckbox
            {...commonProps}
            options={
              metadata.option?.map((opt) => ({
                value: opt.value,
                label: opt.value,
                checked: false,
              })) || []
            }
            row
          />
        )

      case "date":
        return <CustomDatePicker {...commonProps} label={metadata.title} />;

      case "address":
        return (
          <Grid container spacing={4}>
            {metadata.option?.map((opt) => (
              <Grid size={12} key={opt.value}>
                <CustomTextField
                  control={control}
                  name={`${opt.value}_${id}`}
                  label={opt.value}
                  placeholder={opt.value}
                  type="text"
                  size="medium"
                  rules={
                    isRequired
                      ? { required: `${opt.value} is required` }
                      : undefined
                  }
                />
              </Grid>
            ))}
          </Grid>
        );

      default:
        return null;
    }
  };




  if (dynamicFormLoading) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }



  if (filteredFormData.length === 0) {

    const routeToNavigate = previousRoute === routes.userPaymentMethod() ? routes.selectedPrograms() : routes.userPaymentMethod();

    return <Navigate to={routeToNavigate} />

  }



  return (
    <Box className="dynamic-form">
      <CardContent>
        <Typography textAlign={"center"} paddingBottom={2} className="dynamic-form-header">
          Event Registration Form
        </Typography>
        <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={4}>
            {filteredFormData.map((field: FormField) => (
              <Grid container size={12} key={field.id}>
                {renderFormField(field)}
              </Grid>
            ))}
            <Grid
              size={12}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box className="navigation-button-container">
                <CustomButton
                  color="primary"
                  variant="outlined"
                  className="back-button"
                  label="Back"
                  onClick={() => routes.selectedPrograms()}
                />
                <CustomButton isLoading={formSubmissionLoading} className={"next-button"} label="Next" type="submit" />
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <CustomActionModal submitLabel="Skip" cancelLabel="Cancel" modalClassName="dynamic-form-modal" cancelAction={handleCloseModal} onClose={handleCloseModal} open={isModalOpen} submitAction={handleSkipForm} header="Are you sure you want to skip this form?" subHeader="This form is not mandotory you can skip the form if you want to" />
    </Box>
  );
};

export default DynamicUserForm;






