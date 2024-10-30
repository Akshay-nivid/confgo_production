import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Modal,
  Box,
  CircularProgress,
  Alert,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import apiClient from "@/Libs/Https/API-client";
import { Logger } from "@/Utils/Logger";
import ImageListDisplay from "./ImageListDisplay";
import FileUpload from "./FileUpload";
import "./_style.scss";

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
  companyId: number;
  multipleSelect?: boolean;
  imagesPerRow?: number;
}

const fetchFilesFromAPI = async (companyId: number, searchQuery: string) => {
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
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const delayTime = useRef<number | undefined>(undefined);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false); // State to control FileUpload modal

  // Fetch files from the server based on companyId and search query
  const fetchFiles = useCallback(
    async (searchQuery: string = "") => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFilesFromAPI(companyId, searchQuery);
        const { data } = response.data;

        if (Array.isArray(data)) {
          setFiles(data);
          setAutocompleteOptions(data.map((file: CustomFile) => file.name));
        } else {
          setFiles([]);
        }
      } catch (error) {
        Logger.error("Error fetching files:", error);
        setError("Failed to fetch files. Please try again.");
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

  // Handle search term changes in the Autocomplete input
  const handleSearchChange = (_event: React.ChangeEvent<{}>, value: string) => {
    setSearchTerm(value);
    if (delayTime.current) {
      clearTimeout(delayTime.current);
    }
    delayTime.current = window.setTimeout(() => {
      fetchFiles(value);
    }, 1000);
  };

  // Handle file selection
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

  // Handle confirming selection
  const handleConfirmSelection = () => {
    onSelectFile(selectedFiles);
    handleClose();
  };

  // Handle successful file upload
  const handleUploadSuccess = async (uploadedFile: CustomFile) => {
    // Close the upload modal
    setUploadModalOpen(false);

    // Fetch the updated file list and auto-select the uploaded file
    await fetchFiles(); // Refresh the file list
    setSelectedFiles([uploadedFile]); // Select the uploaded file
    onSelectFile([uploadedFile]); // Notify parent of the selection
  };

	return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" className="modal">
      <Box className="modal__container">
        <Box className="modal__content">

          <Autocomplete
            limitTags={2}
            freeSolo
            options={autocompleteOptions}
            filterOptions={(options) => options.slice(0, 4)}
            value={searchTerm}
            onInputChange={handleSearchChange}
            renderInput={(params) => (
              <TextField {...params} label="Search by name" variant="outlined" fullWidth className="modal__search-input" />
            )}
          />

          {loading ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box className="modal__image-list">
              <ImageListDisplay
                files={files}
                selectedFiles={selectedFiles}
                onSelectFile={handleFileSelect}
                multipleSelect={multipleSelect}
                imagesPerRow={imagesPerRow}
              />
            </Box>
          )}

          {multipleSelect && (
            <Button variant="contained" color="primary" fullWidth className="modal__confirm-button" onClick={handleConfirmSelection}>
              Confirm Selection
            </Button>
          )}

          <Button variant="outlined" color="secondary" fullWidth className="modal__upload-button" onClick={() => setUploadModalOpen(true)}>
            Upload New File
          </Button>

          {/* FileUpload Modal */}
          <Modal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
            <Box className="modal__upload-container">
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </Box>
          </Modal>
        </Box>
      </Box>
    </Modal>
  );
};

export default FileListModal;
