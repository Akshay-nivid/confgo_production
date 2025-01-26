/**
 * AssignReviewerDrawer Component
 * A drawer component for assigning reviewers to an abstract.
 * Displays a list of reviewers and allows assigning them to the selected abstract.
 */
import React, { useEffect, useState } from "react";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { Logger } from "@/Utils/Logger";
import Grid from "@mui/material/Grid2";
import useStore from "@/Libs/store/store";
import { IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";


interface AssignReviewerDrawerProps {
  open: boolean;
  onClose: () => void;
  abstractId: number[] | null;
  companyId: string | null;
  onSuccess: () => void;
}

const AssignReviewerDrawer: React.FC<AssignReviewerDrawerProps> = ({
  open,
  onClose,
  abstractId,
  companyId,
  onSuccess,
}) => {
  const [reviewers, setReviewers] = useState([]);
  const setDataById = useStore((state: any) => state.setDataById);

  /**
   * Fetches the list of reviewers whenever the drawer is opened.
   */
  useEffect(() => {
    if (open) {
      fetchReviewers();
    }
  }, [open]);

  /**
   * Retrieves the list of reviewers from the API based on the provided company ID.
   * Updates the local state with the fetched reviewers.
   */
  const fetchReviewers = async () => {
    if (!companyId) return;
    try {
      const req = {
        filters: {
          companyId,
          roleEnums: ["REVIEWER"],
        },
      };
      const response = await apiClient.post("/user/userRole/list", req);
      const { status, data } = await processAPIResponse(response, "reviewers");
      if (status) {
        setReviewers(data);
      }
    } catch (error) {
      Logger.error("Error fetching reviewers:", error);
    }
  };

  /**
   * Assigns the selected reviewer to the current abstract.
   * Displays a success or error message based on the API response.
   * @param {number} reviewerId - The ID of the reviewer to assign.
   */
  const assignReviewer = async (reviewerId: number) => {
    if (!abstractId) return;
    try {
      const req = {
        abstracts:abstractId,
        reviewerId,
      };
      const response = await apiClient.post(`/userAbstract/assign`, req);
      const { status } = await processAPIResponse(response, "reviewer-assignment");
      if (status) {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "success",
          message: "Reviewer Assigned",
        });
        onSuccess();
        onClose();
      }
      else {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: "Failed to assign reviewer",
        });
      }
    } catch (error) {
      Logger.error("Error assigning reviewer:", error);
    }
  };
  return (
    <CustomDrawer open={open} onClose={onClose} type="right" className="assign-reviewer-drawer">
      <Grid className="assign-reviewer-drawer-main" >
        <Grid container className="assign-reviewer-drawer-header">
          <Typography variant="h5" className="assign-reviewer-drawer-title">
            Assign Reviewer
          </Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Grid>
        <Grid className="assign-reviewer-drawer-content">
          {reviewers.length ? (
            <List className="assign-reviewer-drawer-list">
              {reviewers.map((reviewer: any) => (
                <ListItem
                  key={reviewer?.id}
                  className="assign-reviewer-drawer-list-item"
                  secondaryAction={
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      className="assign-reviewer-drawer-assign-button"
                      onClick={() => assignReviewer(reviewer.id)}
                    >
                      Assign
                    </Button>
                  }
                >
                  <ListItemText
                    primary={reviewer?.firstName}
                    secondary={reviewer?.email || "No email provided"}
                    className="assign-reviewer-drawer-list-item-text"
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" className="assign-reviewer-drawer-no-reviewers">
              No reviewers available.
            </Typography>
          )}
        </Grid>

      </Grid>
    </CustomDrawer>
  );
};

export default AssignReviewerDrawer;
