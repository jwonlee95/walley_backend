import express from 'express';
import controller from '../controllers/expense/expense';

const router = express.Router();

router.get('/', controller.readAll);
router.get('/read/:expenseID', controller.read);
router.post('/create', controller.create);
router.post('/query', controller.readExact);
router.patch('/update/:expenseID', controller.update);
router.delete('/:expenseID', controller.deleteExpense);
router.patch('/updateExpense/:userID', controller.expenseInUser);

export = router;
