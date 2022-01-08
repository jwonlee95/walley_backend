import express from 'express';
import controller from '../controllers/expense/expense';

const router = express.Router();

router.post('/create/expense', controller.create);
router.get('/get/expense', controller.readAll);

export = router;
