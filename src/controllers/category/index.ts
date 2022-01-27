import e, { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mongoose from 'mongoose';
import Category from '../../models/category';
import User from '../../models/user';
import category from '../../models/category';

const create = async (req: Request, res: Response, next: NextFunction) => {
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
                            payload: {
                                data: data
                            }
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

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.userID;
    const categoryID = req.params.categoryID;
    logging.info(`Incoming read for category with name ${categoryID}`);

    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                user.category.map(function (e) {
                    if (e._id === categoryID) {
                        return res.status(200).json({
                            payload: {
                                data: e
                            }
                        });
                    }
                });
                // return res.status(200).json({
                //     payload: {
                //         data: user
                //     }
                // });
            } else {
                return res.status(404).json({
                    error: 'User not found.'
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

const addSpent = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Add Spent route called');

    const _id = req.params.userID;
    const data = new Category({
        name: req.body.name,
        spent: req.body.spent
    });
    var newSpent = data.spent;
    var exist = false;

    console.log('data is', data);
    User.findById(_id, 'expense')
        .exec()
        .then((user) => {
            if (user) {
                user.expense.map(function (e) {
                    if (e.category === data.name) {
                        exist = true;
                    }
                    if (exist === true) {
                        console.log('EXIST TRUE ');

                        newSpent = newSpent + e.amount;
                        User.updateOne(
                            { _id: _id },
                            { $set: { 'category.$[el].spent': newSpent } },
                            {
                                arrayFilters: [{ 'el.name': data.name }],
                                new: true
                            }
                        ).exec();
                    }
                });
                if (exist === false) {
                    console.log('EXIST FALSE ');
                    User.updateOne(
                        { _id: _id },
                        { $set: { 'category.$[el].spent': data.spent } },
                        {
                            arrayFilters: [{ 'el.name': data.name }],
                            new: true
                        }
                    ).exec();
                }
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

const updateSpent = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update Spent route called');

    const _id = req.params.userID;
    var changedCategoryOldSpent = 0;
    const data = new Category({
        name: req.body.name,
        spent: req.body.spent,
        oldAmount: req.body.oldAmount,
        oldSpent: req.body.oldSpent,
        oldName: req.body.oldName
    });

    console.log('data is', data);
    User.findById(_id, 'category')
        .exec()
        .then((user) => {
            if (user) {
                if (data.oldName === data.name) {
                    User.updateOne(
                        { _id: _id },
                        { $set: { 'category.$[el].spent': data.oldSpent - data.oldAmount + data.spent } },
                        {
                            arrayFilters: [{ 'el.name': data.name }],
                            new: true
                        }
                    ).exec();
                } else {
                    {
                        user.category.map(function (e) {
                            if (e.name === data.name) {
                                console.log('Now looking at: ', e.name);
                                changedCategoryOldSpent = e.spent;
                                console.log('OldCategorySpentIs: ', changedCategoryOldSpent);
                                User.updateOne(
                                    { _id: _id },
                                    { $set: { 'category.$[el].spent': changedCategoryOldSpent + data.spent, 'category.$[old].spent': data.oldSpent - data.spent } },
                                    {
                                        arrayFilters: [{ 'el.name': data.name }, { 'old.name': data.oldName }],
                                        multi: true
                                    }
                                ).exec();
                            }
                        });
                    }
                }
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

export default { create, read, addSpent, updateSpent };
