import express from 'express';
import controller from '../controllers/income/income';

const router = express.Router();

router.get('/', controller.readAll);
router.get('/read/:incomeID', controller.read);
router.post('/create', controller.create);
router.post('/query', controller.readExact);
router.patch('/update/:incomeID', controller.update);
router.delete('/:incomeID', controller.deleteIncome);
router.patch('/updateIncome/:userID', controller.incomeInUser);

export = router;
