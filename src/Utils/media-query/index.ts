import { useMediaQuery } from 'react-responsive';


/**
 * custom hook to get the screen size
 * 
 */
const useScreenSizes = () => {
  const mobile = useMediaQuery({ maxWidth: 600 })
  const tablet = useMediaQuery({ maxWidth: 900 })
  const laptop = useMediaQuery({ maxWidth: 1200 })
  const desktop = useMediaQuery({ minWidth: 1200 })

  return {
    mobile,
    tablet,
    laptop,
    desktop
  };
};

export default useScreenSizes;
