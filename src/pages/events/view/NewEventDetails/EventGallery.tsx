import React, { useEffect, useState, useTransition } from "react";
import { Modal, Box, Typography, FormLabel } from "@mui/material";
import apiClient from "@/Libs/Https/API-client";
import { Logger } from "@/Utils/Logger";
import "./EventGallery.scss";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import config from "../../../../../config.json";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import CustomButton from "@/components/CustomButton/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import FileUpload from "@/components/FileUpload/FileUpload";
import Masonry from "react-masonry-css";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { setDataById } from "@/Libs/store";

interface CustomFile {
  asset:{
    id: string;
    name: string;
  }
}

/**
 * Component to show and add images to event gallery
 */
const EventGallery: React.FC = () => {
  const { handleSubmit } = useForm();
  const eventId = useLocation()?.pathname?.split("/")[3];

  const [files, setFiles] = useState<CustomFile[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [_modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [gallery, setGallery] = useState(false);
  const baseURL = config.api.url;
  const [imageSubmission, setImageSubmission] = useState(false);


  /**
   * function to fetch images for an event
   */
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post("/eventImage/ListByEvent", {
        eventId,
      });
      const imagesArray = response?.data?.data?.images || [];

      if (Array?.isArray(imagesArray)) {
        setFiles(imagesArray);
      } else {
        setFiles([]);
        console.error("Invalid images data format:", response.data);
      }
    } catch (error) {
      Logger.error("Error fetching files:", error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * function to open the images modal
   */
  const handleEditClick = () => {
    setGallery(true);

  };

  /**
   * function to open upload
   */
  const addImages = () => {
    setUploadModalOpen(true);
  };

  /**
   * function to submit the image that needs to upload
   */
  const onSubmit = async () => {
    setImageSubmission(true)
    try {
      const req = {
        eventId: eventId,
        assetIds: selectedFiles?.flat()?.map((file) => file?.id) || [],
      };
      setLoading(true);
      const response = await apiClient.post("/eventImage/upload", req);
      const { status,message } =  await processAPIResponse(response,"imageUpload");
      if(status){
        setDataById("snackBarInfo", { open: true, autoHideDuration: 2000, severity: "success", message: message});
        setSelectedFiles([]);
      }
      else{
        throw new Error(message|| 'Unexpected error occurred');
      }
    } catch (error) {
      Logger.error("Error uploading files:", error);
    } finally {
      setLoading(false);
      setUploadModalOpen(false);
      setImageSubmission(false)
    }
  };

  /**
   * adding break points to image masonry
   */
  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
  };

  /**
   * closing the upload modal and calling the fetchfiles
   */
  const handleUploadSuccess = async (uploadedFile: any) => {
    setModalOpen(false);
    await fetchFiles();
    setSelectedFiles([uploadedFile]);
  };

  useEffect(() => {
    fetchFiles();
  }, [uploadModalOpen]);

  /**
   * closing the upload modal and set SelectedFiles empty
   */
  const cancelupload = () => {
    setUploadModalOpen(false);
    setSelectedFiles([]);
  };
  return (
    <Grid container size={12} className="event-gallery" >
      <Grid className="event-gallery-border" size={12} minHeight={"20rem"}>
        <Typography className="event-gallery-title">Event Gallery</Typography>
        <Grid size={12}  >
        {files?.length != 0 ? (
            <Grid container spacing={1} justifyContent="center">
              {files?.slice(0, 5)?.map((item) => (
                <Grid key={item?.asset?.id} className="event-gallery-images">
                  <img
                    src={`${baseURL}asset/${item?.asset?.id}`}
                    alt={item?.asset?.name}
                    loading="lazy"
                    className="event-gallery-info-image"
                  />
                </Grid>
              ))}

              {files?.length > 5 && (
                <Grid className="event-gallery-img-length">
                  +{files?.length - 5}
                </Grid>
              )}
            </Grid>
          ) : (
            <Grid className="event-gallery-upload-text">
              <Typography>Please upload images</Typography>
            </Grid>
          )}
          <CustomButton
            className="event-gallery-view-btn"
            label="View or Edit Gallery"
            size="large"
            onClick={handleEditClick}
          />
        </Grid>
      </Grid>

      {/* opens the event gallery modal */}
      <Modal
        open={gallery}
        onClose={() => setGallery(false)}
        aria-labelledby="modal-title"
      >
        <Box className="event-gallery-container">
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className="event-gallery-header" 
          >
            <Typography className="event-gallery-title">
              Event Gallery
            </Typography>
            <CloseIcon
              onClick={() => setGallery(false)}
              className="event-gallery-close-icon"
            />
          </Grid>

          <Grid container justifyContent="flex-end" className="event-gallery-add-grid">
            <CustomButton
              className="abstract-green-btn"
              label="Add Images"
              startIcon={<AddIcon />}
              size="large"
              onClick={addImages}
            />
          </Grid>
          <Box className="event-gallery-content">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="event-gallery-masonry"
              columnClassName="event-gallery-masonry-column"
            >
              {files?.map((item) => (
                <>
                <img
                  key={item?.asset?.id}
                  src={`${baseURL}asset/${item?.asset?.id}`}
                  alt={item?.asset?.name}
                  className="event-gallery-img"
                  loading="lazy"
                />
                <Grid display={"flex"} alignItems={"center"} justifyContent={"center"}>
                  <Typography className="event-gallery-img-name">{item?.asset?.name}</Typography>
                </Grid>
                </>
              ))}      
            </Masonry>
          </Box>
        </Box>
      </Modal>

      {/* opens the upload modal */}
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        className="event-gallery-upload-modal"
      >
        <Box className="event-gallery-upload">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid size={12}>
              <FormLabel className="form-file-upload-label">
                Please upload Images
              </FormLabel>
            </Grid>
            <Grid className="event-gallery-confirm">
            <Grid
              container
              spacing={2}
              className="event-gallery-confirm-grid"
            >
              {selectedFiles?.length !== 0 ? (
                <>
                  {selectedFiles?.flat()?.map((file) => (
                      <Grid key={file?.id} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                      <img
                        src={`${baseURL}asset/${file?.id}`}
                        alt={file?.name}
                        loading="lazy"
                        className="event-gallery-confirm-img"
                      />
                      <Typography>{file?.name}</Typography>
                    </Grid>                
                  ))}
                </>
              ) : (
                <FileUpload
                  acceptedFiles={["image/jpeg", "image/png"]}
                  onSubmit={handleUploadSuccess}
                  canSelectMultiple={true}
                  NoRecommended={true}
                  className="event-gallery-file"
                />
              )}
              </Grid>

              
            </Grid>
            <Grid size={12} container spacing={2} justifyContent="center">
                <Grid size={{ xs: 12, sm: 12 }}>
                  <CustomButton className="event-gallery-save-btn" label="Submit" variant="contained" type="submit" size="large" onClick={() => addImages()} disabled={selectedFiles?.length == 0 || imageSubmission  }/>
                  <CustomButton className="custom-list-save-btn custom-list-restore-btn" label="Cancel" variant="outlined" size="large" onClick={() => cancelupload()}/>
                </Grid>
              </Grid>
          </form>
        </Box>
      </Modal>
    </Grid>
  );
};

export default EventGallery;
