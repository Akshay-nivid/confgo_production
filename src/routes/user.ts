/**
 * User Routes
 * Author: sarathavs
 */
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { verifyToken } from '../middleware/jwtMiddleware';

const router = Router();
const userController = new UserController();

router.post('/forgotPassword', (req, res, next) =>
  userController.forgotPassword(req, res, next)
);
router.post('/list', verifyToken, (req, res, next) =>
  userController.getAllUsers(req, res, next)
);
router.get('/', verifyToken, (req, res, next) =>
  userController.getUserById(req, res, next)
);
router.post('/', (req, res, next) => userController.createUser(req, res, next));

router.post('/details', (req, res, next) =>
  userController.retrieveUserDetails(req, res, next)
);

router.put('/', verifyToken, (req, res, next) =>
  userController.updateUser(req, res, next)
);
// router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));
router.put('/setpassword', (req, res, next) =>
  userController.setPassword(req, res, next)
);
router.put('/phone', verifyToken, (req, res, next) =>
  userController.updateUserPhone(req, res, next)
);
router.post('/checkRegistration', (req, res, next) =>
  userController.checkUserRegistration(req, res, next)
);
router.post('/userRole/list', verifyToken, (req, res, next) =>
  userController.getAllUserWithRoles(req, res, next)
);
router.post('/assignEvent', (req, res, next) =>
  userController.assignEventToUser(req, res, next)
);
router.post('/volunteerEvent/list', (req, res, next) =>
  userController.getAllVolunteerEvents(req, res, next)
);
router.delete('/volunteerEvent/:id', (req, res, next) =>
  userController.deleteVolunteerEvent(req, res, next)
);
//route for company admins to edit user details
router.put('/update/:id', verifyToken, (req, res, next) =>
  userController.adminUpdateUser(req, res, next)
);
router.post('/changePassword', verifyToken, (req, res, next) =>
  userController.changePassword(req, res, next)
);
export default router;
