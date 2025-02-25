import './tdrawer.scss'
import useStore, { setNonPersistedDataById } from "@/Libs/store";
import { Box, Drawer, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';



const TDrawer:React.FC<{children: React.ReactNode,className?:string}> = ({children,className }) => {

    const isDrawerOpen = useStore(state => state.nonPersistedData?.templateDrawerOpen?.value) || false;

 function handleClose(){
        setNonPersistedDataById('templateDrawerOpen', {value:false})
 }

  return (
      <Drawer
     className={className}
      PaperProps={{
        sx: {
            width: '100%', // Makes the drawer take full width
             
        }
    }}
          open={isDrawerOpen}
          anchor="right"
          
      >
          <Box className="min-h-full  bg-black relative w-full">
         
              <IconButton onClick={handleClose} sx={{position:'absolute',top:'1.5rem',right:'1rem',border:'0.15rem solid gray',color:'gray',borderRadius:'0.8rem',padding:'0.4rem'}} >
                  
                  <CloseIcon className="template-drawer-close-icon "  />
              </IconButton>
                  
              
          {children}
              
          </Box>
         
   </Drawer>
  )
}

export default TDrawer