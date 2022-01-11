import mongoose, { now, Schema } from 'mongoose';
import { ISubscription } from '../interfaces';

const SubscriptionSchema: Schema = new Schema(
    {
        amount: { type: Number, required: true },
        description: { type: String },
        recurDate: { type: Date, required: true, default: now }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
