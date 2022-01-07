import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import { IBook, IExpense } from '../interfaces/book';

const BookSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        extraInformation: { type: String, required: false }
    },
    {
        timestamps: true
    }
);

BookSchema.post<IBook>('save', function () {
    logging.info(this);
});

export default mongoose.model<IBook>('Book', BookSchema);
