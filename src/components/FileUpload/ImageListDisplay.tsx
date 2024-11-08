import React from "react";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid2"
import "./_style.scss";
import config from '../../../config.json';

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
  /**
   * Handles the selection of a file
   * @param file The file to select or toggle.
   */
  const handleFileSelect = (file: CustomFile) => {
    onSelectFile(file);
  };

	const baseURL = config.api.url;

  return (
    <Grid container>
      <Grid size={{xs:12}}>
        <ImageList cols={imagesPerRow} gap={20} rowHeight={70} className="image-list">
          {files.map((file) => (
            <ImageListItem key={file.id} onClick={() => handleFileSelect(file)} className="image-list__item">
              <img
                src={`${baseURL}asset/${file.id}`}
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
                classes={{
                  root: 'image-list-item-bar',
                  title: 'image-list-item-bar-title',
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
