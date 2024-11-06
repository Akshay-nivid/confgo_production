import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CardContent, Button, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import useStore from "@/Libs/store";
import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker";
import CustomFileUpload from "@/components/CustomFileUpload/CustomFileUpload";

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

interface DynamicFormProps {
  formFields: FormField[];
  onSubmit: (data: any) => void;
}

const DynamicFormGenerator: React.FC<DynamicFormProps> = ({}) => {
  const { control, handleSubmit } = useForm();

  const renderFormField = (field: FormField) => {
    const { id, metadata } = field;

    const isRequired =
      metadata.required && metadata?.required?.includes("true");

    const commonProps = {
      control,
      name: metadata.title + "_" + id.toString(),
      label: metadata.title.charAt(0).toUpperCase() + metadata.title.slice(1),
      placeholder:
        metadata.title.charAt(0).toUpperCase() + metadata.title.slice(1),
      rules: isRequired
        ? { required: `${metadata.title} is required` }
        : undefined,
    };

    switch (metadata.fieldType) {
      case "text":
        return <CustomTextField {...commonProps} type="text" size="medium" />;

      case "number":
        return <CustomTextField {...commonProps} type="number" size="medium" />;

      case "email":
        return <CustomTextField {...commonProps} type="email" size="medium" />;

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

      case "checbox":
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

      case "file":
        return (
          <Box
            className={
              "w-full border border-gray-200 flex items-center justify-center p-8 rounded bg-gray-100/50"
            }
          >
            <CustomFileUpload
              {...commonProps}
              multiple={true}
              label=""
              rules={
                metadata.required && metadata?.required?.includes("true")
                  ? {
                      required: "Please select at least one file",
                      validate: (value: any) =>
                        value.length > 0
                          ? true
                          : "Please select at least one file",
                    }
                  : undefined
              }
            />
          </Box>
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

  const handleFormSubmit = (data: any) => {
    return data
  };

  const setDataById = useStore((state) => state.setDataById);
  const dynamicFormData =
    useStore((state: any) => state?.compData?.["dynamicFormData"]) ?? [];

  useEffect(() => {
    const fetchDynamicFormData = async () => {
      const response = await apiClient.get("event/form/7");
      const { status, data, message } = processAPIResponse(
        response,
        "eventForm"
      );

      if (status) {
        const parsedData = data?.map((item: any) => {
          return {
            ...item,
            metadata: JSON.parse(item.metadata),
          };
        });

        setDataById("dynamicFormData", { data: parsedData });
      } else {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: message || "Something went wrong",
        });
      }
    };
    fetchDynamicFormData();
  }, []);

  return (
    <Box className="dynamic-form">
      <CardContent>
        <Typography textAlign={"center"} className="dynamic-form-header">
          Event Registration Form
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={4}>
            {dynamicFormData?.data?.map((field: FormField) => (
              <Grid size={12} key={field.id}>
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

export default DynamicFormGenerator;

