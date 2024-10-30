import React from "react";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid2"
import "./_style.scss";

interface CustomFile {
  id: number;
  name: string;
  mimeType: string;
  sourcePath: string;
  size: number;
  createdOn: string;
}

interface ImageListDisplayProps {
  files: CustomFile[];
  selectedFiles: CustomFile[];
  onSelectFile: (file: CustomFile) => void;
  multipleSelect?: boolean;
  imagesPerRow?: number;
}

const ImageListDisplay: React.FC<ImageListDisplayProps> = ({
  files,
  selectedFiles,
  onSelectFile,
  multipleSelect = false,
  imagesPerRow = 5,
}) => {
  const handleFileSelect = (file: CustomFile) => {
    onSelectFile(file);
  };

  return (
    <Grid container>
      <Grid size={{xs:12}}>
        <ImageList cols={imagesPerRow} gap={20} rowHeight={70} className="image-list">
          {files.map((file) => (
            <ImageListItem key={file.id} onClick={() => handleFileSelect(file)} className="image-list__item">
              <img
                src={`http://localhost:4444/api/asset/${file.id}`}
                alt={file.name}
                loading="lazy"
                className="image-list__image"
              />
              <ImageListItemBar
                title={file.name}
                actionIcon={
                  multipleSelect ? (
                    <Checkbox
                      checked={selectedFiles.some((selected) => selected.id === file.id)}
                      onChange={() => handleFileSelect(file)}
                      className="image-list__checkbox"
                    />
                  ) : null
                }
                sx={{
                  height: 20,
                  "& .MuiImageListItemBar-title": {
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
    </Grid>
  );
};

export default ImageListDisplay;
