import { useForm } from "react-hook-form";
import { CardContent, Button, Typography, Box, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import useStore, { clearDataById, POST } from "@/Libs/store";
import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker";
import FileUpload from "@/components/FileUpload/FileUpload";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";

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
  const setDataById = useStore((state) => state.setDataById);
  const eventId = useStore((state: any) => state?.compData?.["eventSelected"]?.id) ?? null;

  const dynamicFormData = useStore((state: any) => state?.compData?.["dynamicFormData"]) ?? [];
  const uploadedFiles = useStore((state: any) => state?.compData?.["uploadedFiles"]) ?? [];
  const navigate = useNavigate();



  /**
   * function to get custom form data from api
   *  
   * */

//   useEffect(() => {
// /**
//  * Fetches dynamic form data from the API and processes the response.
//  * On success, it parses the response data, converts metadata to JSON,
//  * and stores it in the state under "dynamicFormData".
//  * On failure, it updates the state with an error message to display in a snackbar.
//  */
//     const fetchDynamicFormData = async () => {
//       const response = await apiClient.get("event/form/7");
//       const { status, data, message } = processAPIResponse(
//         response,
//         "eventForm"
//       );

//       if (status) {
//         const parsedData = data?.map((item: any) => {
//           return {
//             ...item,
//             metadata: JSON.parse(item.metadata),
//           };
//         });

//         setDataById("dynamicFormData", { data: parsedData });
//       } else {
//         setDataById("snackBarInfo", {
//           open: true,
//           autoHideDuration: 2000,
//           severity: "error",
//           message: message || "Something went wrong",
//         });
//       }
//     };
//     fetchDynamicFormData();
//   }, []);
  
  /**
   * 
   * fucntion to handle form submition
   * @param data :form data
   * 
   * 
   */
  const handleFormSubmit = (data: any) => {

    
    

    const formData = Object.entries(data).map(([key, value]: [string, any]) => {

      if (value === undefined) return

      const [fieldName, id, fieldType] = key.split("_");


      return {

        eventRegistrationFormId: id,
        response: JSON.stringify({ [fieldName]: value, fieldType: fieldType })

      }
    })

    const uploadedFileData = Object.entries(uploadedFiles).map(([key, value]: [string, any]) => {

      if(value.length === 0) return


      const [fieldName, id, fieldType] = key.split("_");

      return {

        eventRegistrationFormId: id,
        response: JSON.stringify({ [fieldName]: value, fieldType: fieldType })

      }
    })

    if ((formData.length === 0 || formData[0] === undefined) && uploadedFileData.length === 0) {
      return;
    }

    const body = {
      eventId: '7',
      data: [...formData, ...uploadedFileData]
    }

    POST({
      url: 'registrationRecord', body: body, id: 'registrationRecord',
      successCB: () => {

        clearDataById('uploadedFiles')
        navigate(routes.userPaymentMethod())

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
        return <Grid className="file-upload-wrapper" size={12} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
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
        </Grid>;

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
        );

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



  return (
    <Box className="dynamic-form">
      <CardContent>
        <Typography textAlign={"center"} className="dynamic-form-header">
          Event Registration Form
        </Typography>
        <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={4}>
            {dynamicFormData?.data?.map((field: FormField) => (
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="dynamic-form-submit-btn"
                size="large"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Box>
  );
};

export default DynamicUserForm;






