import express from 'express';
import controller from '../controllers/category';

const router = express.Router();

router.patch('/create/:userID', controller.create);
router.patch('/updateSpent/:userID', controller.addSpent);

export = router;
