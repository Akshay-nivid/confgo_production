import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, FormLabel } from "@mui/material";
import apiClient from "@/Libs/Https/API-client";
import { Logger } from "@/Utils/Logger";
import "./_style.scss";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import config from "../../../config.json";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import CustomButton from "@/components/CustomButton/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import FileUpload from "@/components/FileUpload/FileUpload";
import Masonry from "react-masonry-css";

interface CustomFile {
  assetId: any;
  id: string;
  name: string;
  sourcePath: string;
}

/**
 * Component to show and add images to event gallery
 */
const EventGallery: React.FC = () => {
  const { handleSubmit } = useForm();
  const eventId = useLocation()?.pathname.split("/")[3];

  const [files, setFiles] = useState<CustomFile[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [selectedFiles, setSelectedFiles] = useState<CustomFile[]>([]);
  const [_modalOpen, setModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [gallery, setGallery] = useState(false);
  const baseURL = config.api.url;

  /**
   * function to fetch images for an event
   */
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post("/eventImage/ListByEvent", {
        eventId,
      });
      const imagesArray = response.data?.data?.images || [];

      if (Array.isArray(imagesArray)) {
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
    try {
      const req = {
        eventId: eventId,
        assetIds: selectedFiles.flat().map((file) => file.id) || [],
      };
      setLoading(true);
      await apiClient.post("/eventImage/upload", req);
      setSelectedFiles([]);
    } catch (error) {
      Logger.error("Error uploading files:", error);
    } finally {
      setLoading(false);
      setUploadModalOpen(false);
    }
  };

  /**
   * adding break points to image masonry
   */
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
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
    <>
      <Grid className="event-gallery-border" size={3}>
        <Typography className="event-gallery-title">Event Gallery</Typography>
        <Grid size={12}>
        {files?.length != 0 ? (
            <Grid container spacing={1} justifyContent="center">
              {files.slice(0, 5).map((item) => (
                <Grid key={item.id} className="event-gallery-images">
                  <img
                    src={`${baseURL}asset/${item.assetId}`}
                    alt={item.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Grid>
              ))}

              {files.length > 5 && (
                <Grid className="event-gallery-img-length">
                  +{files.length - 5}
                </Grid>
              )}
            </Grid>
          ) : (
            <Grid mt={2}>
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
            mb={2}
          >
            <Typography className="event-gallery-title">
              Event Gallery
            </Typography>
            <CloseIcon
              onClick={() => setGallery(false)}
              className="event-gallery-close-icon"
            />
          </Grid>

          <Grid container justifyContent="flex-end" className="event-gallery-close-icon" mr={5} mb={2}>
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
              {files.map((item) => (
                <img
                  key={item.id}
                  src={`${baseURL}asset/${item.assetId}`}
                  alt={item.name}
                  className="event-gallery-img"
                  loading="lazy"
                />
              ))}
            </Masonry>
          </Box>
        </Box>
      </Modal>

      {/* opens the upload modal */}
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box className="event-gallery-upload">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid size={12}>
              <FormLabel className="form-file-upload-label">
                Please upload Images
              </FormLabel>
            </Grid>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              {selectedFiles.length !== 0 ? (
                <>
                  {selectedFiles.flat().map((file) => (
                    <Grid key={file.id}>
                      <img
                        src={`${baseURL}asset/${file.id}`}
                        alt={file.name}
                        loading="lazy"
                        style={{ height: "5rem" }}
                      />
                    </Grid>
                  ))}
                </>
              ) : (
                <FileUpload
                  acceptedFiles={["image/jpeg", "image/png"]}
                  resolution={{ width: 200 }}
                  onSubmit={handleUploadSuccess}
                  canSelectMultiple={true}
                  NoRecommended={true}
                />
              )}

              <Grid size={12} container spacing={2} justifyContent="center">
                <Grid size={{ xs: 12, sm: 12 }}>
                  <CustomButton className="custom-list-save-btn" label="Submit" variant="contained" type="submit" size="large" onClick={() => addImages()} />
                  <CustomButton className="custom-list-save-btn custom-list-restore-btn" label="Cancel" variant="outlined" size="large" onClick={() => cancelupload()}/>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EventGallery;
