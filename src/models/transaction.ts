import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../interfaces';

const Transaction: Schema = new Schema(
    {
        category: { type: String },
        type: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        amount: { type: Number, required: true, default: 0 },
        memo: { type: String, default: '' }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITransaction>('Transaction', Transaction);
