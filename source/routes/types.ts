import express from 'express';
import controller from '../controllers/types';

const router = express.Router();

router.get('/read/:types', controller.read);
router.post('/create', controller.create);
router.patch('/updateTypes/:userID', controller.typesInUser);

export = router;
