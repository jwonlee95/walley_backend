import mongoose, { Schema } from 'mongoose';
import { IIncome } from '../interfaces';

const IncomeSchema: Schema = new Schema(
    {
        category: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        description: { type: String },
        amount: { type: Number, required: true },
        balance: { type: Number, required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IIncome>('Income', IncomeSchema);
