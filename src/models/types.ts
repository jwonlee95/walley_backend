import mongoose, { Schema } from 'mongoose';
import { ITypes } from '../interfaces';

const TypesSchema: Schema = new Schema(
    {
        icon: { type: String, required: true },
        color: { type: String, required: true },
        name: { type: String, required: true },
        budget: { type: Number, required: true, default: 0 },
        remain: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITypes>('Types', TypesSchema);
