import express from 'express';
import controller from '../controllers/expense/expense';

const router = express.Router();

router.get('/', controller.readAll);
router.get('/read/:expenseID', controller.read);
router.post('/create/:userID', controller.create);
router.post('/query', controller.readExact);
router.post('/update/:expenseID', controller.update);
router.delete('/:expenseID', controller.deleteExpense);
router.patch('/editExpense/:userID/:expenseID', controller.editExpenseInUser);
router.patch('/updateExpense/:userID', controller.expenseInUser);

export = router;
