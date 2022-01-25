import e, { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mongoose from 'mongoose';
import Category from '../../models/category';
import User from '../../models/user';

const create = (req: Request, res: Response, next: NextFunction) => {
    let { name, budget, spent } = req.body;

    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name,
        budget,
        spent
    });

    return category
        .save()
        .then((result) => {
            return res.status(201).json({
                category: result
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
    const _id = req.params.categoryID;
    logging.info(`Incoming read for category with id ${_id}`);

    Category.findById(_id)
        .populate('user')
        .exec()
        .then((category) => {
            if (category) {
                return res.status(200).json({ category });
            } else {
                logging.info('Category does not exist. Creating...');
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

const expenseCategoryInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.userID;
    const body = req.body.category;
    const data = new Category({
        icon: req.body.icon,
        color: req.body.color,
        name: req.body.name,
        budget: req.body.budget,
        remain: req.body.budget
    });

    console.log('data is', data);
    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne({ _id: _id }, { $push: { category: data } }).exec();
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

const incomeCategoryInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.userID;
    const body = req.body.category;
    const data = new Category({
        name: req.body.name
    });

    console.log('data is', data);
    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne({ _id: _id }, { $push: { incomeCategory: data } }).exec();
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

const editIncomeCategoryInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update Spent route called');

    const _id = req.params.userID;
    const data = new Category({
        oldName: req.body.oldName,
        name: req.body.name,
        budget: req.body.budget
    });

    console.log('data is', data);
    User.findById(_id, 'income')
        .exec()
        .then((user) => {
            if (user) {
                user.incomeCategory.map(function (e) {
                    User.updateOne(
                        { _id: _id },
                        {
                            $set: {
                                'incomeCategory.$[el].name': data.name,
                                'incomeCategory.$[el].budget': data.budget,
                                'incomeCategory.$[el].remain': { $subtract: [data.budget, 'incomeCategory.$[el].spent'] }
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
    const data = new Category({
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
                            { $set: { 'expenseCategory.$[el].spent': newSpent + data.spent } },
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

export default { create, read, expenseCategoryInUser, incomeCategoryInUser, addSpent };
