import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces';

const UserSchema: Schema = new Schema({
    uid: { type: String, unique: true },
    name: { type: String },
    expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
    income: { type: mongoose.Schema.Types.ObjectId, ref: 'Income' },
    balance: { type: Number, default: 0 }
});

export default mongoose.model<IUser>('User', UserSchema);
