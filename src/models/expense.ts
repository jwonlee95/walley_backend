import mongoose, { Schema } from 'mongoose';
import { IExpense } from '../interfaces';

const ExpenseSchema: Schema = new Schema(
    {
        category: { type: String },
        description: { type: String },
        amount: { type: Number, required: true, default: 0 }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
