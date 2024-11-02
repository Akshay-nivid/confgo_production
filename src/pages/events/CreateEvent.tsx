/**
 * CreateEvent handles the event creation first screen
 */
import { setFormValues } from "@/Utils/CommonBaseClass";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
type EventProps = {
  formSubmit: boolean;
  onSubmitHandler: (
    event: React.FormEvent<HTMLFormElement>,
    type: string
  ) => void;
  data: any;
};

type FormData = {
  type: string;
  name: string;
  startTime: Date;
  endTime: Date;
  speakers: string;
  description: string;
  venueName: string;
  mapUrl: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  url: string;
};

const typeArray = [
  { label: "Offline", value: "OFFLINE" },
  { label: "Online", value: "ONLINE" },
  { label: "Hybrid", value: "HYBRID" },
];

const CreateEvent: React.FC<EventProps> = React.memo(
  ({ formSubmit, onSubmitHandler, data }) => {
    const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
    } = useForm<FormData>();

    const [editorContent, setEditorContent] = useState("");

    /**
     * Method handles the on change event for description editor
     * @param value : event value
     */
    const handleChange = (value: any) => {
      setEditorContent(value);
      setValue("description", value);
    };

    /**
     * Useeffect hook handles the form submission based on the formSubmit variable
     */
    useEffect(() => {
      if (formSubmit) {
        handleSubmit(onSubmit)();
      }
    }, [formSubmit]);

    /**
     * Method handles the form submission
     * @param data
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {
      onSubmitHandler && onSubmitHandler(data, "EVENT");
    };

    /**
     * Useeffect hook set the form values based on the data
     */
    useEffect(() => {
      if (data) {
        setFormValues(data, setValue);
        data?.description && setEditorContent(data?.description);
      } else {
        setValue("type", "OFFLINE");
      }
    }, [data]);

    return (
      <Box className="create-event-container">
        <Grid
          container
          size={{ xs: 12, sm: 12 }}
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Grid size={{ xs: 0, sm: 3 }}></Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Grid>
              <Typography
                textAlign={"center"}
                variant="h3"
                lineHeight={2}
                className="create-event-title"
              >
                Create Event
              </Typography>
            </Grid>
            <Grid>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  spacing={2}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Grid size={{ xs: 12, sm: 12 }} mb={1}>
                    <Typography
                      variant="h3"
                      className="create-event-description"
                    >
                      Event Name
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }} mb={1}>
                    <CustomTextField
                      placeholder="Event Name"
                      control={control}
                      name="name"
                      type="text"
                      rules={{ required: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }} mb={1}>
                    <Typography
                      variant="h3"
                      className="create-event-description"
                    >
                      Event Description
                    </Typography>
                  </Grid>
                  <Grid
                    size={{ xs: 12, sm: 12 }}
                    mb={1}
                    className="create-event-description"
                  >
                    <ReactQuill
                      className={
                        errors?.description ||
                        watch("description") === "<p><br></p>"
                          ? "create-event-description-error"
                          : ""
                      }
                      value={editorContent}
                      onChange={handleChange}
                      theme="snow"
                      placeholder="Type your description here..."
                    />
                    <CustomTextField
                      control={control}
                      name="description"
                      type="hidden"
                      rules={{ required: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }} mb={1}>
                    <CustomRadio
                      control={control}
                      name="type"
                      label=""
                      options={typeArray}
                      row={true}
                      value={"OFFLINE"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} mb={1}>
                    <CustomTextField
                      placeholder="Start Date"
                      control={control}
                      name="startTime"
                      type="date"
                      defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                      min={moment().format("YYYY-MM-DD")}
                      rules={{
                        validate: (value) =>
                          new Date(value) >= new Date() ||
                          "Start Date cannot be in the past",
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} mb={1}>
                    <CustomTextField
                      placeholder="End Date"
                      control={control}
                      name="endTime"
                      type="date"
                      defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                      min={moment().format("YYYY-MM-DD")}
                      rules={{
                        validate: (value) =>
                          new Date(value) >= new Date() ||
                          "End Date cannot be in the past",
                      }}
                    />
                  </Grid>
                  {watch("type") !== "OFFLINE" && (
                    <Grid size={{ xs: 12, sm: 12 }} mb={1}>
                      <CustomTextField
                        placeholder="Url"
                        control={control}
                        name="url"
                        type="text"
                        rules={{ required: watch("type") === "ONLINE" }}
                      />
                      {errors.url && (
                        <Typography color="error" variant="body2">
                          {errors.url.message}
                        </Typography>
                      )}
                    </Grid>
                  )}

                  {watch("type") !== "ONLINE" && (
                    <>
                      <Grid
                        container
                        alignItems="center"
                        size={{ xs: 12, sm: 12 }}
                        mb={1}
                      >
                        <CustomTextField
                          placeholder="Location URL (must be an embed URL)"
                          control={control}
                          name="mapUrl"
                          type="text"
                          rules={{
                            required: true,
                            validate: (value) =>
                              /embed/.test(value) || 'URL must contain "embed"',
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }} mb={1}>
                        <CustomTextField
                          placeholder="Location"
                          control={control}
                          name="venueName"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }} mb={1}>
                        <CustomTextField
                          placeholder="Address"
                          control={control}
                          name="address"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }} mb={1}>
                        <CustomTextField
                          placeholder="City"
                          control={control}
                          name="city"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }} mb={1}>
                        <CustomTextField
                          placeholder="State"
                          control={control}
                          name="state"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }} mb={1}>
                        <CustomTextField
                          placeholder="Country"
                          control={control}
                          name="country"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }} mb={1}>
                        <CustomTextField
                          placeholder="Pin Code"
                          control={control}
                          name="postalCode"
                          type="text"
                          rules={{
                            required: watch("type") === "OFFLINE",
                            pattern: {
                              value: /^[0-9]{5,6}$/,
                              message: "Pin code must be a 5 or 6-digit number",
                            },
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </form>
            </Grid>
          </Grid>
          <Grid size={{ xs: 0, sm: 3 }}></Grid>
        </Grid>
      </Box>
    );
  }
);

export default CreateEvent;
