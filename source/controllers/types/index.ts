import { NextFunction, Request, Response } from 'express';
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

const typesInUser = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.userID;
    const body = req.body.types;
    const data = new Types({
        name: req.body.name,
        budget: req.body.budget,
        spent: req.body.amount,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
    });

    console.log('data is', data);
    User.findById(_id)
        .exec()
        .then((user) => {
            if (user) {
                User.updateOne({ _id: _id }, { $push: { types: data } }).exec();
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

export default { create, read, typesInUser };
