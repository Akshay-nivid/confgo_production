'use client'

import Grid from "@mui/material/Grid2";
import { Typography, IconButton, Box, Rating } from '@mui/material';
import { Book, DowloadIcon, PdfIcon } from '@/assets/svg';
import StatusComponent from '@/components/Status/StatusComponent';
import CustomButton from '@/components/CustomButton/CustomButton';
import ReactQuill from 'react-quill';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import moment from "moment";

/**
 * Reviewer component renders the details page for the reviewer.
 * It displays a navigation bar, an abstract summary, reviewer's message,
 * rating, and an editor for the reviewer to write a comment and submit.
 * The component includes:
 * - A logo and avatar in the navigation bar.
 * - A summary of abstracts with title, date, and status.
 * - A message box for the reviewer to write a message.
 * - A rating component for the reviewer to rate the abstract.
 * - An editor for the reviewer to write a comment.
 * - A submit button to submit the comment.
 */
const Reviewer = () => {
    const { id } = useParams<{ id: string }>(); // Retrieve the ID from URL parameters
    const [dataResult,setData] = useState<Reviewer | null>(null); // Replace 'Coupon' with your actual coupon type
    const [rating, setRating] = useState<number | null>(null); // Store rating
    const [comment, setComment] = useState<string>('');
    interface Reviewer {
        asset?: {name: string;
            createdOn:Date;
            mimeType:string;
            sourcePath:string;


        };  // Make asset optional in case it's not returned
        user?: {firstName: string;
            lastName: string;
            email: string;
          };
        isReviewed?: any;
        status:any;
}

    /**
     * useEffect hook to handle the API call
     */
    useEffect(() => {
        fetchAbstractDetails();
    }, [id]);

  /**
   * Fetch Coupon Details
   */
  const fetchAbstractDetails = async () => {
  
      const response = await apiClient.get(`/userAbstract/${id}`); // Adjust the endpoint as needed
      const { status, data } = await processAPIResponse(response, "Viewcoupon");
      if (status) {
        setData(data);
      }
   
  };

  const updateReviewDetails = async () => {
    if (rating === null || comment.trim() === '') {
      
      return;
    }

   
    const updatedFields = {
        id,
        rating,
        comment,
      };
      const response = await apiClient.put(`/userAbstract/${id}`, updatedFields); // Adjust the endpoint as needed
      const { status } = await processAPIResponse(response, "Viewcoupon");

      if (status) {
        setTimeout(() => {
          //navigate(routes.reviewDetails(id)); // Redirect after successful update
        }, 1500);
    }
  };
    return (
        <Box className="reviewer-main">

            {/* <ReviewerNavbar /> */}

            <Grid container columnSpacing={2}>

                <Grid size={11} container className="layout-container">

                    <Grid size={7}>
                        <Box className="document-card">

                            <Box className="eye-download-container">

                                <Box className="header-container">
                                    <Book />
                                    <Typography>Abstract</Typography>
                                </Box>

                                <IconButton>
                                    <DowloadIcon />
                                </IconButton>

                            </Box>



                            <Box className="file-container">

                                <PdfIcon />
                                <Box className="file-info">
                                    <Typography className='date'>{moment(dataResult?.asset?.createdOn).format('MMMM D, YYYY')}</Typography>
                                    <Typography className='name'>{dataResult?.asset?.name}</Typography>
                                </Box>

                            </Box>

                        </Box>

                        <Box className="reviewer-message-container">

                            <Box className="reviewer-avatar-container">
                                {/* <Avatar className='avatar'>JD</Avatar> */}
                                <Typography className='name'>Review</Typography>
                            </Box>

                            <Box className="rating-container">
                                <Rating
                                size="large"
                                precision={0.5}
                                value={rating}
                                onChange={(_, newValue) => setRating(newValue)}
                                />
                            </Box>

                            <Box className="editor-container">
                                <ReactQuill
                                value={comment}
                                onChange={setComment}
                                modules={{
                                    toolbar: [['bold', 'italic', 'link']],
                                }}
                                placeholder="Write a comment..."
                                />
                            </Box>

              <Box className="editor-btn-container">
                <CustomButton label="Submit" className="comment-btn" onClick={updateReviewDetails} />
              </Box>

                        </Box>

                    </Grid>

                    <Box className="divider"></Box>


                    <Grid size={"grow"} className="right-grid abstract-user-info-container">
                        <Typography className='abstract-name'>{dataResult?.asset?.name}</Typography>
                        <Box className="user-info-container">
                            <Box className="user-info-group">
                                <Typography className='title'>Submitted By</Typography>
                                <Typography className='value'>{dataResult?.user?.firstName} {dataResult?.user?.lastName}</Typography>
                            </Box>
                            <Box className="user-info-group">
                                <Typography className='title'>Email</Typography>
                                <Typography className='value'>{dataResult?.user?.email}</Typography>
                            </Box>
                            <Box className="user-info-group">
                                <Typography className='title'>Submission Date</Typography>
                                <Typography className='value'>{moment(dataResult?.asset?.createdOn).format('MMMM D, YYYY')}</Typography>
                            </Box>
                            <Box className="user-info-group">
                                <Typography className='title'>Status</Typography>
                                <Box className="value">
                                    <StatusComponent value={dataResult?.isReviewed} className='w-max' />
                                </Box>
                            </Box>
                        </Box>

                    </Grid>

                </Grid>
            </Grid>
        </Box>
    );
}
export default Reviewer


