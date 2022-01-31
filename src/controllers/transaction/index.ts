import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import Transaction from '../../models/transaction';
import User from '../../models/user';

const create = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Create Transaction route called');

    const _id = req.params.userID;
    const data = new Transaction({
        category: req.body.category,
        type: req.body.type,
        description: req.body.description,
        date: req.body.date,
        amount: req.body.amount,
        memo: req.body.memo
    });
    console.log('data is ', data);
    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne({ _id: _id }, { $push: { transaction: data } }).exec();
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

const edit = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update edit transaction route called');
    const _id = req.params.userID;
    const transactionID = req.params.transactionID;
    const data = {
        category: req.body.category,
        type: req.body.type,
        description: req.body.description,
        date: req.body.date,
        amount: req.body.amount,
        memo: req.body.memo
    };

    console.log('data is', data);
    User.findById(_id, 'transaction')
        .exec()
        .then((user) => {
            if (user) {
                user.transaction.map(function (e) {
                    User.updateOne(
                        { _id: _id },
                        {
                            $set: {
                                'transaction.$[el].category': req.body.category,
                                'transaction.$[el].type': req.body.type,
                                'transaction.$[el].description': req.body.description,
                                'transaction.$[el].date': req.body.date,
                                'transaction.$[el].amount': req.body.amount,
                                'transaction.$[el].memo': req.body.memo
                            }
                        },
                        {
                            arrayFilters: [{ 'el._id': transactionID }],
                            new: true
                        }
                    ).exec();
                });
                user.save()
                    .then(() => {
                        logging.info(`User with id ${_id} updated`);
                        const data = {
                            category: req.body.category,
                            type: req.body.type,
                            description: req.body.description,
                            date: req.body.date,
                            amount: req.body.amount,
                            memo: req.body.memo,
                            _id: transactionID
                        };
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

const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Delete transaction route called');

    const _id = req.params.userID;
    const transactionID = req.params.transactionID;

    var ObjectId = require('mongoose').Types.ObjectId;

    User.findById(_id, 'transaction')
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne(
                    { _id: _id },
                    {
                        $pull: {
                            transaction: { _id: transactionID }
                        }
                    }
                ).exec();
                user.save().then(() => {
                    return res.status(201).json({
                        payload: {
                            data: transactionID
                        }
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

export default { create, edit, deleteTransaction };
