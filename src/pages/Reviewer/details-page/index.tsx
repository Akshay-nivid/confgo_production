import Grid from '@mui/material/Grid2';
import { Typography, IconButton, Box, Rating, CircularProgress } from '@mui/material';
import { Book, DowloadIcon, PdfIcon } from '@/assets/svg';
import StatusComponent from '@/components/Status/StatusComponent';
import CustomButton from '@/components/CustomButton/CustomButton';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { GET, PUT, snackBar } from '@/Libs/store/store';
import { useForm } from 'react-hook-form';
import useStore from '@/Libs/store/store';
import { Edit } from '@mui/icons-material';
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
  const [dataResult, setData] = useState<Reviewer | null>(null); // Store abstract data
  const [disbaled, setDisabled] = useState<boolean>(false); // Store disabled state

  const reviewData = useStore((state: any) => state.compData?.updateReviewDetails?.[`userAbstract/${id}`]);
  const fecthReviewData = useStore((state: any) => state.compData?.fetchAbstractDetails?.[`userAbstract/${id}`]);

  const form = useForm({
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  interface Reviewer {
    asset?: {
      id: number;
      name: string;
      createdOn: Date;
      mimeType: string;
      sourcePath: string;
    }; // Make asset optional in case it's not returned
    user?: {
      firstName: string;
      lastName: string;
      email: string;
    };
    isReviewed?: any;
    status: any;
    statusId: any;
  }

  /**
   * useEffect hook to handle the API call
   */
  useEffect(() => {
    fetchAbstractDetails();
  }, [id]);

  /**
   * Fetches the abstract details from the API, updates the form state
   * and disables the form if the abstract is already reviewed.
   */
  const fetchAbstractDetails = async () => {
    GET({
      id: 'fetchAbstractDetails',
      url: `userAbstract/${id}`,
      successCB: data => {
        setDisabled(data?.data?.isReviewed === 1);

        form.reset({
          rating: data?.data?.rating,
          comment: data?.data?.comment,
        });

        setData(data?.data);
      },
      errorCB: () => {
        snackBar({
          severity: 'error',
          message: 'Failed to fetch abstract details',
        });
      },
    });
  };

  /**
   * Submits the review details to the API and updates the form state.
   * Also handles the error and success responses
   * @param {object} data - The data to be submitted
   */
  const updateReviewDetails = (status: 'approved' | 'rejected') => {
    const data = form.getValues();
    const { rating, comment } = data;

    if (!rating || !comment || comment === '<p><br></p>') {
      snackBar({
        severity: 'error',
        message: 'Both rating and comment are required',
      });
      return;
    }

    const body = {
      id,
      rating,
      comment,
      statusId: status === 'approved' ? 1 : 2,
    };

    PUT({
      url: `userAbstract/${id}`,
      body: body,
      id: 'updateReviewDetails',
      successCB: () => {
        snackBar({
          severity: 'success',
          message: 'Review submitted successfully',
        });
        fetchAbstractDetails();
      },
      errorCB: () => {
        snackBar({ severity: 'error', message: 'Failed to submit review' });
      },
    });
  };

  /**
   * Updates the form's 'comment' field with the given value.
   * @param value - The content to be set as the comment in the form.
   */

  const handleQuillChange = (value: string) => {
    form.setValue('comment', value);
  };

  /**
   * Opens the abstract's file in a new tab.
   * If the abstract doesn't have a file, does nothing.
   */
  const handleFileClick = () => {
    const href = `https://api.confgo.com/api/asset/${dataResult?.asset?.id}`;
    window.open(href, '_blank');
  };

  /**
   * Enables the form for editing by setting the 'disabled' state to false.
   */
  function handleClickEditButton() {
    setDisabled(false);
  }

  if (fecthReviewData?.loading) {
    return (
      <Grid position={'fixed'} display={'flex'} justifyContent={'center'} alignItems={'center'} top={0} bottom={0} left={0} right={0}>
        <CircularProgress color="inherit" />
      </Grid>
    );
  }

  return (
    <Box className="reviewer-main">
      <Grid container columnSpacing={2}>
        <Grid size={11} container className="layout-container">
          <Grid size={7}>
            <Box className="document-card">
              <Box className="eye-download-container">
                <Box className="header-container">
                  <Book />
                  <Typography>Abstract</Typography>
                </Box>

                <IconButton onClick={handleFileClick}>
                  <DowloadIcon />
                </IconButton>
              </Box>

              <Box className="file-container" onClick={handleFileClick}>
                <PdfIcon />
                <Box className="file-info">
                  <Typography className="date">{moment(dataResult?.asset?.createdOn).format('MMMM D, YYYY')}</Typography>
                  <Typography className="name">{dataResult?.asset?.name} </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="reviewer-message-container">
              <Box className="reviewer-avatar-container">
                {/* <Avatar className='avatar'>JD</Avatar> */}
                <Typography className="name">Review</Typography>
                {dataResult?.isReviewed === 1 && (
                  <IconButton onClick={handleClickEditButton}>
                    <Edit />
                  </IconButton>
                )}
              </Box>

              <form>
                <Box className="rating-container">
                  <Rating
                    size="large"
                    disabled={reviewData?.loading || disbaled}
                    precision={1}
                    name="rating"
                    onChange={(_event, newValue) => {
                      if (newValue !== null) {
                        form.setValue('rating', newValue);
                      }
                    }}
                    max={5}
                    value={form.watch('rating')}
                  />
                </Box>

                <Box className="editor-container">
                  <ReactQuill
                    readOnly={reviewData?.loading || disbaled}
                    onChange={handleQuillChange}
                    modules={{
                      toolbar: [['bold', 'italic', 'link']],
                    }}
                    value={form.watch('comment')}
                    placeholder="Write a comment..."
                  />
                </Box>

                <Box className="editor-btn-container">
                  <CustomButton disabled={reviewData?.loading || disbaled} label="Reject" className="omment-btn reject-btn" onClick={() => updateReviewDetails('rejected')} />

                  <CustomButton
                    disabled={reviewData?.loading || disbaled}
                    isLoading={reviewData?.loading}
                    label="Approve"
                    className="comment-btn"
                    onClick={() => updateReviewDetails('approved')}
                  />
                </Box>
              </form>
            </Box>
          </Grid>

          <Box className="divider"></Box>

          <Grid size={'grow'} className="right-grid abstract-user-info-container">
            <Typography className="abstract-name">{dataResult?.asset?.name}</Typography>
            <Box className="user-info-container">
              <Box className="user-info-group">
                <Typography className="title">Submitted By</Typography>
                <Typography className="value">
                  {dataResult?.user?.firstName} {dataResult?.user?.lastName}
                </Typography>
              </Box>
              <Box className="user-info-group">
                <Typography className="title">Email</Typography>
                <Typography className="value">{dataResult?.user?.email}</Typography>
              </Box>
              <Box className="user-info-group">
                <Typography className="title">Submission Date</Typography>
                <Typography className="value">{moment(dataResult?.asset?.createdOn).format('MMMM D, YYYY')}</Typography>
              </Box>
              <Box className="user-info-group">
                <Typography className="title">Status</Typography>
                <Box className="value">
                  <StatusComponent value={dataResult?.statusId === 2 ? '10' : dataResult?.statusId === 1 ? '9' : '3'} className="w-max" />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Reviewer;
