import express from 'express';
import controller from '../controllers/subscription/subscription';

const router = express.Router();

router.patch('/updateSubscription/:userID', controller.subInUser);

export = router;
