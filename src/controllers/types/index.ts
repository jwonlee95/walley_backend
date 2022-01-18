import e, { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mongoose from 'mongoose';
import Types from '../../models/types';
import User from '../../models/user';

const create = (req: Request, res: Response, next: NextFunction) => {
    let { name, budget, spent } = req.body;

    const types = new Types({
        _id: new mongoose.Types.ObjectId(),
        name,
        budget,
        spent
    });

    return types
        .save()
        .then((result) => {
            return res.status(201).json({
                types: result
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
    const _id = req.params.typesID;
    logging.info(`Incoming read for types with id ${_id}`);

    Types.findById(_id)
        .populate('user')
        .exec()
        .then((types) => {
            if (types) {
                return res.status(200).json({ types });
            } else {
                logging.info('Types does not exist. Creating...');
                return create(req, res, next);
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
    logging.info('Readall route called');

    User.find()
        .exec()
        .then((users) => {
            return res.status(200).json({
                count: users.length,
                users: users
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const expenseTypesInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.userID;
    const body = req.body.types;
    const data = new Types({
        name: req.body.name,
        budget: req.body.budget,
        spent: req.body.amount,
        remain: req.body.budget,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
    });

    console.log('data is', data);
    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne({ _id: _id }, { $push: { expenseTypes: data } }).exec();
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

const incomeTypesInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.userID;
    const body = req.body.types;
    const data = new Types({
        name: req.body.name
    });

    console.log('data is', data);
    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne({ _id: _id }, { $push: { incomeTypes: data } }).exec();
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

const editIncomeTypesInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update Spent route called');

    const _id = req.params.userID;
    const data = new Types({
        oldName: req.body.oldName,
        name: req.body.name,
        budget: req.body.budget
    });

    console.log('data is', data);
    User.findById(_id, 'income')
        .exec()
        .then((user) => {
            if (user) {
                user.incomeTypes.map(function (e) {
                    User.updateOne(
                        { _id: _id },
                        {
                            $set: {
                                'incomeTypes.$[el].name': data.name,
                                'incomeTypes.$[el].budget': data.budget,
                                'incomeTypes.$[el].remain': { $subtract: [data.budget, 'incomeTypes.$[el].spent'] }
                            }
                        },
                        {
                            arrayFilters: [{ 'el.name': data.oldName }],
                            new: true
                        }
                    ).exec();
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

const addSpent = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update Spent route called');

    const _id = req.params.userID;
    var newSpent = 0;
    const data = new Types({
        name: req.body.category,
        spent: req.body.amount
    });

    console.log('data is', data);
    User.findById(_id, 'expense')
        .exec()
        .then((user) => {
            if (user) {
                user.expense.map(function (e) {
                    if (e.category === data.name) {
                        User.updateOne(
                            { _id: _id },
                            { $set: { 'expenseTypes.$[el].spent': newSpent + data.spent } },
                            {
                                arrayFilters: [{ 'el.name': data.name }],
                                new: true
                            }
                        ).exec();
                        newSpent += e.amount;
                    }
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

export default { create, read, expenseTypesInUser, incomeTypesInUser, addSpent };
