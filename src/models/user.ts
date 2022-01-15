import mongoose, { now, Schema } from 'mongoose';
import { IUser } from '../interfaces';

const UserSchema: Schema = new Schema({
    uid: { type: String, unique: true },
    name: { type: String },
    expense: [
        {
            category: { type: String, required: true },
            description: { type: String },
            amount: { type: Number, required: true, default: 0 },
            createdAt: { type: Date },
            updatedAt: { type: Date, default: now }
        }
    ],
    income: [
        {
            category: { type: String, required: true },
            description: { type: String },
            amount: { type: Number, required: true, default: 0 },
            createdAt: { type: Date },
            updatedAt: { type: Date }
        }
    ],
    subscription: [
        {
            amount: { type: Number, required: true },
            description: { type: String },
            recurDate: { type: Date, required: true, default: now }
        }
    ],
    expenseTypes: [
        {
            name: { type: String, required: true },
            budget: { type: Number, required: true, default: 0 },
            spent: { type: Number, required: true, default: 0 },
            remain: { type: Number, default: 0 }
        }
    ],
    incomeTypes: [
        {
            name: { type: String, required: true }
        }
    ],
    balance: { type: Number, default: 0 }
});

export default mongoose.model<IUser>('User', UserSchema);
