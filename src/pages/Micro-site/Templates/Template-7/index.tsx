

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
/**
 * Componet for Template 7
 */
const Template7=()=>{
    return(
        <TemplateWrapper className='template-7'>
            <T7Navbar/>
            <T7HeroSection/>
            <T7About/>
            <T7timeRemaining/>
            <T7Speakers/>
            <T7Location/>
            <T7PriceTier/>
            <T7SponsorContact/>
            <T7Sponsors/>
            <BannerSection className='t7-banner'/>
            <TFooter />
        </TemplateWrapper>

    )

}

export default Template7;