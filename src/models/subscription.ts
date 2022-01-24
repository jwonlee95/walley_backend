import mongoose, { now, Schema } from 'mongoose';
import { ISubscription } from '../interfaces';

const SubscriptionSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        recurDate: { type: Date, required: true, default: now }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
