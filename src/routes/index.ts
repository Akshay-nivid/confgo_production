/**
 * Routes
 * Author: sarathavs
 */
import { Router } from 'express';
import userRouter from './user';
import authRouter from './auth';
import dataRouter from './data';
import companyRouter from './company';
import couponRouter from './coupon';
import participantRouter from './participant';
import tokenRouter from './token';
import assetRouter from './asset';
import planRouter from './plan';
import eventRouter from './event';
import paymentRouter from './payment';
import eventSpeakerRouter from './eventSpeaker';
import addonRouter from './addon';
import attendeeRouter from './attendee';
import notificationRouter from './notification';
import eventRegistrationRecordRouter from './eventRegistrationRecord';
import orderRouter from './order';
import cartRouter from './cart';
import subscriptionRouter from './subscription';
import dashboardRouter from './dashboard';
import templateRouter from './template';
import { verifyToken } from '../middleware/jwtMiddleware';
import volunteerRouter from './volunteer';
import checkOutRouter from './checkout';
import RoleRouter from './role';
import UserAbstractRouter from './userAbstract';
import specialtyRouter from './specialty';
import sponsorRouter from './sponsor';
import taxRouter from './tax';
import eventImagesRouter from './eventImages';
import sponsorTypeRouter from './sponsorType';
import paypalConfigurationRouter from './companyPaypalConfiguration';

const router = Router();

// Register all routes here
// router.use('/user', verifyToken, userRouter); //all sub routes under verify token
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/company', companyRouter);
router.use('/data', verifyToken, dataRouter);
router.use('/coupon', verifyToken, couponRouter);
router.use('/participant', participantRouter);
router.use('/token', tokenRouter);
router.use('/asset', assetRouter);
router.use('/plan', planRouter);
router.use('/event', eventRouter);
router.use('/payment', paymentRouter);
router.use('/eventSpeaker', eventSpeakerRouter);
router.use('/addon', addonRouter);
router.use('/attendance', attendeeRouter);
router.use('/notification', notificationRouter);
router.use('/registrationRecord', eventRegistrationRecordRouter);
router.use('/order', orderRouter);
router.use('/cart', cartRouter);
router.use('/subscription', subscriptionRouter);
router.use('/dashboard', dashboardRouter);
router.use('/template', templateRouter);
router.get('/status', (req, res) => res.send('okay'));
router.use('/volunteer', verifyToken, volunteerRouter);
router.use('/checkout', verifyToken, checkOutRouter);
router.use('/role', RoleRouter);
router.use('/userAbstract', verifyToken, UserAbstractRouter);
router.use('/specialty', specialtyRouter);
router.use('/sponsor', sponsorRouter);
router.use('/tax', taxRouter);
router.use('/eventImage', eventImagesRouter);
router.use('/sponsorType', sponsorTypeRouter);
router.use('/paypalConfig', paypalConfigurationRouter);


export default router;
