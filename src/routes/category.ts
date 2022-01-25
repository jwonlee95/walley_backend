import express from 'express';
import controller from '../controllers/category';

const router = express.Router();

router.get('/read/:category', controller.read);
// router.post('/create', controller.create);
router.patch('/updateExpenseCategory/:userID', controller.expenseCategoryInUser);
router.patch('/updateIncomeCategory/:userID', controller.incomeCategoryInUser);
router.patch('/updateSpent/:userID', controller.addSpent);

export = router;
