import { Box, Typography } from '@mui/material'
import clsx from 'clsx'

/**
 * A Badge component that displays a colored tag with a label.
 * @param {{text:string,type:"addon" | "program"}} props
 * @prop {string} text The text to display in the badge.
 * @prop {"addon" | "program"} type The type of the badge, which determines the color and style of the badge.
 * @returns {ReactElement} The Badge component.
 */
const Badge = ({text,type}:{text:string,type:"addon" | "program"}) => {
  return (
    <Box className={clsx(type === "addon" ? "border border-orange-200 px-2 font-medium rounded-md ml-auto w-max bg-orange-100 h-max":"border border-sky-200 px-2 font-medium rounded-md ml-auto bg-sky-100 w-max h-max")}>
        <Typography fontWeight={500}>{text}</Typography>
      </Box>
  )
}

export default Badge