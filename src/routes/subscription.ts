import express from 'express';
import controller from '../controllers/subscription';

const router = express.Router();

router.patch('/create/:userID', controller.create);
router.post('/updateRecurDate/:userID', controller.updateRecurDate);

export = router;
