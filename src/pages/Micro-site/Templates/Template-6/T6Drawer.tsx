import TDrawer from '../Template-components/TemplateDrawer'

const T6Drawer = () => {

const dta = [{label: 'Speakers', targetElementId: 'speakers'}, {label: 'Sponsors', targetElementId: 'sponsors'}, {label: 'Programs', targetElementId: 'programs'}, {label: 'Location', targetElementId: 'location'}, {label: 'Tickets', targetElementId: 'tickets'}, {label: 'Sponsor Form', targetElementId: 'sponsor-form'}]

  return (
      <TDrawer className='t6-drawer' data={dta}>
    </TDrawer>
  )
}

export default T6Drawer
