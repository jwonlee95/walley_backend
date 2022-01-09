import mongoose, { Schema } from 'mongoose';
import { IExpense } from '../interfaces';

const ExpenseSchema: Schema = new Schema(
    {
        category: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        description: { type: String },
        amount: { type: Number, required: true, default: 0 },
        balance: { type: Number, required: true, default: 0 }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
