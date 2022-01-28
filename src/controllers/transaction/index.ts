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
    const expenseID = req.params.expenseID;
    const data = new Transaction({
        category: req.body.category,
        description: req.body.description,
        amount: req.body.amount,
        type: req.body.type,
        date: req.body.date
    });

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
                                'transaction.$[el].category': data.category,
                                'transaction.$[el].description': data.description,
                                'transaction.$[el].amount': data.amount,
                                'transaction.$[el].type': data.type,
                                'transaction.$[el].date': data.date
                            }
                        },
                        {
                            arrayFilters: [{ 'el._id': expenseID }],
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

export default { create, edit };
