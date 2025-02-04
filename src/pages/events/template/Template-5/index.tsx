import Grid from "@mui/material/Grid2"
import TEventSpeakers from "../_components/TEventSpeakers/TEventSpeakers"
import TLink from "../_components/TLink/TLink"
import TRegisterButton from "../_components/TRegisterButton/TRegisterButton"
import TEventTimer from "../_components/TEventTimer/TEventTimer"
import TAuthButton from "../_components/TAuthButton/TAuthButton"
import TProgram from "../_components/TProgram/TProgram"


const Template5 = () => {
    return (
        <div className="w-full">
            <TRegisterButton />
            <TLink targetelementId="speakers" >
                About</TLink>
            <TLink targetelementId="programs" >About</TLink>
            <TLink targetelementId="sponsors" >About</TLink>
            <TLink targetelementId="location" >About</TLink>
            <TLink targetelementId="tickets" >About</TLink>


            <TEventTimer />
            <TAuthButton authType="SIGNUP">SignUp</TAuthButton>
            <TAuthButton authType="LOGOUT">Logout</TAuthButton>
            <TAuthButton authType="LOGIN">Login</TAuthButton>

            <Grid container columnSpacing={2} rowSpacing={2} >
                <Grid id="SPEAKERS" container marginInline={"auto"} size={11}>
                <TEventSpeakers ItemWrapper={({ children }) => <Grid size={3} >
                    {children}
                </Grid>
                } />
                    </Grid>
            </Grid>

            <TProgram>
                {(props: any) => {
                    return (
                     <></>
                   )
                }}
            </TProgram>
        </div>
    )
}

export default Template5;






 