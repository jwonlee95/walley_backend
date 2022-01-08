import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mongoose from 'mongoose';
import Expense from '../../models/expense';

const create = (req: Request, res: Response, next: NextFunction) => {
    let { category, user, description, amount, balance } = req.body;

    const expense = new Expense({
        _id: new mongoose.Types.ObjectId(),
        category,
        user,
        description,
        amount,
        balance
    });

    return expense
        .save()
        .then((result) => {
            return res.status(201).json({
                expense: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.expenseID;
    logging.info(`Incoming read for expense with id ${_id}`);

    Expense.findById(_id)
        .populate('user')
        .exec()
        .then((expense) => {
            if (expense) {
                return res.status(200).json({ expense });
            } else {
                return res.status(404).json({
                    error: 'expense not found.'
                });
            }
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                error: error.message
            });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Returning all expenses ');

    Expense.find()
        .populate('user')
        .exec()
        .then((expense) => {
            return res.status(200).json({
                count: expense.length,
                expenses: expense
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const readExact = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Query route called');

    Expense.find(req.body)
        .populate('user')
        .exec()
        .then((expense) => {
            return res.status(200).json({
                count: expense.length,
                expenses: expense
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.expenseID;

    Expense.findById(_id)
        .exec()
        .then((expense) => {
            if (expense) {
                expense.set(req.body);
                expense
                    .save()
                    .then((savedExpense) => {
                        logging.info(`Expense with id ${_id} updated`);

                        return res.status(201).json({
                            expense: savedExpense
                        });
                    })
                    .catch((error) => {
                        logging.error(error.message);

                        return res.status(500).json({
                            message: error.message
                        });
                    });
            } else {
                return res.status(401).json({
                    message: 'NOT FOUND'
                });
            }
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const deleteExpense = (req: Request, res: Response, next: NextFunction) => {
    logging.warn('Delete route called');

    const _id = req.params.expenseID;

    Expense.findByIdAndDelete(_id)
        .exec()
        .then(() => {
            return res.status(201).json({
                message: 'Expense deleted'
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

export default { create, read, readAll, readExact, update, deleteExpense };
