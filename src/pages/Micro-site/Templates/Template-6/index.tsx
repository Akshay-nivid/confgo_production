
import './template6.scss'
import { TemplateWrapper } from '../Template-components'
import T6navbar from './T6navbar'
import T6heroSection from './T6heroSection'
import T6about from './T6about'
import T6timeRemaining from './T6timeRemaining'
import T6speakers from './T6speakers'
import T6location from './T6location'
import T6priceTier from './T6priceTier'
import TFooter from '@/pages/events/template/_components/TFooter/TFooter'
import T6Sponsors from './T6Sponsors'
import T6SponsorContact from './T6SponsorContact'
import BannerSection from '../Template-components/Banner/Banner-section'
import T6Drawer from './T6Drawer'
import { Box } from '@mui/material'
import SponosrContactForm from '../Template-components/SponsorContactForm'



const Template6 = () => {

    return (
        <TemplateWrapper className='template-6'>
            <T6heroSection />
            <T6navbar />
            <T6about />
            <T6timeRemaining />
            <T6speakers />
            <T6location />
            <T6priceTier />
            <T6Sponsors/>
            <T6SponsorContact/>
            <BannerSection/>
            <TFooter />
            <T6Drawer/>
        </TemplateWrapper>
    )
}


export default Template6