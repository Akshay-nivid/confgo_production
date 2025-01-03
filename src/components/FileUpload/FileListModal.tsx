import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Box,
  CircularProgress,
  // Autocomplete,
  // TextField,
  Button,
  Typography,
} from "@mui/material";
import apiClient from "@/Libs/Https/API-client";
import { Logger } from "@/Utils/Logger";
import ImageListDisplay from "./ImageListDisplay";
import FileUpload from "./FileUpload";
import "./_style.scss";
import Grid from "@mui/material/Grid2";
import CloseIcon from '@mui/icons-material/Close';

interface CustomFile {
  id: number;
  name: string;
  mimeType: string;
  sourcePath: string;
  size: number;
  createdOn: string;
}

interface FileListModalProps {
  open: boolean;
  handleClose: () => void;
  onSelectFile: (file: CustomFile[]) => void;
  companyId: Number | string | null;
  multipleSelect?: boolean;
  imagesPerRow?: number;
}
/*
 * function to fetch file 
@param companyId,searchQuery
 */
const fetchFilesFromAPI = async (companyId: Number | string | null, searchQuery: string) => {
  const req = {
    filters: {
      companyId,
      name: searchQuery,
    },
    limit: 16,
  };
  return apiClient.post("/asset/list", req);
};

const FileListModal: React.FC<FileListModalProps> = ({
  open,
  handleClose,
  onSelectFile,
  companyId,
  multipleSelect = true,
  imagesPerRow = 4,
}) => {
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<CustomFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [searchTerm, setSearchTerm] = useState<string>("");
  // const delayTime = useRef<number | undefined>(undefined);
  // const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false); // State to control FileUpload modal

/*
 * function to fetch file 
  @param searchQuery
 */
  const fetchFiles = useCallback(
    async (searchQuery: string = "") => {
      try {
        setLoading(true);
        const response = await fetchFilesFromAPI(companyId, searchQuery);
        const { data } = response.data;
        if (Array.isArray(data)) {
          setFiles(data);
          // setAutocompleteOptions(data.map((file: CustomFile) => file.name));
        } else {
          setFiles([]);
        }
      } catch (error) {
        Logger.error("Error fetching files:", error);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  useEffect(() => {
    if (open) {
      fetchFiles("");
    }
  }, [open, fetchFiles]);

/*
 * Handle search term changes in the Autocomplete input
  @param _event ,value
 */ 
  // const handleSearchChange = (_event: React.ChangeEvent<{}>, value: string) => {
  //   setSearchTerm(value);
  //   if (delayTime.current) {
  //     clearTimeout(delayTime.current);
  //   }
  //   delayTime.current = window.setTimeout(() => {
  //     fetchFiles(value);
  //   }, 1000);
  // };

 /*
 * Handle file selection 
  @param file
 */
  const handleFileSelect = (file: CustomFile) => {
    if (multipleSelect) {
      setSelectedFiles((prevSelected) =>
        prevSelected.some((f) => f.id === file.id)
          ? prevSelected.filter((f) => f.id !== file.id)
          : [...prevSelected, file]
      );
    } else {
      setSelectedFiles([file]);
      onSelectFile([file]);
      handleClose();
    }
  };

 /*
 * Handle confirming selection
 */ 
  const handleConfirmSelection = () => {
    onSelectFile(selectedFiles);
    handleClose();
  };

  /*
  *  Handle successful file upload
  */ 
  const handleUploadSuccess = async (uploadedFile: CustomFile) => {
    setUploadModalOpen(false);
    await fetchFiles(); 
    setSelectedFiles([uploadedFile]); 
    onSelectFile([uploadedFile]);
  };

	return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" className="modal">
      <Box className="modal-container">
        <Box className="modal-content" >
        <Grid >
        <Grid className="modal-close-icon" container justifyContent={"flex-end"} onClick={handleClose}>
          <CloseIcon/>
        </Grid>
        <FileUpload acceptedFiles={["image/jpeg", "image/png",]} resolution={{ width: 200, height: 200 }} onSubmit={handleUploadSuccess}/>
{/* 
          <Autocomplete
            limitTags={2}
            freeSolo
            options={autocompleteOptions}
            filterOptions={(options) => options.slice(0, 4)}
            value={searchTerm}
            onInputChange={handleSearchChange}
            renderInput={(params) => (
              <TextField {...params} label="Search by name" variant="outlined" fullWidth className="modal-search-input" />
            )}
          /> */}
          {loading ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid>
            <Typography className="modal-image-saved-assests">Saved Assets</Typography>
            <Box className="modal-image-list">
              <ImageListDisplay
                files={files}
                selectedFiles={selectedFiles}
                onSelectFile={handleFileSelect}
                multipleSelect={multipleSelect}
                imagesPerRow={imagesPerRow}
              />
            </Box>
            </Grid>
          )}
          {multipleSelect && (
            <Button variant="contained" color="primary" fullWidth className="modal-confirm-button" onClick={handleConfirmSelection}>
              Confirm Selection
            </Button>
          )}
{/* 
          <Button variant="outlined" color="secondary" fullWidth className="modal-upload-button" onClick={() => setUploadModalOpen(true)}>
            Upload New File
          </Button> */}
          {/* FileUpload Modal */}
          <Modal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
            <Box className="modal-upload-container">
              <FileUpload acceptedFiles={["image/jpeg", "image/png",]} resolution={{ width: 200, height: 200 }} onSubmit={handleUploadSuccess}/>
            </Box>
          </Modal>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default FileListModal;
