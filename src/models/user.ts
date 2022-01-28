import mongoose, { now, Schema } from 'mongoose';
import { IUser } from '../interfaces';

const UserSchema: Schema = new Schema({
    uid: { type: String, unique: true },
    name: { type: String },
    transaction: [
        {
            category: { type: String },
            type: { type: String, required: true },
            description: { type: String, required: true },
            date: { type: Date, required: true },
            amount: { type: Number, required: true, default: 0 },
            memo: { type: String, default: '' }
        }
    ],
    subscription: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            recurDate: { type: Date, required: true, default: now }
        }
    ],

    category: [
        {
            icon: { type: String, required: true },
            color: { type: String, required: true },
            name: { type: String, required: true },
            budget: { type: Number, required: true, default: 0 },
            spent: { type: Number, required: true, default: 0 },
            remain: { type: Number, default: 0 }
        }
    ],

    balance: { type: Number, default: 0 }
});

export default mongoose.model<IUser>('User', UserSchema);
