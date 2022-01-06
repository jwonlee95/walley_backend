import express from 'express';
import controller from '../controllers/expense/expense';

const router = express.Router();

router.post('/create/expense', controller.createExpense);
router.get('/get/expense', controller.getAllExpense);

export = router;
