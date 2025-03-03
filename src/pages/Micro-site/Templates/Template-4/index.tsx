import TFooter from "@/pages/events/template/_components/TFooter/TFooter";
import { TemplateWrapper } from "../Template-components";
import T4About from "./T4About";
import T4HeroSection from "./T4HeroSection";
import T4Location from "./T4Location";
import T4Navbar from "./T4NavBar";
import T4PriceTier from "./T4PriceTier";
import T4Speakers from "./T4Speakers";
import T4SponsorContact from "./T4SponsorContact";
import T4Sponsors from "./T4Sponsors";
import T4TimeRemaining from "./T4TimeRemaining";
import './template4.scss';
import BannerSection from "../Template-components/Banner/Banner-section";
const NewTemplate4 = () => {

    return (
        <TemplateWrapper className='template-4'>
            <T4HeroSection/>
            <T4Navbar/>
            <T4About />
            <T4TimeRemaining />
            <T4Speakers />
            <T4Location />
            <T4Sponsors />
            <T4PriceTier />
            <T4SponsorContact />
            <BannerSection className='t4-banner'/>
            <TFooter />
        </TemplateWrapper>
    );

}
export default NewTemplate4;