import express from 'express';
import controller from '../controllers/income/income';

const router = express.Router();

router.get('/', controller.readAll);
router.get('/read/:incomeID', controller.read);
router.post('/create', controller.create);
router.post('/query', controller.readExact);
router.post('/update/:incomeID', controller.update);
router.delete('/:incomeID', controller.deleteIncome);
router.post('/updateIncome/:userID', controller.incomeInUser);

export = router;
