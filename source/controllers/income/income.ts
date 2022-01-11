import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mongoose from 'mongoose';
import Income from '../../models/income';
import User from '../../models/user';

const create = (req: Request, res: Response, next: NextFunction) => {
    let { category, description, amount, balance } = req.body;

    const income = new Income({
        _id: new mongoose.Types.ObjectId(),
        category,
        description,
        amount,
        balance
    });

    return income
        .save()
        .then((result) => {
            return res.status(201).json({
                income: result
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
    const _id = req.params.incomeID;
    logging.info(`Incoming read for income with id ${_id}`);

    Income.findById(_id)
        .populate('user')
        .exec()
        .then((income) => {
            if (income) {
                return res.status(200).json({ income });
            } else {
                return res.status(404).json({
                    error: 'income not found.'
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
    logging.info('Returning all incomes ');

    Income.find()
        .populate('user')
        .exec()
        .then((income) => {
            return res.status(200).json({
                count: income.length,
                incomes: income
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

    Income.find(req.body)
        .populate('user')
        .exec()
        .then((income) => {
            return res.status(200).json({
                count: income.length,
                incomes: income
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

    const _id = req.params.incomeID;

    Income.findById(_id)
        .exec()
        .then((income) => {
            if (income) {
                income.set(req.body);
                income
                    .save()
                    .then((savedIncome) => {
                        logging.info(`Income with id ${_id} updated`);

                        return res.status(201).json({
                            income: savedIncome
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

const deleteIncome = (req: Request, res: Response, next: NextFunction) => {
    logging.warn('Delete route called');

    const _id = req.params.incomeID;

    Income.findByIdAndDelete(_id)
        .exec()
        .then(() => {
            return res.status(201).json({
                message: 'Income deleted'
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const incomeInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.userID;
    const data = new Income({
        category: req.body.category,
        description: req.body.description,
        amount: req.body.amount,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
    });

    console.log('data is', data);
    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne({ _id: _id }, { $push: { income: data } }).exec();
                user.save()
                    .then((savedUser) => {
                        logging.info(`User with id ${_id} updated`);

                        return res.status(201).json({
                            user: savedUser
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

export default { create, read, readAll, readExact, update, deleteIncome, incomeInUser };
