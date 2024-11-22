import Grid from '@mui/material/Grid2';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { useMemo } from 'react';
import { Divider } from '@/assets/svg';
import { Button } from '@mui/material';
import { handleLogout } from '@/Utils/CommonBaseClass';

/**
 * Component used to draw nav bar
 */
const Navbar = () => {
    const location = useLocation(); // Get the current path
    const navigate = useNavigate();

    const isUserLoggedIn = sessionStorage.getItem('token');

    const navLinks = useMemo(() => {
        return {
            "Home": routes.participantHome(),
            "Programs": routes.participantHome(),
            "About": routes.participantHome(),
            // "Login": routes.userLogin()
        };
    }, [location]);

    return (
        <Grid container className="participant_nav">
            <Grid size={3}></Grid>
            <Grid container size={8} justifyContent={'flex-end'} alignItems={'center'} className="participant_nav-conatiner">
                <Grid container >
                    {Object.entries(navLinks).map(([key, path]) => (
                        <Grid container key={key}>
                            <Link to={path} className="participant_nav-link">{key}</Link>
                        </Grid>
                    ))}
                    {!isUserLoggedIn ?
                    <>
                    <Grid>
                        <Divider className="participant_nav-divider" />
                    </Grid>
                    <Grid>
                        <Button className='participant_nav-signButton' onClick={() => navigate(routes.userRegister())}>Sign In</Button>
                        </Grid>
                        </> :
                        <>
                        <Grid>
                            <Divider className="participant_nav-divider" />
                        </Grid>
                        <Grid>
                            <Button className='participant_nav-signButton' onClick={() => handleLogout({onLogoutSuccess: () => navigate(routes.userLogin())})}>Logout</Button>
                            </Grid>
                            </>
                        }
                        
                </Grid>
            </Grid>
            <Grid size={1}></Grid>
        </Grid>
    );
};

export default Navbar;
