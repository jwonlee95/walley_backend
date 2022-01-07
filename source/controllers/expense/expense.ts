import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Expense from '../../models/expense';

const createExpense = (req: Request, res: Response, next: NextFunction) => {
    let { category, description, amount, balance } = req.body;

    const expense = new Expense({
        _id: new mongoose.Types.ObjectId(),
        category,
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

const getAllExpense = (req: Request, res: Response, next: NextFunction) => {
    Expense.find()
        .exec()
        .then((expense) => {
            return res.status(200).json({
                expense: expense,
                count: expense.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { createExpense, getAllExpense };
