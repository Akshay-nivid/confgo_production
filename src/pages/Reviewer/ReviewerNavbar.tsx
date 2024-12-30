import Grid from "@mui/material/Grid2";
import {Avatar, Typography} from '@mui/material';

/**
 * ReviewerNavbar component renders the top navigation bar for the reviewer
 * It displays a logo and avatar
 */

const ReviewerNavbar = () => {
    return (
        <Grid container className="reviewer-nav-wrapper">

            <Grid className="reviewer-nav" size={11}>
                <Typography className="logo">Logo</Typography>
                <Avatar className='avatar' src="/placeholder.svg" />
            </Grid>

        </Grid>
    )
}

export default ReviewerNavbar