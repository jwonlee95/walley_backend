import express from 'express';
import controller from '../controllers/category';

const router = express.Router();

router.get('/read/:userID/:categoryID', controller.read);
router.patch('/create/:userID', controller.create);
router.patch('/addSpent/:userID', controller.addSpent);
router.patch('/updateSpent/:userID', controller.updateSpent);

export = router;
