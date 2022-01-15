import mongoose, { Schema } from 'mongoose';
import { IIncome } from '../interfaces';

const IncomeSchema: Schema = new Schema(
    {

        category: { type: String },
        description: { type: String },
        amount: { type: Number, required: true, default: 0 }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IIncome>('Income', IncomeSchema);
