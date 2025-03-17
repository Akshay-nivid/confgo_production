import TDrawer from '../Template-components/TemplateDrawer'
/**
 * T7Drawer component renders a drawer navigation menu for Template 7.
 * It uses the TemplateDrawer component and provides navigation links to different sections
 * like Speakers, Sponsors, Programs, Location, Tickets and Sponsor Form.
 * 
 * The drawer can be toggled open/closed and provides a mobile-friendly navigation experience.
 */
const T7Drawer = () => {

const dta = [{label: 'Speakers', targetElementId: 'speakers'}, {label: 'Sponsors', targetElementId: 'sponsors'}, {label: 'Programs', targetElementId: 'programs'}, {label: 'Location', targetElementId: 'location'}, {label: 'Tickets', targetElementId: 'tickets'}, {label: 'Sponsor Form', targetElementId: 'sponsor-form'}]

  return (
      <TDrawer className='' data={dta}>
    </TDrawer>
  )
}

export default T7Drawer
