import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import { IExpense } from '../interfaces/book';

const ExpenseSchema: Schema = new Schema(
    {
        category: { type: String, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        balance: { type: Number, required: true }
    },
    {
        timestamps: true
    }
);

ExpenseSchema.post<IExpense>('save', function () {
    logging.info('Mongo', 'Checkout the book we just saved: ', this);
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
