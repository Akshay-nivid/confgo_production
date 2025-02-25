import './template5.scss'
import TRegisterButton from "../_components/TRegisterButton/TRegisterButton"
import TAuthButton from "../_components/TAuthButton/TAuthButton"
import { Avatar, Box, Typography } from "@mui/material"
import HeroSection from "./HeroSection5"
import Nav5 from './Nav5'
import { CalendarEventIcon } from '@/assets/svg'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AboutSection5 from './AboutSection5'
import TEventTimer from '../../../Micro-site/Templates/Template-components/TEventTimer/TEventTimer'
import Grid from "@mui/material/Grid2";
import TEventSpeakers from '../_components/TEventSpeakers/TEventSpeakers'
import TLocationMap from '../_components/TLocation/TLocation'
import TSponsors from '../_components/TSponsors/TSponsors'
import { convertUTCToUserTimeZone, toTitleCase } from '@/Utils/CommonBaseClass'
import config from '../../../../../config.json'
import { IEventPriceTier, ISponsor } from '@/Libs/types/event'
import TEventPriceTiers from '../_components/TEventPriceTiers/TEventPriceTiers'
import clsx from 'clsx'
import SponsorShip from '../sponsorShipForm/SponsorShip'
import PlaystorButton from '@/assets/svg/t5playstorebtn.svg'
import IosBtn from '@/assets/svg/t5iosbtn.svg'
import TFooter from '../_components/TFooter/TFooter'


const Template5 = () => {

    const baseUrl = config?.api?.url;

    return (
        <Box className="w-full template5">

            <HeroSection>
                <Nav5 />
                <Box className="date__container">
                    <Box className="date__container__card">
                        <Avatar className='date__container__card__icon'>
                            <CalendarEventIcon />
                        </Avatar>
                        <Box className="date__container__card__content">
                            <p className='date__container__card__content__title'>Date</p>
                            <p className='date__container__card__content__date'>September 15-17, 2025</p>
                        </Box>
                    </Box>
                </Box>

                <Box className="hero-content">
                    <p className='hero-content__title'>Advancing Healthcare: Medical Innovations & Research Conference 2024</p>
                    <Box className="hero-content__buttons">
                        <TAuthButton authType='LOGIN' className="hero-content__buttons__login">Login</TAuthButton>
                        <TAuthButton authType='LOGOUT' className="hero-content__buttons__login">Logout</TAuthButton>
                        <TRegisterButton className='hero-content__buttons__register' />
                    </Box>
                </Box>
                <Box className="venue__container">
                    <Box className="venue__container__card">
                        <Avatar className='venue__container__card__icon'>
                            <PlaceOutlinedIcon />
                        </Avatar>
                        <Box className="venue__container__card__content">
                            <p className='venue__container__card__content__title'>Location</p>
                            <p className='venue__container__card__content__date'>September 15-17, 2025</p>
                        </Box>
                    </Box>
                </Box>

            </HeroSection>

            <AboutSection5 />

            <Box className="timer-section main">
                <p className='timer-section__title'>Time Remaining</p>
                <TEventTimer className='timer-section__timer' />
            </Box>


            <Box id="speakers" className="speakers-section main">
                <h2 className='speakers-section__title'>Meet Our Esteemed Speakers</h2>

                <Grid className="speakers-section__container" container justifyContent={"center"} columnSpacing={4} rowSpacing={6}>
                    <TEventSpeakers ItemWrapper={({ children }) => <Grid className='speakers-section__container__item' size={{ xs: 12, sm: 6, md: 4, lg: 3 }} >
                        {children}
                    </Grid>
                    } />
                </Grid>
            </Box>


            <Box id='programs' className="programs-section">
                <p className='programs-section__title'>Conference Program Schedule</p>
            </Box>


            <Box id='location' className="location-section main">
                <p className='location-section__title'>Location</p>
                <Grid className="">
                    <TLocationMap />
                </Grid>
            </Box>


            <Box id="sponsors" className="sponsor-section main section-vertical-padding ">
                <p className='sponsor-section__title section-title-text'>Sponsors</p>
                <Grid className="sponsor-section__container" >
                    <TSponsors>
                        {({ data }) => {
                            return (
                                <>
                                    {
                                        Object.keys(data)?.length > 0 && Object?.entries(data)?.map(([key, items]: any) => {
                                            return (
                                                key === "DIAMOND" ? items?.length > 0 && (
                                                    <Box width={'100%'} className="" mb={5}>
                                                        <Box width={'100%'}>
                                                            <Typography className='sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>

                                                        </Box>
                                                        <Box className="flex flex-col gap-y-6 w-full">
                                                            {
                                                                items?.map((item: ISponsor) => {
                                                                    return (
                                                                        <Grid container className=" overflow-hidden" columnSpacing={2} justifyContent={"center"} alignItems={"center"} size={12}  >
                                                                            <img
                                                                                className='sponsor-banner-diamond app-border-radius shadow-app'
                                                                                src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''}
                                                                                alt="" />
                                                                        </Grid>
                                                                    )

                                                                })
                                                            }
                                                        </Box>
                                                    </Box>
                                                ) : key === "PLATINUM" ? items?.length > 0 && (
                                                    <Grid size={12} justifyContent={'center'} container spacing={2} mb={5}>
                                                        <Grid size={12}>
                                                            <Typography className='sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>
                                                        </Grid>
                                                        {
                                                            items?.map((item: any) => {
                                                                return (
                                                                    <Grid container justifyContent={"center"} alignItems={"flex-start"} size={{ xs: 12, sm: 6 }}>
                                                                        <img
                                                                            className='sponsor-banner-platinum app-border-radius shadow-app'
                                                                            src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''}
                                                                            alt=""
                                                                        />

                                                                    </Grid>
                                                                )
                                                            })
                                                        }
                                                    </Grid>
                                                ) : key === "GOLD" ? items?.length > 0 && (
                                                    <Grid mb={5} size={12} spacing={2} container justifyContent={'center'}>
                                                        <Grid size={12}>
                                                            <Typography className='sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>

                                                        </Grid>
                                                        {
                                                            items?.map((item: ISponsor) => {
                                                                return (
                                                                    <Grid container justifyContent={"center"} alignItems={"flex-start"} alignContent={"flex-start"} size={{ xs: 12, sm: 4 }}  >
                                                                        <img className='sponsor-banner-gold app-border-radius shadow-app' src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                                    </Grid>
                                                                )
                                                            })
                                                        }
                                                    </Grid>
                                                ) : <>
                                                    {items?.length > 0 && <Grid size={12} spacing={2} container justifyContent={'center'}>
                                                        <Grid size={12}>
                                                            <Typography textAlign={"center"} className='sponsor-banner-text'>{`${key && toTitleCase(key)} Sponsors`}</Typography>
                                                        </Grid>
                                                        {
                                                            items?.map((item: ISponsor) => {
                                                                return (
                                                                    <Grid size={{ xs: 12, sm: 3 }} container justifyContent={'center'} alignItems={"flex-start"} alignContent={"flex-start"}  >
                                                                        <img className='sponsor-banner-silver app-border-radius shadow-app' src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                                    </Grid>
                                                                )
                                                            })
                                                        }
                                                    </Grid>}
                                                </>


                                            )
                                        })
                                    }
                                </>
                            )
                        }}
                    </TSponsors>
                </Grid>
            </Box>





            <Box className="price-tier-section main section-vertical-padding ">
                <p className='price-section__title section-title-text'>Registration & Ticketing</p>
                <Grid id='tier' size={{ xs: 12, md: 12 }} className="" justifyContent={"center"} columnSpacing={4} rowSpacing={4} container >
                    {/* <TLocationMap /> */}
                    <TEventPriceTiers>

                        {
                            ({ data }) => (
                                <>
                                    {Object.entries(data)?.map(([_, priceTier], index: number) => {
                                        const isEven = index % 2 === 0;
                                        return (
                                            <Grid className={clsx("price-tier-section__item shadow-app", isEven && 'even-item', !isEven && 'odd-item')} size={{ xs: 12, md: 6 }} maxWidth={'35rem'}>
                                                <Typography className='price-tier-section__item__title mbc'>{priceTier?.[0].participantType?.name}</Typography>
                                                <Box className={clsx("divider mbc ", isEven && 'even-divider', !isEven && 'odd-divider')}></Box>
                                                {
                                                    priceTier?.map((item: IEventPriceTier) => (
                                                        <>
                                                            <Box display={"flex"} justifyContent={"space-between"} className="" key={item?.id}>
                                                                <Box>
                                                                    <Typography className='price-tier-section__item__name'>{item.name}</Typography>
                                                                    <Typography className='price-tier-section__item__date'>{convertUTCToUserTimeZone(item?.startDate, "MMM DD, YYYY")}-{convertUTCToUserTimeZone(item?.endDate, "MMM DD, YYYY")}</Typography>

                                                                </Box>
                                                                <Typography className='price-tier-section__item__price'>{item?.percentage}%</Typography>

                                                            </Box>
                                                            <Box className={clsx("divider mbc ", isEven && 'even-divider', !isEven && 'odd-divider')}></Box>

                                                        </>

                                                    ))
                                                }
                                                <Typography></Typography>
                                                <TRegisterButton size='large' className={clsx(index % 2 === 0 ? 'register-button-even' : 'register-button-odd')} userTypeId={priceTier?.[0].participantType?.id} fullWidth usageType='TIER-CARD' />
                                            </Grid>
                                        )
                                    }
                                    )}
                                </>
                            )
                        }

                    </TEventPriceTiers>
                </Grid>
            </Box>
            <Box id="sponsor-form" className="sponsor-form-section main ">
                <Grid className="">
                    <SponsorShip />
                </Grid>
            </Box>
            <Box id="banner" className="banner  main section-vertical-padding">
                <Grid display={"flex"} className="banner-container">
                    <Box className="banner-img">

                    </Box>
                    <Box flex={1} className="banner-info-container">
                        <Typography className='banner-title'>Track events, manage tickets, and get real-time updates—all in one place!</Typography>
                        <Box className="banner-button-container">
                            <Box className="playstore-btn">
                                <PlaystorButton width={'100%'} height={'100%'} />

                            </Box>
                            <Box className="playstore-btn">
                                <IosBtn width={'100%'} height={'100%'} />

                            </Box>
                        </Box>
                        <Typography className='banner-subtitle'>Download Now & Simplify Your Event Experience!</Typography>

                    </Box>
                </Grid>
            </Box>
            <TFooter />

        </Box >
    )
}

export default Template5;






