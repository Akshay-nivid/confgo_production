

import TFooter from '@/pages/events/template/_components/TFooter/TFooter';
import { TemplateWrapper } from '../Template-components'
import T7About from './T7About';
import T7HeroSection from './T7HeroSection';
import T7Location from './T7Location';
import T7Navbar from './T7Navbar';
import T7PriceTier from './T7PriceTier';
import T7Speakers from './T7Speakers';
import T7SponsorContact from './T7SponsorContact';
import T7timeRemaining from './T7TimeRemaining';
import './template7.scss';
import BannerSection from '../Template-components/Banner/Banner-section';
import T7Sponsors from './T7Sponors';
import T7ProgramAddon from './T7ProgramAddon';
import useValidateEventData from '../programHandler';
import T7Drawer from './T7Drawer';
/**
 * Componet for Template 7 parent
 */
const Template7=()=>{
    const {isEventPriceTiers,isLocation,isSpeakers,isSponsors} = useValidateEventData()
    return(
        <TemplateWrapper className='template-7'>
            <T7Navbar/>
            <T7HeroSection/>
            <T7About/>
            <T7timeRemaining/>
            <T7ProgramAddon/>
            {isSpeakers&&<T7Speakers/>}
            {isLocation&&<T7Location/>}
            {isEventPriceTiers&&<T7PriceTier/>}
            <T7SponsorContact/>
            {isSponsors&&<T7Sponsors/>}
            <BannerSection className='t7-banner'/>
            <TFooter />
            <T7Drawer/>
        </TemplateWrapper>

    )

}

export default Template7;