import express from 'express';
import controller from '../controllers/transaction';

const router = express.Router();

router.post('/create/:userID', controller.create);
router.patch('/edit/:userID/:transactionID', controller.edit);

export = router;
