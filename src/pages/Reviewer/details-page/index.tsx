'use client'

import Grid from "@mui/material/Grid2";
import { Typography, IconButton, Box, Rating } from '@mui/material';
import { Book, DowloadIcon, PdfIcon } from '@/assets/svg';
import StatusComponent from '@/components/Status/StatusComponent';
import CustomButton from '@/components/CustomButton/CustomButton';
import ReactQuill from 'react-quill';

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
export default function Reviewer() {
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
                                    <Typography className='date'>December 15, 2024</Typography>
                                    <Typography className='name'>NetworkingAbstract_200.pdf</Typography>
                                </Box>

                            </Box>

                        </Box>

                        <Box className="reviewer-message-container">

                            <Box className="reviewer-avatar-container">
                                {/* <Avatar className='avatar'>JD</Avatar> */}
                                <Typography className='name'>Review</Typography>
                            </Box>

                            <Box className="rating-container">
                                <Rating size='large' precision={0.5} />
                            </Box>

                            <Box className="editor-container">

                                <ReactQuill modules={{
                                    toolbar: [['bold', 'italic', 'link']]
                                }}
                                    placeholder='Write a comment...'
                                />

                            </Box>

                            <Box className="editor-btn-container">
                                <Box className='editor'></Box>
                                <CustomButton label='Submit' className='comment-btn' />
                            </Box>

                        </Box>

                    </Grid>

                    <Box className="divider"></Box>


                    <Grid size={"grow"} className="right-grid abstract-user-info-container">
                        <Typography className='abstract-name'>Abstract Name</Typography>
                        <Box className="user-info-container">
                            <Box className="user-info-group">
                                <Typography className='title'>Submitted By</Typography>
                                <Typography className='value'>Dr. John Smith</Typography>
                            </Box>
                            <Box className="user-info-group">
                                <Typography className='title'>Email</Typography>
                                <Typography className='value'>test@gmail.com</Typography>
                            </Box>
                            <Box className="user-info-group">
                                <Typography className='title'>Submission Date</Typography>
                                <Typography className='value'>December 15, 2024</Typography>
                            </Box>
                            <Box className="user-info-group">
                                <Typography className='title'>Status</Typography>
                                <Box className="value">
                                    <StatusComponent value='3' className='w-max' />
                                </Box>
                            </Box>
                        </Box>

                    </Grid>

                </Grid>
            </Grid>
        </Box>
    );
}



