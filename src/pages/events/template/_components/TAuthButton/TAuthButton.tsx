import  { setDataById } from '@/Libs/store';
import routes from '@/router/routes';
import { handleLogout } from '@/Utils/CommonBaseClass';
import Button, { ButtonProps } from '@mui/material/Button/Button'
import { useNavigate } from 'react-router-dom';


interface TRegisterButtonProps extends ButtonProps {
    authType: "SIGNUP" | "LOGIN" | "LOGOUT";
    children: React.ReactNode
}

const TAuthButton = ({ authType, children, ...props }: TRegisterButtonProps) => {

    const navigate = useNavigate();

    const isUserLoggedIn = sessionStorage.getItem('userToken');
    const isCompany = sessionStorage.getItem('userLoggedInType') === 'COMPANYADMIN';
    /**
     * Function navigates to the login page and stores the previous route in the store
     */
    const loginFn = () => {



        if (isCompany) {
            handleLogout({
                onLogoutSuccess: () => {
                    setDataById("previousRoute", { url: location.pathname });

                    navigate(routes.userLogin());
                }
            });

            return;
        }

        setDataById("previousRoute", { url: location.pathname });
        navigate(routes.userLogin());
    }

    /**
     * Function navigates to the signup page and stores the previous route in the store
     */
    const signupFn = () => {
        setDataById("previousRoute", { url: location.pathname });
        navigate(routes.userRegister());
    }


    /**
     * Function scrolls to the sponsorship form section when the sponsor button is clicked
     */
    const logoutFn = () => {
        handleLogout({
            onLogoutSuccess: () => {
                navigate(routes.userLogin());
            }
        })
    }


    const showLoginBtn = authType === "LOGIN" && !isUserLoggedIn;
    const showSignupBtn = authType === "SIGNUP" && !isUserLoggedIn;
    const showLogoutBtn = authType === "LOGOUT" && isUserLoggedIn;

    return (
        <>
            {
                (showLoginBtn || showSignupBtn || showLogoutBtn) ?

                    < Button {...props} onClick={authType === "LOGIN" ? loginFn : authType === "SIGNUP" ? signupFn : logoutFn} >
                        {children}
                    </Button>
                    :
                    <></>
            }
        </>
    )

}

export default TAuthButton