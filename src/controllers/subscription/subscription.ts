import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';

import Subscription from '../../models/subscription';
import User from '../../models/user';

const subInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.userID;
    const data = new Subscription({
        name: req.body.name,
        amount: req.body.amount,
        recurDate: req.body.recurDate
    });

    console.log('data is', data);
    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne({ _id: _id }, { $push: { subscription: data } }).exec();
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

const updateRecurDate = async (req: Request, res: Response, next: NextFunction) => {
    logging.info("Update User's subscription recurring date..");
    const _user_id = req.params.userID;
    const _subscription_id = req.body.data.subscription_id;
    const newRecurDate = req.body.data.newRecurDate;
    console.log(_subscription_id, newRecurDate);

    User.findById(_user_id)
        .exec()
        .then((user) => {
            if (user) {
                let subscription = user.subscription;
                subscription.forEach((sub) => {
                    if (sub._id == _subscription_id) {
                        sub.recurDate = newRecurDate;
                    }
                });
                User.updateOne({ _id: _user_id }, { $set: { subscription: subscription } }).exec();
                user.save()
                    .then((savedUser) => {
                        logging.info(`User with id ${_user_id} updated`);

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
            }
        });
};
export default { subInUser, updateRecurDate };
